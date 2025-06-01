import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useUserStore } from "@/stores/user-store";

interface MenuItem {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    title: "Thông tin cá nhân",
    icon: "person-outline",
    path: "/profile/detailProfile",
  },
  {
    title: "Bảo mật thông tin",
    icon: "shield-checkmark-outline",
    path: "/security",
  },
  {
    title: "Các bài đánh giá",
    icon: "chatbox-ellipses-outline",
    path: "/review/list",
  },
  {
    title: "Các bài báo cáo",
    icon: "chatbox-ellipses-outline",
    path: "/reports/ListReports",
  },
  {
    title: "Các hóa dơn nạp phí",
    icon: "receipt-outline",
    path: "/paymentBill/ListBill",
  },
  {
    title: "Chính sách của chúng tôi",
    icon: "document-text-outline",
    path: "/(other)/policy",
  },
  {
    title: "Hỗ trợ",
    icon: "help-circle-outline",
    path: "/(other)/support",
  },
];

const Profile = () => {
  const router = useRouter();
  const { logout } = useUserStore();
  const handleLogout = () => {
    logout();
    router.push("/(tabs)");
  };
  return (
    <View className="flex-1 bg-white">
      <View>
        <Image
          style={{ height: hp(25), width: wp(100) }}
          source={require("../../assets/images/hero-detail-test.jpg")}
        />
      </View>
      <View className="p-4">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center justify-between p-4 mb-2 bg-gray-50 rounded-lg border border-gray-100"
            onPress={() => router.push(item.path as any)}
          >
            <View className="flex-row items-center">
              <Ionicons name={item.icon} size={24} color="#4B5563" />
              <Text className="ml-3 text-base text-gray-700">{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>
      <View className="p-4">
        <TouchableOpacity
          onPress={() => handleLogout()}
          className="flex-row items-center justify-center p-4 bg-white rounded-lg border border-red-200"
        >
          <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          <Text className="ml-3 text-base text-red-500 font-medium">
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
