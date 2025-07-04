import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  Image,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import TextArea from "@/components/default/textArea";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import ServiceApi from "@/api/service";
import PriceServiceApi from "@/api/priceService";
import ListDetailServiceApi from "@/api/listIconService";
import {
  ListDetailServiceInterface,
  PricesServiceInterface,
  ServiceInterface,
} from "@/types/service";
import DropdownTimeComponent from "@/components/services/dropdownTime";
import timeCategoriesList from "@/constants/TimeCategoriesList";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDate, formatDateWithDay, formatTime } from "@/utils/dateFormat";
import * as ImagePicker from "expo-image-picker";
import RequestServiceApi from "@/api/requestService";
import axios from "axios";
import Constants from "expo-constants";
import { Ionicons } from "@expo/vector-icons";
import LocationPicker from "@/components/default/locationPicker";
import { useUserStore } from "@/stores/user-store";
import {
  getCurrentLocation,
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
} from "@/utils/mapUtils";
import { useLocationStore } from "@/stores/location-store";
import { Switch } from "react-native-paper";

interface Location {
  code: string;
  name: string;
}

interface CustomImageAsset extends Omit<ImagePicker.ImagePickerAsset, "type"> {
  name?: string;
  mimeType?: string;
}

const MONEY_BONUS = [
  "10.000",
  "20.000",
  "30.000",
  "40.000",
  "50.000",
  "100.000",
];

const VerifyService = () => {
  const { unit, serviceId, typeServiceId } = useLocalSearchParams();
  console.log(unit, serviceId, typeServiceId);
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [isUrgent, setIsUrgent] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState("");
  const [isUrgentAvailable, setIsUrgentAvailable] = useState(false);

  const [selectedWard, setSelectedWard] = useState<Location | null>(null);
  const [detailAddress, setDetailAddress] = useState("");
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  const { user } = useUserStore();
  const { latitude, longitude, errorMsg, loading } = useLocationStore();
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);
  const serviceApi = new ServiceApi();
  const priceServiceApi = new PriceServiceApi();
  const listDetailServiceApi = new ListDetailServiceApi();
  const requestServiceApi = new RequestServiceApi();
  const [text, setText] = useState("");
  const router = useRouter();
  const [address, setAddress] = useState<any>();
  const [service, setService] = useState<ServiceInterface>();
  const [priceService, setPrice] = useState<PricesServiceInterface>();
  const [listDetailService, setListDetailService] =
    useState<ListDetailServiceInterface>();
  const [images, setImages] = useState<CustomImageAsset[]>([]);
  const [otherDevice, setOtherDevice] = useState("");
  const [checkDate, setCheckDate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirmDate = (date: any) => {
    const selected = new Date(date);
    const now = new Date();

    // Đặt thời gian của 'now' về 00:00:00 để so sánh chỉ theo ngày
    now.setHours(0, 0, 0, 0);

    // Giới hạn trên là ngày hiện tại + 10 ngày
    const maxDate = new Date(now);
    maxDate.setDate(now.getDate() + 50); //sửa thành 10 khi build
    console.log(
      "first",
      (selected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Kiểm tra xem có phải ngày hôm nay không
    const isToday =
      selected.getDate() === new Date().getDate() &&
      selected.getMonth() === new Date().getMonth() &&
      selected.getFullYear() === new Date().getFullYear();

    if ((selected.getTime() - now.getTime()) / (1000 * 60 * 60 * 24) > 1) {
      console.log("first");
      setCheckDate(true);
    } else {
      setCheckDate(false);
    }

    // So sánh
    if (selected < now) {
      Alert.alert("Thông báo", "Không được chọn ngày trong quá khứ.");
      return;
    }

    if (selected > maxDate) {
      Alert.alert("Thông báo", "Chỉ được chọn ngày trong vòng 10 ngày tới.");
      return;
    }

    // Reset selected time when date changes to ensure validation
    if (selectedTime) {
      const currentTime = new Date();
      const twoHoursFromNow = new Date(
        currentTime.getTime() + 2 * 60 * 60 * 1000
      );

      // If selected time is now invalid for the new date, reset it
      if (isToday && selectedTime.getTime() < twoHoursFromNow.getTime()) {
        setSelectedTime(null);
        setSelectedDate(null);
        console.log("Vào");
        Alert.alert(
          "Thông báo",
          "Thời gian đã chọn không hợp lệ cho ngày mới. Vui lòng chọn lại giờ."
        );
        return; // Thêm return để không tiếp tục xử lý
      }
    }

    // Nếu hợp lệ, set ngày mới
    setSelectedDate(date);
    hideDatePicker();
    checkUrgentAvailability(date, selectedTime);
  };

  const handleConfirmTime = (time: any) => {
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

    // Kiểm tra xem ngày đã chọn có phải hôm nay không
    const isToday =
      selectedDate &&
      selectedDate.getDate() === new Date().getDate() &&
      selectedDate.getMonth() === new Date().getMonth() &&
      selectedDate.getFullYear() === new Date().getFullYear();

    if (isToday) {
      // Thời gian hiện tại + 1 tiếng
      const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);

      // So sánh
      if (selected.getTime() < oneHourFromNow.getTime()) {
        Alert.alert(
          "Thông báo",
          "Vui lòng chọn thời gian cách hiện tại ít nhất 1 tiếng."
        );
        return;
      }
    }

    // Nếu hợp lệ
    setSelectedTime(time);
    console.log(time, " ", formatTime(time));
    hideTimePicker();
    checkUrgentAvailability(selectedDate, time);
  };

  const checkUrgentAvailability = (date: Date | null, time: Date | null) => {
    if (!date || !time) {
      setIsUrgentAvailable(false);
      setIsUrgent(false);
      return;
    }

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

    const now = new Date();
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);

    // Kiểm tra nếu thời gian hẹn cách hiện tại dưới 2 tiếng
    const isAvailable = selectedDateTime <= twoHoursFromNow;
    setIsUrgentAvailable(isAvailable);

    // Nếu không khả dụng, tắt chế độ urgent
    if (!isAvailable) {
      setIsUrgent(false);
    }
  };

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
          mimeType: `image/${result.assets[0].uri.split(".").pop()}`,
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

  useEffect(() => {
    if (unit) {
      const fetchDataService = async () => {
        const serviceData = await serviceApi.getById(serviceId as string);
        setService(serviceData);
        const unitData = await listDetailServiceApi.getOneByUnit(
          Array.isArray(unit) ? unit[0] : unit
        );
        setListDetailService(unitData);
        const priceData = await priceServiceApi.getById(
          typeServiceId as string
        );

        setPrice(priceData);
      };
      fetchDataService();
    }
  }, [unit]);

  const requestService = async () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert("Lỗi", "Vui lòng chọn ngày và giờ hẹn.");
      return;
    }

    if (!detailAddress) {
      Alert.alert(
        "Lỗi",
        "Vui lòng chọn đầy đủ địa chỉ và nhập địa chỉ chi tiết."
      );
      return;
    }
    if (listDetailService?.name === "Khác") {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập chính xác thiết bị bạn cần được hỗ trợ"
      );
      return;
    }
    const formData = new FormData();

    // Append fields
    if (user?.id) {
      formData.append("userId", user.id);
    }
    formData.append("nameService", service?.name || "");
    formData.append("listDetailService", listDetailService?.name || "");
    formData.append("priceService", priceService?.name || "");
    formData.append("typeEquipment", selectedValue || "");
    formData.append("address", `${detailAddress}` || "");
    formData.append("isUrgent", `${isUrgent}` || "");
    formData.append("bonus", `${selectedPriceRange}` || "");
    formData.append(
      "calender",
      `${formatTime(selectedTime)},${formatDateWithDay(selectedDate)}`
    );
    formData.append("note", text || "");

    // Append file(s)
    images
      .filter((img) => img !== undefined)
      .forEach((image, index) => {
        const fileData = {
          uri: image.uri,
          name: image.name || `photo_${index}.jpg`,
          type: image.mimeType || "image/jpeg",
        } as any;
        formData.append("file", fileData);
      });
    try {
      // const res = await requestServiceApi.createRequestService(formData);
      const res = await axios.post(
        `${Constants.expoConfig?.extra?.API_NETWORK}/requestService`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res) {
        router.push("/service/requestSuccess");
      }
    } catch (err) {
      console.error("Lỗi upload:", err);
    }
  };

  const handleConfirmRequest = () => {
    if (otherDevice) {
      if (priceService) {
        priceService.name = otherDevice;
      }
    }
    if (!selectedDate || !selectedTime) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn ngày và giờ hẹn trước khi xác nhận."
      );
      return;
    }
    if (listDetailService?.name === "Khác") {
      Alert.alert(
        "Lỗi",
        "Vui lòng nhập chính xác thiết bị bạn cần được hỗ trợ"
      );
      return;
    }
    if (!detailAddress) {
      Alert.alert(
        "Thông báo",
        "Vui lòng chọn địa chỉ đầy đủ trước khi xác nhận."
      );
      return;
    }

    setIsConfirmModalVisible(true);
  };

  const handleSubmitRequest = async () => {
    setIsConfirmModalVisible(false);
    setIsLoading(true);
    try {
      await requestService();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView className="px-4 pt-3 pb-5 bg-white ">
            {priceService?.name === "Khác" && (
              <View>
                <Text className="pb-2 font-bold text-lg">
                  Thiết bị cần được hỗ trợ của bạn là gì ?{" "}
                  <Text style={{ color: "red" }}>*</Text>
                </Text>
                <TextInput
                  className="border border-gray-300 rounded-lg p-3 mb-2"
                  placeholder="Nhập thiết bị cần hỗ trợ"
                  value={otherDevice}
                  onChangeText={(text) => setOtherDevice(text)}
                />
              </View>
            )}
            <Text className="pb-3 font-bold text-lg">
              Mô tả thêm về vấn đề bạn đang gặp
            </Text>
            <DropdownTimeComponent
              data={timeCategoriesList}
              type={"time"}
              onSelect={(unit: any) => setSelectedValue(unit)}
            />
            <TextArea placeholder="Nhập mô tả ..." onChangeText={setText} />
            <View className="flex-row mt-3 gap-3">
              <View className="w-1/2">
                <Text>
                  <Text className="font-bold">Gợi ý :</Text>Bạn có thể thêm hình
                  ảnh để nhân viên có thể hỗ trợ cho bạn tốt hơn
                </Text>
              </View>
              <View className=" flex-row gap-3">
                {[0, 1].map((index) => {
                  const img = images[index];
                  return (
                    <View key={index} className="relative">
                      <TouchableOpacity
                        onPress={() => {
                          selectImage(index);
                        }}
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
            <Text className="py-2 font-bold text-lg">Thông tin dịch vụ</Text>
            <View className="border border-gray-300 rounded-lg p-4 bg-gray-100 w-100">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Tên dịch vụ:</Text>
                <Text
                  style={{ maxWidth: 215 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="font-bold"
                >
                  {service?.name}
                </Text>
              </View>
              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-600">Phân loại dịch vụ:</Text>
                <Text
                  style={{ maxWidth: 200 }}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="font-bold"
                >
                  {listDetailService?.name}
                </Text>
              </View>
              {priceService?.name !== "Khác" && (
                <View className="flex-row justify-between mt-2">
                  <Text className="text-gray-600">
                    Chi tiết thiết bị của bạn:
                  </Text>
                  <Text className="font-bold">{priceService?.name}</Text>
                </View>
              )}
            </View>
            <Text className="py-2 font-bold text-lg">
              Xác nhận lịch hẹn(Vui lòng chọn ngày trước)<Text style={{ color: "red" }}>*</Text>
            </Text>
            <View className="flex-row gap-1">
              <TouchableOpacity
                className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100 w-2/3"
                onPress={showDatePicker}
              >
                <Text numberOfLines={1} className="text-center w-100">
                  {selectedDate
                    ? `${formatDateWithDay(selectedDate)}`
                    : "Chọn ngày"}
                </Text>
                <LottieView
                  source={require("@/assets/icons/calendar-icon.json")}
                  autoPlay={false}
                  loop={false}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-row justify-between items-center border rounded-lg p-4 w-1/3 ${
                  selectedDate
                    ? "border-primary bg-gray-100"
                    : "border-gray-300 bg-gray-200"
                }`}
                disabled={!selectedDate}
                onPress={showTimePicker}
              >
                <Text numberOfLines={1} className="">
                  {selectedTime ? `${formatTime(selectedTime)}` : "Chọn giờ"}
                </Text>
                <LottieView
                  source={require("@/assets/icons/clock-icon.json")}
                  autoPlay={false}
                  loop={false}
                  style={{ width: 20, height: 20 }}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-3 items-center mt-2">
              <View className="flex-1">
                <Text className="text-lg font-semibold">Yêu cầu cần gấp</Text>
                {!isUrgentAvailable && selectedDate && selectedTime && (
                  <Text className="text-sm text-gray-500">
                    Chức năng này chỉ khả dụng khi giờ hẹn của bạn dưới 2 giờ
                  </Text>
                )}
              </View>
              <Switch
                value={isUrgent}
                onValueChange={setIsUrgent}
                trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                thumbColor={isUrgent ? "#FFFFFF" : "#FFFFFF"}
                disabled={!isUrgentAvailable}
              />
            </View>
            {isUrgent && (
              <View>
                <Text className="mt-2">
                  Với lựa chọn 'Cần gấp', nhân viên sẽ cố gắng đến sớm nhất có
                  thể (thường là trước giờ hẹn). Nếu bạn muốn khích lệ tinh thần
                  và ghi nhận sự nỗ lực của nhân viên, bạn có thể cân nhắc
                  thưởng thêm cho họ nhé!
                </Text>
              </View>
            )}
            <View className="mt-2">
              <Text className="text-lg font-semibold my-2">
                Bo thêm cho nhân viên
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {MONEY_BONUS.map((range) => (
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
            <Text className="py-2 font-bold text-lg">Xác nhận địa chỉ <Text style={{ color: "red" }}>*</Text></Text>
            <View className="">
              <TouchableOpacity
                className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100 w-full"
                onPress={() => setIsLocationModalVisible(true)}
              >
                <Text numberOfLines={2} className="w-[90%]">
                  {detailAddress ? detailAddress : "Chọn địa điểm"}
                </Text>
                <LottieView
                  source={require("@/assets/icons/location-icon.json")}
                  autoPlay={false}
                  loop={false}
                  style={{ width: 30, height: 30 }}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleConfirmRequest}
              className="mt-6 bg-primary py-5 px-4 rounded-lg"
              style={{ marginBottom: 100 }}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold">
                  Xác nhận đặt dịch vụ
                </Text>
              )}
            </TouchableOpacity>

            <Modal
              visible={isConfirmModalVisible}
              transparent={true}
              animationType="slide"
              onRequestClose={() => setIsConfirmModalVisible(false)}
            >
              <View className="flex-1 justify-center items-center bg-black/50">
                <View className="bg-white w-[90%] rounded-lg p-4">
                  <Text className="text-xl font-bold mb-4 text-center">
                    Xác nhận thông tin
                  </Text>

                  <View className="space-y-3">
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Dịch vụ:</Text>
                      <Text className="font-medium">{service?.name}</Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Phân loại dịch vụ:</Text>
                      <Text className="font-medium">
                        {listDetailService?.name}
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Chi tiết thiết bị:</Text>
                      <Text className="font-medium">
                        {priceService?.name === "Khác"
                          ? otherDevice
                          : priceService?.name}
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">
                        Thời điểm lắp đặt/mua thiết bị:
                      </Text>
                      <Text className="font-medium">
                        {selectedValue || "Trống"}
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Ngày hẹn:</Text>
                      <Text className="font-medium">
                        {selectedDate ? formatDateWithDay(selectedDate) : ""}
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Giờ hẹn:</Text>
                      <Text className="font-medium">
                        {selectedTime ? formatTime(selectedTime) : ""}
                      </Text>
                    </View>
                    {isUrgent && (
                      <View className="flex-row justify-end">
                        <Text className="text-gray-600">
                          Bạn đã đánh dấu xác nhận là cần gấp
                        </Text>
                      </View>
                    )}
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Tiền bo:</Text>
                      <Text className="font-medium">
                        {selectedPriceRange ? `${selectedPriceRange}` : "0"} VNĐ
                      </Text>
                    </View>
                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Địa chỉ:</Text>
                      <Text className="font-medium text-right flex-1 ml-2">
                        {`${detailAddress}`}
                      </Text>
                    </View>

                    <View className="flex-row justify-between">
                      <Text className="text-gray-600">Ghi chú của bạn:</Text>
                      <Text className="font-medium">{text}</Text>
                    </View>
                  </View>

                  <View className="flex-row justify-between mt-6">
                    <TouchableOpacity
                      onPress={() => setIsConfirmModalVisible(false)}
                      className="bg-gray-200 py-3 px-6 rounded-lg"
                    >
                      <Text className="text-gray-700">Hủy</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={handleSubmitRequest}
                      className="bg-primary py-3 px-6 rounded-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator color="white" />
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
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={hideDatePicker}
        minimumDate={new Date()}
      />

      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={hideTimePicker}
      />

      <LocationPicker
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        onSelect={(fullAddress) => {
          setDetailAddress(fullAddress);
        }}
      />
    </View>
  );
};

export default VerifyService;
