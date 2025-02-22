import { View, Text, TextInput, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "expo-router";
import ApiOtp from "@/api/otpApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TEMP_EMAIL_REGISTER } from "@/constants";
import { useAppAlert } from "@/hooks/useAppAlert";

const VerifyOtp = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const router = useRouter();
  const [verified, setVerified] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const otpApi = new ApiOtp();
  const { showAlert } = useAppAlert();

  useEffect(() => {
    if (verified) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
      setTimeout(() => {
        router.push("/(auth)/login");
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [verified, router]);

  const handleChange = (text, index) => {
    let newOtp = [...otp];
    if (text.length === 1) {
      newOtp[index] = text;
      if (index < 5) inputRefs.current[index + 1]?.focus();
    } else if (text.length === 0) {
      newOtp[index] = "";
      if (index > 0) inputRefs.current[index - 1]?.focus();
    }
    setOtp(newOtp);
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const otpCode = otp.join("");
    try {
      let email = await AsyncStorage.getItem(TEMP_EMAIL_REGISTER);
      if (email) {
        const res = await otpApi.verifyOtp(email, otpCode);
        if (res) {
          setVerified(true);
        } else {
          showAlert("Lỗi đăng ký", res.message);
        }
      }
    } catch (error) {
      showAlert("Lỗi hệ thống", "Mã lỗi #3");
    }
  };

  if (verified) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-2xl font-bold text-green-600 mb-4">
          Xác thực thành công!
        </Text>
        <Text className="text-gray-600 mb-6 text-center">
          Bạn sẽ được chuyển về trang đăng nhập sau {countdown} giây.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Text className="text-2xl font-bold text-gray-900 mb-4">
        Xác thực OTP
      </Text>
      <Text className="text-gray-600 mb-6 text-center">
        Nhập mã OTP 6 số đã gửi đến email hoặc số điện thoại của bạn.
      </Text>

      <View className="flex-row justify-center mb-6">
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            className="w-12 h-12 text-center text-xl font-semibold border border-gray-400 rounded-lg mx-1"
            keyboardType="numeric"
            maxLength={1}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
          />
        ))}
      </View>

      <TouchableOpacity
        className="bg-blue-600 w-full p-3 rounded-lg items-center"
        onPress={handleSubmit}
      >
        <Text className="text-white text-lg font-semibold">Xác nhận</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyOtp;
