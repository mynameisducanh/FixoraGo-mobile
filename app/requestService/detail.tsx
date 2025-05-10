import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  Image,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import RequestServiceApi from "@/api/requestService";
import { formatDateTimeVN, formatTimestamp } from "@/utils/dateFormat";
import { statusMap } from "@/utils/function";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import BackButton from "@/components/buttonDefault/backButton";
import InfoButton from "@/components/buttonDefault/infoButton";

interface ActivityHistory {
  id: string;
  status: string;
  timestamp: string;
  note: string;
}

type StatusType = "pending" | "done" | "cancel" | "processing";

interface StatusInfo {
  label: string;
  color: string;
  icon: string;
}

const statusMapTyped: Record<StatusType, StatusInfo> = {
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
  processing: {
    label: "Đang xử lý",
    color: "text-blue-500",
    icon: "sync-outline",
  },
};

const RequestDetail = () => {
  const router = useRouter();
  const requestServiceApi = new RequestServiceApi();
  const { idRequest } = useLocalSearchParams();
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showImageModal, setShowImageModal] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [activityHistory, setActivityHistory] = useState<ActivityHistory[]>([
    {
      id: "1",
      status: "pending",
      timestamp: new Date().toISOString(),
      note: "Yêu cầu dịch vụ đã được tạo",
    },
    {
      id: "2",
      status: "processing",
      timestamp: new Date().toISOString(),
      note: "Đang xử lý yêu cầu",
    },
  ]);

  const fetchDataRequestDetail = async () => {
    try {
      setLoading(true);
      const res = await requestServiceApi.getById(idRequest as string);
      if (res) {
        setRequestData(res);
        // Parse fileImage string to array of URLs
        if (res.fileImage) {
          try {
            const imageUrls = JSON.parse(res.fileImage);
            if (Array.isArray(imageUrls)) {
              setImages(imageUrls);
            }
          } catch (error) {
            console.error("Error parsing fileImage:", error);
          }
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDataRequestDetail();
  }, []);

  const statusInfo = statusMapTyped[requestData?.status as StatusType] || {
    label: requestData?.status || "Không xác định",
    color: "text-gray-500",
    icon: "help-circle-outline",
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <BackButton />
      <InfoButton />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: hp(5),
        }}
        className="flex-1 pt-20"
      >
        {/* Status Section */}
        <View className="items-center py-6 bg-white mb-4">
          <View className="bg-gray-50 p-4 rounded-full mb-4">
            <Ionicons
              name={statusInfo.icon as any}
              size={48}
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
          </View>
          <Text className={`text-xl font-bold ${statusInfo.color}`}>
            {statusInfo.label}
          </Text>
        </View>

        {/* Request Info Section */}
        <View style={{ width: wp(100) }} className="px-4 mb-6">
          <Text className="text-lg font-semibold mb-4">Thông tin yêu cầu</Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            <InfoRow label="Tên dịch vụ" value={requestData?.nameService} />
            <InfoRow label="Phân loại" value={requestData?.listDetailService} />
            <InfoRow
              label="Chi tiết thiết bị"
              value={requestData?.priceService}
            />
            <InfoRow
              label="Thời gian thiết bị được lắp đặt/mua"
              value={requestData?.typeEquipment}
            />
            <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="text-gray-500 font-medium max-w-[35%] text-left"
              >
                Hình ảnh
              </Text>
              <TouchableOpacity
                className="max-w-[65%] text-right"
                onPress={() => setShowImageModal(true)}
              >
                <Text className="text-primary font-semibold">Xem chi tiết</Text>
              </TouchableOpacity>
            </View>
            <InfoRow label="Ghi chú" value={requestData?.note} />
            <InfoRow label="Địa chỉ" value={requestData?.address} />
            <InfoRow label="Lịch hẹn" value={requestData?.calender} />
            <InfoRow
              label="Ngày tạo"
              value={formatDateTimeVN(requestData?.createAt)}
            />
            <InfoRow
              label="Cập nhật lần cuối"
              value={formatDateTimeVN(requestData?.updateAt)}
            />
            <InfoRow label="Mã yêu cầu" value={requestData?.id} />
          </View>
        </View>

        {/* Activity History Section */}
        <View className="px-4">
          <Text className="text-lg font-semibold mb-4">Lịch sử hoạt động</Text>
          <View className="bg-gray-50 rounded-2xl p-4">
            {activityHistory.map((activity, index) => (
              <View key={activity.id} className="flex-row mb-4 last:mb-0">
                <View className="mr-4 items-center w-2 justify-center ">
                  <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                  {index !== activityHistory.length - 1 && (
                    <View className="w-0.5 h-12 bg-gray-300" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900">
                    {statusMapTyped[activity.status as StatusType]?.label ||
                      activity.status}
                  </Text>
                  <Text className="text-sm text-gray-500 mb-1">
                    {formatDateTimeVN(activity.timestamp)}
                  </Text>
                  <Text className="text-gray-600">{activity.note}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Image Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="bg-white w-[90%] rounded-2xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-semibold">Hình ảnh</Text>
              <TouchableOpacity onPress={() => setShowImageModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {images.map((imageUrl, index) => (
                <View key={index} className="mr-4">
                  <Image
                    source={{ uri: imageUrl }}
                    style={{
                      width: Dimensions.get("window").width * 0.7,
                      height: Dimensions.get("window").width * 0.7,
                      borderRadius: 8,
                    }}
                    resizeMode="cover"
                  />
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      className="text-gray-500 font-medium max-w-[35%] text-left"
    >
      {label}
    </Text>
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      className="text-gray-900 font-semibold max-w-[65%] text-right"
    >
      {value ? value : "Trống"}
    </Text>
  </View>
);

export default RequestDetail;
