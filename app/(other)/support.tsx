import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const Support = () => {
  const router = useRouter();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "Làm thế nào để đặt lịch sửa chữa?",
      answer:
        "Để đặt lịch sửa chữa, bạn thực hiện các bước sau:\n\n" +
        "1. Chọn dịch vụ cần sửa chữa\n" +
        "2. Chọn thời gian phù hợp\n" +
        "3. Mô tả chi tiết vấn đề\n" +
        "4. Xác nhận đặt lịch và thanh toán",
    },
    {
      question: "Tôi có thể hủy lịch hẹn không?",
      answer:
        "Bạn có thể hủy lịch hẹn trước 1 giờ mà không bị phí. Để hủy lịch:\n\n" +
        "1. Vào mục 'Lịch hẹn của tôi'\n" +
        "2. Chọn lịch cần hủy\n" +
        "3. Nhấn nút 'Hủy lịch'\n" +
        "4. Xác nhận hủy lịch",
    },
    {
      question: "Làm sao để liên hệ với kỹ thuật viên?",
      answer:
        "Bạn có thể liên hệ với kỹ thuật viên qua:\n\n" +
        "- Chat trực tiếp trong ứng dụng\n" +
        "- Gọi điện qua số điện thoại được cung cấp\n" +
        "- Email hỗ trợ: support@fixorago.com",
    },
    {
      question: "Phương thức thanh toán nào được chấp nhận?",
      answer:
        "Fixorago chấp nhận các phương thức thanh toán:\n\n" +
        "- Thanh toán trực tuyến qua thẻ ngân hàng\n" +
        "- Ví điện tử (Momo, ZaloPay, VNPay)\n" +
        "- Thanh toán tiền mặt khi hoàn thành dịch vụ",
    },
    {
      question: "Tôi có thể đánh giá kỹ thuật viên không?",
      answer:
        "Sau khi hoàn thành dịch vụ, bạn có thể:\n\n" +
        "1. Đánh giá chất lượng dịch vụ\n" +
        "2. Để lại nhận xét về kỹ thuật viên\n" +
        "3. Chấm điểm từ 1-5 sao\n" +
        "4. Gửi phản hồi để chúng tôi cải thiện",
    },
    {
      question: "Làm sao để trở thành đối tác của Fixorago?",
      answer:
        "Để trở thành đối tác, bạn cần:\n\n" +
        "1. Đăng ký tài khoản kỹ thuật viên\n" +
        "2. Cung cấp chứng chỉ hành nghề\n" +
        "3. Hoàn thành khóa đào tạo\n" +
        "4. Đạt yêu cầu đánh giá chất lượng",
    },
  ];

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-6">Câu hỏi thường gặp</Text>

        {faqs.map((faq, index) => (
          <View key={index} className="mb-4">
            <TouchableOpacity
              className="flex-row items-center justify-between p-4 bg-gray-50 rounded-lg"
              onPress={() => toggleExpand(index)}
            >
              <Text className="flex-1 text-base font-medium text-gray-800">
                {faq.question}
              </Text>
              <Ionicons
                name={expandedIndex === index ? "chevron-up" : "chevron-down"}
                size={20}
                color="#4B5563"
              />
            </TouchableOpacity>

            {expandedIndex === index && (
              <View className="p-4 bg-white border border-gray-100 rounded-lg mt-1">
                <Text className="text-base text-gray-700 leading-6">
                  {faq.answer}
                </Text>
              </View>
            )}
          </View>
        ))}

        <View className="mt-6 p-4 bg-blue-50 rounded-lg">
          <Text className="text-base text-gray-700 mb-2">
            Vẫn còn thắc mắc? Liên hệ với chúng tôi:
          </Text>
          <View className="flex-row items-center">
            <Ionicons name="mail-outline" size={20} color="#3B82F6" />
            <Text className="ml-2 text-blue-600">support@fixorago.com</Text>
          </View>
          <View className="flex-row items-center mt-2">
            <Ionicons name="call-outline" size={20} color="#3B82F6" />
            <Text className="ml-2 text-blue-600">1900 1234</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Support;
