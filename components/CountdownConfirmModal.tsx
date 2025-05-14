import React, { useState, useEffect } from "react";
import { View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import LottieView from "lottie-react-native";

interface CountdownConfirmModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  data: {
    requestId: string;
    nameService: string;
    listDetailService: string;
    priceService: string;
    typeEquipment: string;
    address: string;
    calender: string;
    note: string;
  };
  countdownSetup: number;
}

const CountdownConfirmModal: React.FC<CountdownConfirmModalProps> = ({
  visible,
  onClose,
  onConfirm,
  title = "Xác nhận",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  data,
  countdownSetup
}) => {
  const [countdown, setCountdown] = useState(countdownSetup);
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (visible && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (countdown === 0) {
      onConfirm();
      onClose();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [visible, countdown]);

  useEffect(() => {
    if (visible) {
      setCountdown(countdownSetup);
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden p-4">
          {/* Header */}
          <View className="">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-xl font-bold text-primary">{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#FFC107" />
              </TouchableOpacity>
            </View>
            <View className="flex-col items-center">
              <Text className="text-primary ml-2">Tự động xác nhận sau:</Text>
              <View style={{ width: 45, height: 45, position: "relative" }}>
                <LottieView
                  source={require("@/assets/icons/loading-icon.json")}
                  autoPlay
                  loop
                  style={{ width: 45, height: 45 }}
                />
                <Text
                  className="text-center"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: [{ translateX: -10 }, { translateY: -10 }],
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {countdown}s
                </Text>
              </View>
            </View>
          </View>
          <Text className="text-base text-gray-600 mb-4">{message}</Text>

          {/* Request Details */}
          <View className="bg-gray-50 rounded-xl p-4 mb-4">
            <Text className="text-lg font-semibold mb-3">
              Thông tin yêu cầu
            </Text>

            <View className="flex-col">
              {data?.nameService && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Dịch vụ:</Text>
                  <Text className="font-medium">{data.nameService}</Text>
                </View>
              )}

              {data?.listDetailService && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Phân loại dịch vụ:</Text>
                  <Text className="font-medium">{data.listDetailService}</Text>
                </View>
              )}

              {data?.priceService && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Chi tiết thiết bị:</Text>
                  <Text className="font-medium">{data.priceService}</Text>
                </View>
              )}

              {data?.note && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">
                    Thời điểm lắp đặt/mua thiết bị:
                  </Text>
                  <Text className="font-medium">{data.note}</Text>
                </View>
              )}

              {data?.calender && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Giờ hẹn:</Text>
                  <Text className="font-medium">{data.calender}</Text>
                </View>
              )}

              {data?.address && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Địa chỉ:</Text>
                  <Text className="font-medium text-right flex-1 ml-2">
                    {data.address}
                  </Text>
                </View>
              )}

              {data?.note && (
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Ghi chú:</Text>
                  <Text className="font-medium">{data.note}</Text>
                </View>
              )}
            </View>

            {/* Footer */}
            <View className="flex-row p-4 border-t border-gray-200">
              <TouchableOpacity
                className="flex-1 py-3 rounded-lg bg-gray-100 items-center mr-2"
                onPress={onClose}
              >
                <Text className="text-base font-semibold text-gray-700">
                  Hủy
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 py-3 rounded-lg bg-primary items-center ml-2"
                onPress={() => {
                  onConfirm();
                  onClose();
                }}
              >
                <Text className="text-base font-semibold text-white">
                  Xác nhận
                </Text>
              </TouchableOpacity>
            </View>
            <View className="mt-4">
              <Text className="text-gray-500 text-sm text-center">
                *Bằng cách nhấn "Xác nhận", bạn đồng ý với{" "}
                <Text className="text-primary font-semibold">
                  điều khoản sử dụng
                </Text>{" "}
                của chúng tôi.
              </Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CountdownConfirmModal;
