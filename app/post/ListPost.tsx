import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import Categories from "@/components/staff/Categories";
import PostCard from "@/components/staff/PostCard";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";

const ListPost = () => {
  const onCatChanged = (category: string) => {
    console.log(category);
  };
  return (
    <View className="flex-1 bg-background">
      <BackButton />
      <InfoButton />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-24"
      >
        <Categories onCategoryChanged={onCatChanged} />
        <View className="mt-3 mb-10">
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </View>
      </ScrollView>
    </View>
  );
};

export default ListPost;
