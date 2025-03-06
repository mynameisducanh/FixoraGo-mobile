import { useState } from "react";
import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TextArea = ({ placeholder = "Nhập nội dung..." }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      className={`w-full p-3 rounded-xl border ${
        isFocused ? "border-primary" : "border-gray-300"
      } bg-white`}
    >
      <TextInput
        className="text-base text-gray-700"
        multiline
        numberOfLines={4}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={setText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <MaterialCommunityIcons
        name="pencil-outline"
        size={20}
        color={isFocused ? "#00a1e9" : "#9CA3AF"}
        className="absolute right-3 bottom-3"
      />
    </View>
  );
};

export default TextArea;
