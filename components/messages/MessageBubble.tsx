import React from "react";
import { View, Text } from "react-native";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Message } from "../../types/message";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

// Component hiển thị một tin nhắn trong cuộc trò chuyện
const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  isOwnMessage,
}) => {
  const time = format(new Date(message.createdAt), "HH:mm", { locale: vi });

  return (
    <View
      className={`flex-row ${
        isOwnMessage ? "justify-end" : "justify-start"
      } mb-2`}
    >
      <View
        className={`max-w-[80%] rounded-2xl px-4 py-2 ${
          isOwnMessage
            ? "bg-blue-500 rounded-tr-none"
            : "bg-gray-200 rounded-tl-none"
        }`}
      >
        <Text
          className={`text-base ${
            isOwnMessage ? "text-white" : "text-gray-900"
          }`}
        >
          {message.content}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            isOwnMessage ? "text-blue-100" : "text-gray-500"
          }`}
        >
          {time}
        </Text>
      </View>
    </View>
  );
};

export default MessageBubble;
