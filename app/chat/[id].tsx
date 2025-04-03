import React, { useState, useEffect, useRef } from "react";
import { View, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MessageBubble from "../../components/messages/MessageBubble";
import ChatInput from "../../components/messages/ChatInput";
import { Message, MessageThread } from "../../types/message";
import { getMessageThread, sendMessage } from "../../api/messages";
import { useWebSocket } from "../../hooks/useWebSocket";
import { useUserStore } from "../../stores/user-store";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  return <Text className="text-sm text-gray-500">mes</Text>;
};
// const ChatScreen = () => {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { user } = useUserStore();
//   const [thread, setThread] = useState<MessageThread | null>(null);
//   const [loading, setLoading] = useState(true);
//   const flatListRef = useRef<FlatList>(null);

//   const { lastMessage } = useWebSocket(`ws://your-websocket-server/chat/${id}`);

//   useEffect(() => {
//     fetchThread();
//   }, [id]);

//   useEffect(() => {
//     if (lastMessage && thread) {
//       setThread((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           messages: [...prev.messages, lastMessage],
//         };
//       });
//       scrollToBottom();
//     }
//   }, [lastMessage]);

//   const fetchThread = async () => {
//     try {
//       const response = await getMessageThread(id as string);
//       setThread(response.data);
//     } catch (error) {
//       console.error("Error fetching thread:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSend = async (content: string) => {
//     if (!thread || !user) return;

//     try {
//       const newMessage = await sendMessage(thread.id, content);
//       setThread((prev) => {
//         if (!prev) return null;
//         return {
//           ...prev,
//           messages: [...prev.messages, newMessage],
//         };
//       });
//       scrollToBottom();
//     } catch (error) {
//       console.error("Error sending message:", error);
//     }
//   };

//   const scrollToBottom = () => {
//     if (flatListRef.current && thread?.messages.length) {
//       flatListRef.current.scrollToEnd({ animated: true });
//     }
//   };

//   if (loading || !thread) {
//     return (
//       <View className="flex-1 items-center justify-center">
//         <Text>Đang tải...</Text>
//       </View>
//     );
//   }

//   return (
//     <View className="flex-1 bg-white">
//       <View className="flex-row items-center p-4 border-b border-gray-200">
//         <TouchableOpacity onPress={() => router.back()} className="mr-4">
//           <Ionicons name="arrow-back" size={24} color="#000" />
//         </TouchableOpacity>
//         <Image
//           source={{ uri: thread.participant.avatar }}
//           className="w-10 h-10 rounded-full mr-3"
//         />
//         <View>
//           <Text className="text-lg font-semibold">
//             {thread.participant.name}
//           </Text>
//           <Text className="text-sm text-gray-500">
//             {thread.participant.online ? "Đang hoạt động" : "Ngoại tuyến"}
//           </Text>
//         </View>
//       </View>

//       {/* Messages */}
//       <FlatList
//         ref={flatListRef}
//         data={thread.messages}
//         renderItem={({ item }: { item: Message }) => (
//           <MessageBubble
//             message={item}
//             isOwnMessage={item.senderId === user?.id}
//           />
//         )}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={{ padding: 16 }}
//         onContentSizeChange={scrollToBottom}
//       />

//       {/* Input */}
//       <ChatInput onSend={handleSend} />
//     </View>
//   );
// };

export default ChatScreen;
