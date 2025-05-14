import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, Ionicons } from "@expo/vector-icons";

const Overview = () => {
  return (
    <View
      className="bg-blue-100 rounded-2xl p-4 m-auto"
      style={{ width: wp(95) }}
    >
      <View className="flex-row justify-between">
        <View>
          <Text className="text-blue-800 font-semibold text-lg">
            Xin chào Nguyễn Đức Anh
          </Text>
          <View className="flex-row gap-5 mt-2">
            <TouchableOpacity>
              <FontAwesome name="bell-o" size={24} color="#1e40af" />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#1e40af"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#1e40af"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View>
          <Text className="text-blue-700 mt-1">Hết hạn sau: 5 ngày</Text>
          <TouchableOpacity className="mt-2 bg-blue-600 rounded-md py-2 px-3 self-start">
            <Text className="text-white font-semibold">Gia hạn gói</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text className="font-semibold text-blue-700 mt-2">Tổng quan tháng</Text>
      <View className="flex-row justify-between p-1">
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">132</Text>
          <Text className="text-sm text-gray-500">Tổng đơn</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">13</Text>
          <Text className="text-sm text-gray-500">Đơn tháng</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">⭐ 4.7</Text>
          <Text className="text-sm text-gray-500">Đánh giá</Text>
        </View>
      </View>
    </View>
  );
};

export default Overview;
