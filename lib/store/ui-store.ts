import { create } from "zustand";

type Overlay = "menu" | "search" | "cart" | null;

type UIState = {
  overlay: Overlay;
  openMenu: () => void;
  openSearch: () => void;
  openCart: () => void;
  close: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  overlay: null,
  openMenu: () => set({ overlay: "menu" }),
  openSearch: () => set({ overlay: "search" }),
  openCart: () => set({ overlay: "cart" }),
  close: () => set({ overlay: null }),
}));
