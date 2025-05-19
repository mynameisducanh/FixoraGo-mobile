import { create } from 'zustand';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  errorMsg: string | null;
  loading: boolean;
  setLocation: (latitude: number, longitude: number) => void;
  setError: (errorMsg: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  latitude: null,
  longitude: null,
  errorMsg: null,
  loading: true,
  setLocation: (latitude, longitude) => set({ latitude, longitude, errorMsg: null }),
  setError: (errorMsg) => set({ errorMsg, loading: false }),
  setLoading: (loading) => set({ loading }),
})); 