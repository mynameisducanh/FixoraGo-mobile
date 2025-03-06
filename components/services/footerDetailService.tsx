import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
const FooterDetailService = () => {
  return (
    <View
      className="px-6 bg-background absolute w-full z-50"
      style={{ height: hp(12), bottom: 0 }}
    >
      <View className="flex-row items-center justify-between my-3">
        <AntDesign name="hearto" size={24} color="black" />
        <TouchableOpacity
          style={{ width: wp(70), height: hp(6) }}
          className="flex justify-center items-center bg-primary rounded-md"
        >
          <Text className="text-white font-bold">Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterDetailService;

const styles = StyleSheet.create({
  actions: {
    flexDirection: "column",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
