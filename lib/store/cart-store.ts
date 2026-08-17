import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  variantId: string;
  productId: string;
  slug: string;
  name: string;
  image: string;
  imageAlt: string;
  color: string;
  size: string;
  strap?: string;
  hardware?: string;
  price: number;
  currency: string;
  quantity: number;
  isMadeToOrder: boolean;
};

type CartState = {
  items: CartItem[];
  // ISO alpha-2 destination country the customer selected for shipping,
  // remembered across visits. Only ever used to look up the matching
  // ShippingZone server-side (see /api/checkout) — never trusted as a price.
  shippingCountry: string | null;
  setShippingCountry: (code: string | null) => void;
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      shippingCountry: null,
      setShippingCountry: (code) => set({ shippingCountry: code }),
      addItem: (item, quantity = 1) => {
        const existing = get().items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: get().items.map((i) =>
              i.variantId === item.variantId ? { ...i, quantity: i.quantity + quantity } : i
            ),
          });
        } else {
          set({ items: [...get().items, { ...item, quantity }] });
        }
      },
      removeItem: (variantId) => set({ items: get().items.filter((i) => i.variantId !== variantId) }),
      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          set({ items: get().items.filter((i) => i.variantId !== variantId) });
          return;
        }
        set({ items: get().items.map((i) => (i.variantId === variantId ? { ...i, quantity } : i)) });
      },
      clear: () => set({ items: [] }),
    }),
    { name: "dar-asala-cart" }
  )
);

export function cartSubtotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

export function cartCount(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.quantity, 0);
}
