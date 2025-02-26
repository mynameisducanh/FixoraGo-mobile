import { StyleSheet, Text, TextInput, View } from "react-native";
import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const SearchBar = () => {
  return (
    <>
      <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
        <TextInput
          placeholder="Tìm kiếm gì đó đi..."
          placeholderTextColor={"gray"}
          style={{ fontSize: hp(1.7) }}
          className="flex-1 text-base mb-1 pl-3 tracking-wider"
        />
        <View className="bg-white rounded-full p-3">
          <FontAwesome name="search" size={20} color="gray" />
        </View>
      </View>
    </>
  );
};

export default SearchBar;

const styles = StyleSheet.create({});
