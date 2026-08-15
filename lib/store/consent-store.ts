import { create } from "zustand";
import { persist } from "zustand/middleware";

type ConsentState = {
  choice: "accepted" | "rejected" | null;
  setChoice: (choice: "accepted" | "rejected") => void;
};

export const useConsentStore = create<ConsentState>()(
  persist(
    (set) => ({
      choice: null,
      setChoice: (choice) => set({ choice }),
    }),
    { name: "dar-asala-cookie-consent" }
  )
);
