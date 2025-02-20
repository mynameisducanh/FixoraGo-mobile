import { create } from "zustand";

type AlertState = {
  title: string;
  message: string;
  isVisible: boolean;
  showAlert: (title: string, message: string) => void;
  hideAlert: () => void;
};

export const useAppAlert = create<AlertState>((set) => ({
  title: "",
  message: "",
  isVisible: false,
  showAlert: (title, message) => set({ title, message, isVisible: true }),
  hideAlert: () => set({ isVisible: false }),
}));
