import { Text, View, FlatList, Image } from "react-native";
import React, { useEffect, useState } from "react";
import ActivityLogApi from "@/api/activityLogApi";
import { useUserStore } from "@/stores/user-store";
import { formatDateTimeVN, formatTimestamp } from "@/utils/dateFormat";
import { formatDecimalToWhole } from "@/utils/priceFormat";
import { ActivityLogInterface } from "@/types/activityLog";

const ListBill = () => {
  const activityLogApi = new ActivityLogApi();
  const { user } = useUserStore();
  const [bills, setBills] = useState<ActivityLogInterface[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await activityLogApi.GetAllBillByUserId(user?.id as string);
      setBills(res || []);
    } catch (error) {
      console.error("Error fetching bills:", error);
      setBills([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: string | null) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-orange-500";
      case "confirmed":
        return "bg-green-500";
      case "reject":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const formatAmount = (note: string | null) => {
    if (!note) return "0 đ";
    return `${formatDecimalToWhole(note)} đ`;
  };

  const renderBillItem = ({ item }: { item: ActivityLogInterface }) => (
    <View className="bg-white rounded-xl p-4 mb-3 shadow-sm">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-base font-semibold text-gray-800">
          Mã đơn: {item.id?.slice(0, 13) || "N/A"}
        </Text>
        <View className={`px-3 py-1 rounded-full ${getStatusColor(item.temp)}`}>
          <Text className="text-xs font-medium text-white capitalize">
            {item.temp || "pending"}
          </Text>
        </View>
      </View>
      
      <View className="mt-2">
        <Text className="text-sm text-gray-600 mb-1">
          Ngày gửi : {item.createAt ? formatDateTimeVN(item.createAt) : "Chưa có thời gian"}
        </Text>
        <Text className="text-lg font-semibold text-blue-500">
          {formatAmount(item.note)}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Đang tải...</Text>
      </View>
    );
  }

  if (!bills.length) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Chưa có hóa đơn nào</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={bills}
        renderItem={renderBillItem}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        onRefresh={fetchData}
        refreshing={loading}
      />
    </View>
  );
};

export default ListBill;
