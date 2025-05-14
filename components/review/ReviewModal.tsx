import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useUserStore } from "@/stores/user-store";

// Predefined options for reviews
const SERVICE_REVIEW_OPTIONS = [
  "Dịch vụ nhanh chóng",
  "Nhân viên thân thiện",
  "Giá cả hợp lý",
  "Chất lượng tốt",
  "Đúng hẹn",
  "Tư vấn nhiệt tình",
];

const STAFF_REVIEW_OPTIONS = [
  "Thái độ phục vụ tốt",
  "Chuyên môn cao",
  "Nhiệt tình, chu đáo",
  "Đúng giờ hẹn",
  "Giải thích rõ ràng",
  "Tư vấn hữu ích",
];

interface ReviewModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (review: {
    rating: number;
    comment: string;
    type: string;
    fixerId?: string;
  }) => void;
  idRequestService: string;
  type: "service" | "staff";
  fixerId?: string;
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  visible,
  onClose,
  onSubmit,
  idRequestService,
  type,
  fixerId,
}) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const [hoveredStar, setHoveredStar] = useState(0);
  const { user } = useUserStore();
  const options =
    type === "service" ? SERVICE_REVIEW_OPTIONS : STAFF_REVIEW_OPTIONS;

  const handleOptionToggle = (option: string) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter((item) => item !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = () => {
    const finalComment =
      selectedOptions.length > 0
        ? `${selectedOptions.join(", ")}${comment ? ". " + comment : ""}`
        : comment;

    onSubmit({
      idRequestService,
      rating,
      comment: finalComment,
      type,
      ...(fixerId && { fixerId }),
    });

    // Reset form
    setRating(0);
    setComment("");
    setSelectedOptions([]);
    onClose();
  };

  const renderStars = () => {
    return (
      <View className="flex-row justify-center items-center space-x-2 my-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity
            key={star}
            onPress={() => setRating(star)}
            onPressIn={() => setHoveredStar(star)}
            onPressOut={() => setHoveredStar(0)}
          >
            <Ionicons
              name={star <= (hoveredStar || rating) ? "star" : "star-outline"}
              size={40}
              color={star <= (hoveredStar || rating) ? "#FFD700" : "#D1D5DB"}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  const renderRatingLabel = () => {
    const labels = {
      1: "Rất không hài lòng",
      2: "Không hài lòng",
      3: "Bình thường",
      4: "Hài lòng",
      5: "Rất hài lòng",
    };
    return rating > 0 ? (
      <Text className="text-center text-gray-600 mb-4">
        {labels[rating as keyof typeof labels]}
      </Text>
    ) : null;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <Animated.View
          entering={FadeIn}
          exiting={FadeOut}
          className="bg-white rounded-2xl w-[90%] max-h-[80%]"
        >
          <ScrollView className="p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-neutral-800">
                {type === "service" ? "Đánh giá dịch vụ" : "Đánh giá nhân viên"}
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-base text-gray-600 mb-2">
              Bạn hài lòng với {type === "service" ? "dịch vụ" : "nhân viên"}{" "}
              này như thế nào?
            </Text>

            {renderStars()}
            {renderRatingLabel()}

            <Text className="text-base font-medium text-gray-800 mb-2">
              Chọn các điểm nổi bật (có thể chọn nhiều)
            </Text>
            <View className="flex-row flex-wrap mb-4">
              {options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleOptionToggle(option)}
                  className={`mr-2 mb-2 px-3 py-2 rounded-full ${
                    selectedOptions.includes(option)
                      ? "bg-primary/10 border border-primary"
                      : "bg-gray-100"
                  }`}
                >
                  <Text
                    className={`${
                      selectedOptions.includes(option)
                        ? "text-primary"
                        : "text-gray-600"
                    }`}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-base font-medium text-gray-800 mb-2">
              Nhận xét thêm (không bắt buộc)
            </Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-3 min-h-[100px] text-base"
              placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
              multiline
              textAlignVertical="top"
              value={comment}
              onChangeText={setComment}
            />

            <TouchableOpacity
              onPress={handleSubmit}
              disabled={rating === 0}
              className={`mt-6 py-3 rounded-xl ${
                rating === 0 ? "bg-gray-300" : "bg-primary"
              }`}
            >
              <Text className="text-white text-center font-semibold text-base">
                Gửi đánh giá
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ReviewModal;
