import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Animated, { FadeInDown } from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { IconLottieInterface } from "@/types";
import IconServiceApi from "@/api/iconService";
import ShimmerPlaceholder from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';
import BackButton from "@/components/buttonDefault/backButton";

const ListServiceForUser = () => {
  const router = useRouter();
  const [animations, setAnimations] = useState<Record<string, any>>({});
  const [listIcons, setListIcons] = useState<IconLottieInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const api = new IconServiceApi();

  // Phân loại dịch vụ
  const popularServices = listIcons.slice(0, 3);
  const newServices = listIcons.slice(0, 9); 
  const otherServices = listIcons.slice(10); 

  useEffect(() => {
    const fetchAnimations = async () => {
      try {
        setLoading(true);
        const res = await api.getAll();
        setListIcons(res);

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
      } finally {
        setLoading(false);
      }
    };

    fetchAnimations();
  }, []);

  const ServiceSection = ({ title, services }: { title: string; services: IconLottieInterface[] }) => (
    <Animated.View entering={FadeInDown.duration(500).springify()} className="mb-6">
      <View className="mx-5 mb-4">
        <Text className="text-xl font-bold text-neutral-800">{title}</Text>
      </View>
      <View className="px-5">
        {loading ? (
          // Shimmer loading effect in grid
          <View className="flex-row flex-wrap ">
            {Array.from({ length: 6 }).map((_, index) => (
              <View key={index} className="items-center mb-6" style={{ width: wp(28) }}>
                <ShimmerPlaceholder
                  LinearGradient={LinearGradient}
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 35,
                    marginBottom: 8,
                  }}
                />
                <ShimmerPlaceholder
                  LinearGradient={LinearGradient}
                  style={{
                    width: wp(25),
                    height: 14,
                    borderRadius: 7,
                  }}
                />
              </View>
            ))}
          </View>
        ) : (
          <View className="flex-row flex-wrap ">
            {services.map((service, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  router.push({
                    pathname: "/service/detailService",
                    params: { idService: service.idService },
                  });
                }}
                className="items-center mb-6"
                style={{ width: wp(28) }}
              >
                <View className="bg-primary/10 rounded-full p-3 mb-2">
                  {animations[service.name] && (
                    <LottieView
                      source={animations[service.name]}
                      autoPlay
                      loop
                      style={{ width: 50, height: 50 }}
                    />
                  )}
                </View>
                <Text className="text-neutral-600 text-center" style={{ width: wp(25) }}>
                  {service.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </Animated.View>
  );

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <View className="pt-14">
        <BackButton />
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 , paddingTop:40 }}
      >
        <Text className="text-2xl font-bold text-neutral-800 mx-5 mb-6">
          Danh sách dịch vụ
        </Text>

        <ServiceSection title="Dịch vụ mới" services={popularServices} />
        <ServiceSection title="Tất cả dịch vụ" services={newServices} />
      </ScrollView>
    </View>
  );
};

export default ListServiceForUser; 