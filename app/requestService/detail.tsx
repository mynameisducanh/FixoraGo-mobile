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
import LottieView from "lottie-react-native";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Entypo from "@expo/vector-icons/Entypo";
import TechnicianDetailModal from "@/components/technicianDetailModal";
import { useUserStore } from "@/stores/user-store";
import CountdownConfirmModal from "../../components/CountdownConfirmModal";

interface ActivityHistory {
  id: string;
  status: string;
  timestamp: string;
  note: string;
}

type StatusType =
  | "pending"
  | "completed"
  | "guarantee"
  | "rejected"
  | "approved";

interface StatusInfo {
  label: string;
  color: string;
  icon: string;
  bgColor: string;
}

const statusMapTyped: Record<StatusType, StatusInfo> = {
  pending: {
    label: "Chờ xử lý",
    color: "text-yellow-500",
    icon: "time-outline",
    bgColor: "bg-yellow-50",
  },
  completed: {
    label: "Hoàn thành",
    color: "#16a34a",
    icon: "checkmark-circle-outline",
    bgColor: "bg-green-100",
  },
  guarantee: {
    label: "Đang bảo hành",
    color: "#3b82f6",
    icon: "shield-checkmark-outline",
    bgColor: "bg-blue-100",
  },
  rejected: {
    label: "Đã hủy",
    color: "#ef4444",
    icon: "close-circle-outline",
    bgColor: "bg-red-50",
  },
  approved: {
    label: "Đã duyệt",
    color: "#22c55e",
    icon: "clipboard-user",
    bgColor: "bg-green-50",
  },
};

const RequestDetail = () => {
  const router = useRouter();
  const requestServiceApi = new RequestServiceApi();
  const { idRequest } = useLocalSearchParams();
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
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
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const fetchDataRequestDetail = async () => {
    try {
      setLoading(true);
      const res = await requestServiceApi.getById(idRequest as string);
      if (res) {
        setRequestData(res);
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

  const handleFixerApproved = async () => {
    try {
      const payload = {
        requestId: idRequest,
        fixerId: user?.id,
      };
      const res = await requestServiceApi.fixerReceiveRequest(payload);
      if (res) {
        router.push({
          pathname: "/notification/success",
          params: {
            type: "success",
            title: "Nhận yêu cầu thành công",
            message: "Bạn đã nhận yêu cầu dịch vụ thành công. Vui lòng liên hệ với khách hàng để thực hiện dịch vụ.",
            redirectTo: "/(staff)",
            buttonText: "Xem danh sách yêu cầu"
          }
        });
      }
    } catch (error) {
      router.replace({
        pathname: "/notification/success",
        params: {
          type: "error",
          title: "Có lỗi xảy ra",
          message: "Không thể nhận yêu cầu dịch vụ. Vui lòng thử lại sau.",
          redirectTo: "/(staff)",
          redirectParams: JSON.stringify({ idRequest }),
          buttonText: "Thử lại"
        }
      });
    }
  };

  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApproved = () => {
    setShowConfirmModal(false);
    handleFixerApproved();
  };

  useEffect(() => {
    fetchDataRequestDetail();
  }, []);

  const statusInfo = statusMapTyped[requestData?.status as StatusType] || {
    label: requestData?.status || "Không xác định",
    color: "text-gray-500",
    icon: "help-circle-outline",
    bgColor: "bg-gray-50",
  };

  // Mock data for technician
  const technicianData = {
    avatar:
      "https://res.cloudinary.com/di6tygnb5/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1740975527/cld-sample-3.jpg",
    name: "Nguyễn Văn A",
    hometown:
      "55 tran thanh, Phường Hòa Thọ Đông, Quận Cẩm Lệ, Thành phố Đà Nẵng",
    phone: "0123456789",
    rating: 5.0,
    totalReviews: 128,
    experience: "5 năm kinh nghiệm",
    skills: ["Sửa điện", "Sửa nước", "Lắp đặt thiết bị", "Bảo trì"],
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
        className="flex-1 pt-24 "
      >
        <View className="h-40 px-4 py-4 mb-2 ">
          <View
            style={{ height: wp(35) }}
            className={` w-full rounded-2xl ${statusInfo.bgColor}`}
          >
            {requestData?.status === "pending" &&
              user?.roles !== "system_fixer" && (
                <View className="flex-1 p-4">
                  <View className="flex-row items-center justify-between mb-4"></View>
                  <View className="flex-row items-center justify-center gap-3">
                    <Image
                      source={{
                        uri: "https://res.cloudinary.com/di6tygnb5/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1740975527/cld-sample-3.jpg",
                      }}
                      className="w-12 h-12 rounded-full"
                      resizeMode="cover"
                    />
                    <View className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                    <LottieView
                      source={require("@/assets/icons/waiting-icon.json")}
                      autoPlay
                      loop
                      style={{ width: 40, height: 40 }}
                    />
                    <View className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse" />
                    <Image
                      source={require("@/assets/icons/fixer-icon.png")}
                      className="w-16 h-16 rounded-full"
                      resizeMode="cover"
                    />
                  </View>
                  <Text className="text-gray-700 font-medium text-center">
                    Đang tìm kiếm thợ
                  </Text>
                </View>
              )}

            {requestData?.status === "rejected" && (
              <View className="flex-1 p-4 items-center justify-center">
                <View className=" p-4 rounded-full mb-4">
                  <Ionicons name="close-circle" size={48} color="#ef4444" />
                </View>
                <Text className="text-xl font-semibold text-red-500">
                  Đã hủy
                </Text>
              </View>
            )}

            {(requestData?.status === "approved" ||
              requestData?.status === "guarantee" ||
              requestData?.status === "completed" ||
              (requestData?.status === "pending" &&
                user?.roles === "system_fixer")) && (
              <View className="flex-1 px-4 py-3">
                {user?.roles === "system_user" ? (
                  <Text
                    style={{ color: statusInfo.color }}
                    className="text-green-500 font-bold text-lg -ml-1 mb-1"
                  >
                    Thông tin thợ đã nhận yêu cầu
                  </Text>
                ) : (
                  <Text
                    style={{ color: statusInfo.color }}
                    className="text-green-500 font-bold text-lg -ml-1 mb-1"
                  >
                    Thông tin khách hàng
                  </Text>
                )}

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Image
                      source={{
                        uri: "https://res.cloudinary.com/di6tygnb5/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1740975527/cld-sample-3.jpg",
                      }}
                      className="w-12 h-12 rounded-full mr-3"
                      resizeMode="cover"
                    />
                    <View>
                      <Text className="font-semibold text-gray-900">
                        {"Nguyễn Văn A"}
                      </Text>
                      {user?.roles === "system_user" && (
                        <View className="flex-row items-center">
                          <Ionicons name="star" size={16} color="#eab308" />
                          <Text className="text-gray-600 ml-1">{"5.0"}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View
                    style={{ backgroundColor: statusInfo.color }}
                    className=" w-10 h-10 p-2 rounded-full items-center"
                  >
                    {requestData?.status === "approved" ? (
                      <FontAwesome6
                        name={statusInfo.icon}
                        size={24}
                        color="#fff"
                      />
                    ) : (
                      <Ionicons
                        name={statusInfo.icon as any}
                        size={22}
                        color="#fff"
                      />
                    )}
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <View className="flex-row justify-start mt-3 space-x-4 gap-4 items-center">
                    <TouchableOpacity
                      className=""
                      onPress={() => setShowTechnicianModal(true)}
                    >
                      <MaterialCommunityIcons
                        name="card-account-details-star"
                        size={24}
                        color={statusInfo.color}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity className="">
                      <Entypo
                        name="message"
                        size={26}
                        color={statusInfo.color}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity className="">
                      <Entypo name="phone" size={24} color={statusInfo.color} />
                    </TouchableOpacity>
                    <TouchableOpacity className=" ">
                      <Entypo name="flag" size={24} color={statusInfo.color} />
                    </TouchableOpacity>
                  </View>
                  <View className="flex-col">
                    <Text className="mt-4">Ngày nhận : {"10/5/2025"}</Text>
                    {(requestData?.status === "guarantee" ||
                      requestData?.status === "completed") && (
                      <Text>Hạn BH : {"21/5/2025"}</Text>
                    )}
                  </View>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Request Info Section */}
        <View style={{ width: wp(100) }} className="px-4 mb-3 mt-3">
          <Text className="text-lg font-semibold mb-3">Thông tin yêu cầu</Text>
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
            <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                className="text-gray-500 font-medium max-w-[35%] text-left"
              >
                Tình trạng
              </Text>

              <Text
                style={{ color: statusInfo.color }}
                className={`font-semibold max-w-[65%] text-right ${statusInfo.color}`}
              >
                {statusInfo?.label}
              </Text>
            </View>
            <InfoRow label="Mã yêu cầu" value={requestData?.id} />
          </View>
        </View>
        <View style={{ width: wp(100) }} className="flex-row justify-center">
          {((requestData?.status === "rejected" &&
            user?.roles === "system_user") ||
            (requestData?.status === "approved" &&
              user?.roles === "system_fixer") ||
            (requestData?.status === "pending" &&
              user?.roles === "system_user")) && (
            <View className="items-center p-2">
              <TouchableOpacity className="px-6 py-2 rounded-xl border border-red-500 active:opacity-70">
                <Text className="text-red-500 font-semibold text-center">
                  Hủy yêu cầu dịch vụ
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {((requestData?.status === "guarantee" &&
            user?.roles === "system_user") ||
            requestData?.status === "completed") && (
            <View className="items-center p-2">
              <TouchableOpacity className="px-6 py-2 rounded-xl border border-primary active:opacity-70">
                <Text className="text-primary font-semibold text-center">
                  Đánh giá
                </Text>
              </TouchableOpacity>
            </View>
          )}
          {((requestData?.status === "pending" &&
            user?.roles === "system_fixer") ||
            requestData?.status === "completed") && (
            <View className="items-center p-2">
              <TouchableOpacity
                onPress={handleShowConfirmModal}
                className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
              >
                <Text className="text-primary font-semibold text-center">
                  Nhận yêu cầu
                </Text>
              </TouchableOpacity>
            </View>
          )}
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

      <TechnicianDetailModal
        visible={showTechnicianModal}
        onClose={() => setShowTechnicianModal(false)}
        technician={technicianData}
        bgColor={statusInfo.bgColor}
        color={statusInfo.color}
      />

      <CountdownConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmApproved}
        title="Xác nhận nhận yêu cầu"
        message="Bạn có chắc chắn muốn nhận yêu cầu này?"
        data={requestData}
        countdownSetup={10}
      />
    </View>
  );
};

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
    <Text
      numberOfLines={2}
      ellipsizeMode="tail"
      className="text-gray-500 font-medium max-w-[35%] text-left "
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
