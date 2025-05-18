import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React from "react";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useUserStore } from "@/stores/user-store";

const DetailProfile = () => {
  const { user } = useUserStore();
  console.log(user);
  return (
    <ScrollView style={{ width: wp(100) }} className="flex-1 bg-white">
      <View className="h-[300px] relative items-center">
        <Image
          source={require("../../assets/images/hero-detail-test.jpg")}
          className="w-full h-full items-center rounded-b-3xl"
          resizeMode="cover"
        />

        <BackButton />
        <TouchableOpacity className="absolute top-16 right-5 z-50 bg-white items-center justify-center w-12 h-12 rounded-full">
          <EvilIcons name="pencil" size={24} color="#FFC107" />
        </TouchableOpacity>
        <Image
          source={require("../../assets/images/hero-detail-test.jpg")}
          className="w-[200px] h-[200px] rounded-full border-4 border-white absolute -bottom-[20%] "
        />
      </View>

      <View className="items-center px-4 mt-[68px]">
        <Text className="text-2xl font-bold text-gray-800">
          {user?.fullName}
        </Text>
        <Text className="text-base text-gray-500 mt-1">@{user?.username}</Text>
      </View>

      <View className="w-[90%] m-auto">
        <View className="flex-row items-center border border-gray-300 rounded-full h-14 p-3 mt-3">
          <Ionicons name="mail-outline" size={20} color="#888" />
          <Text className="ml-3">{user?.email}</Text>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row items-center border border-gray-300 rounded-full w-[60%] h-14 p-3 mt-3">
            <Feather name="phone" size={20} color="#888" />
            <Text className="ml-3">{user?.phonenumber}</Text>
          </View>
          <View className="flex-row items-center border border-gray-300 rounded-full w-1/3 h-14 p-3 mt-3">
            <Ionicons name="person-outline" size={20} color="#888" />
            <Text className="ml-3">{user?.authdata}</Text>
          </View>
        </View>

        <View className="flex-row items-center border border-gray-300 rounded-full h-14 p-3 mt-3">
          <Ionicons name="location-outline" size={20} color="#888" />
          <Text className="ml-3">{user?.address}</Text>
        </View>
      </View>
      <View className="w-[80%] m-auto flex-row justify-between p-1 mt-5">
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">13</Text>
          <Text className="text-sm text-gray-500">Tổng đơn</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">7</Text>
          <Text className="text-sm text-gray-500">Đơn tháng</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">7</Text>
          <Text className="text-sm text-gray-500">Bài đánh giá</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailProfile;
