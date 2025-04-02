import React from "react";
import { View, FlatList } from "react-native";
import MessageItem from "./MessageItem";
import { MessageThread } from "../../types/message";

interface MessageListProps {
  threads: MessageThread[];
  onThreadPress: (threadId: string) => void;
}

// Component hiển thị danh sách các cuộc trò chuyện
const MessageList: React.FC<MessageListProps> = ({
  threads,
  onThreadPress,
}) => {
  const renderItem = ({ item }: { item: MessageThread }) => (
    <MessageItem thread={item} onPress={() => onThreadPress(item.id)} />
  );

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={threads}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle="p-4"
      />
    </View>
  );
};

export default MessageList;
