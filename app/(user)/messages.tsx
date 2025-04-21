import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = "http://192.168.1.50:3333"; // chỉnh lại nếu chạy trên thiết bị thật

const Messages = () => {
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<ScrollView | null>(null);

  const [roomId, setRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState<
    { senderId: string; senderName: string; content: string }[]
  >([]);

  const [currentRole, setCurrentRole] = useState<"user" | "staff">("user");

  const userId = "user123";
  const staffId = "staff456";

  const senderId = currentRole === "user" ? userId : staffId;
  const receiverId = currentRole === "user" ? staffId : userId;
  const senderName = currentRole === "user" ? "User" : "Staff";
  const receiverName = currentRole === "user" ? "Staff" : "User";

  useEffect(() => {
    if (socketRef.current) return; // chỉ connect socket 1 lần duy nhất

    const socket = io(SOCKET_URL, {
      transports: ["websocket"],
      query: {
        userId,
        role: currentRole,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected");
    });

    socket.on("roomCreated", (room) => {
      setRoomId(room.data.id);
      socket.emit("joinRoom", { roomId: room.data.id }); // join ngay khi tạo
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
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollToEnd({ animated: true });
    }
  }, [chatLog]);

  const handleCreateRoom = () => {
    if (socketRef.current) {
      socketRef.current.emit("createRoom", {
        userId,
        staffId,
      });
    }
  };

  const handleSendMessage = () => {
    if (!roomId) return alert("Chưa có room!");
    if (socketRef.current) {
      socketRef.current.emit("sendMessage", {
        roomId,
        senderId,
        senderName,
        receiverId,
        receiverName,
        content: message,
      });
      setMessage("");
    }
  };

  const handleJoinRoom = () => {
    if (roomId && socketRef.current) {
      socketRef.current.emit("joinRoom", { roomId });
    }
  };

  const toggleRole = () => {
    setCurrentRole((prev) => (prev === "user" ? "staff" : "user"));
  };

  return (
    <View className="flex-1 p-4 mt-10 bg-white">
      <Text className="text-xl font-bold mb-4 text-center">💬 Chat Realtime Demo</Text>

      <TouchableOpacity
        onPress={toggleRole}
        className="bg-purple-600 py-2 rounded-md mb-3"
      >
        <Text className="text-white text-center font-medium">
          🔄 Chuyển sang: {currentRole === "user" ? "Nhân viên (staff)" : "Người dùng (user)"}
        </Text>
      </TouchableOpacity>

      <Text className="text-sm text-gray-700 mb-1">
        👤 Đang là: <Text className="font-semibold">{senderName}</Text>
      </Text>
      <Text className="text-sm text-gray-700 mb-3">
        🗣️ Gửi tới: <Text className="font-semibold">{receiverName}</Text>
      </Text>

      <TouchableOpacity
        onPress={handleCreateRoom}
        className="bg-blue-600 py-2 rounded-md mb-3"
      >
        <Text className="text-white text-center font-medium">Tạo phòng</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleJoinRoom}
        className="bg-orange-500 py-2 rounded-md mb-3"
      >
        <Text className="text-white text-center font-medium">Tham gia phòng (nếu đã tạo)</Text>
      </TouchableOpacity>

      <Text className="text-sm text-gray-700 mb-2">
        Room ID: <Text className="font-semibold">{roomId || "(chưa tạo)"}</Text>
      </Text>

      <TextInput
        className="border border-gray-300 rounded-md p-2 mb-3"
        placeholder="Nhập tin nhắn..."
        value={message}
        onChangeText={setMessage}
      />

      <TouchableOpacity
        onPress={handleSendMessage}
        className="bg-green-600 py-2 rounded-md mb-4"
      >
        <Text className="text-white text-center font-medium">Gửi tin nhắn</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        className="flex-1 bg-gray-100 p-3 rounded-md"
      >
        {chatLog.map((msg, index) => {
          const isMe = msg.senderId === senderId;
          return (
            <View
              key={index}
              className={`mb-2 ${isMe ? "items-end" : "items-start"}`}
            >
              <Text className="text-xs text-gray-500 mb-1">
                {msg.senderName}
              </Text>
              <View
                className={`px-4 py-2 rounded-lg max-w-[75%] ${
                  isMe
                    ? "bg-green-500 rounded-br-none"
                    : "bg-gray-300 rounded-bl-none"
                }`}
              >
                <Text className={`${isMe ? "text-white" : "text-black"}`}>
                  {msg.content}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default Messages;
