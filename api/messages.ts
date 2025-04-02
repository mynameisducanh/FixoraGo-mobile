import axios from "axios";
import { MessageThread, Message } from "../types/message";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Lấy danh sách các cuộc trò chuyện
export const getMessageThreads = async () => {
  const response = await axios.get<MessageThread[]>(
    `${API_URL}/messages/threads`
  );
  return response;
};

// Lấy thông tin chi tiết một cuộc trò chuyện
export const getMessageThread = async (threadId: string) => {
  const response = await axios.get<MessageThread>(
    `${API_URL}/messages/threads/${threadId}`
  );
  return response;
};

// Gửi tin nhắn mới
export const sendMessage = async (threadId: string, content: string) => {
  const response = await axios.post<Message>(
    `${API_URL}/messages/threads/${threadId}/messages`,
    {
      content,
    }
  );
  return response.data;
};

// Đánh dấu tin nhắn đã đọc
export const markThreadAsRead = async (threadId: string) => {
  const response = await axios.put(
    `${API_URL}/messages/threads/${threadId}/read`
  );
  return response;
};
