import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/stores/user-store";
import ActivityLogApi from "@/api/activityLogApi";
import { formatDecimalToWhole } from "@/utils/priceFormat";

interface PayFeesModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    images: ImagePicker.ImagePickerAsset[];
    note: string;
  }) => void;
  feeAmount: number;
}

const PayFeesModal: React.FC<PayFeesModalProps> = ({
  visible,
  onClose,
  onSubmit,
  feeAmount,
}) => {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user } = useUserStore();
  const activityLogApi = new ActivityLogApi();
  const [isLoading, setIsLoading] = useState(false);

  const selectImage = async (index: number) => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Thông báo", "Bạn cần cấp quyền Camera để chụp ảnh!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = {
          ...result.assets[0],
          name: `image.${result.assets[0].uri.split(".").pop()}`,
          type: `image/${result.assets[0].uri.split(".").pop()}`,
        };

        setImages((prev) => {
          const updated = [...prev];
          updated[index] = newImage;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = undefined as any;
      return updated;
    });
  };

  const handleSubmit = () => {
    const validImages = images.filter((img) => img !== undefined);
    if (validImages.length === 0) {
      Alert.alert("Lỗi", "Vui lòng chụp ít nhất một hình ảnh");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      const formData = new FormData();
      if (user?.id) {
        formData.append("userId", user.id);
      }
      formData.append("activityType", "staff_payfee");
      formData.append("note", note);
      const firstImage = images.find((img) => img !== undefined);
      if (firstImage) {
        formData.append("file", {
          uri: firstImage.uri,
          name: firstImage.name || "image.jpg",
          type: firstImage.type || "image/jpeg",
        });
      }
      formData.append("temp", "pending");
      const res = await activityLogApi.createRes(formData);
      if (res) {
        onSubmit({
          images: images.filter((img) => img !== undefined),
          note,
        });
        setImages([]);
        setNote("");
        setIsLoading(false);
        setShowConfirmModal(false);
        setTimeout(() => {
          onClose();
        }, 100);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-[90%] rounded-2xl p-4 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">Xác nhận đóng phí</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            <View className="p-2 rounded-lg bg-gray-50">
              <Text className="text-gray-600 text-center mb-2">
                Số tiền cần đóng
              </Text>
              <Text className="text-2xl font-bold text-center text-primary">
                {formatDecimalToWhole(feeAmount)} VNĐ
              </Text>
            </View>

            <View>
              <Text className="text-gray-700 mb-2">
                Hình ảnh <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {[0].map((index) => {
                  const img = images[index];
                  return (
                    <View key={index} className="relative">
                      <TouchableOpacity
                        onPress={() => selectImage(index)}
                        className="border-dotted border w-20 h-20 border-gray-300 justify-center items-center rounded-lg overflow-hidden"
                      >
                        {img ? (
                          <Image
                            source={{ uri: img.uri }}
                            className="w-full h-full"
                          />
                        ) : (
                          <Ionicons name="camera" size={24} color="#9CA3AF" />
                        )}
                      </TouchableOpacity>
                      {img && (
                        <TouchableOpacity
                          onPress={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                        >
                          <Ionicons name="close" size={12} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
              <Text className="text-gray-500 text-sm mt-2">
                Vui lòng chụp ảnh biên lai hoặc chứng từ thanh toán
              </Text>
            </View>

            <View>
              <Text className="text-gray-700 mb-2">
                Xác nhận số tiền bạn nhập
              </Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={note}
                onChangeText={(text) => setNote(text.replace(/[^0-9]/g, ""))}
                placeholder="Xác nhận số tiền..."
                keyboardType="numeric"
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary py-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center font-semibold">
                Xác nhận đóng phí
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] rounded-2xl p-4">
            <Text className="text-base font-bold mb-4 text-center">
              Xác nhận đóng phí
            </Text>
            <Text className="text-base font-bold mb-4 text-center">
              Sau khi bạn gửi yêu cầu này đi chúng tôi sẽ tiến hành xác nhận và
              thông báo cho bạn sớm nhất , bạn có thể theo dõi trạng thái ở "Yêu
              cầu nộp phí"
            </Text>
            <View className="flex-row justify-end space-x-4 mt-6 gap-3">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                disabled={isLoading}
                className="bg-gray-200 py-3 px-6 rounded-lg"
              >
                <Text className="text-gray-700">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-primary py-3 px-6 rounded-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size={20} />
                ) : (
                  <Text className="text-white">Xác nhận</Text>
                )}
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
      </Modal>
    </Modal>
  );
};

export default PayFeesModal;
