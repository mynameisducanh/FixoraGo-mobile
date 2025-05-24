import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import ChatApi from "@/api/chatApi";
import { useUserStore } from "@/stores/user-store";
import ChatRoomList from "@/components/chat/ChatRoomList";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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
  const insets = useSafeAreaInsets();

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [idReceive, setIdReceive] = useState();
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
    <View className="flex-1 bg-gray-50" style={{ paddingTop: insets.top }}>
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <Text className="text-xl font-bold">Tin nhắn</Text>
      </View>
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
