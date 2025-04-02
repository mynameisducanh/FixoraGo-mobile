import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ChatInputProps {
  onSend: (message: string) => void;
  onAttachment?: () => void;
}

// Component nhập tin nhắn trong màn hình chat
const ChatInput: React.FC<ChatInputProps> = ({ onSend, onAttachment }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="border-t border-gray-200 bg-white"
    >
      <View className="flex-row items-center p-2">
        <TouchableOpacity onPress={onAttachment} className="p-2">
          <Ionicons name="add-circle-outline" size={24} color="#666" />
        </TouchableOpacity>

        <TextInput
          value={message}
          onChangeText={setMessage}
          placeholder="Nhập tin nhắn..."
          multiline
          className="flex-1 mx-2 p-2 bg-gray-100 rounded-full text-base"
          maxLength={1000}
        />

        <TouchableOpacity
          onPress={handleSend}
          disabled={!message.trim()}
          className={`p-2 ${!message.trim() ? "opacity-50" : ""}`}
        >
          <Ionicons
            name="send"
            size={24}
            color={message.trim() ? "#007AFF" : "#666"}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatInput;
