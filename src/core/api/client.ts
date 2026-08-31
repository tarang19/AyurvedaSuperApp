import NetInfo from '@react-native-community/netinfo';
import {ENV} from '../config/env';
import {logger} from '../logging/logger';
import {storage, STORAGE_KEYS} from '../storage/storage';
import {
  ApiError,
  ApiResult,
  NetworkError,
  SessionExpiredError,
  TimeoutError,
} from './types';

type CacheEntry<T> = {data: T; timestamp: number; key: string};

let isOnline = true;

NetInfo.addEventListener(state => {
  isOnline = state.isConnected === true && state.isInternetReachable !== false;
});

export function getNetworkStatus(): boolean {
  return isOnline;
}

async function getCache<T>(key: string): Promise<T | null> {
  const cache = await storage.get<Record<string, CacheEntry<unknown>>>(
    STORAGE_KEYS.API_CACHE,
  );
  const entry = cache?.[key] as CacheEntry<T> | undefined;
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ENV.CACHE_TTL_MS) return null;
  return entry.data;
}

async function setCache<T>(key: string, data: T): Promise<void> {
  const cache =
    (await storage.get<Record<string, CacheEntry<unknown>>>(
      STORAGE_KEYS.API_CACHE,
    )) ?? {};
  cache[key] = {data, timestamp: Date.now(), key};
  await storage.set(STORAGE_KEYS.API_CACHE, cache);
}

function simulateNetworkDelay(): Promise<void> {
  const delay = Math.random() < 0.1 ? ENV.MOCK_SLOW_NETWORK_MS : 150 + Math.random() * 350;
  return new Promise(resolve => setTimeout(resolve, delay));
}

function simulateFailure(): void {
  if (Math.random() < ENV.MOCK_FAILURE_RATE) {
    throw new ApiError('Random server error', 'SERVER_ERROR', 500, true);
  }
}

export async function apiRequest<T>(
  cacheKey: string,
  fetcher: () => T | Promise<T>,
  options: {skipCache?: boolean; requireOnline?: boolean} = {},
): Promise<ApiResult<T>> {
  const start = Date.now();

  if (!options.skipCache) {
    const cached = await getCache<T>(cacheKey);
    if (cached) {
      logger.performance(`cache:${cacheKey}`, Date.now() - start);
      return {success: true, data: cached, fromCache: true};
    }
  }

  if (options.requireOnline && !isOnline) {
    const stale = await getCache<T>(cacheKey);
    if (stale) return {success: true, data: stale, fromCache: true};
    return {success: false, error: new NetworkError()};
  }

  try {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new TimeoutError()), ENV.API_TIMEOUT_MS),
    );

    await simulateNetworkDelay();
    simulateFailure();

    const data = await Promise.race([Promise.resolve(fetcher()), timeoutPromise]);

    await setCache(cacheKey, data);
    logger.performance(`api:${cacheKey}`, Date.now() - start);
    return {success: true, data};
  } catch (error) {
    if (error instanceof ApiError) {
      if (error.code === 'SESSION_EXPIRED') {
        return {success: false, error: new SessionExpiredError()};
      }
      const stale = await getCache<T>(cacheKey);
      if (stale) return {success: true, data: stale, fromCache: true};
      return {success: false, error};
    }

    const stale = await getCache<T>(cacheKey);
    if (stale) return {success: true, data: stale, fromCache: true};

    logger.error(`API request failed: ${cacheKey}`, error);
    return {
      success: false,
      error: new ApiError('Unexpected error', 'UNKNOWN', undefined, true),
    };
  }
}

export async function parseJsonSafe<T>(raw: string): Promise<T | null> {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}
