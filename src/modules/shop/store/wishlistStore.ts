import {create} from 'zustand';
import {persist, createJSONStorage} from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Product} from '../../../data/generators/products';

type WishlistState = {
  items: Product[];
  toggle: (product: Product) => void;
  isWishlisted: (productId: string) => boolean;
  remove: (productId: string) => void;
};

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],

      toggle: product => {
        const exists = get().items.some(i => i.id === product.id);
        if (exists) {
          set({items: get().items.filter(i => i.id !== product.id)});
        } else {
          set({items: [...get().items, product]});
        }
      },

      isWishlisted: productId => get().items.some(i => i.id === productId),

      remove: productId => {
        set({items: get().items.filter(i => i.id !== productId)});
      },
    }),
    {
      name: 'wishlist-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
