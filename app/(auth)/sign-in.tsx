import { View, Text, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { useUserStore } from "@/stores/user-store";

const SignIn = () => {
  const { login } = useUserStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      await login({ email, password });
    } catch (err) {
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
        className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-lg shadow-sm"
      />
      <TextInput
        placeholder="Mật khẩu"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full p-3 mb-4 bg-white border border-gray-300 rounded-lg shadow-sm"
      />

      <Button title="Đăng nhập" onPress={handleLogin} color="#007bff" />

      {error && <Text className="text-red-500 mt-2">{error}</Text>}
    </View>
  );
};

export default SignIn;
