import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Overview from "@/components/staff/overview";
import Categories from "@/components/staff/Categories";

const PostCard = () => {
  return (
    <View
      style={{ height: hp(17), width: wp(95) }}
      className="bg-gray-200 m-auto flex-row items-center p-3 rounded-md mb-5"
    >
      <Image
        className="w-1/3 h-36 rounded-md"
        source={require("../../assets/images/hero-detail-test.jpg")}
      />
      <View className="w-2/3 h-full px-2 justify-between">
        <Text
          className="text-base font-semibold w-full"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Lordem ipsum dolor sit amet consectetur adipisicing elit.
        </Text>
        <Text
          className="text-base w-full"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Tên yêu cầu chi tiết
        </Text>
        <Text className="text-base font-semibold">Địa chỉ</Text>
        <Text className="text-sm text-gray-500">Thời gian</Text>
        <View className="flex-row justify-end items-center">
          <TouchableOpacity className="rounded-lg p-3  bg-blue-600 w-1/3">
            <Text className="text-white text-base font-semibold text-center">
              Chi tiết
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default PostCard;
