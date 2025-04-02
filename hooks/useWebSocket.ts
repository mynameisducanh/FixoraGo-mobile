import { useEffect, useRef, useState } from "react";

interface WebSocketHook {
  lastMessage: any;
  sendMessage: (message: any) => void;
}

// Hook xử lý kết nối WebSocket
export const useWebSocket = (url: string): WebSocketHook => {
  const [lastMessage, setLastMessage] = useState<any>(null);
  const ws = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Khởi tạo kết nối WebSocket
    ws.current = new WebSocket(url);

    // Xử lý sự kiện khi kết nối thành công
    ws.current.onopen = () => {
      console.log("WebSocket connected");
    };

    // Xử lý sự kiện khi nhận được tin nhắn
    ws.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setLastMessage(message);
    };

    // Xử lý sự kiện khi có lỗi
    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Xử lý sự kiện khi đóng kết nối
    ws.current.onclose = () => {
      console.log("WebSocket disconnected");
    };

    // Cleanup khi component unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  // Hàm gửi tin nhắn
  const sendMessage = (message: any) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  return { lastMessage, sendMessage };
};
