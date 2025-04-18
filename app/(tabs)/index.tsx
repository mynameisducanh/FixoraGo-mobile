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
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
      >
        <Header />
        <SearchBar />
        <View>
          <ListService />
        </View>
        <View className="mt-5">
          <NewsRow />
        </View>
        {/* <TouchableOpacity onPress={() => router.push("/(staff)")}>
          <Text>Staff</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
}
