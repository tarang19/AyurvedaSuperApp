import AsyncStorage from '@react-native-async-storage/async-storage';
import {logger} from '../logging/logger';

const STORAGE_PREFIX = '@ayurveda:';

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch (error) {
      logger.error(`Storage get failed: ${key}`, error);
      return null;
    }
  },

  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      logger.error(`Storage set failed: ${key}`, error);
    }
  },

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch (error) {
      logger.error(`Storage remove failed: ${key}`, error);
    }
  },

  async getSecure<T>(key: string): Promise<T | null> {
    return this.get<T>(`secure:${key}`);
  },

  async setSecure<T>(key: string, value: T): Promise<void> {
    return this.set(`secure:${key}`, value);
  },
};

export const STORAGE_KEYS = {
  CART: 'cart',
  WISHLIST: 'wishlist',
  BOOKINGS: 'bookings',
  BOOKING_QUEUE: 'booking_queue',
  API_CACHE: 'api_cache',
  THEME: 'theme',
  SESSION: 'session',
} as const;
