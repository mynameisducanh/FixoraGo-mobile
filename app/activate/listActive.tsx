import { Text, View, FlatList, TouchableOpacity } from "react-native";
import React from "react";
import { formatTimestamp } from "@/utils/dateFormat";

const historyData = [
  {
    id: "1",
    nameService: "Sửa chữa, thay mới đường điện",
    listDetailService: "Kiểm tra và tư vấn sửa chữa",
    priceService: "20.000đ",
    time: 1742442116768,
  },
  {
    id: "2",
    nameService: "Sửa chữa, thay mới đường",
    listDetailService: "Kiểm tra và tư vấn sửa chữa",
    priceService: "30.000đ",
    time: 1742442116768,
  },
  {
    id: "3",
    nameService:
      "Sửa chữa, thay mới đường đường chữa, thay mới đường chữa, thay mới đường đường ",
    listDetailService: "Kiểm tra và tư vấn sửa chữa",
    priceService: "30.000đ",
    time: 1742442116768,
  },
];

const ListActive = () => {
  const handleReorder = (item) => {
    console.log("đã chọn ", item.id);
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleReorder(item)}
      className="rounded-xl mb-3 p-3 bg-white"
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
        <Text className="text-lg font-bold text-green-600">
          {item.priceService}
        </Text>
      </View>
      {/* <TouchableOpacity  className="mt-2">
         <Text className="text-blue-500 text-lg font-semibold">Xem thêm thông tin</Text>
       </TouchableOpacity> */}
    </TouchableOpacity>
  );
  return (
    <View className="h-full bg-gray-100 p-5">
      <View>
        {/* tạo bộ lọc */}
      </View>
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ListActive;
