import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const NotAuth = () => {
  const router = useRouter();
  const [isLogin, setIsLogin] = React.useState(true);

  return (
    <View
      style={{ height: hp(100), width: wp(100) }}
      className="flex-1 items-center justify-center bg-white px-5 space-y-8"
    >
      <Text className="text-3xl font-bold text-primary">Fixorago</Text>

      <Image
        className="w-[90%] h-[40%] object-contain mt-5"
        source={require("../../assets/images/auth-screen.png")}
      />

      <Text className="text-lg text-center text-gray-700 mt-3">
        Bạn cần đăng nhập hoặc đăng ký tài khoản để sử dụng chức năng này
      </Text>

      <View className="flex-row w-[80%] h-12 bg-gray-200 rounded-full p-1 mt-5">
        <TouchableOpacity
          onPress={() => router.push("/(auth)/login")}
          className={`flex-1 items-center justify-center rounded-full ${
            isLogin ? "bg-black" : ""
          }`}
        >
          <Text
            className={`text-base font-medium ${
              isLogin ? "text-white" : "text-black"
            }`}
          >
            Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          className={`flex-1 items-center justify-center rounded-full ${
            !isLogin ? "bg-black" : ""
          }`}
        >
          <Text
            className={`text-base font-medium ${
              !isLogin ? "text-white" : "text-black"
            }`}
          >
            Sign-up
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-black w-[80%] py-3 rounded-full mt-4"
        onPress={() => {}}
      >
        <Text className="text-white text-center text-base font-semibold">
          Đăng nhập với Google
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotAuth;
