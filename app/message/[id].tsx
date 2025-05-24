import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { io, Socket } from "socket.io-client";
import Constants from "expo-constants";
import ChatApi from "@/api/chatApi";
import { useUserStore } from "@/stores/user-store";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import UserApi from "@/api/userApi";

interface ChatMessage {
  senderId: string;
  senderName: string;
  content: string;
}

interface Room {
  id: string;
  userId: string;
  staffId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatRoomResponse {
  room: Room;
  messages: ChatMessage[];
}

const ChatDetail = () => {
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);
  const { user } = useUserStore();
  const chatApi = new ChatApi();
  const userApi = new UserApi();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [chatLog, setChatLog] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataSender, setDataSender] = useState<any>(null);
  const [roomStatus, setRoomStatus] = useState<string>("active");

  const fetchDataUser = async (id: string) => {
    try {
      const res = await userApi.getByUserId(id);
      if (res) {
        setDataSender(res);
      }
    } catch (error) {}
  };

  // Load chat room details
  const loadChatRoomDetails = async (roomId: string) => {
    try {
      setIsLoading(true);
      const response = await chatApi.getDetailByChatRoomId(roomId);
      if (response?.data) {
        const { room, messages } = response.data;
        setChatLog(messages);
        setRoomStatus(room.status);
        // Set sender and receiver IDs based on user role
        if (user?.roles === "system_user") {
          setSenderId(room.userId);
          setReceiverId(room.staffId);
          fetchDataUser(room.staffId);
        } else if (user?.roles === "system_fixer") {
          setSenderId(room.staffId);
          setReceiverId(room.userId);
          fetchDataUser(room.userId);
        }
      }
    } catch (error) {
      console.error("Error loading chat details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadChatRoomDetails(id as string);
  }, [id]);

  useEffect(() => {
    if (socketRef.current) return;

    const socket = io(Constants.expoConfig?.extra?.SOCKET_URL, {
      transports: ["websocket"],
      query: {
        userId: user?.id,
        role: user?.roles,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
      if (typeof id === "string") {
        socket.emit("joinRoom", { roomId: id });
      }
    });

    socket.on("joinedRoom", (data) => {
      console.log("Đã join room:", data.roomId);
    });

    socket.on("newMessage", (data) => {
      setChatLog((prev) => [
        ...prev,
        {
          senderId: data.senderId,
          senderName: data.senderName,
          content: data.content,
        },
      ]);
      // Scroll to bottom when new message arrives
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollToEnd({ animated: true });
        }
      }, 100);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    if (!id || typeof id !== "string") return alert("Chưa có room!");
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        roomId: id,
        senderId: user?.id,
        senderName: user?.fullName || user?.username,
        receiverId,
        receiverName: dataSender?.fullName || dataSender?.username,
        content: message.trim(),
      });
      setMessage("");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
      style={{ paddingTop: insets.top, paddingBottom: 100 }}
    >
      <View className="flex-1 mb-3">
        <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
          <TouchableOpacity onPress={() => router.back()} className="mr-4">
            <Text className="text-blue-500">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold">
            {dataSender?.fullName || dataSender?.username || "Đang tải..."}
          </Text>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 p-4"
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {isLoading ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-600">Đang tải tin nhắn...</Text>
            </View>
          ) : (
            chatLog.map((msg, index) => {
              const isMe = msg.senderId === user?.id;
              return (
                <View
                  key={index}
                  className={`mb-4 ${isMe ? "items-end" : "items-start"}`}
                >
                  <Text className="text-xs text-gray-500 mb-1">
                    {msg.senderName}
                  </Text>
                  <View
                    className={`px-4 py-2 rounded-lg max-w-[75%] ${
                      isMe
                        ? "bg-blue-500 rounded-br-none"
                        : "bg-gray-200 rounded-bl-none"
                    }`}
                  >
                    <Text className={isMe ? "text-white" : "text-gray-800"}>
                      {msg.content}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {roomStatus === "cancel" ? (
          <View className="p-4 bg-white border-t border-gray-200">
            <View className="bg-red-50 p-4 rounded-lg">
              <Text className="text-red-600 text-center">
                Kênh chat này đã bị đóng
              </Text>
            </View>
          </View>
        ) : (
          <View
            className="p-4 bg-white border-t border-gray-200"
            style={{ paddingBottom: insets.bottom + 16 }}
          >
            <View className="flex-row">
              <TextInput
                className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2"
                placeholder="Nhập tin nhắn..."
                value={message}
                onChangeText={setMessage}
                multiline
                maxLength={500}
              />
              <TouchableOpacity
                onPress={handleSendMessage}
                className="bg-blue-500 px-4 rounded-r-lg justify-center"
              >
                <Text className="text-white font-medium">Gửi</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatDetail;
