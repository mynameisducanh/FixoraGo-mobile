import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";

const RequestSuccess = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
    // if (countdown === 0) {
    //   handleGoToRequestDetail();
    // }
  }, [countdown]);

  const handleGoToRequestDetail = () => {
    router.replace(`/(user)/activate`);
  };

  const handleGoHome = () => {
    router.replace("/(user)");
  };

  return (
    <View className="flex-1 bg-white  justify-center items-center">
      <View className=" rounded-2xl p-6 w-100 h-100 items-center">
        <LottieView
          source={require("@/assets/icons/success-icon.json")}
          autoPlay={false}
          loop={false}
          style={{ width: 100, height: 100 }}
        />
        <Text className="text-2xl font-bold text-green-500 mt-4 mb-2 text-center">
          Gửi yêu cầu thành công!
        </Text>
        <Text className="text-gray-600 text-base text-center mb-6">
          Yêu cầu của bạn đã được gửi. Chúng tôi sẽ liên hệ với bạn sớm nhất.
        </Text>
        <TouchableOpacity
          className="bg-primary p-3 rounded-lg w-full mb-2"
          onPress={handleGoToRequestDetail}
        >
          <Text className="text-white text-center font-bold text-base">
            Xem chi tiết yêu cầu {countdown > 0 ? `(${countdown})` : ""}
          </Text>
        </TouchableOpacity>
        {/* <TouchableOpacity
          className="bg-gray-100 p-3 rounded-lg w-full"
          onPress={handleGoHome}
        >
          <Text className="text-gray-800 text-center font-bold text-base">
            Về trang chủ
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default RequestSuccess;
