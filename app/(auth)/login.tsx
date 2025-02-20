import { View, Text, TextInput, Button, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "expo-router";
import CustomAlert from "@/components/others/CustomAlertProvider";
import { validateLoginForm } from "@/utils/validation";
import { useAppAlert } from "@/hooks/useAppAlert";

const Login = () => {
  const { login } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { showAlert } = useAppAlert();

  const handleLogin = async () => {
    try {
      const errorMessage = validateLoginForm({ email, password });
      if (errorMessage) {
        showAlert("Lỗi đăng nhập", errorMessage);
        return;
      }
      await login({ email, password });
    } catch (err) {
      showAlert("Lỗi đăng nhập", "Mã lỗi #2");
      setError("Login failed");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-100 p-6">
      <Text className="text-xl font-bold text-gray-800 mb-4">Đăng nhập</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full border border-gray-300 p-3 rounded-lg mb-3"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full border border-gray-300 p-3 rounded-lg mb-3"
      />

      <TouchableOpacity
        className="bg-blue-600 w-full p-3 rounded-lg items-center"
        onPress={handleLogin}
      >
        <Text className="text-white text-lg font-semibold">Đăng nhập</Text>
      </TouchableOpacity>
      <Button
        title="Go to Sign up"
        onPress={() => router.push("/(auth)/register")}
      />
    </View>
  );
};

export default Login;
