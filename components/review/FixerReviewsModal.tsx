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
import { formatDateTimeVN } from "@/utils/dateFormat";
import ReviewApi from "@/api/reviewApi";
import UserApi from "@/api/userApi";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Avatar from "@/components/others/Avatar";

interface FixerReviewsModalProps {
  visible: boolean;
  onClose: () => void;
  fixerId: string;
}

interface Review {
  id: string;
  createAt: string;
  updateAt: string;
  deleteAt: string | null;
  idRequestService: string;
  rating: number;
  comment: string;
  type: string;
  userId: string;
  fixerId: string;
  temp: string;
  senderId: string;
  senderFullName: string;
  senderUsername: string;
  senderAvatarUrl: string;
}

const FixerReviewsModal = ({
  visible,
  onClose,
  fixerId,
}: FixerReviewsModalProps) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [userData, setUserData] = useState<any>(null);
  const [userLoading, setUserLoading] = useState(false);
  const reviewApi = new ReviewApi();
  const userApi = new UserApi();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewApi.getListReviewFixerId(fixerId);
      console.log(response);
      if (response && Array.isArray(response)) {
        setReviews(response);
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (userId: string) => {
    try {
      setUserLoading(true);
      const response = await userApi.getByUserId(userId);
      if (response) {
        setUserData(response);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchReviews();
    }
  }, [visible, fixerId]);

  useEffect(() => {
    if (showUserDetail && selectedUserId) {
      fetchUserData(selectedUserId);
    }
  }, [showUserDetail, selectedUserId]);

  const handleUserPress = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserDetail(true);
  };

  const handleBack = () => {
    setShowUserDetail(false);
    setUserData(null);
  };

  const renderStars = (rating: number) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={16}
            color={star <= rating ? "#eab308" : "#d1d5db"}
          />
        ))}
      </View>
    );
  };

  const renderReviewItem = (review: Review) => (
    <View key={review.id} className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row items-center mb-3">
        <TouchableOpacity
          className="flex-row items-center flex-1"
          onPress={() => handleUserPress(review.senderId)}
        >
          {review.senderAvatarUrl ? (
            <Image
              source={{ uri: review.senderAvatarUrl }}
              className="w-10 h-10 rounded-full mr-3"
              resizeMode="cover"
            />
          ) : (
            <View className="mr-3">
              <Avatar size={40} username={review.senderUsername} />
            </View>
          )}
          <Text className="text-gray-900 font-medium">
            {review.senderFullName || review.senderUsername}
          </Text>
        </TouchableOpacity>
        <Text className="text-gray-500 text-sm">
          {formatDateTimeVN(review.createAt)}
        </Text>
      </View>
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1">{renderStars(review.rating)}</View>
      </View>
      {review.comment && (
        <Text className="text-gray-600 mt-2">{review.comment}</Text>
      )}
    </View>
  );

  const renderUserDetail = () => (
    <ScrollView className="flex-1 p-4">
      {userLoading ? (
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
          <View className="space-y">
            {/* <InfoItem label="Email" value={userData.email} /> */}
            {/* <InfoItem label="Số điện thoại" value={userData.phonenumber} /> */}
            <InfoItem label="Địa chỉ" value={userData.address} />
            <InfoItem label="Giới tính" value={userData.gioitinh} />
            <InfoItem
              label="Ngày tham gia"
              value={new Date(userData.createAt).toLocaleDateString()}
            />
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
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View
          style={{ height: hp(70), width: wp(90) }}
          className="bg-white rounded-2xl"
        >
          {/* Header */}
          <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
            {showUserDetail ? (
              <>
                <TouchableOpacity
                  onPress={handleBack}
                  className="flex-row items-center"
                >
                  <Ionicons name="arrow-back" size={24} color="#4b5563" />
                  <Text className="text-xl font-semibold text-gray-900 ml-2">
                    Thông tin người dùng
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text className="text-xl font-semibold text-gray-900">
                  Đánh giá của nhân viên
                </Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color="#4b5563" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {showUserDetail ? (
            renderUserDetail()
          ) : (
            <ScrollView className="flex-1 p-4">
              {loading ? (
                <View className="flex-1 justify-center items-center py-8">
                  <ActivityIndicator size="large" color="#3b82f6" />
                </View>
              ) : reviews.length > 0 ? (
                reviews.map(renderReviewItem)
              ) : (
                <View className="flex-1 justify-center items-center py-8">
                  <Text className="text-gray-500 text-center">
                    Chưa có đánh giá nào
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row gap-3 py-2 border-b border-gray-200 last:border-b-0">
    <Text className="text-gray-500 font-medium">{label}</Text>
    <Text
      style={{ maxWidth: 280 }}
      numberOfLines={2}
      ellipsizeMode="tail"
      className="text-gray-900 font-semibold"
    >
      {value || "Không có"}
    </Text>
  </View>
);

export default FixerReviewsModal;
