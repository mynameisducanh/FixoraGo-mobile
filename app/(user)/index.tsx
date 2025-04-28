import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React from "react";
import { useUserStore } from "@/stores/user-store";
import { StatusBar } from "expo-status-bar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Header from "@/components/default/header";
import SearchBar from "@/components/default/searchBar";
import ListService from "@/components/services/listService";
import NewsRow from "@/components/news/newsRow";
const HomeUser = () => {
  // const { user, isAuthenticated } = useUserStore();
  // console.log("TT user : ", user);

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
          <ListService />
        </View>
        <View className="mt-5">
          <NewsRow />
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeUser;

const styles = StyleSheet.create({});
