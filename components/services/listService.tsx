import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { IconLottieInterface } from "@/types";
import { useRouter } from "expo-router";
import IconServiceApi from "@/api/iconService";

const ListService = () => {
  const [animations, setAnimations] = useState({});
  const [activeCategory, setActiveCategory] = useState<string | null>(
    "Điện"
  );
  const [listIcons, setlistIcons] = useState<IconLottieInterface[]>(
    []
  );
  const api = new IconServiceApi();
  const router = useRouter();
  useEffect(() => {
    const fetchAnimations = async () => {
      try {
        const res = await api.getAll();
        setlistIcons(res);

        const results = await Promise.allSettled(
          res.map(async (cat: any) => {
            const response = await fetch(cat.url);
            if (!response.ok) throw new Error(`Failed to load ${cat.name}`);
            const json = await response.json();
            return { [cat.name]: json };
          })
        );

        const fulfilledResults = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value);
        const animations = Object.assign({}, ...fulfilledResults);

        setAnimations(animations);
      } catch (error) {
        console.error("Lỗi khi tải icon động:", error);
      }
    };

    fetchAnimations();
  }, []);

  return (
    <Animated.View entering={FadeInDown.duration(500).springify()}>
      <View className="flex flex-row justify-between items-center m-5">
        <Text className="text-lg font-bold">Dịch vụ sửa chữa</Text>
        <Text className="text-textBlue font-semibold">Xem tất cả</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="space-x-4"
        contentContainerStyle={{ paddingHorizontal: 15 }}
      >
        {listIcons.map((cat, index) => {
          let isActive = cat.name == activeCategory;
          let activeButtonClass = isActive ? "bg-primary" : "bg-black/10";
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                setActiveCategory(cat.name);
                router.push({
                  pathname: "/service/detailService",
                  params: { idService: cat.idService },
                });
              }}
              className="flex items-center space-y-1 mr-3"
            >
              <View className={"rounded-full p-[6px] " + activeButtonClass}>
                {animations[cat.name] && (
                  <LottieView
                    key={
                      activeCategory === cat.name
                        ? "active"
                        : `inactive-${index}`
                    }
                    source={animations[cat.name]}
                    autoPlay={activeCategory === cat.name}
                    loop={activeCategory === cat.name}
                    style={{ width: 50, height: 50 }}
                  />
                )}
              </View>
              <Text className="text-neutral-600">{cat.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </Animated.View>
  );
};

export default ListService;

const styles = StyleSheet.create({});
