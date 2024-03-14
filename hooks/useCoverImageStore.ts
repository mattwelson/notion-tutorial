import { create } from "zustand";

interface CoverImageStore {
  url?: string;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  replace: (url: string) => void;
}

export const useCoverImage = create<CoverImageStore>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true, url: undefined }),
  close: () => set({ isOpen: false }),
  replace: (url) => {
    set({ isOpen: true, url });
  },
}));
