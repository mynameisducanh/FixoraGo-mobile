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

const VerifyService = () => {
  const { unit, serviceId, typeServiceId } = useLocalSearchParams();
  const [selectedValue, setSelectedValue] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const showTimePicker = () => setTimePickerVisibility(true);
  const hideTimePicker = () => setTimePickerVisibility(false);
  const serviceApi = new ServiceApi();
  const priceServiceApi = new PriceServiceApi();
  const listDetailServiceApi = new ListDetailServiceApi();
  const [text, setText] = useState("");
  const router = useRouter();
  const [service, setService] = useState<ServiceInterface>();
  const [priceService, setPrice] = useState<PricesServiceInterface>();
  const [listDetailService, setListDetailService] =
    useState<ListDetailServiceInterface>();
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const handleConfirmDate = (date: any) => {
    console.log(date, "  ");
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleConfirmTime = (time: any) => {
    setSelectedTime(time);
    console.log(time, " ", formatTime(time));
    hideTimePicker();
  };
  //  const [playIcon, setPlayIcon] = useState(false);
  //   useEffect(() => {
  //     setPlayIcon(true);

  //     const timer = setTimeout(() => {
  //       setPlayIcon(false);
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }, [value, isFocus]);
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

      if (!result.canceled && selectedIndex !== null) {
        const newImage = {
          ...result.assets[0],
          name: `image.${result.assets[0].uri.split(".").pop()}`,
          type: `image/${result.assets[0].uri.split(".").pop()}`,
        };

        // Cập nhật đúng vị trí trong mảng images
        setImages((prev) => {
          const updated = [...prev];
          updated[selectedIndex] = newImage;
          return updated;
        });

        setSelectedIndex(null); // Reset lại index
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (unit) {
      const fetchDataService = async () => {
        const serviceData = await serviceApi.getById(Number(serviceId));
        setService(serviceData);
        const unitData = await listDetailServiceApi.getOneByUnit(
          Array.isArray(unit) ? unit[0] : unit
        );
        setListDetailService(unitData);
        const priceData = await priceServiceApi.getById(typeServiceId);

        setPrice(priceData);
      };
      fetchDataService();
    }
  }, [unit]);

  const requestService = async () => {
    console.log(
      "đã nhấn",
      text,
      service?.name,
      listDetailService?.name,
      priceService?.name,
      selectedValue,
      formatDateWithDay(selectedDate),
      selectedTime,
      images
    );
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView className="px-4 pt-3 bg-white ">
          <Text className="pb-3 font-bold text-lg">
            Mô tả thêm về vấn đề bạn đang gặp
          </Text>
          <DropdownTimeComponent
            data={timeCategoriesList}
            onSelect={(unit: any) => setSelectedValue(unit)}
          />
          <TextArea placeholder="Nhập mô tả ..." onChangeText={setText} />
          <View className="mt-2 flex-row gap-3">
            {[0, 1].map((index) => (
              <TouchableOpacity
                key={index}
                className="border-dotted border w-20 h-20 border-gray-300 justify-center items-center rounded-lg overflow-hidden"
                onPress={() => {
                  setSelectedIndex(index); // lưu ô bấm
                  selectImage(); // rồi mới chụp ảnh
                }}
              >
                {images[index] ? (
                  <Image
                    source={{ uri: images[index].uri }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                ) : (
                  <Text>+</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <Text className="py-2 font-bold text-lg">Thông tin dịch vụ</Text>
          <View className="border border-gray-300 rounded-lg p-4 bg-gray-100 w-100">
            <View className="flex-row justify-between mt-2">
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
            <View className="flex-row justify-between mt-2">
              <Text className="text-gray-600">Chi tiết thiết bị của bạn:</Text>
              <Text className="font-bold">{priceService?.name}</Text>
            </View>
            {/* <View className="flex-row justify-between mt-2">
          <Text className="text-gray-600">
           
          </Text>
          <Text className="font-bold text-green-600">
 
          </Text>
        </View> */}
          </View>
          <Text className="py-2 font-bold text-lg">Xác nhận lịch hẹn</Text>
          <View className="flex-row gap-1">
            <TouchableOpacity
              className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100 w-1/3 "
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
          </View>
          <Text className="py-2 font-bold text-lg">Xác nhận địa chỉ</Text>
          <View className="">
            <TouchableOpacity className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100 w-full ">
              <Text numberOfLines={1} className="">
                K16/6 Ngô Sĩ Liên ,Hòa Khánh Bắc , Liên Chiểu , Đà Nẵng{" "}
              </Text>
              <LottieView
                source={require("@/assets/icons/location-icon.json")}
                autoPlay
                loop
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
          </View>

          <View className="mt-6">
            <TouchableOpacity
              onPress={() => {
                requestService();
              }}
              className="bg-primary text-white py-5 rounded-md"
            >
              <Text className="text-center font-bold text-white">
                Xác nhận đặt dịch vụ
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-4">
            <Text className="text-gray-500 text-sm text-center">
              *Bằng cách nhấn "Xác nhận đặt dịch vụ", bạn đồng ý với{" "}
              <Text className="text-primary font-semibold">
                điều khoản sử dụng
              </Text>{" "}
              của chúng tôi.
            </Text>
          </View>
          {/* Picker Ngày */}
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirmDate}
            onCancel={hideDatePicker}
            locale="vi"
          />

          {/* Picker Giờ */}
          <DateTimePickerModal
            isVisible={isTimePickerVisible}
            mode="time"
            onConfirm={handleConfirmTime}
            onCancel={hideTimePicker}
            locale="vi"
            is24Hour={true}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default VerifyService;
