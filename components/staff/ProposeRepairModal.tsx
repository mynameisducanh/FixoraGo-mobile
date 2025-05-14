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
import { Picker } from "@react-native-picker/picker";

interface ProposeRepairModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: string;
    name: string;
    images: ImagePicker.ImagePickerAsset[];
    price: string;
    note: string;
  }) => void;
}

const ProposeRepairModal: React.FC<ProposeRepairModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [type, setType] = useState("repair");
  const [name, setName] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const selectImage = async (index: number) => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
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
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sửa chữa");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập giá tiền");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = () => {
    onSubmit({
      type,
      name,
      images: images.filter((img) => img !== undefined),
      price,
      note,
    });
    // Reset form
    setType("repair");
    setName("");
    setImages([]);
    setPrice("");
    setNote("");
    setShowConfirmModal(false);
    onClose();
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
            <Text className="text-xl font-bold">Đề xuất sửa chữa</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            <View>
              <Text className="text-gray-700 mb-2">Loại sửa chữa</Text>
              <View className="border border-gray-300 rounded-lg">
                <Picker
                  selectedValue={type}
                  onValueChange={(value) => setType(value)}
                >
                  <Picker.Item label="Sửa chữa" value="repair" />
                  <Picker.Item label="Thay mới" value="replace" />
                </Picker>
              </View>
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Tên sửa chữa</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={name}
                onChangeText={setName}
                placeholder="Nhập tên sửa chữa"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Hình ảnh</Text>
              <View className="flex-row gap-3">
                {[0, 1].map((index) => {
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
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Giá tiền</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={price}
                onChangeText={setPrice}
                placeholder="Nhập giá tiền"
                keyboardType="numeric"
              />
            </View>

            <View>
              <Text className="text-gray-700 mb-2">Ghi chú</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={note}
                onChangeText={setNote}
                placeholder="Nhập ghi chú"
                multiline
                numberOfLines={3}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-primary py-3 rounded-lg mt-4"
            >
              <Text className="text-white text-center font-semibold">
                Xác nhận
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
            <Text className="text-xl font-bold mb-4 text-center">
              Xác nhận thông tin
            </Text>

            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Loại sửa chữa:</Text>
                <Text className="font-medium">
                  {type === "repair" ? "Sửa chữa" : "Thay mới"}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Tên sửa chữa:</Text>
                <Text className="font-medium">{name}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Giá tiền:</Text>
                <Text className="font-medium">{price}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Ghi chú:</Text>
                <Text className="font-medium">{note || "Không có"}</Text>
              </View>
            </View>

            <View className="flex-row justify-end space-x-4 mt-6">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="bg-gray-200 py-3 px-6 rounded-lg"
              >
                <Text className="text-gray-700">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-primary py-3 px-6 rounded-lg"
              >
                <Text className="text-white">Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default ProposeRepairModal; 