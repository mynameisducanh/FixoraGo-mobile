import { Text, View, FlatList, TouchableOpacity, Image } from "react-native";
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

const Activate = () => {
  const router = useRouter();
  const requestService = new RequestServiceApi();
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
      const res = await requestService.getListServiceByUserId("670551b4-9c73-4895-840e-1ac7ea826dc1");
      console.log(res)
      if (res) {
        setActiveData(res);
      }
    } catch (error) {
      console.log(error);
    }
  };
 const statusInfo = statusMap[activeData?.status] || {
    label: activeData?.status || "Không xác định",
    color: "text-gray-500",
    icon: "help-circle-outline",
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
        <View className="flex-row items-center gap-1">
          <View className="flex-1">
            <Text numberOfLines={2} ellipsizeMode="tail" className="text-lg font-bold">
              {`Dịch vụ ${item.nameService}`}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" className="text-lg ">
              {`${item.listDetailService}`}
            </Text>
            <Text className="text-gray-500 mt-1">{formatTimestamp(item.createAt)}</Text>
          </View>
          <View className="items-center mb-6">
            <Ionicons
              name={statusInfo.icon as any}
              size={36}
              color={
                statusInfo.color === "text-yellow-500"
                  ? "#eab308"
                  : statusInfo.color === "text-green-500"
                  ? "#22c55e"
                  : statusInfo.color === "text-red-500"
                  ? "#ef4444"
                  : "#6b7280"
              }
            />
            <Text className={`mt-2 text-lg font-bold ${statusInfo.color}`}>
              {statusInfo.label}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="h-full bg-white">
      <View className="">
        <Image
          style={{ height: hp(32), width: wp(100) }}
          source={require("../../assets/images/hero-detail-test.jpg")}
        />
      </View>
      <View className="px-5 -mt-12 pt-6 bg-background rounded-t-3xl">
        <Text className="text-xl font-bold mb-3">Hoạt động gần đây</Text>
        <FlatList
          data={activeData.slice(0,3)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
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
    </View>
  );
};

export default Activate;
