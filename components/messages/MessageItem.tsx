import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { MessageThread } from "../../types/message";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

interface MessageItemProps {
  thread: MessageThread;
  onPress: () => void;
}

// Component hiển thị một item trong danh sách tin nhắn
const MessageItem: React.FC<MessageItemProps> = ({ thread, onPress }) => {
  const lastMessage = thread.messages[thread.messages.length - 1];
  const timeAgo = formatDistanceToNow(new Date(lastMessage.createdAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <TouchableOpacity
      className="flex-row p-3 border-b border-gray-200"
      onPress={onPress}
    >
      <Image
        source={{ uri: thread.participant.avatar }}
        className="w-12 h-12 rounded-full mr-3"
      />
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-semibold">
            {thread.participant.name}
          </Text>
          <Text className="text-xs text-gray-500">{timeAgo}</Text>
        </View>
        <Text className="text-sm text-gray-500" numberOfLines={1}>
          {lastMessage.content}
        </Text>
        {thread.unreadCount > 0 && (
          <View className="absolute right-0 top-1 bg-blue-500 rounded-full min-w-[24px] h-6 justify-center items-center px-1.5">
            <Text className="text-white text-xs font-semibold">
              {thread.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default MessageItem;
