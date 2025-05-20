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
import RequestCard from "@/components/staff/RequestCard";
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

const HomeStaff = () => {
  const router = useRouter();
  const requestService = new RequestServiceApi();
  const [activeData, setActiveData] = useState<RequestData[]>([]);
  const { user } = useUserStore();
  const [approvedRequest, setApprovedRequest] = useState<RequestData>();
  const [showMap, setShowMap] = useState(false);
  const [dataAddress, setDataAddress] = useState("");

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

            <RequestCard
              data={approvedRequest}
              onPress={() => {
                if (approvedRequest.id) {
                  router.push(
                    `/requestService/detail?idRequest=${approvedRequest.id}`
                  );
                }
              }}
              onShowMap={(address) => {
                setDataAddress(address);
                setShowMap(true)
              }}
            />
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
                  onShowMap={(address) => {
                    setDataAddress(address);
                    setShowMap(true)
                  }}
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
        destinationAddress={dataAddress}
      />
    </View>
  );
};

export default HomeStaff;
