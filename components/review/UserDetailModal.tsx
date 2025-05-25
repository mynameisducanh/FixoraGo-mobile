import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import UserApi from "@/api/userApi";
import Avatar from "@/components/others/Avatar";

interface UserDetailModalProps {
  visible: boolean;
  onClose: () => void;
  userId: string;
}

const UserDetailModal = ({ visible, onClose, userId }: UserDetailModalProps) => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const userApi = new UserApi();

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await userApi.getByUserId(userId);
      if (response) {
        setUserData(response);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchUserData();
    }
  }, [visible, userId]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View
          style={{ height: hp(60), width: wp(90) }}
          className="bg-white rounded-2xl"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            <Text className="text-xl font-semibold text-gray-900">Thông tin người dùng</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#4b5563" />
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 p-4">
            {loading ? (
              <View className="flex-1 justify-center items-center py-8">
                <ActivityIndicator size="large" color="#3b82f6" />
              </View>
            ) : userData ? (
              <View className="space-y-4">
                {/* Avatar and Name */}
                <View className="items-center">
                  {userData.avatarurl ? (
                    <Image
                      source={{ uri: userData.avatarurl }}
                      className="w-24 h-24 rounded-full mb-4"
                      resizeMode="cover"
                    />
                  ) : (
                    <Avatar size={96} username={userData.username} />
                  )}
                  <Text className="text-2xl font-bold text-gray-900">
                    {userData.fullName || userData.username}
                  </Text>
                </View>

                {/* User Info */}
                <View className="space-y-3">
                  <InfoItem label="Email" value={userData.email} />
                  <InfoItem label="Số điện thoại" value={userData.phonenumber} />
                  <InfoItem label="Địa chỉ" value={userData.address} />
                  <InfoItem label="Giới tính" value={userData.gioitinh} />
                  <InfoItem label="Ngày tạo" value={new Date(userData.createAt).toLocaleDateString()} />
                </View>
              </View>
            ) : (
              <View className="flex-1 justify-center items-center py-8">
                <Text className="text-gray-500 text-center">
                  Không tìm thấy thông tin người dùng
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
    <Text className="text-gray-500 font-medium">{label}</Text>
    <Text className="text-gray-900 font-semibold">{value || "Không có"}</Text>
  </View>
);

export default UserDetailModal; 