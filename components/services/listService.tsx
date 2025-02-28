import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { categoryData } from "@/temp/service";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import splashIcon from "../../assets/icons/plumbing-icon.json";
const ListService = ({ activeCategory, setActiveCategory }) => {
  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <View className="flex flex-row justify-between items-center m-5">
        <Text className="text-lg font-bold">Dịch vụ</Text>
        <Text className="text-textBlue font-semibold">Xem tất cả</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {categoryData.map((cat, index) => {
          let isActive = cat.name == activeCategory;
          let activeButtonClass = isActive ? "bg-primary" : "bg-black/10";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveCategory(cat.name)}
              className="flex items-center space-y-1 mr-3"
            >
              <View className={"rounded-full p-[6px] " + activeButtonClass}>
                <LottieView
                  source={cat.image}
                  autoPlay
                  loop
                  style={{ width: hp(6), height: hp(6) }}
                />
              </View>
              <Text className="text-neutral-600" style={{ fontSize: hp(1.6) }}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default ListService;

const styles = StyleSheet.create({});
