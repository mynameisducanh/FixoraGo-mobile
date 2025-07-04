import {
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { formatTimestamp } from "@/utils/dateFormat";
import { useRouter } from "expo-router";
import RequestServiceApi from "@/api/requestService";
import { statusMap } from "@/utils/function";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/stores/user-store";

interface ServiceItem {
  id: string;
  nameService: string;
  listDetailService: string;
  createAt: string;
  status: keyof typeof statusMap;
  temp?: string;
}

const Activate = () => {
  const router = useRouter();
  const requestService = new RequestServiceApi();
  const [refreshing, setRefreshing] = useState(false);
  const [activeData, setActiveData] = useState<ServiceItem[]>([]);
  const { user } = useUserStore();

  const handleReorder = (item: ServiceItem) => {
    router.push({
      pathname: "/requestService/detail",
      params: { idRequest: item.id },
    });
  };

  const fetchDataActive = async () => {
    try {
      const res = await requestService.getListServiceByFixerId(
        user?.id as string
      );
      if (res) {
        setActiveData(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchDataActive();
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    console.log("onRefresh");
    await fetchDataActive();
    setRefreshing(false);
  }, []);

  const renderItem = ({ item }: { item: ServiceItem }) => {
    const statusInfo = statusMap[item.status] || {
      label: item.status || "Không xác định",
      color: "text-gray-500",
      icon: "help-circle-outline",
    };

    return (
      <TouchableOpacity
        onPress={() => handleReorder(item)}
        className="rounded-lg mb-3 p-2"
      >
        <View className="flex-row items-center justify-between gap-1">
          <View className="w-[70%]">
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              className="text-lg font-bold"
            >
              {`Dịch vụ ${item.nameService}`}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="text-lg ">
              {`${item.listDetailService}`}
            </Text>
            <Text className="text-gray-500 mt-1">
              Ngày tạo : {formatTimestamp(item.createAt)}
            </Text>
          </View>
          <View className="w-[30%]">
            <View className="items-center mb-6">
              <Ionicons
                name={statusInfo.icon as any}
                size={26}
                color={
                  statusInfo.color === "text-yellow-500"
                    ? "#eab308"
                    : statusInfo.color === "text-green-600"
                    ? "#22c55e"
                    : statusInfo.color === "text-blue-500"
                    ? "#3b82f6"
                    : statusInfo.color === "text-red-500"
                    ? "#ef4444"
                    : "#6b7280"
                }
              />
              <Text className={`mt-2 text-sm font-bold ${statusInfo.color}`}>
                {statusInfo.label}
              </Text>
              {item.temp && (
                <Text
                  numberOfLines={1}
                  ellipsizeMode="tail"
                  className="text-base text-blue-500"
                >
                  {`Ex :${item.temp}`}
                </Text>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView
      className="h-full bg-white flex-1"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#FFC107"]}
          tintColor="#FFC107"
          progressViewOffset={20}
          progressBackgroundColor="#ffffff"
          title="Đang tải..."
          titleColor="#FFC107"
        />
      }
    >
      {/* <View className="">
        <Image
          style={{ height: hp(32), width: wp(100) }}
          source={require("../../assets/images/hero-detail-test.jpg")}
        />
      </View> */}
      <View className="px-5 -mt-12 pt-6 bg-background mt-6">
        <Text className="text-xl font-bold mb-3">Hoạt động gần đây</Text>
        <View>
          {activeData.slice(0, 3).map((item) => (
            <View key={item.id}>
              {renderItem({ item })}
            </View>
          ))}
        </View>
      </View>
      <TouchableOpacity className="w-full mt-4">
        <Text
          onPress={() => {
            router.push({
              pathname: "/requestService/listRequestSerivce",
            });
          }}
          className="text-blue-500 text-lg font-semibold text-center "
        >
          Xem thêm lịch sử hoạt động
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Activate;
