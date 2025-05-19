import Constants from "expo-constants";

export const MAPBOX_ACCESS_TOKEN = Constants.expoConfig?.extra?.MAPBOX_ACCESS_TOKEN; 

export const MAP_CONFIG = {
  defaultRegion: {
    latitude: 16.047079, // Đà Nẵng
    longitude: 108.206230,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  },
}; 