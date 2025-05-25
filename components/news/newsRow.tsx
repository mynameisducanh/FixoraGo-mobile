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
import { useRouter } from "expo-router";

const NewsRow = () => {
  const router = useRouter();
  return (
    <View>
      <View className="flex-row justify-between items-center px-4">
        <View>
          <Text className="font-bold text-lg">Tin tức</Text>
          <Text className="text-gray-500 text-xs">
            Tin tức mới của chúng tôi
          </Text>
        </View>
        <TouchableOpacity onPress={() => router.push("/news/listNews")}>
          <Text className="font-semibold text-textBlue">Xem tất cả</Text>
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
