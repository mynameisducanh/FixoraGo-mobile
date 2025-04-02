// Thông tin người dùng tham gia cuộc trò chuyện
export interface Participant {
  id: string;
  name: string;
  avatar: string;
  online: boolean;
}

// Thông tin tin nhắn
export interface Message {
  id: string;
  content: string;
  senderId: string;
  createdAt: string;
  updatedAt: string;
}

// Thông tin cuộc trò chuyện
export interface MessageThread {
  id: string;
  participant: Participant;
  messages: Message[];
  unreadCount: number;
  lastMessageAt: string;
  createdAt: string;
  updatedAt: string;
}
