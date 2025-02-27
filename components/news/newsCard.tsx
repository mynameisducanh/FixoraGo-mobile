import {
  Image,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";

const NewsCard = ({ item }) => {
  return (
    <TouchableWithoutFeedback>
      <View className="mr-6 bg-white rounded-3xl shadow-sm max-w-xs">
        <Image className="h-36 w-64 rounded-t-3xl" source={item.image} />
        <View className="px-3 pb-4 space-y-2">
          <Text className="text-lg font-bold pt-2">{item.name}</Text>
          <Text className="text-gray-700">{item.description}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default NewsCard;

const styles = StyleSheet.create({});
