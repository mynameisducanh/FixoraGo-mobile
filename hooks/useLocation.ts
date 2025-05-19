import { useEffect } from 'react';
import * as Location from 'expo-location';
import { useLocationStore } from '@/stores/location-store';

export const useLocation = () => {
  const { setLocation, setError, setLoading } = useLocationStore();

  useEffect(() => {
    (async () => {
      try {
        // Kiểm tra quyền truy cập vị trí
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission to access location was denied');
          return;
        }

        // Bắt đầu theo dõi vị trí
        const locationSubscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000, // Cập nhật mỗi 5 giây
            distanceInterval: 10, // Cập nhật khi di chuyển 10 mét
          },
          (location) => {
            setLocation(location.coords.latitude, location.coords.longitude);
            setLoading(false);
          }
        );

        // Cleanup subscription khi component unmount
        return () => {
          if (locationSubscription) {
            locationSubscription.remove();
          }
        };
      } catch (error) {
        setError('Error getting location');
      }
    })();
  }, []);

  return useLocationStore();
}; 