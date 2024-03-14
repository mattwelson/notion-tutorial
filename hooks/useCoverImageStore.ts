import { create } from "zustand";

interface CoverImageStore {
  isOpen: boolean;
  open: () => void;
  close: () => void;
}

export const useCoverImage = create<CoverImageStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
}));
