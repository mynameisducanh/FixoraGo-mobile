import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RequestServiceApi from "@/api/requestService";
import { formatDateTimeVN, formatTimestamp } from "@/utils/dateFormat";

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
  const requestServiceApi = new RequestServiceApi();
  const { idRequest } = useLocalSearchParams();
  const [requestData,setRequestData] = useState();
  console.log(idRequest);
  const fetchDataRequestDetail = async () => {
    try {
      const res = await requestServiceApi.getById(idRequest);
      if (res) {
        console.log(formatDateTimeVN(res?.createAt));
        setRequestData(res);
      }
    } catch (error) {}
  };

  useEffect(() => {
    const fetchData = async () =>{
      await fetchDataRequestDetail();
    }
    fetchData();
  }, []);
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

  const statusInfo = statusMap[requestData?.status] || {
    label: requestData?.status || "Không xác định",
    color: "text-gray-500",
    icon: "help-circle-outline",
  };

  return (
    <View className="flex-1 bg-white">
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
          <InfoRow label="Tên dịch vụ" value={requestData?.nameService} />
          <InfoRow label="Phân loại" value={requestData?.listDetailService} />
          <InfoRow label="Chi tiết thiết bị" value={requestData?.priceService} />
          <InfoRow label="Ghi chú" value={requestData?.note || "Không có"} />
          <InfoRow
            label="Ngày tạo"
            value={formatDateTimeVN(requestData?.createAt)}
          />
          <InfoRow
            label="Cập nhật"
            value={formatDateTimeVN(requestData?.updateAt)}
          />
          <InfoRow label="Mã yêu cầu" value={requestData?.id} />
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
