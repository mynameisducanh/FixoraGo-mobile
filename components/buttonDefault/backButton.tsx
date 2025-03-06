import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useTheme } from "react-native-paper";
const BackButton = () => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      className="flex-row items-center p-2 bg-background w-12 h-12 rounded-full absolute top-14 left-5 z-50"
      onPress={() => navigation.goBack()}
    >
      <Ionicons name="chevron-back-outline" size={24} color={"#FFC107"} />
    </TouchableOpacity>
  );
};

export default BackButton;
