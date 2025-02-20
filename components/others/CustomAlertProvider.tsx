import { useAppAlert } from "@/hooks/useAppAlert";
import { CustomAlertProps } from "@/types/others";
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const CustomAlertProvider = () => {
  const { title, message, isVisible, hideAlert } = useAppAlert();
  return (
    <Modal transparent animationType="fade" visible={isVisible}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg w-4/5">
          <Text className="text-lg font-bold mt-5 text-center">{title}</Text>
          <Text className="text-lg mt-1 mb-3 text-center px-3.5">{message}</Text>
          <TouchableOpacity
            className="border-t-[0.5px] border-gray-300 p-4 rounded-lg mt-1"
            onPress={hideAlert}
          >
            <Text className="text-blue-500 font-bold text-center">OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlertProvider;
