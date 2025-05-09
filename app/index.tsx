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
import LottieView from "lottie-react-native";
import Animated, { useSharedValue, withSpring } from "react-native-reanimated";
import { useUserStore } from "@/stores/user-store";

export default function Page() {
  const navigation = useNavigation();
  const router = useRouter();
  const { user } = useUserStore();
  const ring1padding = useSharedValue(0);
  const ring2padding = useSharedValue(0);
  const [play, setPlay] = useState(false);
  useEffect(() => {
    ring1padding.value = 0;
    ring2padding.value = 0;

    setTimeout(
      () => (ring1padding.value = withSpring(ring1padding.value + hp(4.5))),
      100
    );
    setTimeout(
      () => (ring2padding.value = withSpring(ring2padding.value + hp(5))),
      100
    );

    if (user?.roles === "system_user") {
      // console.log("User");
      // router.push("/(user)");
      setTimeout(() => router.replace("/(user)"), 4000);
    } else if (user?.roles === "system_staff") {
      // console.log("Staff");
      // router.push("/(staff)");
      setTimeout(() => router.replace("/(staff)"), 4000);
    } else {
      setTimeout(() => router.replace("/(user)"), 4000);
    }
  }, []);

  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <StatusBar style="light" />
      <Animated.View
        className="bg-white/20 rounded-full"
        style={{ padding: ring2padding }}
      >
        <Animated.View
          className="bg-white/20 rounded-full"
          style={{ padding: ring1padding }}
        >
          <LottieView
            source={require("../assets/icons/icon-welcome-screen.json")}
            autoPlay
            loop
            style={{ height: hp(20), width: hp(20) }}
          />
        </Animated.View>
      </Animated.View>

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
          Tiện ích gia đình
        </Text>
      </View>
    </View>
  );
}
