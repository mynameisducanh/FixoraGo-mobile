import {
  Image,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/default/header";
import SearchBar from "@/components/default/searchBar";
import { categoryData, newsData } from "../../temp/service";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ListService from "@/components/services/listService";
import { useState } from "react";
import NewsRow from "@/components/news/newsRow";

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState("Sửa điện");
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        <Header />
        <SearchBar />
        <View>
          <ListService
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </View>
        <View className="mt-5">
          <NewsRow />
        </View>
      </ScrollView>
    </View>
  );
}
