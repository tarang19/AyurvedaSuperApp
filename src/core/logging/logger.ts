import {ENV} from '../config/env';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private minLevel: LogLevel = __DEV__ ? 'debug' : 'info';

  private shouldLog(level: LogLevel): boolean {
    return LEVEL_PRIORITY[level] >= LEVEL_PRIORITY[this.minLevel];
  }

  debug(message: string, meta?: Record<string, unknown>) {
    if (this.shouldLog('debug')) {
      console.debug(`[DEBUG] ${message}`, meta ?? '');
    }
  }

  info(message: string, meta?: Record<string, unknown>) {
    if (this.shouldLog('info')) {
      console.info(`[INFO] ${message}`, meta ?? '');
    }
  }

  warn(message: string, meta?: Record<string, unknown>) {
    if (this.shouldLog('warn')) {
      console.warn(`[WARN] ${message}`, meta ?? '');
    }
  }

  error(message: string, error?: unknown, meta?: Record<string, unknown>) {
    if (this.shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error, meta ?? '');
    }
  }

  performance(label: string, durationMs: number) {
    if (ENV.ENABLE_PERFORMANCE_MONITORING) {
      this.debug(`Perf: ${label}`, {durationMs});
    }
  }
}

export const logger = new Logger();
