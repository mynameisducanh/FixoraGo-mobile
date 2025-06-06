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
import { News } from "@/api/newsApi";
import { formatDateTimeVN } from "@/utils/dateFormat";

interface NewsCardProps {
  item: News;
}

const NewsCard = ({ item }: NewsCardProps) => {
  const router = useRouter();

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        router.push({
          pathname: `/news/${item.id}`,
        });
      }}
    >
      <View style={{ width: wp(90) }} className="mr-6 bg-white max-w-[340px] mb-3">
        {item.image ? (
          <Image
            className="h-44 w-full rounded-md"
            source={{ uri: item.image }}
            resizeMode="cover"
          />
        ) : (
          <View className="h-44 w-full rounded-md bg-gray-200 items-center justify-center">
            <AntDesign name="picture" size={40} color="#9ca3af" />
          </View>
        )}
        <View className="pt-1">
          <Text
            className="w-full font-bold pt-2"
            numberOfLines={2}
            ellipsizeMode="tail"
          >
            {item.title}
          </Text>
          <View className="text-gray-700 w-full ">
            <View className="flex flex-row items-center">
              <Text className="text-sm text-gray-500 font-bold">News</Text>
              <Entypo name="dot-single" size={12} color="#9ca3af" />
              <Text className="text-sm text-gray-400">
                {formatDateTimeVN(item.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewsCard;

const styles = StyleSheet.create({});
