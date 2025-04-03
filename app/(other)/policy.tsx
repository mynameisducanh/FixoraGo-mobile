import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Policy = () => {
  const router = useRouter();

  const sections = [
    {
      title: "1. Giới thiệu",
      content:
        "Fixorago là nền tảng kết nối người dùng với các dịch vụ sửa chữa, bảo trì chuyên nghiệp. Chúng tôi cam kết mang đến trải nghiệm đặt lịch sửa chữa nhanh chóng, tiện lợi và đáng tin cậy.",
    },
    {
      title: "2. Điều khoản sử dụng",
      content:
        "Khi sử dụng Fixorago, bạn đồng ý tuân thủ các điều khoản sau:\n\n" +
        "- Cung cấp thông tin chính xác về vấn đề cần sửa chữa\n" +
        "- Tôn trọng thời gian làm việc của kỹ thuật viên\n" +
        "- Thanh toán đầy đủ theo báo giá đã thỏa thuận\n" +
        "- Không yêu cầu sửa chữa các thiết bị bất hợp pháp",
    },
    {
      title: "3. Chính sách đặt lịch",
      content:
        "- Đặt lịch trước tối thiểu 2 giờ\n" +
        "- Có thể hủy lịch trước 1 giờ mà không bị phí\n" +
        "- Đổi lịch miễn phí 1 lần trong vòng 24h\n" +
        "- Kỹ thuật viên sẽ đến đúng giờ hoặc báo trước nếu có thay đổi",
    },
    {
      title: "4. Chính sách bảo mật",
      content:
        "Fixorago cam kết bảo mật thông tin cá nhân của người dùng:\n\n" +
        "- Không chia sẻ thông tin cho bên thứ ba\n" +
        "- Mã hóa dữ liệu nhạy cảm\n" +
        "- Chỉ sử dụng thông tin cho mục đích cung cấp dịch vụ\n" +
        "- Tuân thủ quy định bảo mật của pháp luật",
    },
    {
      title: "5. Chính sách hoàn tiền",
      content:
        "- Hoàn tiền 100% nếu kỹ thuật viên không đến đúng hẹn\n" +
        "- Hoàn tiền theo thỏa thuận nếu dịch vụ không đạt yêu cầu\n" +
        "- Xử lý khiếu nại trong vòng 24h\n" +
        "- Bảo hành dịch vụ 30 ngày",
    },
  ];

  return (
    <View className="flex-1 bg-white">
      {/* Content */}
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Chính sách Fixorago</Text>

        {sections.map((section, index) => (
          <View key={index} className="mb-6">
            <Text className="text-lg font-semibold mb-2">{section.title}</Text>
            <Text className="text-base text-gray-700 leading-6">
              {section.content}
            </Text>
          </View>
        ))}

        <View className="mb-6">
          <Text className="text-base text-gray-500">
            Cập nhật lần cuối: 01/04/2024
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Policy;
