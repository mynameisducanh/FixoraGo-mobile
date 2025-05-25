import React, { useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

interface NotificationParams {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  redirectTo?: string;
  redirectParams?: string;
  subParams: string;
  buttonText?: string;
}

const NotificationPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams() as unknown as NotificationParams;
  const {
    type = "success",
    title,
    message,
    redirectTo,
    redirectParams,
    subParams,
    buttonText = "Tiếp tục",
  } = params;

  const handleContinue = () => {
    if (redirectTo) {
      router.replace({
        pathname: redirectTo as any,
      });
    } else {
      router.back();
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-4">
      <View className="w-full max-w-[400px] items-center">
        {/* Animation */}
        <View style={{ width: wp(50), height: wp(50) }}>
          <LottieView
            source={require("../../assets/icons/success-icon.json")}
            autoPlay
            loop
            style={{ width: "100%", height: "100%" }}
          />
        </View>

        {/* Title */}
        <Text className="text-2xl font-bold text-gray-900 mt-4 text-center">
          {title}
        </Text>

        {/* Message */}
        <Text className="text-base text-gray-600 mt-2 text-center">
          {message}
        </Text>

        {/* Button */}
        <TouchableOpacity
          className="mt-3 bg-primary p-4 rounded-xl"
          onPress={handleContinue}
        >
          <Text className="text-white font-semibold text-lg">{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotificationPage;
