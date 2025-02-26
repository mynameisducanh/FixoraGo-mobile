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
      <View className="mx-4 flex-row justify-between items-center mb-2">
        <Image
          source={require("../../assets/images/splash-icon.png")}
          className="rounded-full"
          style={{ height: hp(5), width: hp(5.5) }}
        />
        <FontAwesome name="bell-o" size={24} color="gray" />
      </View>
      <View className="mx-4 space-y-2 mb-2">
        <Text style={{ fontSize: hp(1.9) }} className="text-neutral-600">
          Hello , {user?.username}
        </Text>
        <View>
          <Text
            style={{ fontSize: hp(3.8) }}
            className="font-semibold text-neutral-600"
          >
            Lorem ipsum dolor sit,
          </Text>
        </View>
        <Text
          style={{ fontSize: hp(3.8) }}
          className="font-semibold text-neutral-600"
        >
          stay at <Text className="text-amber-400">home</Text>
        </Text>
      </View>
    </>
  );
};

export default Header;

const styles = StyleSheet.create({});
