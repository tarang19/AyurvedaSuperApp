import {storage, STORAGE_KEYS} from '../storage/storage';
import {logger} from '../logging/logger';

export type SyncAction = {
  id: string;
  type: 'CREATE_BOOKING' | 'CANCEL_BOOKING';
  payload: Record<string, unknown>;
  createdAt: string;
  retries: number;
};

type SyncHandler = (action: SyncAction) => Promise<boolean>;

class SyncQueue {
  private handlers = new Map<string, SyncHandler>();
  private processing = false;

  register(type: string, handler: SyncHandler) {
    this.handlers.set(type, handler);
  }

  async enqueue(action: Omit<SyncAction, 'id' | 'createdAt' | 'retries'>) {
    const queue = await this.getQueue();
    const item: SyncAction = {
      ...action,
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      retries: 0,
    };
    queue.push(item);
    await storage.set(STORAGE_KEYS.BOOKING_QUEUE, queue);
    logger.info('Queued offline action', {type: action.type, id: item.id});
    return item;
  }

  async getQueue(): Promise<SyncAction[]> {
    return (await storage.get<SyncAction[]>(STORAGE_KEYS.BOOKING_QUEUE)) ?? [];
  }

  async processQueue(isOnline: boolean) {
    if (!isOnline || this.processing) return;

    this.processing = true;
    try {
      let queue = await this.getQueue();
      const remaining: SyncAction[] = [];

      for (const action of queue) {
        const handler = this.handlers.get(action.type);
        if (!handler) {
          remaining.push(action);
          continue;
        }

        try {
          const success = await handler(action);
          if (!success) {
            action.retries += 1;
            if (action.retries < 3) remaining.push(action);
          }
        } catch {
          action.retries += 1;
          if (action.retries < 3) remaining.push(action);
        }
      }

      await storage.set(STORAGE_KEYS.BOOKING_QUEUE, remaining);
      if (queue.length !== remaining.length) {
        logger.info('Sync queue processed', {
          processed: queue.length - remaining.length,
        });
      }
    } finally {
      this.processing = false;
    }
  }
}

export const syncQueue = new SyncQueue();
