import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { useLocalSearchParams } from 'expo-router';

const DetailActive = () => {
  const { id } = useLocalSearchParams();

  const serviceDetail = {
    nameService: "Sửa chữa điện",
    listDetailService: "Kiểm tra và sửa chữa hệ thống điện",
    priceService: "500.000đ",
    typeService: "Điện",
    note: "Khách hàng yêu cầu hoàn thành trong ngày",
    status: "Đã hoàn thành",
  };

  return (
    <View className="h-full bg-gray-100 p-5">
      <Text className="text-xl font-bold mb-3">Chi tiết dịch vụ</Text>
      <View className="bg-white p-4 rounded-lg shadow-md">
        <Text className="text-lg font-semibold">{serviceDetail.nameService}</Text>
        <Text className="text-gray-600 mt-2">{serviceDetail.listDetailService}</Text>
        <Text className="text-lg font-bold text-green-600 mt-2">Giá: {serviceDetail.priceService}</Text>
        <Text className="text-gray-500 mt-2">Loại dịch vụ: {serviceDetail.typeService}</Text>
        <Text className="text-gray-500 mt-2">Ghi chú: {serviceDetail.note}</Text>
        <Text className="text-gray-500 mt-2">Trạng thái: {serviceDetail.status}</Text>
      </View>

      {/* Nút hành động */}
      <View className="flex-row mt-5 gap-3">
        <TouchableOpacity className="flex-1 bg-blue-500 p-3 rounded-lg items-center">
          <Text className="text-white font-bold">Đánh giá của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-red-500 p-3 rounded-lg items-center">
          <Text className="text-white font-bold">Đặt lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DetailActive;
