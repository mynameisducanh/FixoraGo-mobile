import React from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ChatRoomItem from './ChatRoomItem';

interface ChatRoom {
  id: string;
  userId: string;
  staffId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatRoomListProps {
  chatRooms: ChatRoom[];
  currentUserId: string;
  onChatRoomPress: (chatRoom: ChatRoom) => void;
  isLoading: boolean;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({
  chatRooms,
  currentUserId,
  onChatRoomPress,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-2">Đang tải danh sách chat...</Text>
      </View>
    );
  }

  if (chatRooms.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-600">Chưa có cuộc trò chuyện nào</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={chatRooms}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ChatRoomItem
          {...item}
          currentUserId={currentUserId}
          onPress={() => onChatRoomPress(item)}
        />
      )}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default ChatRoomList; 