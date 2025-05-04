import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const statusMap = {
  pending: {
    label: "Chờ xử lý",
    color: "text-yellow-500",
    icon: "time-outline",
  },
  done: {
    label: "Hoàn thành",
    color: "text-green-500",
    icon: "checkmark-circle-outline",
  },
  cancel: {
    label: "Đã hủy",
    color: "text-red-500",
    icon: "close-circle-outline",
  },
};

const RequestDetail = () => {
  const router = useRouter();
  const request = {
    id: "59ba55d3-f705-476c-bcba-f5b437fafa23",
    userId: 1231213,
    staffId: null,
    nameService: "Sửa chữa, thay mới đường điện",
    listDetailService: "Tại nhà riêng",
    priceService: "Hệ thống điện âm tường",
    note: "",
    status: "pending",
    createAt: "2025-05-04T15:01:02.997Z",
    updateAt: "2025-05-04T15:01:02.997Z",
    deleteAt: null,
  };

  const statusInfo = statusMap[request.status] || {
    label: request.status || "Không xác định",
    color: "text-gray-500",
    icon: "help-circle-outline",
  };

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="p-2 mr-2">
          <Ionicons name="arrow-back" size={24} color="#222" />
        </TouchableOpacity>
        <Text className="text-lg font-bold">Chi tiết yêu cầu</Text>
      </View>
      <ScrollView className="flex-1 px-4 py-6">
        <View className="items-center mb-6">
          <Ionicons
            name={statusInfo.icon as any}
            size={56}
            className={statusInfo.color}
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
          <Text className={`mt-2 text-xl font-bold ${statusInfo.color}`}>
            {statusInfo.label}
          </Text>
        </View>
        <View className="bg-gray-50 rounded-2xl p-4 mb-4 shadow">
          <InfoRow label="Tên dịch vụ" value={request.nameService} />
          <InfoRow label="Phân loại" value={request.listDetailService} />
          <InfoRow label="Chi tiết thiết bị" value={request.priceService} />
          <InfoRow label="Ghi chú" value={request.note || "Không có"} />
          <InfoRow
            label="Ngày tạo"
            value={new Date(request.createAt).toLocaleString("vi-VN")}
          />
          <InfoRow
            label="Cập nhật"
            value={new Date(request.updateAt).toLocaleString("vi-VN")}
          />
          <InfoRow label="Mã yêu cầu" value={request.id} />
        </View>
      </ScrollView>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
    <Text className="text-gray-500 font-medium">{label}</Text>
    <Text className="text-gray-900 font-semibold max-w-[60%] text-right">
      {value}
    </Text>
  </View>
);

export default RequestDetail;
