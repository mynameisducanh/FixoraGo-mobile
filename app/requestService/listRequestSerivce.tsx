import { Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { formatTimestamp } from "@/utils/dateFormat";
import { useRouter } from "expo-router";
import RequestServiceApi from "@/api/requestService";
import { useUserStore } from "@/stores/user-store";
import { statusMap } from "@/utils/function";
import { Ionicons } from "@expo/vector-icons";

const Activate = () => {
  const router = useRouter();
  const requestService = new RequestServiceApi();
  const { user } = useUserStore();
  const [activeData, setActiveData] = useState([]);
  const handleReorder = (item) => {
    console.log("đã chọn ", item.id);
    router.push({
      pathname: "/requestService/detail",
      params: { idRequest: item.id },
    });
  };

  const fetchDataActive = async () => {
    try {
      let res;
      if (user?.roles === "system_user") {
        res = await requestService.getListServiceByUserId(user?.id as string);
      }
      if (user?.roles === "system_fixer") {
        res = await requestService.getListServiceByFixerId(user?.id as string);
      }
      if (res) {
        setActiveData(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchDataActive();
    };
    fetchData();
  }, []);
  const renderItem = ({ item }) => {
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
    <View className="h-full bg-white mt-5 pt-3">
      <View className="">{/* Bộ lọc */}</View>
      <View className="px-5 -mt-12 pt-6 bg-background rounded-t-3xl">
        <FlatList
          data={activeData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

export default Activate;
