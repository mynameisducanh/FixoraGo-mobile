import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { newsData } from "@/temp/service";
import NewsCard from "@/components/news/newsCard";
import BackButton from "@/components/buttonDefault/backButton";

const ListNews = () => {
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
        {newsData.map((news, index) => {
          return <NewsCard item={news} key={index} />;
        })}
      </ScrollView>
    </View>
  );
};

export default ListNews;
