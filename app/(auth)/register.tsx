import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import AuthApi from "@/api/authApi";
import { RegisterInterface } from "@/types/auth";
import { useAppAlert } from "@/hooks/useAppAlert";
import { validateRegisterForm } from "@/utils/validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TEMP_EMAIL_REGISTER } from "@/constants";
import { useRouter } from "expo-router";

const Register = () => {
  const authApi = new AuthApi();
  const { showAlert } = useAppAlert();
  const [form, setForm] = useState<RegisterInterface>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const router = useRouter();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleRegister = async () => {
    const errorMessage = validateRegisterForm(form);
    if (errorMessage) {
      showAlert("Lỗi đăng ký", errorMessage);
      return;
    }
    try {
      const res = await authApi.register(form);

      if (res.statusCode === 200) {
        await AsyncStorage.setItem(TEMP_EMAIL_REGISTER, form.email);
        router.push("/(auth)/verifyOtp");
      } else {
        showAlert("Lỗi đăng ký", res.message);
      }
    } catch (error) {
      showAlert("Lỗi hệ thống", "Mã lỗi #1");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-4">
      <Text className="text-2xl font-bold text-blue-600 mb-4">Đăng ký</Text>
      <TextInput
        className="w-full border border-gray-300 p-3 rounded-lg mb-3"
        placeholder="Email"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(text) => handleChange("email", text)}
      />

      <TextInput
        className="w-full border border-gray-300 p-3 rounded-lg mb-3"
        placeholder="Mật khẩu"
        secureTextEntry
        value={form.password}
        onChangeText={(text) => handleChange("password", text)}
      />

      <TextInput
        className="w-full border border-gray-300 p-3 rounded-lg mb-3"
        placeholder="Nhập lại mật khẩu"
        secureTextEntry
        value={form.confirmPassword}
        onChangeText={(text) => handleChange("confirmPassword", text)}
      />

      <TouchableOpacity
        className="bg-blue-600 w-full p-3 rounded-lg items-center"
        onPress={handleRegister}
      >
        <Text className="text-white text-lg font-semibold">Đăng ký</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Register;
