import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useUserStore } from "@/stores/user-store";
import ReviewApi from "@/api/reviewApi";
import { Ionicons } from "@expo/vector-icons";
import { formatDateTimeVN } from "@/utils/dateFormat";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";
import UserDetailModal from "@/components/review/UserDetailModal";
import Avatar from "@/components/others/Avatar";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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

const ReviewList = () => {
  const { user } = useUserStore();
  const reviewApi = new ReviewApi();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"received" | "given">("received");
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string>("");

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setReviews([]);
      let response;
      if (user?.roles === "system_fixer") {
        if (activeTab === "received") {
          response = await reviewApi.getListReviewFixerId(user.id);
        } else {
          response = await reviewApi.getListReviewUserId(user.id);
        }
      } else {
        response = await reviewApi.getListReviewUserId(user?.id as string);
      }
      if (response && Array.isArray(response)) {
        console.log("response", response);
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

  useEffect(() => {
    fetchReviews();
  }, [activeTab]);

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

  const handleUserPress = (userId: string) => {
    setSelectedUserId(userId);
    setShowUserDetail(true);
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

  return (
    <View className="flex-1 bg-gray-50">
      <BackButton />
      <InfoButton />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: hp(5),
        }}
        className="flex-1 pt-28"
      >
        {user?.roles === "system_fixer" && (
          <View className="flex-row justify-center mb-4">
            <TouchableOpacity
              onPress={() => setActiveTab("received")}
              className={`px-6 py-2 rounded-l-xl border ${
                activeTab === "received"
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "received" ? "text-white" : "text-gray-700"
                }`}
              >
                Đánh giá về tôi
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setActiveTab("given")}
              className={`px-6 py-2 rounded-r-xl border ${
                activeTab === "given"
                  ? "bg-primary border-primary"
                  : "bg-white border-gray-300"
              }`}
            >
              <Text
                className={`font-semibold ${
                  activeTab === "given" ? "text-white" : "text-gray-700"
                }`}
              >
                Đánh giá của tôi
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="px-4">
          {loading ? (
            <View className="flex-1 justify-center items-center py-8">
              <ActivityIndicator size="large" color="#3b82f6" />
            </View>
          ) : reviews.length > 0 ? (
            reviews.map(renderReviewItem)
          ) : (
            <View className="flex-1 justify-center items-center py-8">
              <Text className="text-gray-500 text-center">
                {user?.roles === "system_fixer"
                  ? activeTab === "received"
                    ? "Chưa có đánh giá nào về bạn"
                    : "Bạn chưa đánh giá dịch vụ nào"
                  : "Bạn chưa có đánh giá nào"}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <UserDetailModal
        visible={showUserDetail}
        onClose={() => setShowUserDetail(false)}
        userId={selectedUserId}
      />
    </View>
  );
};

export default ReviewList;
