import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
const InfoButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="absolute top-16 right-5 z-50"
      onPress={() => navigation.goBack()}
    >
      <AntDesign name="questioncircleo" size={24} color="white" />
    </TouchableOpacity>
  );
};

export default InfoButton;
