import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
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

const VerifyService = () => {
  const { unit, serviceId } = useLocalSearchParams();
  const serviceApi = new ServiceApi();
  const priceServiceApi = new PriceServiceApi();
  const listDetailServiceApi = new ListDetailServiceApi();
  const [text, setText] = useState("");
  const router = useRouter();
  const [service, setService] = useState<ServiceInterface>();
  const [priceService, setPrice] = useState<PricesServiceInterface>();
  const [listDetailService, setListDetailService] =
    useState<ListDetailServiceInterface>();
  useEffect(() => {
    if (unit) {
      const fetchDataService = async () => {
        const serviceData = await serviceApi.getById(Number(serviceId));
        setService(serviceData);
        const unitData = await listDetailServiceApi.getOneByUnit(
          Array.isArray(unit) ? unit[0] : unit
        );
        setListDetailService(unitData);
        const priceData = await priceServiceApi.getOneByUnit(
          Array.isArray(unit) ? unit[0] : unit
        );
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
      priceService?.price
    );
  };
  return (
    <ScrollView className="p-4 bg-white ">
      <Text className="py-3 font-bold text-lg">
        Mô tả thêm về vấn đề bạn đang gặp
      </Text>
      <TextArea placeholder="Nhập mô tả ..." onChangeText={setText} />
      <Text className="py-3 font-bold text-lg">Thông tin dịch vụ</Text>
      <View className="border border-gray-300 rounded-lg p-4 bg-gray-100 w-100">
        <View className="flex-row justify-between mt-2">
          <Text className="text-gray-600">Tên dịch vụ:</Text>
          <Text
            style={{ width: 215 }}
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
            style={{ width: 190 }}
            numberOfLines={1}
            ellipsizeMode="tail"
            className="font-bold"
          >
            {listDetailService?.name}
          </Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-gray-600">Tên gói:</Text>
          <Text className="font-bold">{priceService?.name}</Text>
        </View>
        <View className="flex-row justify-between mt-2">
          <Text className="text-gray-600">Tổng tiền:</Text>
          <Text className="font-bold text-green-600">
            {priceService?.price} VND
          </Text>
        </View>
      </View>
      <Text className="py-3 font-bold text-lg">Xác nhận địa chỉ</Text>
      <View className="">
        <TouchableOpacity className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100 w-full ">
          <Text numberOfLines={1} className="">
            K16/6 Ngô Sĩ Liên ,Hòa Khánh Bắc , Liên Chiểu , Đà Nẵng{" "}
          </Text>
          <LottieView
            source={require("@/assets/icons/location-icon.json")}
            autoPlay
            loop
            style={{ width: 30, height: 30 }}
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
          <Text className="text-primary font-semibold">điều khoản sử dụng</Text>{" "}
          của chúng tôi.
        </Text>
      </View>
    </ScrollView>
  );
};

export default VerifyService;
