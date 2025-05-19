import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/stores/user-store";
import RequestConfirmServiceApi from "@/api/requestConfirmServiceApi";

interface CompleteRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  requestId: string;
  fixerData?: {
    id: string;
    name: string;
    temp: string;
    note?: string;
    image?: string;
    userAccept: string;
  } | null;
}

const WARRANTY_OPTIONS = [
  { label: "10 ngày", value: 10 },
  { label: "15 ngày", value: 15 },
  { label: "30 ngày", value: 30 },
  { label: "60 ngày", value: 60 },
  { label: "90 ngày", value: 90 },
];

const CompleteRequestModal: React.FC<CompleteRequestModalProps> = ({
  visible,
  onClose,
  onSuccess,
  requestId,
  fixerData,
}) => {
  const { user } = useUserStore();
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [warrantyDays, setWarrantyDays] = useState<number>(10);
  const requestConfirmServiceApi = new RequestConfirmServiceApi();

  useEffect(() => {
    if (fixerData?.temp) {
      setWarrantyDays(Number(fixerData.temp));
    }
  }, [fixerData]);

  const selectImage = async () => {
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
        setImage(result.assets[0]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleComplete = async () => {
    if (!user) {
      Alert.alert("Lỗi", "Không tìm thấy thông tin người dùng");
      return;
    }

    if (user.roles === "system_fixer" && !fixerData) {
      if (!image) {
        Alert.alert("Lỗi", "Vui lòng chụp ảnh hoàn thành công việc");
        return;
      }

      try {
        setLoading(true);
        const formData = new FormData();
        formData.append("file", {
          uri: image?.uri,
          type: "image/jpeg",
          name: "completion.jpg",
        } as any);
        formData.append("note", note);
        formData.append("name", "Xác nhận đã hoàn thành của nhân viên");
        formData.append("type", "completed");
        formData.append("userId", user.id);
        formData.append("requestServiceId", requestId);
        formData.append("temp", warrantyDays.toString());

        const res = await requestConfirmServiceApi.createRequest(formData);
        onSuccess();
        onClose();
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi xác nhận hoàn thành");
      } finally {
        setLoading(false);
      }
    } else if (user.roles === "system_user" && fixerData?.id) {
      try {
        setLoading(true);

        const res = await requestConfirmServiceApi.userAccept(fixerData.id);
        console.log(res);
        onSuccess();
        onClose();
      } catch (error) {
        console.error(error);
        Alert.alert("Lỗi", "Có lỗi xảy ra khi xác nhận hoàn thành");
      } finally {
        setLoading(false);
      }
    }
  };

  const renderWarrantyOptions = () => (
    <View className="mt-4">
      <Text className="text-gray-600 mb-2">Thời gian bảo hành:</Text>
      <View className="flex-row flex-wrap gap-2">
        {WARRANTY_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => setWarrantyDays(option.value)}
            disabled={!!fixerData?.id}
            className={`px-4 py-2 rounded-full border ${
              warrantyDays === option.value
                ? "bg-primary border-primary"
                : "border-gray-300"
            }`}
          >
            <Text
              className={`${
                warrantyDays === option.value ? "text-white" : "text-gray-600"
              }`}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFixerInputForm = () => (
    <View className="my-4">
      <Text className="text-gray-600">
        Vui lòng chụp ảnh hoàn thành công việc và thêm ghi chú
      </Text>

      <View className="relative my-4">
        <TouchableOpacity
          onPress={selectImage}
          className="border-dotted border-2 border-gray-300 h-40 rounded-lg justify-center items-center"
        >
          {image ? (
            <Image
              source={{ uri: image.uri }}
              className="w-full h-full rounded-lg"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="camera" size={32} color="#9CA3AF" />
              <Text className="text-gray-500 mt-2">Chụp ảnh</Text>
            </View>
          )}
        </TouchableOpacity>
        {image && (
          <TouchableOpacity
            onPress={removeImage}
            className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
          >
            <Ionicons name="close" size={16} color="white" />
          </TouchableOpacity>
        )}
      </View>

      <TextInput
        className="border border-gray-300 rounded-lg p-3"
        value={note}
        onChangeText={setNote}
        placeholder="Thêm ghi chú (không bắt buộc)"
        multiline
        numberOfLines={3}
      />

      {renderWarrantyOptions()}

      <View className="mt-4">
        <Text className="text-gray-500 text-sm text-center">
          *Bằng cách nhấn "Xác nhận", bạn đồng ý với{" "}
          <Text className="text-primary font-semibold">điều khoản sử dụng</Text>{" "}
          của chúng tôi.
        </Text>
      </View>
    </View>
  );

  const renderFixerData = () => (
    <View className="space-y-4">
      <Text className="text-gray-600 mb-2">Thông tin xác nhận hoàn thành:</Text>

      {fixerData && (
        <View className="bg-gray-50 p-4 rounded-lg">
          <View className="flex-row items-center mb-3">
            <Text className="font-semibold">{fixerData.name}</Text>
          </View>

          {fixerData.image && (
            <Image
              source={{ uri: fixerData.image }}
              className="w-full h-40 rounded-lg mb-3"
            />
          )}

          {fixerData.note && (
            <Text className="text-gray-600">Ghi chú : {fixerData.note}</Text>
          )}
        </View>
      )}

      {renderWarrantyOptions()}

      {user?.roles === "system_fixer" && (
        <Text className="mt-2">
          Bạn đã xác nhận hoàn thành, vui lòng chờ người dùng xác nhận
        </Text>
      )}
    </View>
  );

  if (!user) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="bg-white w-[90%] rounded-2xl p-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold">Xác nhận hoàn thành</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              {user.roles === "system_fixer"
                ? fixerData
                  ? renderFixerData()
                  : renderFixerInputForm()
                : renderFixerData()}

              {fixerData?.userAccept !== "Accepted" && (
                <View>
                  {user.roles === "system_user" && fixerData?.id && (
                    <View className="mt-3">
                      <Text>
                        Nếu nhân viên của bạn đã thật sự hoàn thành hãy nhấn xác
                        nhận trước khi thanh toán
                      </Text>
                    </View>
                  )}
                  <View className="flex-row justify-end gap-4 mt-6">
                    <TouchableOpacity
                      onPress={onClose}
                      className="bg-gray-200 py-3 px-6 rounded-lg"
                      disabled={loading}
                    >
                      <Text className="text-gray-700">Đóng</Text>
                    </TouchableOpacity>

                    {user.roles === "system_fixer" && !fixerData && (
                      <TouchableOpacity
                        onPress={handleComplete}
                        className="bg-primary py-3 px-6 rounded-lg"
                        disabled={loading}
                      >
                        {loading ? (
                          <ActivityIndicator color="white" />
                        ) : (
                          <Text className="text-white">
                            Xác nhận hoàn thành
                          </Text>
                        )}
                      </TouchableOpacity>
                    )}

                    {user.roles === "system_user" &&
                      fixerData?.id &&
                      fixerData.userAccept && (
                        <TouchableOpacity
                          onPress={handleComplete}
                          className="bg-primary py-3 px-6 rounded-lg"
                          disabled={loading}
                        >
                          {loading ? (
                            <ActivityIndicator color="white" />
                          ) : (
                            <Text className="text-white">Tôi xác nhận</Text>
                          )}
                        </TouchableOpacity>
                      )}
                  </View>
                </View>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CompleteRequestModal;
