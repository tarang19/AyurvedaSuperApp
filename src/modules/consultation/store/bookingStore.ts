import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Booking, bookSlot, releaseSlot, validateBooking} from '../../../data/generators/doctors';
import {getNetworkStatus} from '../../../core/api/client';
import {syncQueue} from '../../../core/offline/syncQueue';
import {storage, STORAGE_KEYS} from '../../../core/storage/storage';

type BookingState = {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt' | 'status'>) => Promise<{success: boolean; error?: string}>;
  cancelBooking: (id: string) => Promise<void>;
  loadBookings: () => Promise<void>;
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      bookings: [],

      loadBookings: async () => {
        const saved = await storage.get<Booking[]>(STORAGE_KEYS.BOOKINGS);
        if (saved) set({bookings: saved});
      },

      addBooking: async bookingData => {
        const validation = validateBooking(bookingData.slotId, new Date(Date.now() + 3600000).toISOString());
        if (!validation.valid) {
          return {success: false, error: validation.reason};
        }

        const booking: Booking = {
          ...bookingData,
          id: `bk-${Date.now()}`,
          status: getNetworkStatus() ? 'confirmed' : 'pending_sync',
          createdAt: new Date().toISOString(),
        };

        if (!getNetworkStatus()) {
          await syncQueue.enqueue({
            type: 'CREATE_BOOKING',
            payload: booking as unknown as Record<string, unknown>,
          });
        } else {
          bookSlot(bookingData.slotId);
        }

        const bookings = [booking, ...get().bookings];
        set({bookings});
        await storage.set(STORAGE_KEYS.BOOKINGS, bookings);
        return {success: true};
      },

      cancelBooking: async id => {
        const booking = get().bookings.find(b => b.id === id);
        if (booking) releaseSlot(booking.slotId);

        const bookings = get().bookings.map(b =>
          b.id === id ? {...b, status: 'cancelled' as const} : b,
        );
        set({bookings});
        await storage.set(STORAGE_KEYS.BOOKINGS, bookings);

        if (!getNetworkStatus()) {
          await syncQueue.enqueue({
            type: 'CANCEL_BOOKING',
            payload: {id},
          });
        }
      },
    }),
    {
      name: 'booking-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: state => ({bookings: state.bookings}),
    },
  ),
);

export function getUpcomingBookings(bookings: Booking[]): Booking[] {
  const now = new Date();
  return bookings.filter(
    b =>
      b.status !== 'cancelled' &&
      new Date(`${b.date}T${b.time}`) >= now,
  );
}
