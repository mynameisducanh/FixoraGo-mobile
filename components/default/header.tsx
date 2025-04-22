import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useUserStore } from "@/stores/user-store";
const Header = () => {
  const { user, isAuthenticated } = useUserStore();
  return (
    <>
      <View className="mx-4 flex-row justify-between items-center mb-6">
        <Image
          source={require("../../assets/images/avatar-default.png")}
          className="rounded-full"
          style={{ height: hp(5), width: hp(5) }}
        />
        <FontAwesome name="bell-o" size={24} color="#FFC107" />
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
