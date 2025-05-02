import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
  Alert,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

interface Location {
  code: string;
  name: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (address: {
    province: Location | null;
    district: Location | null;
    ward: Location | null;
    detail: string;
  }) => void;
}

const LocationPicker: React.FC<Props> = ({ visible, onClose, onSelect }) => {
  const [currentStep, setCurrentStep] = useState<
    "province" | "district" | "ward"
  >("province");
  const [provinces, setProvinces] = useState<Location[]>([]);
  const [districts, setDistricts] = useState<Location[]>([]);
  const [wards, setWards] = useState<Location[]>([]);
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Location | null>(null);
  const [detailAddress, setDetailAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMainPicker, setShowMainPicker] = useState(false);

  useEffect(() => {
    if (visible) {
      setShowMainPicker(false);
    }
  }, [visible]);

  const fetchProvinces = async () => {
    setLoading(true);
    try {
      const res = await axios.get("https://provinces.open-api.vn/api/p/");
      setProvinces(res.data);
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
    setShowMainPicker(false);
  };

  const handleBack = () => {
    if (currentStep === "ward") setCurrentStep("district");
    else if (currentStep === "district") setCurrentStep("province");
  };

  const handleConfirm = () => {
    onSelect({
      province: selectedProvince,
      district: selectedDistrict,
      ward: selectedWard,
      detail: detailAddress,
    });
    onClose();
  };

  const handleCurrentLocation = () => {
    Alert.alert("Thông báo", "Tính năng đang phát triển");
    onClose();
  };

  let locations: Location[] = [];
  let title = "";

  switch (currentStep) {
    case "province":
      locations = provinces;
      title = "Chọn tỉnh/thành phố";
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
                {!showMainPicker ? (
                  <>
                    <View className="flex-row items-center justify-between mb-4">
                      <Text className="text-lg font-bold text-center flex-1">
                        Chọn địa chỉ của bạn
                      </Text>
                      <TouchableOpacity onPress={onClose}>
                        <Ionicons name="close" size={18} color="#000" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      onPress={handleCurrentLocation}
                      className="flex-row items-center gap-2 border border-primary rounded-lg p-4 mb-4"
                    >
                      <Ionicons name="locate" size={20} color="#2563EB" />
                      <Text className="text-primary text-base">
                        Chọn vị trí hiện tại
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => {
                        setShowMainPicker(true);
                        fetchProvinces();
                      }}
                      className={`flex-row items-center gap-2 py-4 mb-4 ${
                        !selectedProvince
                          ? "border-b-2 border-gray-100"
                          : "border border-primary rounded-lg p-4"
                      }`}
                    >
                      <Text
                        className={`text-base  ${
                          !selectedProvince
                            ? "text-gray-400 "
                            : "text-gray-950 "
                        }`}
                      >
                        {!selectedProvince ? (
                          "Tỉnh/Thành phố, Quận/Huyện, Phường/Xã"
                        ) : (
                          <>
                            <Text className=" text-base font-bold mb-1">
                              Địa điểm đã chọn:
                            </Text>
                            {selectedWard?.name && `${selectedWard.name}, `}
                            {selectedDistrict?.name &&
                              `${selectedDistrict.name}, `}
                            {selectedProvince?.name}
                          </>
                        )}
                      </Text>
                    </TouchableOpacity>

                    <View className="space-y-2 mb-4">
                      <TextInput
                        className="border-b-2 border-gray-100 p-3"
                        placeholder="Tên đường, Tòa nhà, Số nhà, Thôn, Ngõ ,..."
                        value={detailAddress}
                        onChangeText={setDetailAddress}
                        multiline
                      />
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
                  <View className="h-[70vh]">
                    <View className="flex-row items-center justify-between mb-4">
                      {currentStep !== "province" ? (
                        <TouchableOpacity onPress={handleBack}>
                          <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                      ) : (
                        <View style={{ width: 24 }} />
                      )}
                      <Text className="text-lg font-semibold">{title}</Text>
                      <TouchableOpacity
                        onPress={() => setShowMainPicker(false)}
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
