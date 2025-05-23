import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ChatApi from "@/api/chatApi";
import { useUserStore } from "@/stores/user-store";
import ChatRoomList from "@/components/chat/ChatRoomList";
import { useRouter } from "expo-router";

interface ChatRoom {
  id: string;
  userId: string;
  staffId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const Messages = () => {
  const { user } = useUserStore();
  const chatApi = new ChatApi();
  const router = useRouter();
  
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch chat rooms based on user role
  const fetchChatRooms = async () => {
    try {
      setIsLoading(true);
      let response;
      if (user?.roles === "system_user") {
        response = await chatApi.getAllByUserId(user.id);
      } else {
        response = await chatApi.getAllByFixerId(user?.id as string);
      }
      
      if (response?.data) {
        setChatRooms(response.data);
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchChatRooms();
  }, []);

  const handleChatRoomPress = (room: ChatRoom) => {
    router.push(`/message/${room.id}`);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <Text className="text-xl font-bold p-4 bg-white">Tin nhắn</Text>
      <ChatRoomList
        chatRooms={chatRooms}
        currentUserId={user?.id as string}
        onChatRoomPress={handleChatRoomPress}
        isLoading={isLoading}
      />
    </View>
  );
};

export default Messages;
