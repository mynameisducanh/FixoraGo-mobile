import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCurrentLocation,
  getAddressFromCoordinates,
} from "@/utils/mapUtils";
import { useLocationStore } from "@/stores/location-store";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: string) => void;
}

const LocationPicker: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const [detailAddress, setDetailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState("");
  const { latitude, longitude, errorMsg } = useLocationStore();

  useEffect(() => {
    if (visible) {
      setError("");
      if (!currentLocation) {
        fetchCurrentLocation();
      }
    }
  }, [visible]);

  const fetchCurrentLocation = async () => {
    setLoading(true);
    try {
      const location = await getCurrentLocation();
      const addressData = await getAddressFromCoordinates(
        location.lat,
        location.lon
      );
      console.log(addressData.detailedAddress)
      setCurrentLocation(addressData.detailedAddress);
    } catch (error) {
      console.log(error);
      setError("Không thể lấy vị trí hiện tại");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!detailAddress.trim()) {
      setError("Vui lòng nhập địa chỉ chi tiết");
      return;
    }

    if (!currentLocation) {
      setError("Không thể lấy vị trí hiện tại");
      return;
    }

    const fullAddress = `${detailAddress}, ${currentLocation}`;
    onSelect(fullAddress);
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback>
          <View className="flex-1 bg-black/40 justify-center items-center px-6">
            <TouchableWithoutFeedback>
              <View className="bg-white w-full rounded-xl p-6 space-y-4">
                <View className="flex-row items-center justify-between mb-4">
                  <Text className="text-lg font-bold text-center flex-1">
                    Chọn địa chỉ
                  </Text>
                  <TouchableOpacity onPress={onClose}>
                    <Ionicons name="close" size={18} color="#000" />
                  </TouchableOpacity>
                </View>

                {loading ? (
                  <View className="items-center justify-center py-8">
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text className="text-gray-600 mt-2">
                      Đang lấy vị trí...
                    </Text>
                  </View>
                ) : currentLocation ? (
                  <>
                    <View className="bg-blue-50 p-4 rounded-lg mb-4">
                      <Text className="text-blue-800 font-medium mb-1">
                        Vị trí hiện tại:
                      </Text>
                      <Text className="text-blue-800">
                        {currentLocation}
                      </Text>
                    </View>

                    <View className="space-y-2 mb-4">
                      <TextInput
                        className={`border-b-2 ${
                          error ? "border-red-500" : "border-gray-100"
                        } p-3`}
                        placeholder="Số nhà, Tòa nhà, Thôn, Ngõ,..."
                        value={detailAddress}
                        onChangeText={(text) => {
                          setDetailAddress(text);
                          setError("");
                        }}
                        multiline
                      />
                      {error && (
                        <Text className="text-red-500 text-sm">{error}</Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={handleConfirm}
                      className="bg-primary rounded-lg p-4"
                    >
                      <Text className="text-white text-center font-semibold">
                        Xác nhận
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <View className="items-center justify-center py-8">
                    <Text className="text-red-500 text-center">
                      {error || "Không thể lấy vị trí hiện tại"}
                    </Text>
                    <TouchableOpacity
                      onPress={fetchCurrentLocation}
                      className="mt-4 bg-primary rounded-lg px-4 py-2"
                    >
                      <Text className="text-white">Thử lại</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default LocationPicker;
