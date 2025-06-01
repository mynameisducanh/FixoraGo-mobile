import { Image, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useUserStore } from "@/stores/user-store";
import { useRouter } from "expo-router";
import NotificationApi from "@/api/notificationApi";

const Header = () => {
  const { user, isAuthenticated } = useUserStore();
  const router = useRouter();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false);
  const notificationApi = new NotificationApi();

  const checkUnreadNotifications = async () => {
    try {
      const response = await notificationApi.getAllNotification();
      if (response?.data) {
        const hasUnread = response.data.some(
          (notification) => notification.status === "UNREAD"
        );
        setHasUnreadNotifications(hasUnread);
      }
    } catch (error) {
      console.error("Error checking notifications:", error);
    }
  };

  useEffect(() => {
    checkUnreadNotifications();
  }, []);

  return (
    <>
      <View className="mx-4 flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => {
            user?.roles
              ? router.push("/profile/detailProfile")
              : router.push("/profile");
          }}
        >
          <Image
            source={require("../../assets/images/avatar-default.png")}
            className="rounded-full"
            style={{ height: hp(5), width: hp(5) }}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/notification")}
          className="relative"
        >
          <FontAwesome name="bell-o" size={24} color="#FFC107" />
          {(hasUnreadNotifications && user) && (
            <View className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
          )}
        </TouchableOpacity>
      </View>
      <View className="mx-4 mb-2">
        <Text style={{ fontSize: hp(2.0) }} className="text-neutral-600">
          {/* {user?.username
            ? `Xin chào , ${user?.username}`
            : "Chào mừng bạn đến với FixoraGo"} */}
          Chào mừng bạn đến với FixoraGo
        </Text>
        <View>
          <Text
            style={{ fontSize: hp(3.8) }}
            className="font-semibold text-neutral-600"
          >
            Có vấn đề cần sửa chữa ,
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(3.8) }}
          className="font-semibold text-neutral-600"
        >
          đặt ngay <Text className="text-primary">Fixorago</Text>
        </Text>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({});
