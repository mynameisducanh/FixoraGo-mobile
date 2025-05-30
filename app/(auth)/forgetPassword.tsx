import { Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { widthPercentageToDP as wp } from "react-native-responsive-screen";
import AuthApi from "@/api/authApi";

const ForgetPassword = () => {
  const router = useRouter();
  const authApi = new AuthApi();
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [emailData, setEmailData] = useState("");
  const [tokenData, setTokenData] = useState("");
  const handleSendOTP = async () => {
    if (!username) {
      Alert.alert("Lỗi", "Vui lòng nhập tên đăng nhập");
      return;
    }
    try {
      setLoading(true);
      const res = await authApi.resetPass({ username });
      console.log(res);
      if (res.statusCode === 200) {
        // Alert.alert('Thành công', 'Mã OTP đã được gửi đến email của bạn')
        setEmailData(res.email);
        setStep(2);
      } else {
        Alert.alert("Lỗi", res.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) {
      Alert.alert("Lỗi", "Vui lòng nhập mã OTP");
      return;
    }
    try {
      setLoading(true);
      const res = await authApi.confirmOTPReset({ otp, email: emailData });
      console.log(res);
      if (res.statusCode === 200) {
        setTokenData(res.token);
        setStep(3);
      } else {
        Alert.alert("Lỗi", res.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Mã OTP không đúng");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mật khẩu");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }
    try {
      setLoading(true);
      const res = await authApi.confirmResetPass({
        password: newPassword,
        token: tokenData,
      });
      console.log(res)
      if (res === true) {
        Alert.alert("Thành công", "Mật khẩu đã được đặt lại");
        router.replace("/login");
      } else {
        Alert.alert("Lỗi", res.message || "Có lỗi xảy ra");
      }
    } catch (error: any) {
      Alert.alert("Lỗi", error.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="flex-1 px-6 pt-14">
        <TouchableOpacity onPress={() => router.back()} className="mb-6">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <Text className="text-2xl font-bold text-gray-900 mt-2 mb-2">
          {step === 1
            ? "Quên mật khẩu"
            : step === 2
            ? "Xác thực OTP"
            : "Đặt lại mật khẩu"}
        </Text>
        <Text className="text-gray-500 mb-5">
          {step === 1
            ? "Nhập tên đăng nhập của bạn để nhận mã xác thực"
            : step === 2
            ? "Nhập mã OTP đã được gửi đến email của bạn"
            : "Nhập mật khẩu mới của bạn"}
        </Text>

        {step === 1 && (
          <View className="space-y-4">
            <View className="space-y-2">
              <Text className="text-gray-700 font-medium mb-3">
                Tên đăng nhập
              </Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Nhập tên đăng nhập của bạn"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
            <TouchableOpacity
              onPress={handleSendOTP}
              disabled={loading}
              className="py-3 bg-black rounded-xl"
            >
              <Text className="text-xl font-bold text-center text-white">
                {loading ? "Đang xử lý..." : "Gửi mã OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View className="space-y-4">
            <View className="space-y-2">
              <Text className="text-gray-700 font-medium mb-3">
                Chúng tôi vừa gửi tới địa chỉ email {emailData} một mã xác thực
                OTP , vui lòng nhập mã để xác thực
              </Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Nhập mã OTP"
                value={otp}
                onChangeText={setOtp}
                keyboardType="number-pad"
                maxLength={6}
              />
            </View>
            <TouchableOpacity
              onPress={handleVerifyOTP}
              disabled={loading}
              className="py-3 bg-black rounded-xl"
            >
              <Text className="text-xl font-bold text-center text-white">
                {loading ? "Đang xác thực..." : "Xác thực OTP"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View className="space-y-4">
            <View className="space-y-2">
              <Text className="text-gray-700 font-medium mb-3">
                Mật khẩu mới
              </Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Nhập mật khẩu mới"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
              />
            </View>
            <View className="space-y-2">
              <Text className="text-gray-700 font-medium mb-3">
                Xác nhận mật khẩu
              </Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
                placeholder="Nhập lại mật khẩu mới"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
            <TouchableOpacity
              onPress={handleResetPassword}
              disabled={loading}
              className="py-3 bg-black rounded-xl"
            >
              <Text className="text-xl font-bold text-center text-white">
                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default ForgetPassword;
