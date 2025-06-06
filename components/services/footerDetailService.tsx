import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/user-store";
const FooterDetailService = ({ unit, serviceId, typeService, isActive }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const [checkActive, setCheckActive] = useState(false);
  const CheckActive = () => {
    if (isActive && user) {
      setCheckActive(true);
    } else {
      setCheckActive(false);
    }
  };
  useEffect(() => {
    CheckActive();
  }, [isActive, user]);
  return (
    <View
      className="px-6 bg-background absolute w-full z-50"
      style={{ height: hp(12), bottom: 0 }}
    >
      <View className="flex-row items-center justify-between my-3">
        <AntDesign name="hearto" size={24} color="black" />
        <TouchableOpacity
          disabled={!isActive}
          style={{
            width: wp(70),
            height: hp(6),
            opacity: isActive ? 1 : 0.5,
          }}
          className="flex justify-center items-center bg-primary rounded-md"
          onPress={() => {
            if (checkActive) {
              router.push({
                pathname: "/service/verifyService",
                params: {
                  serviceId: serviceId,
                  unit: unit,
                  typeServiceId: typeService,
                },
              });
            } else {
              router.push({
                pathname: "/(tabs)/profile",
              });
            }
          }}
        >
          <Text className="text-white font-bold">Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterDetailService;
