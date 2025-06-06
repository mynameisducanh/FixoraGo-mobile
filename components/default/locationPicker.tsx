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
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getCurrentLocation,
  getAddressFromCoordinates,
} from "@/utils/mapUtils";
import { useLocationStore } from "@/stores/location-store";
import axios from "axios";

interface Location {
  code: string;
  name: string;
}

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
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [currentStep, setCurrentStep] = useState<"province" | "district" | "ward">("province");
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(null);
  const [selectedWard, setSelectedWard] = useState<Location | null>(null);

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
      
      // Check if the location is in Da Nang
      if (!addressData.detailedAddress.toLowerCase().includes("đà nẵng")) {
        setError("Ứng dụng chưa được hỗ trợ ở vị trí của bạn");
        setCurrentLocation("");
        return;
      }
      
      setCurrentLocation(addressData.detailedAddress);
    } catch (error) {
      console.log(error);
      setError("Không thể lấy vị trí hiện tại");
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/p/");
      // Filter to only get Da Nang
      const daNang = res.data.find((p: Location) => p.name === "Thành phố Đà Nẵng");
      setProvinces(daNang ? [daNang] : []);
      // Auto select Da Nang and fetch its districts
      if (daNang) {
        handleSelectProvince(daNang);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchDistricts = async (provinceCode: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
      );
      setDistricts(res.data.districts);
    } finally {
      setLoading(false);
    }
  };

  const fetchWards = async (districtCode: string) => {
    setLoading(true);
    try {
      const res = await axios.get(
        `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
      );
      setWards(res.data.wards);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProvince = (province: Location) => {
    setSelectedProvince(province);
    setSelectedDistrict(null);
    setSelectedWard(null);
    setCurrentStep("district");
    fetchDistricts(province.code);
  };

  const handleSelectDistrict = (district: Location) => {
    setSelectedDistrict(district);
    setSelectedWard(null);
    setCurrentStep("ward");
    fetchWards(district.code);
  };

  const handleSelectWard = (ward: Location) => {
    setSelectedWard(ward);
    setShowAddressPicker(false);
    setCurrentLocation(`${ward.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`);
  };

  const handleBack = () => {
    if (currentStep === "ward") setCurrentStep("district");
    else if (currentStep === "district") setCurrentStep("province");
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

  let locations: Location[] = [];
  let title = "";

  switch (currentStep) {
    case "province":
      locations = provinces;
      title = "Thành phố Đà Nẵng";
      break;
    case "district":
      locations = districts;
      title = "Chọn quận/huyện";
      break;
    case "ward":
      locations = wards;
      title = "Chọn phường/xã";
      break;
  }

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
                    Chọn địa chỉ tại Đà Nẵng
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

                    <TouchableOpacity
                      onPress={() => {
                        setShowAddressPicker(true);
                        fetchProvinces();
                      }}
                      className="flex-row items-center gap-2 border border-primary rounded-lg p-4 mb-4"
                    >
                      <Ionicons name="location" size={20} color="#2563EB" />
                      <Text className="text-primary text-base">
                        Chọn địa chỉ khác
                      </Text>
                    </TouchableOpacity>

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

                {showAddressPicker && (
                  <Modal visible={showAddressPicker} animationType="slide" transparent>
                    <View className="flex-1 bg-black/40">
                      <View className="bg-white h-[80%] mt-auto rounded-t-xl p-6">
                        <View className="flex-row items-center justify-between mb-4">
                          {currentStep !== "province" ? (
                            <TouchableOpacity onPress={handleBack}>
                              <Ionicons name="arrow-back" size={24} color="#000" />
                            </TouchableOpacity>
                          ) : (
                            <View style={{ width: 24 }} />
                          )}
                          <Text className="text-lg font-semibold">
                            {currentStep === "province" 
                              ? "Thành phố Đà Nẵng" 
                              : currentStep === "district" 
                                ? "Chọn quận/huyện" 
                                : "Chọn phường/xã"}
                          </Text>
                          <TouchableOpacity
                            onPress={() => setShowAddressPicker(false)}
                          >
                            <Ionicons name="close" size={24} color="#000" />
                          </TouchableOpacity>
                        </View>

                        <ScrollView className="flex-1">
                          {loading ? (
                            <ActivityIndicator
                              size="large"
                              color="#3B82F6"
                              className="mt-4"
                            />
                          ) : (
                            locations.map((location) => (
                              <TouchableOpacity
                                key={location.code}
                                className="p-4 border-b border-gray-100"
                                onPress={() => {
                                  if (currentStep === "province")
                                    handleSelectProvince(location);
                                  else if (currentStep === "district")
                                    handleSelectDistrict(location);
                                  else handleSelectWard(location);
                                }}
                              >
                                <Text className="text-base text-gray-800">
                                  {location.name}
                                </Text>
                              </TouchableOpacity>
                            ))
                          )}
                        </ScrollView>
                      </View>
                    </View>
                  </Modal>
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
