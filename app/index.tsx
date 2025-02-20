import React, { useState } from "react";
import {
  FlatList,
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

// Lấy thông tin kích thước màn hình
const { width, height } = Dimensions.get("window");

export default function Page() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  // Dữ liệu nội dung cho mỗi slide
  const slides = [
    { key: "1", title: "Welcome to App", subtitle: "This is slide 1" },
    // { key: "2", title: "Feature 1", subtitle: "This is slide 2" },
    // { key: "3", title: "Feature 2", subtitle: "This is slide 3" },
    // { key: "4", title: "Get Started", subtitle: "This is slide 4" },
  ];

  const handleViewableItemsChanged = ({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  };

  const renderItem = ({ item }: { item: { key: string; title: string; subtitle: string } }) => (
    <View
      style={{ width: width, height: height }}
      className="w-full h-full justify-center items-center rounded-xl p-5"
    >
      <Text className="text-3xl font-bold">{item.title}</Text>
      <Text className="text-lg text-gray-600 mt-2">{item.subtitle}</Text>
    </View>
  );

  const renderDot = (index: number) => {
    return (
      <TouchableOpacity
        key={index}
        className={`w-2.5 h-2.5 m-1.5 rounded-full ${
          currentIndex === index ? "bg-blue-500" : "bg-gray-400"
        }`}
        onPress={() => setCurrentIndex(index)}
      />
    );
  };

  return (
    <View
      style={{ width: width, height: height }}
      className="flex-1 justify-center items-center bg-white"
    >
      <FlatList
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        keyExtractor={(item) => item.key}
        scrollEnabled={currentIndex < slides.length - 1}
      />
      {currentIndex === 0 && (
        <View className="mt-5 w-4/5">
          <Button
            title="Go to Home Page"
            onPress={() => router.push("/(tabs)")}
          />
          <Button
            title="Go to Sign in"
            onPress={() => router.push("/(auth)/login")}
          />
        </View>
      )}
      {/* Render các nút chấm ở dưới */}
      <View className="flex-row justify-center items-center mt-5 mb-10">
        {slides.map((_, index) => renderDot(index))}
      </View>
    </View>
  );
}
