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

const NewsRow = () => {
  return (
    <View>
      <View className="flex-row justify-between items-center px-4">
        <View>
          <Text className="font-bold text-lg">Tin tức</Text>
          <Text className="text-gray-500 text-xs">
            Tin tức mới của chúng tôi
          </Text>
        </View>
        <TouchableOpacity>
          <Text className="font-semibold text-blue-400">Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        className="overflow-visible py-5"
      >
        {newsData.map((news, index) => {
          return <NewsCard item={news} key={index} />;
        })}
      </ScrollView>
    </View>
  );
};

export default NewsRow;

const styles = StyleSheet.create({});
