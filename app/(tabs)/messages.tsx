import React, { useState, useEffect } from "react";
import { View, FlatList, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import MessageList from "../../components/messages/MessageList";
import { MessageThread } from "../../types/message";
import { useWebSocket } from "../../hooks/useWebSocket";
import { getMessageThreads } from "../../api/messages";

// Màn hình chính hiển thị danh sách tin nhắn
const Messages = () => {
  const router = useRouter();
  const [threads, setThreads] = useState<MessageThread[]>([]);
  const [loading, setLoading] = useState(true);

  // Kết nối WebSocket để nhận tin nhắn mới
  const { lastMessage } = useWebSocket("ws://your-websocket-server/messages");

  // Lấy danh sách tin nhắn khi component mount
  useEffect(() => {
    fetchThreads();
  }, []);

  // Cập nhật danh sách tin nhắn khi có tin nhắn mới
  useEffect(() => {
    if (lastMessage) {
      updateThreadsWithNewMessage(lastMessage);
    }
  }, [lastMessage]);

  // Hàm lấy danh sách tin nhắn
  const fetchThreads = async () => {
    try {
      const response = await getMessageThreads();
      setThreads(response.data);
    } catch (error) {
      console.error("Error fetching message threads:", error);
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật danh sách tin nhắn khi có tin nhắn mới
  const updateThreadsWithNewMessage = (newMessage: any) => {
    setThreads((prevThreads) => {
      const updatedThreads = [...prevThreads];
      const threadIndex = updatedThreads.findIndex(
        (thread) => thread.id === newMessage.threadId
      );

      if (threadIndex !== -1) {
        updatedThreads[threadIndex].messages.push(newMessage);
        updatedThreads[threadIndex].unreadCount += 1;
      }

      return updatedThreads;
    });
  };

  // Xử lý khi người dùng chọn một cuộc trò chuyện
  const handleThreadPress = (threadId: string) => {
    router.push(`/chat/${threadId}`);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <MessageList threads={threads} onThreadPress={handleThreadPress} />
    </View>
  );
};

export default Messages;
