import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";
import EvilIcons from "@expo/vector-icons/EvilIcons";
const DetailNews = () => {
  const news = {
    title: "Công nghệ AI đang thay đổi thế giới",
    date: "06/03/2025",
    views: 1250,
    image:
      "https://res.cloudinary.com/di6tygnb5/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1740975526/samples/cup-on-a-table.jpg",
    content: `  Trí tuệ nhân tạo (AI) đang dần trở thành một phần ko thể thiếu trong cuộc sống. Các ứng dụng AI giúp tối ưu hóa quy trình sản xuất, nâng cao chất lượng dịch vụ khách hàng, và mở ra nhiều cơ hội mới trong ngành công nghệ. Trí tuệ nhân tạo (AI) đang dần trở thành một phần không thể thiếu trong cuộc sống. Các ứng dụng AI giúp tối ưu hóa quy trình sản xuất, nâng cao chất lượng dịch vụ khách hàng, và mở ra nhiều cơ hội mới trong ngành công nghệ.`,
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <BackButton />
      <InfoButton />

      <Image
        source={{ uri: news.image }}
        className="w-full h-72 rounded-lg"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {news.title}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <EvilIcons name="clock" size={14} color="black" />
            <Text className="text-gray-500 text-sm">{news.date}</Text>
          </View>
          <Text className="text-gray-500 text-sm">{news.views} lượt xem</Text>
        </View>

        <Text className="text-base text-gray-700 dark:text-gray-300 mt-4 leading-relaxed">
          {news.content}
        </Text>
      </View>
    </ScrollView>
  );
};

export default DetailNews;
