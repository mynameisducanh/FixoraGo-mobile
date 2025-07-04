import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import {
  getCoordinatesFromAddress,
  getCurrentLocation,
  getRouteInfo,
  fetchDataStepByStep,
} from "@/utils/mapUtils";
import { MAP_CONFIG } from "@/constants/config";
import { Button } from "react-native-paper";
import * as Speech from "expo-speech";

interface Step {
  id: string;
  instruction: string;
  distance: number;
  duration: number;
}

interface MapViewProps {
  mode: "route" | "current-location";
  destinationAddress?: string;
  startAddress?: string;
  onLocationSelect?: (location: {
    lat: number;
    lon: number;
    address: string;
  }) => void;
  visible: boolean;
  onClose: () => void;
  onMapLoaded?: () => void;
}

export const CustomMapView: React.FC<MapViewProps> = ({
  mode,
  destinationAddress,
  startAddress,
  onLocationSelect,
  visible,
  onClose,
  onMapLoaded,
}) => {
  const mapRef = useRef<MapView>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [destination, setDestination] = useState<{
    lat: number;
    lon: number;
    address: string;
  } | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<
    Array<{ latitude: number; longitude: number }>
  >([]);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [showDirections, setShowDirections] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);

  // Đảm bảo sử dụng provider mặc định
  useEffect(() => {
    // Force default provider to avoid Google Maps API key issues
    if (visible) {
      setError(null);
      setLoading(true);
    }
  }, [visible]);

  // Lấy vị trí hiện tại
  const getCurrentPosition = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      return location;
    } catch (error) {
      setError("Không thể lấy vị trí hiện tại");
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
        mapRef.current?.animateToRegion(
          {
            latitude: location.lat,
            longitude: location.lon,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000
        );
      }
    } catch (error) {
      setError("Lỗi khi lấy vị trí hiện tại");
    } finally {
      setLoading(false);
      if (onMapLoaded) onMapLoaded();
    }
  };

  // Xử lý chế độ chỉ đường
  const handleRouteMode = async () => {
    setLoading(true);
    try {
      // Lấy vị trí hiện tại
      const startLocation = await getCurrentPosition();
      if (!startLocation) {
        throw new Error("Không thể lấy vị trí hiện tại");
      }

      console.log("Current location:", startLocation);

      // Lấy tọa độ đích
      if (destinationAddress) {
        console.log("Getting coordinates for address:", destinationAddress);
        const dest = await getCoordinatesFromAddress(destinationAddress);
        console.log("Destination coordinates:", dest);

        // Cập nhật điểm đích
        setDestination({
          lat: dest.lat,
          lon: dest.lon,
          address: dest.detailedAddress,
        });

        // Lấy thông tin tuyến đường
        console.log("Getting route info...");
        const route = await getRouteInfo(
          startLocation.lat,
          startLocation.lon,
          dest.lat,
          dest.lon
        );

        console.log("Route info received:", route);

        // Cập nhật tọa độ tuyến đường
        setRouteCoordinates(route.geometry.coordinates);
        const delay = (ms: number) =>
          new Promise((resolve) => setTimeout(resolve, ms));
        await delay(2000);

        // Cập nhật thông tin tuyến đường
        setRouteInfo({
          distance: route.distance,
          duration: route.duration,
        });

        // Fit map to show both markers with padding
        if (mapRef.current) {
          const coordinates = [
            { latitude: startLocation.lat, longitude: startLocation.lon },
            { latitude: dest.lat, longitude: dest.lon },
          ];

          mapRef.current.fitToCoordinates(coordinates, {
            edgePadding: { top: 250, right: 150, bottom: 200, left: 150 },
            animated: true,
          });
        }
      }
    } catch (error: any) {
      console.error("Error in handleRouteMode:", error);
      setError(error.message || "Lỗi khi tính toán tuyến đường");
    } finally {
      setLoading(false);
      if (onMapLoaded) onMapLoaded();
    }
  };

  const handleGetDirections = async () => {
    setLoading(true);
    try {
      if (
        currentLocation?.lat !== undefined &&
        currentLocation?.lon !== undefined &&
        destination?.lat !== undefined &&
        destination?.lon !== undefined
      ) {
        const res = await fetchDataStepByStep(
          currentLocation.lat,
          currentLocation.lon,
          destination.lat,
          destination.lon
        );
        if (res) {
          setSteps(res.stepList);
          setShowDirections(true);
        }
      } else {
        throw new Error("Thiếu thông tin vị trí để lấy chỉ dẫn từng bước.");
      }
    } catch (error: any) {
      setError(error.message || "Lỗi khi lấy chỉ dẫn chi tiết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      setLoading(true);
      if (mode === "current-location") {
        handleCurrentLocationMode();
      } else if (mode === "route") {
        handleRouteMode();
      }
    }
  }, [mode, destinationAddress, visible]);

  const speakStep = (instruction: string) => {
    Speech.speak(instruction);
  };

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
            <Text style={styles.headerTitle}>Bản đồ chỉ dẫn</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Map Container */}
          <View style={styles.mapContainer}>
            <MapView
              ref={mapRef}
              style={styles.map}
              showsUserLocation
              showsMyLocationButton
              initialRegion={
                currentLocation
                  ? {
                      latitude: currentLocation.lat,
                      longitude: currentLocation.lon,
                      latitudeDelta: 0.005,
                      longitudeDelta: 0.005,
                    }
                  : undefined
              }
              onMapReady={() => {
                setIsMapReady(true);
                if (currentLocation && destination) {
                  mapRef.current?.fitToCoordinates(
                    [
                      {
                        latitude: currentLocation.lat,
                        longitude: currentLocation.lon,
                      },
                      { latitude: destination.lat, longitude: destination.lon },
                    ],
                    {
                      edgePadding: {
                        top: 250,
                        right: 150,
                        bottom: 200,
                        left: 150,
                      },
                      animated: true,
                    }
                  );
                }
              }}
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
                  description={destinationAddress}
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

            {/* Loading Overlay */}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text style={styles.loadingText}>Đang tải bản đồ...</Text>
              </View>
            )}
          </View>

          {/* Route Info */}
          {routeInfo && !loading && (
            <View style={styles.routeInfo}>
              <Text style={styles.routeText}>
                Khoảng cách dự tính: {(routeInfo.distance / 1000).toFixed(1)} km
              </Text>
              <Text style={styles.routeText}>
                Thời gian dự tính: {Math.round(routeInfo.duration / 60)} phút
              </Text>
              <Button
                mode="contained"
                onPress={handleGetDirections}
                style={styles.directionsButton}
                loading={loading}
                disabled={loading}
              >
                {loading ? "Đang tải..." : "Xem chỉ dẫn đường đi"}
              </Button>
            </View>
          )}

          {/* Directions Panel */}
          {showDirections && (
            <View style={styles.directionsPanel}>
              <View style={styles.directionsHeader}>
                <Text style={styles.directionsTitle}>
                  Chỉ dẫn chi tiết đường đi
                </Text>
                <TouchableOpacity
                  onPress={() => setShowDirections(false)}
                  style={styles.closeDirectionsButton}
                >
                  <Text style={styles.closeButtonText}>✕</Text>
                </TouchableOpacity>
              </View>
              <ScrollView style={styles.steps}>
                {steps.map((step) => (
                  <View key={step.id} style={styles.step}>
                    <Text style={styles.stepText}>{step.instruction}</Text>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Error state */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                onPress={() => setError(null)}
                style={styles.retryButton}
              >
                <Text style={styles.retryButtonText}>Thử lại</Text>
              </TouchableOpacity>
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
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "95%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
  },
  map: {
    flex: 1,
  },
  startMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "white",
  },
  endMarker: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#F44336",
    borderWidth: 2,
    borderColor: "white",
  },
  routeInfo: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 70,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  routeText: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: "500",
  },
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0000ff",
  },
  errorContainer: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "rgba(255, 0, 0, 0.1)",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  directionsButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
  },
  directionsPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "50%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  directionsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  directionsTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  closeDirectionsButton: {
    padding: 5,
  },
  steps: {
    maxHeight: "100%",
  },
  step: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  stepText: {
    flex: 1,
    marginRight: 10,
  },
  retryButton: {
    marginTop: 10,
    backgroundColor: "#2196F3",
    padding: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
