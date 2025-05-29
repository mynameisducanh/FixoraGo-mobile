import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, FlatList, Image } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import NotificationApi from '@/api/notificationApi';
import { formatDateTimeVN } from '@/utils/dateFormat';

interface Notification {
  id: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  content: string;
  imageUrl: string;
  actionUrl: string;
  createAt: string;
  readAt: string | null;
}

interface NotificationModalProps {
  visible: boolean;
  onClose: () => void;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onClose }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const notificationApi = new NotificationApi();

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getAllNotification();
      if (response?.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchNotifications();
    }
  }, [visible]);

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity 
      className={`p-4 border-b border-gray-200 ${item.status === 'UNREAD' ? 'bg-blue-50' : ''}`}
      onPress={() => {
        // Handle notification press
        if (item.actionUrl) {
          // Navigate to action URL
        }
      }}
    >
      <View className="flex-row items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
          <Text className="text-sm text-gray-600 mt-1">{item.content}</Text>
          <View className="flex-row items-center mt-2">
            <FontAwesome name="clock-o" size={12} color="#666" />
            <Text className="text-xs text-gray-500 ml-1">
              {formatDateTimeVN(item.createAt)}
            </Text>
            {item.status === 'UNREAD' && (
              <View className="ml-2 bg-blue-500 rounded-full px-2 py-0.5">
                <Text className="text-xs text-white">Mới</Text>
              </View>
            )}
          </View>
        </View>
        {item.imageUrl && (
          <Image
            source={{ uri: item.imageUrl }}
            className="w-12 h-12 rounded-lg ml-2"
            resizeMode="cover"
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <View className="flex-1 mt-20 bg-white rounded-t-3xl">
          <View className="p-4 border-b border-gray-200">
            <View className="flex-row justify-between items-center">
              <Text className="text-xl font-bold text-gray-800">Thông báo</Text>
              <TouchableOpacity onPress={onClose}>
                <FontAwesome name="times" size={24} color="#666" />
              </TouchableOpacity>
            </View>
          </View>

          {loading ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-gray-500">Đang tải...</Text>
            </View>
          ) : notifications.length === 0 ? (
            <View className="flex-1 justify-center items-center">
              <FontAwesome name="bell-o" size={48} color="#ccc" />
              <Text className="text-gray-500 mt-4">Không có thông báo mới</Text>
            </View>
          ) : (
            <FlatList
              data={notifications}
              renderItem={renderNotificationItem}
              keyExtractor={(item) => item.id}
              className="flex-1"
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default NotificationModal; 