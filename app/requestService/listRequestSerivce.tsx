import { Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { formatTimestamp } from "@/utils/dateFormat";
import { useRouter } from "expo-router";
import RequestServiceApi from "@/api/requestService";

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
      const res = await requestService.getListServiceByUserId("123");
      console.log(res);
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
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleReorder(item)}
      className="rounded-lg mb-3 p-2"
    >
      <View className="flex-row items-center gap-1">
        <View className="flex-1">
          <Text
            numberOfLines={2}
            ellipsizeMode="tail"
            className="text-lg font-bold"
          >{`Dịch vụ ${item.nameService}`}</Text>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            className="text-lg "
          >{`${item.listDetailService}`}</Text>
          <Text className="text-gray-500 mt-1">
            {formatTimestamp(item.createAt)}
          </Text>
        </View>
        <Text className="w-[90px] text-lg font-bold text-green-600">
          {item.status}
        </Text>
      </View>
      {/* <TouchableOpacity  className="mt-2">
        <Text className="text-blue-500 text-lg font-semibold">Xem thêm thông tin</Text>
      </TouchableOpacity> */}
    </TouchableOpacity>
  );

  return (
    <View className="h-full bg-white mt-5">
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
