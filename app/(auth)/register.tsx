import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import AuthApi from "@/api/authApi";
import { RegisterInterface } from "@/types/auth";
import { useAppAlert } from "@/hooks/useAppAlert";
import { validateRegisterForm } from "@/utils/validation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TEMP_EMAIL_REGISTER } from "@/constants";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "@/components/buttonDefault/backButton";

const Register = () => {
  const authApi = new AuthApi();
  const { showAlert } = useAppAlert();
  const [secure, setSecure] = useState(true);
  const [form, setForm] = useState<RegisterInterface>({
    username: "",
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
        router.push("/verifyOtp");
      } else {
        showAlert("Lỗi đăng ký", res.message);
      }
    } catch (error) {
      showAlert("Lỗi hệ thống", "Mã lỗi #1");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{ height: hp(100), width: wp(100) }}
            className="flex-1 justify-center items-center bg-white p-4"
          >
             <BackButton />
            <Image
              source={require("@/assets/images/auth-screen.png")}
              className="w-[80%] h-[30%] object-contain"
            />

            <Text className="text-2xl font-bold text-gray-800 mt-5">
              Chào mừng bạn đến với FixoraGo
            </Text>
            <Text className="text-base text-gray-500 mb-2">
              Vui lòng đăng ký để tiếp tục
            </Text>
            <View className="w-full space-y-3 mt-4">
              <View className="flex-row items-center border border-gray-300 rounded-full px-2">
                <Ionicons name="person-outline" size={20} color="#888" />
                <TextInput
                  className="flex-1 ml-2 text-lg justify-center"
                  placeholder="Tên đăng nhập"
                  keyboardType="email-address"
                  placeholderTextColor="#888"
                  value={form.username}
                  style={{ height: 50, alignItems: "center", lineHeight: 19 }}
                  onChangeText={(text) => handleChange("username", text)}
                />
              </View>
              <View className="flex-row items-center border border-gray-300 rounded-full px-2 mt-3">
                <Ionicons name="mail-outline" size={20} color="#888" />
                <TextInput
                  className="flex-1 ml-2 text-lg justify-center"
                  placeholder="Email"
                  keyboardType="email-address"
                  placeholderTextColor="#888"
                  value={form.email}
                  style={{ height: 50, alignItems: "center", lineHeight: 19 }}
                  onChangeText={(text) => handleChange("email", text)}
                />
              </View>

              <View className="flex-row items-center border border-gray-300 rounded-full px-2 mt-3">
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  className="flex-1 ml-2 text-lg justify-center"
                  placeholder="Mật khẩu"
                  secureTextEntry={secure}
                  placeholderTextColor="#888"
                  value={form.password}
                  onChangeText={(text) => handleChange("password", text)}
                  style={{ height: 50, alignItems: "center", lineHeight: 19 }}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                  <Ionicons
                    name={secure ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>

              <View className="flex-row items-center border border-gray-300 rounded-full px-2 mt-3">
                <Ionicons name="lock-closed-outline" size={20} color="#888" />
                <TextInput
                  className="flex-1 ml-2 text-lg justify-center"
                  placeholder="Nhập lại mật khẩu"
                  secureTextEntry={secure}
                  placeholderTextColor="#888"
                  value={form.confirmPassword}
                  style={{ height: 50, alignItems: "center", lineHeight: 19 }}
                  onChangeText={(text) => handleChange("confirmPassword", text)}
                />
                <TouchableOpacity onPress={() => setSecure(!secure)}>
                  <Ionicons
                    name={secure ? "eye-off-outline" : "eye-outline"}
                    size={22}
                    color="#888"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              className="bg-black w-full py-4 rounded-full items-center mt-5"
              onPress={handleRegister}
            >
              <Text className="text-white text-base font-semibold">
                Đăng ký
              </Text>
            </TouchableOpacity>

            <View className="flex-row space-x-1 mt-4">
              <Text className="text-sm text-blue">Đã có tài khoản?</Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text className="text-sm text-blue-600 font-medium">
                  Đăng nhập ngay
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;
