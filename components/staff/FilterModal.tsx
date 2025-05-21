import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  Switch,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  onApply: (filters: {
    districts: string[];
    services: string[];
    priceRange: string;
    status: string[];
    isUrgent: boolean;
    bonusAmount: string;
  }) => void;
}

const DISTRICTS = [
  "Hải Châu",
  "Thanh Khê",
  "Sơn Trà",
  "Ngũ Hành Sơn",
  "Liên Chiểu",
  "Cẩm Lệ",
  "Hòa Vang",
];

const SERVICES = ["Điện", "Phương tiện", "Đồ điện tử", "Sơn", "Ống nước"];

const TIME_RANGES = ["Tất cả", "Hôm nay", "Ngày mai", "Tuần này", "Tháng này"];

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onClose,
  onApply,
}) => {
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState("Tất cả");
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [isUrgent, setIsUrgent] = useState(false);
  const [bonusAmount, setBonusAmount] = useState("");
  const slideAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    } else {
      Animated.spring(slideAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }).start();
    }
  }, [visible]);

  const toggleDistrict = (district: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(district)
        ? prev.filter((d) => d !== district)
        : [...prev, district]
    );
  };

  const toggleService = (service: string) => {
    setSelectedServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatus((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleApply = () => {
    onApply({
      districts: selectedDistricts,
      services: selectedServices,
      priceRange: selectedPriceRange,
      status: selectedStatus,
      isUrgent,
      bonusAmount,
    });
    onClose();
  };

  const handleReset = () => {
    setSelectedDistricts([]);
    setSelectedServices([]);
    setSelectedPriceRange("Tất cả");
    setSelectedStatus([]);
    setIsUrgent(false);
    setBonusAmount("");
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <Animated.View
          className="absolute right-0 top-0 bottom-0 w-[90%] bg-white"
          style={{
            transform: [
              {
                translateX: slideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 400],
                }),
              },
            ],
          }}
        >
          <View className="flex-1">
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200 mt-12">
              <Text className="text-xl font-bold">Bộ lọc</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1 p-4">
              {/* Urgent Toggle */}

              {/* Districts Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-3">Quận/Huyện</Text>
                <View className="flex-row flex-wrap gap-2">
                  {DISTRICTS.map((district) => (
                    <TouchableOpacity
                      key={district}
                      onPress={() => toggleDistrict(district)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedDistricts.includes(district)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={`${
                          selectedDistricts.includes(district)
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {district}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Services Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-3">Dịch vụ</Text>
                <View className="flex-row flex-wrap gap-2">
                  {SERVICES.map((service) => (
                    <TouchableOpacity
                      key={service}
                      onPress={() => toggleService(service)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedServices.includes(service)
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={`${
                          selectedServices.includes(service)
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {service}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Price Range Filter */}
              <View className="mb-6">
                <Text className="text-lg font-semibold mb-3">Thời gian</Text>
                <View className="flex-row flex-wrap gap-2">
                  {TIME_RANGES.map((range) => (
                    <TouchableOpacity
                      key={range}
                      onPress={() => setSelectedPriceRange(range)}
                      className={`px-4 py-2 rounded-full border ${
                        selectedPriceRange === range
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      <Text
                        className={`${
                          selectedPriceRange === range
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        {range}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View className="mb-6">
                <View className="flex-row gap-3 items-center">
                  <Text className="text-lg font-semibold">Cần gấp</Text>
                  <Switch
                    value={isUrgent}
                    onValueChange={setIsUrgent}
                    trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                    thumbColor={isUrgent ? "#FFFFFF" : "#FFFFFF"}
                  />
                </View>
                <Text className="mt-2">
                  Với lựa chọn Cần gấp bạn chắc chắn sẽ được thưởng thêm (tiền
                  Bo)
                </Text>
              </View>
            </ScrollView>

            {/* Bottom Buttons */}
            <View className="p-4 border-t border-gray-200 flex-row gap-3">
              <TouchableOpacity
                onPress={handleReset}
                className="flex-1 bg-gray-100 py-3 rounded-lg"
              >
                <Text className="text-center text-gray-600 font-semibold">
                  Đặt lại
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleApply}
                className="flex-1 bg-blue-600 py-3 rounded-lg"
              >
                <Text className="text-center text-white font-semibold">
                  Áp dụng
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default FilterModal;
