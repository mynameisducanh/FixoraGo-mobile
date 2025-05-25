import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import RenderHTML from "react-native-render-html";
import { useLocalSearchParams } from "expo-router";
import NewsApi, { News } from "@/api/newsApi";
import { formatDateTimeVN } from "@/utils/dateFormat";

const NewsDetail = () => {
  const { width } = useWindowDimensions();
  const { id } = useLocalSearchParams();
  const [news, setNews] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const newsApi = new NewsApi();

  const fetchNewsDetail = async () => {
    try {
      setLoading(true);
      const response = await newsApi.getNewsById(id as string);
      if (response) {
        setNews(response);
      }
    } catch (error) {
      console.error("Error fetching news detail:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchNewsDetail();
    }
  }, [id]);

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!news) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-500">Không tìm thấy tin tức</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <BackButton />
      <InfoButton />

      {news.image ? (
        <Image
          source={{ uri: news.image }}
          className="w-full h-72 rounded-lg"
          resizeMode="cover"
        />
      ) : (
        <View className="w-full h-72 bg-gray-200 items-center justify-center">
          <Text className="text-gray-500">Không có hình ảnh</Text>
        </View>
      )}

      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {news.title}
        </Text>
        <Text className="text-xl text-gray-800 dark:text-gray-200">
          {news.description}
        </Text>
        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <EvilIcons name="clock" size={14} color="black" />
            <Text className="text-gray-500 text-sm ml-1">
              {formatDateTimeVN(news.createdAt)}
            </Text>
          </View>
        </View>

        <View className="mt-4">
          <RenderHTML contentWidth={width} source={{ html: news.content }} />
        </View>
      </View>
    </ScrollView>
  );
};

export default NewsDetail;
