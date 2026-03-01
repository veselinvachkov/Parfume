"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartBundle } from "@/types";

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string | null;
}

interface CartState {
  items: CartItem[];
  bundles: CartBundle[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  addBundle: (bundle: Omit<CartBundle, "quantity">) => void;
  removeBundle: (offerId: number) => void;
  updateBundleQuantity: (offerId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      bundles: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.productId === item.productId);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),

      removeItem: (productId) =>
        set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),

      updateQuantity: (productId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.productId !== productId)
              : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
        })),

      addBundle: (bundle) =>
        set((state) => {
          const existing = state.bundles.find((b) => b.offerId === bundle.offerId);
          if (existing) {
            return {
              bundles: state.bundles.map((b) =>
                b.offerId === bundle.offerId ? { ...b, quantity: b.quantity + 1 } : b
              ),
            };
          }
          return { bundles: [...state.bundles, { ...bundle, quantity: 1 }] };
        }),

      removeBundle: (offerId) =>
        set((state) => ({ bundles: state.bundles.filter((b) => b.offerId !== offerId) })),

      updateBundleQuantity: (offerId, quantity) =>
        set((state) => ({
          bundles:
            quantity <= 0
              ? state.bundles.filter((b) => b.offerId !== offerId)
              : state.bundles.map((b) => (b.offerId === offerId ? { ...b, quantity } : b)),
        })),

      clearCart: () => set({ items: [], bundles: [] }),

      totalItems: () => {
        const s = get();
        return (
          s.items.reduce((n, i) => n + i.quantity, 0) +
          s.bundles.reduce((n, b) => n + b.quantity, 0)
        );
      },

      totalPrice: () => {
        const s = get();
        return (
          s.items.reduce((sum, i) => sum + i.price * i.quantity, 0) +
          s.bundles.reduce((sum, b) => sum + b.comboPrice * b.quantity, 0)
        );
      },
    }),
    {
      name: "parfume-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
