import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Modal, Dimensions } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import { getCoordinatesFromAddress, getCurrentLocation, getRouteInfo } from '@/utils/mapUtils';
import { MAP_CONFIG } from '@/constants/config';

interface MapViewProps {
  mode: 'route' | 'current-location';
  destinationAddress?: string;
  startAddress?: string;
  onLocationSelect?: (location: { lat: number; lon: number; address: string }) => void;
  visible: boolean;
  onClose: () => void;
}

export const CustomMapView: React.FC<MapViewProps> = ({
  mode,
  destinationAddress,
  startAddress,
  onLocationSelect,
  visible,
  onClose,
}) => {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lon: number; address: string } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Array<{ latitude: number; longitude: number }>>([]);
  const [routeInfo, setRouteInfo] = useState<{ distance: number; duration: number } | null>(null);

  // Lấy vị trí hiện tại
  const getCurrentPosition = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (error) {
      setError('Không thể lấy vị trí hiện tại');
      return null;
    }
  };

  // Xử lý chế độ hiện vị trí hiện tại
  const handleCurrentLocationMode = async () => {
    setLoading(true);
    try {
      const location = await getCurrentPosition();
      if (location) {
        setCurrentLocation(location);
        mapRef.current?.animateToRegion({
          latitude: location.lat,
          longitude: location.lon,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }, 1000);
      }
    } catch (error) {
      setError('Lỗi khi lấy vị trí hiện tại');
    } finally {
      setLoading(false);
    }
  };

  // Xử lý chế độ chỉ đường
  const handleRouteMode = async () => {
    setLoading(true);
    try {
      // Lấy vị trí hiện tại
      const startLocation = await getCurrentPosition();
      if (!startLocation) {
        throw new Error('Không thể lấy vị trí hiện tại');
      }

      console.log('Current location:', startLocation);

      // Lấy tọa độ đích
      if (destinationAddress) {
        console.log('Getting coordinates for address:', destinationAddress);
        const dest = await getCoordinatesFromAddress(destinationAddress);
        console.log('Destination coordinates:', dest);

        // Cập nhật điểm đích
        setDestination({
          lat: dest.lat,
          lon: dest.lon,
          address: dest.displayName,
        });

        // Lấy thông tin tuyến đường
        console.log('Getting route info...');
        const route = await getRouteInfo(
          startLocation.lat,
          startLocation.lon,
          dest.lat,
          dest.lon
        );

        console.log('Route info received:', route);

        // Cập nhật tọa độ tuyến đường
        setRouteCoordinates(route.geometry.coordinates);
        
        // Cập nhật thông tin tuyến đường
        setRouteInfo({
          distance: route.distance,
          duration: route.duration,
        });

        // Zoom to fit both markers
        if (mapRef.current) {
          mapRef.current.fitToCoordinates(
            [
              { latitude: startLocation.lat, longitude: startLocation.lon },
              { latitude: dest.lat, longitude: dest.lon }
            ],
            {
              edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
              animated: true,
            }
          );
        }
      }
    } catch (error: any) {
      console.error('Error in handleRouteMode:', error);
      setError(error.message || 'Lỗi khi tính toán tuyến đường');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mode === 'current-location') {
      console.log(mode , " vao current-location")
      handleCurrentLocationMode();
    } else if (mode === 'route') {
      console.log(mode , " vao route")
      handleRouteMode();
    }
  }, [mode, destinationAddress]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bản đồ</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Map Container */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              provider={PROVIDER_GOOGLE}
              showsUserLocation
              showsMyLocationButton
              initialRegion={currentLocation ? {
                latitude: currentLocation.lat,
                longitude: currentLocation.lon,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              } : undefined}
            >
              {/* Marker điểm xuất phát */}
              {currentLocation && (
                <Marker
                  coordinate={{
                    latitude: currentLocation.lat,
                    longitude: currentLocation.lon,
                  }}
                  title="Điểm xuất phát"
                  description="Vị trí hiện tại của bạn"
                >
                  <View style={styles.startMarker} />
                </Marker>
              )}

              {/* Marker điểm đích */}
              {destination && (
                <Marker
                  coordinate={{
                    latitude: destination.lat,
                    longitude: destination.lon,
                  }}
                  title="Điểm đến"
                  description={destination.address}
                >
                  <View style={styles.endMarker} />
                </Marker>
              )}

              {/* Vẽ tuyến đường */}
              {routeCoordinates.length > 0 && (
                <Polyline
                  coordinates={routeCoordinates}
                  strokeWidth={4}
                  strokeColor="#FF0000"
                  lineDashPattern={[1]}
                  zIndex={1}
                />
              )}
            </MapView>
          </View>

          {/* Route Info */}
          {routeInfo && (
            <View style={styles.routeInfo}>
              <Text style={styles.routeText}>
                Khoảng cách: {(routeInfo.distance / 1000).toFixed(1)} km
              </Text>
              <Text style={styles.routeText}>
                Thời gian: {Math.round(routeInfo.duration / 60)} phút
              </Text>
            </View>
          )}

          {/* Loading Indicator */}
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          )}

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    height: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#666',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  startMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: 'white',
  },
  endMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#F44336',
    borderWidth: 2,
    borderColor: 'white',
  },
  routeInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  routeText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: '500',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
}); 