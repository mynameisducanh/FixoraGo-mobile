import React, { useEffect, useState } from 'react';
import { View, FlatList, ActivityIndicator, Text } from 'react-native';
import ChatRoomItem from './ChatRoomItem';
import { useUserStore } from '@/stores/user-store';
import UserApi from '@/api/userApi';

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
  const { user } = useUserStore();
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const userApi = new UserApi();

  useEffect(() => {
    const fetchUserNames = async () => {
      const names: Record<string, string> = {};
      for (const room of chatRooms) {
        const receiveId = user?.roles === 'system_user' ? room.staffId : room.userId;
        try {
          const userData = await userApi.getByUserId(receiveId);
          if (userData) {
            names[receiveId] = userData.fullName || userData.username;
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      }
      setUserNames(names);
    };

    if (chatRooms.length > 0) {
      fetchUserNames();
    }
  }, [chatRooms, user?.roles]);

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
      renderItem={({ item }) => {
        const receiveId = user?.roles === 'system_user' ? item.staffId : item.userId;
        const userName = userNames[receiveId] || 'Đang tải...';
        
        return (
          <ChatRoomItem
            {...item}
            currentUserId={currentUserId}
            onPress={() => onChatRoomPress(item)}
            userName={userName}
          />
        );
      }}
      contentContainerStyle={{ padding: 16 }}
    />
  );
};

export default ChatRoomList; 