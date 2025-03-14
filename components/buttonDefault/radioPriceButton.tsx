import { Text, TouchableOpacity, View } from "react-native";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { MaterialIcons } from "@expo/vector-icons";
const RadioPriceButton = ({ options, checkedValue, onChange }) => {
  return (
    <View className="">
      {options.map((option: any, index: any) => {
        let active = checkedValue == option.id;
        return (
          <TouchableOpacity
            key={option.id}
            className={`flex-row items-center justify-between p-4 rounded-xl border my-3 ${
              active
                ? "border-primary bg-bgBlueButtonHover"
                : "border-gray-300 bg-white"
            }`}
            onPress={() => onChange(option.id)}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons
                name={
                  active ? "radio-button-checked" : "radio-button-unchecked"
                }
                size={15}
                color={active ? "#06b6b4" : "#64748b"}
              />
              <Text className={"text-lg font-semibold"}>{option.name}</Text>
            </View>
            <Text>{option.price}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default RadioPriceButton;
