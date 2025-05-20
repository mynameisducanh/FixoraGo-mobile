import { create } from 'zustand';

interface LocationData {
  lat: number;
  lon: number;
  address: string;
  detailedAddress: string;
}

interface LocationState {
  currentLocation: LocationData | null;
  setCurrentLocation: (location: LocationData | null) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  currentLocation: null,
  setCurrentLocation: (location) => set({ currentLocation: location }),
})); 