import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Ionicons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useUserStore } from "@/stores/user-store";
import Avatar from "@/components/others/Avatar";
import UserApi from "@/api/userApi";
import { useFocusEffect, useRouter } from "expo-router";

const DetailProfile = () => {
  const { user } = useUserStore();
  const userApi = new UserApi();
  const [userData, setUserData] = useState();
  const router = useRouter();

  const featchDataUser = async () => {
    try {
      const response = await userApi.getByUserId(user?.id as string);
      console.log(response);
      if (response) {
        setUserData(response);
      }
    } catch (error) {}
  };
  console.log(user);

  useEffect(() => {
    featchDataUser();
  }, []);
  useFocusEffect(
    useCallback(() => {
      featchDataUser();
    }, [])
  );
  return (
    <ScrollView style={{ width: wp(100) }} className="flex-1 bg-white">
      <View className="h-[300px] relative items-center">
        <Image
          source={require("../../assets/images/hero-detail-test.jpg")}
          className="w-full h-full items-center rounded-b-3xl"
          resizeMode="cover"
        />

        <BackButton />
        <TouchableOpacity
          onPress={() => router.push("/profile/editProfile")}
          className="absolute top-16 right-5 z-50 bg-white items-center justify-center w-12 h-12 rounded-full"
        >
          <EvilIcons name="pencil" size={24} color="#FFC107" />
        </TouchableOpacity>
        {userData?.avatarurl ? (
          <View
            style={{
              width: wp(50),
              height: wp(50),
            }}
            className=" rounded-full border-4 bg-white border-primary absolute -bottom-[20%]"
          >
            <Image
              source={{ uri: userData?.avatarurl }}
              resizeMode="cover"
              className="w-full h-full rounded-full"
            />
          </View>
        ) : (
          <View className="w-[200px] h-[200px] rounded-full border border-primary absolute -bottom-[20%] ">
            <Avatar size={200} username={userData?.username} />
          </View>
        )}
      </View>

      <View className="items-center px-4 mt-[68px]">
        <Text className="text-2xl font-bold text-gray-800">
          {userData?.fullName || userData?.username}
        </Text>
        <Text className="text-base text-gray-500 mt-1 ">
          @{userData?.username}
        </Text>
      </View>

      <View className="w-[90%] m-auto">
        <View className="flex-row items-center border border-gray-300 rounded-full h-14 p-3 mt-3">
          <Ionicons name="mail-outline" size={20} color="#888" />
          <Text className="ml-3">{userData?.email}</Text>
        </View>
        <View className="flex-row justify-between">
          <View className="flex-row items-center border border-gray-300 rounded-full w-[60%] h-14 p-3 mt-3">
            <Feather name="phone" size={20} color="#888" />
            <Text className="ml-3">{userData?.phonenumber}</Text>
          </View>
          <View className="flex-row items-center border border-gray-300 rounded-full w-1/3 h-14 p-3 mt-3">
            <Ionicons name="person-outline" size={20} color="#888" />
            <Text className="ml-3">{userData?.gioitinh}</Text>
          </View>
        </View>

        <View className="flex-row items-center border border-gray-300 rounded-full p-3 mt-3">
          <Ionicons name="location-outline" size={20} color="#888" />
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            style={{ maxWidth: 300, flexShrink: 1 }}
            className="ml-3"
          >
            {userData?.address}
          </Text>
        </View>
      </View>
      {/* <View className="w-[80%] m-auto flex-row justify-between p-1 mt-5">
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">13</Text>
          <Text className="text-sm text-gray-500">Tổng đơn</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">7</Text>
          <Text className="text-sm text-gray-500">Đơn tháng</Text>
        </View>
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">7</Text>
          <Text className="text-sm text-gray-500">Bài đánh giá</Text>
        </View>
      </View> */}
    </ScrollView>
  );
};

export default DetailProfile;
