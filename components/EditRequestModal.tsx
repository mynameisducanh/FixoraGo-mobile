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
import {
  formatDateTimeVN,
  formatDateWithDay,
  formatTime,
} from "@/utils/dateFormat";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import LottieView from "lottie-react-native";
import DropdownTimeComponent from "@/components/services/dropdownTime";
import timeCategoriesList from "@/constants/TimeCategoriesList";
import RequestServiceApi from "@/api/requestService";

interface EditRequestModalProps {
  visible: boolean;
  onClose: () => void;
  id: string;
  onSubmit: (data: any) => void;
  initialData: {
    typeEquipment: string;
    calender: string;
    note: string;
    fileImage: string;
  };
}

const EditRequestModal: React.FC<EditRequestModalProps> = ({
  visible,
  onClose,
  id,
  onSubmit,
  initialData,
}) => {
  const [selectedValue, setSelectedValue] = useState("");
  const [note, setNote] = useState("");
  const [oldImages, setOldImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [checkDate, setCheckDate] = useState(false);
  const requestServiceApi = new RequestServiceApi();

  React.useEffect(() => {
    if (initialData.fileImage) {
      try {
        const imageUrls = JSON.parse(initialData.fileImage);
        if (Array.isArray(imageUrls)) {
          setOldImages(imageUrls);
        }
      } catch (error) {
        console.error("Error parsing fileImage:", error);
      }
    }
  }, [initialData]);

  const pickImage = async (index: number) => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Thông báo", "Bạn cần cấp quyền Camera để chụp ảnh!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = {
          ...result.assets[0],
          name: `image.${result.assets[0].uri.split(".").pop()}`,
          type: `image/${result.assets[0].uri.split(".").pop()}`,
        };

        setNewImages((prev) => {
          const updated = [...prev];
          updated[index] = newImage;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => {
      const updated = [...prev];
      updated[index] = undefined as any;
      return updated;
    });
  };

  const handleConfirmDate = (date: Date) => {
    const selected = new Date(date);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + 50);

    if ((selected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) > 1) {
      setCheckDate(true);
    }

    if (selected < now) {
      Alert.alert("Thông báo", "Không được chọn ngày trong quá khứ.");
      return;
    }

    if (selected > maxDate) {
      Alert.alert("Thông báo", "Chỉ được chọn ngày trong vòng 50 ngày tới.");
      return;
    }

    setSelectedDate(date);
    setDatePickerVisibility(false);
  };

  const handleConfirmTime = (time: Date) => {
    const selected = new Date(time);
    const selectedHour = selected.getHours();
    const now = new Date();

    if (selectedHour < 8 || selectedHour > 20) {
      Alert.alert(
        "Thông báo",
        "Fixer chỉ hoạt động trong khoảng thời gian từ 8h sáng đến 20h tối."
      );
      return;
    }

    if (!checkDate) {
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
      if (selected < oneHourFromNow) {
        Alert.alert(
          "Thông báo",
          "Vui lòng chọn thời gian cách hiện tại ít nhất 1 tiếng."
        );
        return;
      }
    }

    setSelectedTime(time);
    setTimePickerVisibility(false);
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    let hasChanges = false;

    // Chỉ thêm các trường đã được cập nhật
    if (selectedValue && selectedValue !== initialData.typeEquipment) {
      formData.append("typeEquipment", selectedValue);
      hasChanges = true;
    }

    if (selectedDate && selectedTime) {
      const newCalendar = `${formatTime(selectedTime)},${formatDateWithDay(selectedDate)}`;
      if (newCalendar !== initialData.calender) {
        formData.append("calender", newCalendar);
        hasChanges = true;
      }
    }

    if (note !== initialData.note && note) {
      formData.append("note", note);
      hasChanges = true;
    }

    // Chỉ thêm ảnh nếu có ảnh mới
    const hasNewImages = newImages.some(img => img !== undefined);
    if (hasNewImages) {
      newImages
        .filter((img) => img !== undefined)
        .forEach((image, index) => {
          formData.append("file", {
            uri: image.uri,
            name: `photo_${index}.jpg`,
            type: "image/jpeg",
          });
        });
      hasChanges = true;
    }

    if (!hasChanges) {
      Alert.alert("Thông báo", "Không có thay đổi nào để cập nhật");
      return;
    }

    try {
      // await requestServiceApi.updateRequest(formData, id);
      onClose(); // Đóng modal trước
      onSubmit(formData); // Sau đó gọi callback để reload detail
    } catch (error) {
      console.error("Error updating request:", error);
      Alert.alert("Lỗi", "Không thể cập nhật thông tin. Vui lòng thử lại sau.");
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800">
                Chỉnh sửa thông tin
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView className="flex-1 p-4">
            <View className="mb-6">
              <Text className="text-lg font-bold mb-3">Thông tin hiện tại</Text>
              <View className="bg-gray-50 p-4 rounded-lg space-y-3">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Thời gian lắp đặt/mua:</Text>
                  <Text className="font-medium">{initialData.typeEquipment || "Chưa có thông tin"}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Lịch hẹn:</Text>
                  <Text className="font-medium">{initialData.calender || "Chưa có thông tin"}</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Ghi chú:</Text>
                  <Text className="font-medium flex-1 text-right ml-2">{initialData.note || "Chưa có thông tin"}</Text>
                </View>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Thời gian thiết bị được lắp đặt/mua
              </Text>
              <DropdownTimeComponent
                data={timeCategoriesList}
                type="time"
                onSelect={(unit: any) => setSelectedValue(unit)}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Lịch hẹn</Text>
              <View className="flex-row gap-3">
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100 w-1/3"
                  onPress={() => setTimePickerVisibility(true)}
                >
                  <Text numberOfLines={1}>
                    {selectedTime ? formatTime(selectedTime) : "Chọn giờ"}
                  </Text>
                  <LottieView
                    source={require("@/assets/icons/clock-icon.json")}
                    autoPlay={false}
                    loop={false}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100 w-2/3"
                  onPress={() => setDatePickerVisibility(true)}
                >
                  <Text numberOfLines={1} className="text-center w-100">
                    {selectedDate
                      ? formatDateWithDay(selectedDate)
                      : "Chọn ngày"}
                  </Text>
                  <LottieView
                    source={require("@/assets/icons/calendar-icon.json")}
                    autoPlay={false}
                    loop={false}
                    style={{ width: 20, height: 20 }}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">Ghi chú</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3"
                value={note}
                onChangeText={setNote}
                placeholder="Nhập ghi chú"
                multiline
                numberOfLines={4}
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Hình ảnh hiện tại
              </Text>
              {oldImages.length > 0 ? (
                <View className="flex-row flex-wrap">
                  {oldImages.map((image, index) => (
                    <View key={index} className="relative mr-2 mb-2">
                      <Image
                        source={{ uri: image }}
                        className="w-20 h-20 rounded-lg"
                        resizeMode="cover"
                      />
                    </View>
                  ))}
                </View>
              ) : (
                <Text className="text-gray-500 italic">
                  Trước đó bạn chưa tải lên ảnh nào
                </Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 font-medium mb-2">
                Thay hình ảnh khác
              </Text>
              <Text className="text-gray-500 text-sm mb-2">
                Sau khi tải ảnh mới lên, chúng tôi sẽ thay thế ảnh cũ hiện tại
                của bạn
              </Text>
              <View className="flex-row gap-3">
                {[0, 1].map((index) => {
                  const img = newImages[index];
                  return (
                    <View key={index} className="relative">
                      <TouchableOpacity
                        onPress={() => pickImage(index)}
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
                          onPress={() => removeNewImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                        >
                          <Ionicons name="close" size={16} color="white" />
                        </TouchableOpacity>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          <View className="p-4 border-t border-gray-200">
            <TouchableOpacity
              className="bg-primary py-3 rounded-lg"
              onPress={handleSubmit}
            >
              <Text className="text-white font-semibold text-center">
                Lưu thay đổi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </Modal>
  );
};

export default EditRequestModal;
