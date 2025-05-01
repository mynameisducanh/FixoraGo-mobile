import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
const FooterDetailService = ({ unit, serviceId, typeService, isActive }) => {
  const router = useRouter();
  console.log(typeService);
  return (
    <View
      className="px-6 bg-background absolute w-full z-50"
      style={{ height: hp(12), bottom: 0 }}
    >
      <View className="flex-row items-center justify-between my-3">
        <AntDesign name="hearto" size={24} color="black" />
        <TouchableOpacity
          disabled={!isActive}
          style={{ width: wp(70), height: hp(6), opacity: isActive ? 1 : 0.5 }}
          className="flex justify-center items-center bg-primary rounded-md"
          onPress={() => {
            router.push({
              pathname: "/service/verifyService",
              params: {
                unit: unit,
                serviceId: serviceId,
                typeServiceId: typeService,
              },
            });
          }}
        >
          <Text className="text-white font-bold">Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterDetailService;
