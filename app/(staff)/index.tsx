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
import { CustomMapView } from "@/components/MapView";

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
      key={data.id}
      className="bg-white rounded-xl p-4 mb-3"
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
  const [approvedRequest, setApprovedRequest] = useState<RequestData>();
  const [showMap, setShowMap] = useState(false);

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

  const getApprovedServiceByFixerId = async () => {
    try {
      const res = await requestService.getApprovedServiceByFixerId(
        user?.id as string
      );
      if (res.statusForFixer === "success") {
        setApprovedRequest(res.data);
        return;
      } else {
        fetchDataActive();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApprovedServiceByFixerId();
    // fetchDataActive();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        className="space-y-4 pt-14"
      >
        <Overview />

        {approvedRequest ? (
          <View key="approved-request" className="px-4 mt-3">
            <Text className="text-xl font-bold text-gray-900">
              Thông tin yêu cầu bạn đã nhận
            </Text>
            <View className="bg-yellow-50 p-4 rounded-xl mb-4 flex-row items-center mt-3">
              <Ionicons name="warning" size={24} color="#f59e0b" />
              <Text className="text-yellow-800 ml-2 flex-1">
                Bạn phải hoàn thành yêu cầu này trước khi nhận các yêu cầu khác
              </Text>
            </View>

            <View className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-4">
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-900">
                    {approvedRequest?.nameService}
                  </Text>
                  <Text className="text-gray-500 mt-1">
                    {approvedRequest?.listDetailService}
                  </Text>
                </View>
              </View>

              <View className="space-y-2 mb-4">
                <View className="flex-row items-center">
                  <Ionicons name="location" size={20} color="#6b7280" />
                  <Text className="text-gray-600 ml-2 flex-1">
                    {approvedRequest?.address}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Ionicons name="calendar" size={20} color="#6b7280" />
                  <Text className="text-gray-600 ml-2">
                    {approvedRequest?.calender}
                  </Text>
                </View>
              </View>
             <View className="flex-row justify-between">
               <TouchableOpacity
                className="bg-green-500 p-3 rounded-lg"
                onPress={() => setShowMap(true)}
              >
                <Text className="text-white font-semibold text-center">
                  Xem chỉ dẫn trên Map
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-primary p-3 rounded-lg"
                onPress={() => {
                  if (approvedRequest.id) {
                    router.push(
                      `/requestService/detail?idRequest=${approvedRequest.id}`
                    );
                  }
                }}
              >
                <Text className="text-white font-semibold text-center">
                  Xem chi tiết
                </Text>
              </TouchableOpacity>
             </View>
            </View>
          </View>
        ) : (
          <View key="request-list" className="px-4 mt-3">
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
        )}
      </ScrollView>
      <CustomMapView
        mode="route"
        visible={showMap}
        onClose={() => setShowMap(false)}
        destinationAddress={approvedRequest?.calender}
      />
    </View>
  );
};

export default HomeStaff;
