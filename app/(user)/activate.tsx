import { Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { formatTimestamp } from "@/utils/dateFormat";
import { useRouter } from "expo-router";

const historyData = [
  {
    id: "1",
    nameService: "Sửa chữa, thay mới đường điện",
    listDetailService: "Kiểm tra và tư vấn sửa chữa",
    status: "Đang chờ",
    time: 1742442116768,
  },
  {
    id: "2",
    nameService: "Sửa chữa, thay mới đường",
    listDetailService: "Kiểm tra và tư vấn sửa chữa",
    status: "Đã nhận",
    time: 1746370507743,
  },
  {
    id: "3",
    nameService:
      "Sửa chữa, thay mới đường đường chữa, thay mới đường chữa, thay mới đường đường ",
    listDetailService: "Kiểm tra và tư vấn sửa chữa",
    status: "Hoàn thành",
    time: 1742442116768,
  },
];

const Activate = () => {
  const router = useRouter();

  const handleReorder = (item) => {
    console.log("đã chọn ", item.id);
    router.replace(`/requestService/detail?${item.id}`)
  };

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
            {formatTimestamp(item.time)}
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
          data={historyData.slice(0, 3)}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
      <TouchableOpacity className="w-full mt-4">
        <Text
          onPress={() => {
            router.push({
              pathname: "/activate/listActive",
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
