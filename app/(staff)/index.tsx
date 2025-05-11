import { Text, View, ScrollView, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Overview from "@/components/staff/overview";
import Categories from "@/components/staff/Categories";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/user-store";
import RequestServiceApi from "@/api/requestService";
import { formatDateTimeVN } from "@/utils/dateFormat";

interface RequestData {
  id: string;
  nameService: string;
  listDetailService: string;
  priceService: string;
  address: string;
  calender: string;
  note: string;
  status: "pending" | "rejected" | "approved" | "completed" | "guarantee";
  fileImage: string | null;
  createAt: number;
  updateAt: number;
  userId: string;
  fixerId: string | null;
}

type IconName =
  | "time-outline"
  | "close-circle-outline"
  | "checkmark-circle-outline"
  | "shield-checkmark-outline"
  | "help-circle-outline";

interface StatusInfo {
  label: string;
  color: string;
  icon: IconName;
}

const statusMap: Record<RequestData["status"], StatusInfo> = {
  pending: { label: "Chờ xử lý", color: "#facc15", icon: "time-outline" },
  rejected: { label: "Đã hủy", color: "#ef4444", icon: "close-circle-outline" },
  approved: {
    label: "Đã duyệt",
    color: "#22c55e",
    icon: "checkmark-circle-outline",
  },
  completed: {
    label: "Hoàn thành",
    color: "#16a34a",
    icon: "checkmark-circle-outline",
  },
  guarantee: {
    label: "Bảo hành",
    color: "#3b82f6",
    icon: "shield-checkmark-outline",
  },
};

interface RequestCardProps {
  data: RequestData;
  onPress: () => void;
}

const RequestCard: React.FC<RequestCardProps> = ({ data, onPress }) => {
  const status = statusMap[data.status] || {
    label: data.status,
    color: "#6b7280",
    icon: "help-circle-outline",
  };

  let imageUrl = null;
  if (data.fileImage) {
    try {
      const arr = JSON.parse(data.fileImage);
      if (Array.isArray(arr) && arr.length > 0) imageUrl = arr[0];
    } catch {}
  }

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3"
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingBottom: 50,
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-3">
          <Text
            className="text-lg font-bold text-gray-900 mb-1"
            numberOfLines={1}
          >
            {data.nameService}
          </Text>
          <Text className="text-gray-500 text-sm mb-1" numberOfLines={1}>
            {data.listDetailService} - {data.priceService}
          </Text>
        </View>
      </View>

      <View className="flex-row items-start mb-2">
        <Ionicons
          name="location-outline"
          size={18}
          color="#6b7280"
          style={{ marginTop: 2 }}
        />
        <Text className="text-gray-600 text-sm flex-1 ml-2" numberOfLines={2}>
          {data.address}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        <Text className="text-gray-600 text-sm ml-2">{data.calender}</Text>
      </View>

      <View className="flex-row items-start">
        <Ionicons
          name="chatbubble-outline"
          size={18}
          color="#6b7280"
          style={{ marginTop: 2 }}
        />
        <Text className="text-gray-500 text-sm ml-2 flex-1" numberOfLines={2}>
          {data.note ? data.note : "Trống"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const HomeStaff = () => {
  const router = useRouter();
  const requestService = new RequestServiceApi();
  const [activeData, setActiveData] = useState<RequestData[]>([]);
  const { user } = useUserStore();

  const onCatChanged = (category: string) => {
    console.log(category);
  };

  const fetchDataActive = async () => {
    try {
      const filterParams = {
        nameService: "Điều hòa",
        sortTime: "NEWEST",
      };

      const res = await requestService.getAllPendingOrRejected(filterParams);
      if (res) {
        setActiveData(res);
      }
    } catch (error) {
      console.log("Lỗi khi fetch:", error);
    }
  };

  useEffect(() => {
    fetchDataActive();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-4 pt-14"
      >
        <Overview />

        <View className="px-4 mt-3">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-gray-900">
              Danh sách yêu cầu
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/post/ListPost")}
              className="bg-blue-50 p-3 items-center rounded-full"
            >
              <Text className="text-blue-600 font-semibold">Xem thêm</Text>
            </TouchableOpacity>
          </View>

          <Categories onCategoryChanged={onCatChanged} />

          <View className="mt-4">
            {activeData.map((item) => (
              <RequestCard
                key={item.id}
                data={item}
                onPress={() =>
                  router.push(`/requestService/detail?idRequest=${item.id}`)
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HomeStaff;
