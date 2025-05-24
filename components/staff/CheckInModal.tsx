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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/stores/user-store";
import ActivityLogApi from "@/api/activityLogApi";
import CountdownConfirmModal from "../CountdownConfirmModal";
import { ActivityIndicator } from "react-native-paper";

interface CheckInModalProps {
  visible: boolean;
  requestId: string;
  onClose: () => void;
  onSubmit: (data: {
    images: ImagePicker.ImagePickerAsset[];
    note: string;
  }) => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({
  visible,
  requestId,
  onClose,
  onSubmit,
}) => {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user } = useUserStore();
  const ativityLogApi = new ActivityLogApi();
  const [isLoading, setIsLoading] = useState(false);
  const selectImage = async (index: number) => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Thông báo", "Bạn cần cấp quyền Camera để chụp ảnh!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
        formData.append("fixerId", user.id);
      }
      formData.append("activityType", "staff_checkin");
      const firstImage = images.find((img) => img !== undefined);
      // if (firstImage) {
      //   formData.append("file", {
      //     uri: firstImage.uri,
      //     name: firstImage.name || "image.jpg",
      //     type: firstImage.type || "image/jpeg",
      //   });
      // }
      formData.append("note", note);
      formData.append("requestServiceId", requestId);
      const res = await ativityLogApi.createRes(formData);
      if (res) {
        onSubmit({
          images: images.filter((img) => img !== undefined),
          note,
        });
        // Reset form
        onClose();
        setImages([]);
        setNote("");
        setShowConfirmModal(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
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
            <Text className="text-xl font-bold">Xác nhận đã đến</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2">
                Hình ảnh <Text className="text-red-500">*</Text>
              </Text>
              <View className="flex-row gap-3">
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
                Vui lòng chụp ảnh rõ nét và đảm bảo có thể xác định địa điểm rõ
                ràng
              </Text>
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Ghi chú</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={note}
                onChangeText={setNote}
                placeholder="Nhập ghi chú (nếu có)"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary py-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center font-semibold">
                Xác nhận đã đến
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
              Xác nhận là bạn đã đến
            </Text>
            <Text className="text-base font-bold mb-4 text-center">
              Hãy đảm bảo rằng bạn đã đến đúng địa điểm , nếu bạn cố tình gian
              lận chúng tôi sẽ có hình phạt thích đáng
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

export default CheckInModal;
