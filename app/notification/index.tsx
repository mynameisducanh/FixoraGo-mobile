import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import NotificationApi from "@/api/notificationApi";
import { formatDateTimeVN } from "@/utils/dateFormat";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface Notification {
  id: string;
  type: string;
  priority: string;
  status: string;
  title: string;
  content: string;
  imageUrl: string;
  actionUrl: string;
  metadata: string;
  createAt: string;
  readAt: string | null;
}

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const notificationApi = new NotificationApi();
  const navigation = useNavigation();
  const router = useRouter();
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationApi.getAllNotification();
      if (response?.data) {
        setNotifications(response.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotificationItem = ({ item }: { item: Notification }) => (
    <TouchableOpacity
      className={`p-4 border-b border-gray-200 ${
        item.status === "UNREAD" ? "bg-blue-50" : ""
      }`}
      onPress={async () => {
        // Handle notification press
        const res = await notificationApi.markReadNotification(item.id);
        if (item.actionUrl) {
          // Navigate to action URL
          if (item.metadata) {
            router.push({
              pathname: `${item.actionUrl}`,
              params: { idRequest: item.metadata },
            });
          } else {
            router.push({
              pathname: `${item.actionUrl}`,
            });
          }
        }
      }}
    >
      <View className="flex-row items-start">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-800">
            {item.title}
          </Text>
          <Text className="text-sm text-gray-600 mt-1">{item.content}</Text>
          <View className="flex-row items-center mt-2">
            <FontAwesome name="clock-o" size={12} color="#666" />
            <Text className="text-xs text-gray-500 ml-1">
              {formatDateTimeVN(item.createAt)}
            </Text>
            {item.status === "UNREAD" && (
              <View className="ml-2 bg-blue-500 rounded-full px-2 py-0.5">
                <Text className="text-xs text-white">Chưa đọc</Text>
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
    <View className="flex-1 bg-white pt-14">
      {/* Header */}
      <View className="flex-row items-center p-4 border-b border-gray-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-gray-800">Thông báo</Text>
      </View>

      {/* Content */}
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </View>
  );
};

export default NotificationPage;
