import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import NewsCard from "@/components/news/newsCard";
import BackButton from "@/components/buttonDefault/backButton";
import NewsApi, { News } from "@/api/newsApi";
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';

const ListNews = () => {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const newsApi = new NewsApi();

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await newsApi.getAllNews();
      if (response && Array.isArray(response)) {
        setNews(response);
      }
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <View className="bg-white pt-28">
      <BackButton />

      <ScrollView
        contentContainerStyle={{ paddingLeft: 25, paddingBottom: 50 }}
      >
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="font-bold text-lg mb-3">Danh sách tin tức</Text>
          </View>
        </View>
        {loading ? (
          // Shimmer loading placeholders
          Array.from({ length: 5 }).map((_, index) => (
            <View key={index} className="mb-6" style={{ width: '90%' }}>
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{
                  width: '100%',
                  height: 176,
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              />
              <ShimmerPlaceholder
                LinearGradient={LinearGradient}
                style={{
                  width: '80%',
                  height: 20,
                  borderRadius: 4,
                  marginBottom: 8,
                }}
              />
              <View className="flex-row items-center">
                <ShimmerPlaceholder
                  LinearGradient={LinearGradient}
                  style={{
                    width: 60,
                    height: 16,
                    borderRadius: 4,
                    marginRight: 8,
                  }}
                />
                <ShimmerPlaceholder
                  LinearGradient={LinearGradient}
                  style={{
                    width: 100,
                    height: 16,
                    borderRadius: 4,
                  }}
                />
              </View>
            </View>
          ))
        ) : news.length > 0 ? (
          news.map((item) => <NewsCard item={item} key={item.id} />)
        ) : (
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-500 text-center">
              Chưa có tin tức nào
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default ListNews;
