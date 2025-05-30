import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Header from "@/components/default/header";
import SearchBar from "@/components/default/searchBar";
import ListService, { ListServiceRef } from "@/components/services/listService";
import NewsRow from "@/components/news/newsRow";
import { useLocationStore } from "@/stores/location-store";
import {
  getCurrentLocation,
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
} from "@/utils/mapUtils";
import { CustomMapView } from "@/components/MapView";

const HomeUser = () => {
  const [showMap, setShowMap] = useState(false);
  const { latitude, longitude, errorMsg, loading } = useLocationStore();
  const listServiceRef = useRef<ListServiceRef>(null);
  const handleGetCurrentLocation = async () => {
    try {
      // 1. Lấy vị trí hiện tại
      // const location = await getCurrentLocation();
      // 2. Chuyển tọa độ thành địa chỉ
      // const address = await getAddressFromCoordinates(
      //   location.lat,
      //   location.lon
      // );
      // console.log("Địa chỉ đầy đủ:", address.fullAddress);
      // console.log("Địa chỉ ngắn gọn:", address.shortAddress);
      // console.log("Chi tiết địa chỉ:", address.details);
      // const test1 = await getCoordinatesFromAddress(
      //   "K52/6 Ngô Sĩ Liên, Phường Hòa Khánh Bắc, Quận Liên Chiểu, Đà Nẵng"
      // );
      // console.log("test 2",test1);
      // Ví dụ kết quả:
      // Địa chỉ đầy đủ: "123 Đường Nguyễn Văn Linh, Phường Hòa Khánh Bắc, Quận Liên Chiểu, Đà Nẵng, Việt Nam"
      // Địa chỉ ngắn gọn: "Đường Nguyễn Văn Linh, Phường Hòa Khánh Bắc, Quận Liên Chiểu, Đà Nẵng"
      // Chi tiết địa chỉ: {
      //   houseNumber: "123",
      //   road: "Đường Nguyễn Văn Linh",
      //   suburb: "Phường Hòa Khánh Bắc",
      //   district: "Quận Liên Chiểu",
      //   city: "Đà Nẵng",
      //   state: "Việt Nam",
      //   ...
      // }
    } catch (error) {
      console.error(error);
    }
  };
  handleGetCurrentLocation();

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      {/* <CustomMapView
            mode="route"
            destinationAddress="K16/6 đường Ngô Sĩ Liên , phường Hòa Khánh Băc , quận Liên Chiểu "
          /> */}
      {/* <CustomMapView
            mode="route"
            destinationAddress=" đường Ngô Sĩ Liên , phường Hòa Khánh Băc , quận Liên Chiểu"
          /> */}
      {/* {showMap ? (
        <CustomMapView
          mode="current-location"
          visible={showMap}
          onClose={() => setShowMap(false)}
        />
      ) : ( */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 50 }}
          className="space-y-6 pt-14"
        >
          <Header />
          <SearchBar />
          <View>
          <ListService ref={listServiceRef} />
          </View>
          <View className="mt-5">
            <NewsRow />
          </View>
          {/* <TouchableOpacity
            className="mx-5 mt-5 bg-blue-500 p-4 rounded-lg items-center"
            onPress={() => setShowMap(true)}
          >
            <Text className="text-white font-bold text-base">Mở Bản Đồ</Text>
          </TouchableOpacity> */}
        </ScrollView>
      {/* )}. */}
    </View>
  );
};

export default HomeUser;
