import React, { useEffect, useState } from "react";
import {
  FlatList,
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
  Image,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const { width, height } = Dimensions.get("window");

export default function Page() {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => navigation.navigate("(tabs)"), 2500);
  }, []);
 
  return (
    <View
      style={{ width: width, height: height }}
      className="flex-1 justify-center items-center bg-amber-500"
    >
      <StatusBar style="light" />
      <View
        className="bg-white/20 rounded-full"
        style={{ padding: hp(5.5) }}
      >
        <View
          className="bg-white/20 rounded-full"
          style={{ padding: hp(5) }}
        >
          <Image
            source={require("../assets/images/splash-icon.png")}
            className="rounded-full"
            style={{ height: hp(20), width: hp(20) }}
          />
        </View>
      </View>

      <View className="flex items-center space-y-2">
        <Text
          style={{ fontSize: hp(7) }}
          className="font-bold text-white tracking-widest"
        >
          FixoraGo
        </Text>
        <Text
          style={{ fontSize: hp(3) }}
          className="font-medium text-white tracking-widest"
        >
          Lorem ipsum dolor sit,
        </Text>
      </View>
    </View>
  );
}
