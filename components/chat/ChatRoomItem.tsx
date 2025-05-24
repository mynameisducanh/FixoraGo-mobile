import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface ChatRoomItemProps {
  id: string;
  userId: string;
  staffId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  onPress: () => void;
  currentUserId: string;
  userName: string;
}

const ChatRoomItem: React.FC<ChatRoomItemProps> = ({
  id,
  userId,
  staffId,
  status,
  createdAt,
  updatedAt,
  onPress,
  currentUserId,
  userName,
}) => {
  const isActive = status === 'active';
  const timeAgo = formatDistanceToNow(new Date(updatedAt), {
    addSuffix: true,
    locale: vi,
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white p-4 mb-2 rounded-lg border border-gray-200"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-gray-800 font-medium">
            {userName}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            Cập nhật {timeAgo}
          </Text>
        </View>
        <View className={`px-2 py-1 rounded-full ${isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
          <Text className={`text-xs ${isActive ? 'text-green-600' : 'text-gray-600'}`}>
            {isActive ? 'Đang hoạt động' : 'Đã đóng'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ChatRoomItem; 