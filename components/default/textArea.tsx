import { useState } from "react";
import { View, TextInput } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const TextArea = ({ placeholder, onChangeText }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const handleTextChange = (newText) => {
    setText(newText);
    onChangeText?.(newText);
  };
  return (
    <View
      className={`w-full  p-3 rounded-xl border ${
        isFocused ? "border-primary" : "border-gray-300"
      } bg-white`}
    >
      <TextInput
        className="text-base text-gray-700 h-24"
        multiline
        numberOfLines={4}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={handleTextChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <MaterialCommunityIcons
        name="pencil-outline"
        size={20}
        color={isFocused ? "#FFC107" : "#9CA3AF"}
        className="absolute right-5 bottom-3"
      />
    </View>
  );
};

export default TextArea;
