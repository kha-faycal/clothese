import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  variantId: number;
  productId: number;
  name: string;
  brand: string;
  color: string;
  size: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (variantId: number) => void;
  updateQuantity: (variantId: number, qty: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      addItem: (newItem) => set((state) => {
        const existingIndex = state.items.findIndex(i => i.variantId === newItem.variantId);
        if (existingIndex > -1) {
          const updatedItems = [...state.items];
          const proposedQty = updatedItems[existingIndex].quantity + 1;
          if (proposedQty <= newItem.stock) {
            updatedItems[existingIndex].quantity = proposedQty;
          }
          return { items: updatedItems };
        }
        return { items: [...state.items, { ...newItem, quantity: 1 }] };
      }),

      removeItem: (variantId) => set((state) => ({
        items: state.items.filter(i => i.variantId !== variantId)
      })),

      updateQuantity: (variantId, qty) => set((state) => ({
        items: state.items.map(i => 
          i.variantId === variantId 
            ? { ...i, quantity: Math.max(1, Math.min(qty, i.stock)) } 
            : i
        )
      })),

      clearCart: () => set({ items: [] }),
      
      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    { name: "clothese-cart-storage" }
  )
);
