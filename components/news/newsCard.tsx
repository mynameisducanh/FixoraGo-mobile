import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useRouter } from "expo-router";
const NewsCard = ({ item }) => {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        router.push("/news/detailNews");
      }}
    >
      <View style={{ width: wp(90) }} className="mr-6 bg-white max-w-[340px] mb-3">
        <Image
          className="h-44 w-full rounded-md"
          source={{ uri: item.image }}
        />
        <View className="pt-1">
          <Text
            className="w-full font-bold pt-2"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.name}
          </Text>
          <View className="text-gray-700 w-full ">
            <View className="flex flex-row items-center">
              <Text className="text-sm text-gray-500 font-bold">News</Text>
              <Entypo name="dot-single" size={12} color="#9ca3af" />
              <Text className="text-sm text-gray-400">{item.time}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewsCard;

const styles = StyleSheet.create({});
