import {
  View,
  Text,
  Image,
  ScrollView,
  useWindowDimensions,
} from "react-native";
import React from "react";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import HTMLView from "react-native-htmlview";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import RenderHTML from "react-native-render-html";
const DetailNews = () => {
  const { width } = useWindowDimensions();
  const news = {
    title: "Công nghệ AI đang thay đổi thế giới",
    date: "06/03/2025",
    views: 1250,
    image:
      "https://res.cloudinary.com/di6tygnb5/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1740975527/cld-sample-4.jpg",
    content: ` <img src="https://res.cloudinary.com/di6tygnb5/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1740975527/cld-sample-4.jpg"  style="width:100%;max-width:600px;margin-bottom:20px;" alt="VinaCAD Image" /> <p>Chào Duc Anh,</p><p>Chúng tôi xin gửi lời cảm ơn đặc biệt đến bạn về sự quan tâm của bạn đối với các tính năng, tiện ích mới trên VinaCAD.</p><p>Chúng tôi rất vui thông báo rằng bạn đã được cấp quyền sử dụng license hoặc license dùng thử có thời hạn của chúng tôi. Dưới đây là thông tin chi tiết:</p><p><strong>1. License:</strong></p><p>Loại giấy phép: <strong>Dùng thử</strong></p><p>Thời hạn: <strong>3 tháng</strong></p><p>Mã kích hoạt: <strong>229B8-306D2-63AD-9CF0-09417</strong></p><p>Sản phẩm: <strong>TakaCAD</strong></p><p><strong>2. Dùng Thử:</strong></p><p>Thời hạn dùng thử: <strong>2024-04-16</strong></p><p><strong>2. Hướng dẫn truy cập:</strong></p><p>Nhập License Key: Đăng nhập tài khoản của bạn trên ứng dụng VinaCAD bằng email mà hiện tại bạn đang sử dụng cho yêu cầu license.</p><p>Kích hoạt: Sau khi đăng nhập thành công bằng tài khoản email của bạn, key được cấp sẽ tự động kích hoạt trên tài khoản sử dụng.</p><p>Một lần nữa, cảm ơn bạn đã chọn VinaCAD và hy vọng bạn sẽ có trải nghiệm tuyệt vời với sản phẩm của chúng tôi.</p><p><br></p><p>Trân trọng,</p><p>Đội ngũ VinaCAD</p><p>SĐT: 0377.359.728</p><p>Email: <a href="mailto:vinacad@prima-sol.com" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">vinacad@prima-sol.com</a></p>`,
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <BackButton />
      <InfoButton />

      <Image
        source={{ uri: news.image }}
        className="w-full h-72 rounded-lg"
        resizeMode="cover"
      />
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          {news.title}
        </Text>

        <View className="flex-row items-center justify-between mt-2">
          <View className="flex-row items-center">
            <EvilIcons name="clock" size={14} color="black" />
            <Text className="text-gray-500 text-sm">{news.date}</Text>
          </View>
          <Text className="text-gray-500 text-sm">{news.views} lượt xem</Text>
        </View>
        <View className="mt-4">
          <RenderHTML contentWidth={width} source={{ html: news.content }} />
        </View>
      </View>
    </ScrollView>
  );
};

export default DetailNews;
