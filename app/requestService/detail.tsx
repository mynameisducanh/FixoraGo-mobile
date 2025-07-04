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
  Alert,
  RefreshControl,
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
import ReviewModal from "@/components/review/ReviewModal";
import LoadingOverlay from "@/components/default/loading";
import ProposeRepairModal from "@/components/staff/ProposeRepairModal";
import ActivityLogApi from "@/api/activityLogApi";
import CheckInModal from "@/components/staff/CheckInModal";
import HistoryRequestServiceApi from "@/api/historyRequestServiceApi";
import ReviewApi from "@/api/reviewApi";
import UserApi from "@/api/userApi";
import Avatar from "@/components/others/Avatar";
import CompleteRequestModal from "@/components/staff/CompleteRequestModal";
import RequestConfirmServiceApi from "@/api/requestConfirmServiceApi";
import SkillFixerApi from "@/api/skillFixerApi";
import FixerApi from "@/api/fixerApi";
import CancelRequestModal from "@/components/CancelRequestModal";
import ReportModal from "@/components/ReportModal";
import FixerReviewsModal from "@/components/review/FixerReviewsModal";
import EditRequestModal from "@/components/EditRequestModal";
import ArrivalConfirmationModal from "@/components/staff/CommingSoon";

interface ActivityHistory {
  id: string;
  type: string;
  createAt: string;
  name: string;
}

type StatusType =
  | "pending"
  | "completed"
  | "guarantee"
  | "rejected"
  | "approved"
  | "deleted";

interface StatusInfo {
  label: string;
  color: string;
  icon: string;
  bgColor: string;
}

interface ReviewData {
  rating?: number;
  comment?: string;
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
  deleted: {
    label: "Đã hủy",
    color: "#ef4444",
    icon: "close-circle-outline",
    bgColor: "bg-red-50",
  },
  approved: {
    label: "Đã được nhận",
    color: "#22c55e",
    icon: "clipboard-user",
    bgColor: "bg-green-50",
  },
};

const RequestDetail = () => {
  const router = useRouter();
  const requestServiceApi = new RequestServiceApi();
  const requestConfirmServiceApi = new RequestConfirmServiceApi();
  const ativityLogApi = new ActivityLogApi();
  const reviewApi = new ReviewApi();
  const skillFixerApi = new SkillFixerApi();
  const fixerApi = new FixerApi();
  const userApi = new UserApi();
  const historyRequestServiceApi = new HistoryRequestServiceApi();
  const { idRequest } = useLocalSearchParams();
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useUserStore();
  const [showImageModal, setShowImageModal] = useState(false);
  const [showImageModal3, setShowImageModal3] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showReviewModal2, setShowReviewModal2] = useState(false);
  const [fixerChecked, setFixerChecked] = useState(false);
  const [fixerPropose, setFixerPropose] = useState(false);
  const [userPropose, setUserPropose] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [userConfirmed, setUserConfirmed] = useState<any>(false);
  const [activityHistory, setActivityHistory] = useState<ActivityHistory[]>([]);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [fixerData, setFixerData] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [confirmCompleted, setConfirmCompleted] = useState(false);
  const [fixerSkills, setFixerSkills] = useState<string[]>([]);
  const [fixerExperience, setFixerExperience] = useState<string>("");
  const [fixerRating, setFixerRating] = useState<number>(0);
  const [fixerTotalReviews, setFixerTotalReviews] = useState<number>(0);
  const [checkUserReview, setCheckUserReview] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [showCompleteModal2, setShowCompleteModal2] = useState(false);
  const [fixerCompleteData, setFixerCompleteData] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fixerGoing, setFixerGoing] = useState();
  const fetchDataRequestDetail = async () => {
    try {
      setLoading(true);
      const res = await requestServiceApi.getById(idRequest as string);
      const activityRes = await historyRequestServiceApi.getHistory(
        idRequest as string
      );
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
        await fetchUserData(res);
      }
      if (activityRes) {
        setActivityHistory(activityRes);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async (requestData: any) => {
    try {
      if (requestData.userId) {
        const resUser = await userApi.getByUserId(requestData.userId);
        if (resUser) {
          setUserData(resUser);
        }
        if (requestData?.fixerId) {
          const resFixer = await userApi.getByUserId(requestData.fixerId);
          const skillFixer = await skillFixerApi.getByUserId(
            requestData.fixerId
          );
          const fixerData = await fixerApi.getByUserId(requestData.fixerId);
          const fixerGoing = await ativityLogApi.CheckFixerGoing(
            requestData.id
          );
          console.log(fixerGoing);
          if (fixerGoing.hasStaffGoing) {
            setFixerGoing(fixerGoing.note);
          }
          if (resFixer) {
            setFixerData(resFixer);
          }
          if (
            skillFixer &&
            Array.isArray(skillFixer) &&
            skillFixer.length > 0
          ) {
            const fixerSkillNames = skillFixer.map((skill: any) => skill.name);
            setFixerSkills(fixerSkillNames);
          }
          const average = await reviewApi.getReviewAverageByFixerId(
            requestData.fixerId
          );
          if (average) {
            setFixerRating(average.average);
            setFixerTotalReviews(average.count);
          }

          const response2 = await requestConfirmServiceApi.checkFixerCompleted(
            requestData.id
          );
          if (response2) {
            if (response2.hasCompleted === true) {
              setConfirmCompleted(true);
              const response = await requestConfirmServiceApi.getByRequestId(
                requestData.id,
                { type: "completed" }
              );
              if (response) {
                setFixerCompleteData(response);
              }
            }
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleConfirm = async (timeOption: string) => {
    console.log("Đã chọn thời gian:", timeOption);
    try {
      const formData = new FormData();
      formData.append("note", timeOption);
      formData.append("activityType", "staff_going");
      formData.append("requestServiceId", idRequest as string);
      const res = await ativityLogApi.createRes(formData);
      console.log(res);
      if (res) {
        Alert.alert("Thành công", "Đã gửi thông báo thành công");
        reloadData();
      }
    } catch (error) {
      console.log(error);
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
            message:
              "Bạn đã nhận yêu cầu dịch vụ thành công. Vui lòng liên hệ với khách hàng để thực hiện dịch vụ.",
            redirectTo: "/(staff)",
            buttonText: "Xem danh sách yêu cầu",
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkFixerCheckIn = async () => {
    try {
      const res = await ativityLogApi.CheckFixerCheckIn(idRequest as string);
      console.log(res);
      if (res.hasCheckin === true) {
        setFixerChecked(true);
      }
      const res2 = await reviewApi.checkUserReview(idRequest as string);
      const res4 = await requestConfirmServiceApi.checkFixerPropose(
        idRequest as string
      );
      if (res4) {
        setFixerPropose(res4.hasTotalType);
        setUserPropose(res4.isAccepted);
      }
      const res3 = await ativityLogApi.checkUserConfirmCheckin(
        idRequest as string
      );
      if (res2) {
        if (res2.hasReviewed === true) {
          setCheckUserReview(true);
        }
      }
      if (res3.hasCheckin === true) {
        setUserConfirmed(true);
      }
    } catch (error) {
      console.log("checkFixerCheckIn", error);
    }
  };
  useEffect(() => {
    checkFixerCheckIn();
  }, []);
  const handleSubmitStaffReview = (review: ReviewData) => {
    handleSubmitReview(review);
    setShowReviewModal(false);
    setTimeout(() => {
      if (user?.roles === "system_user") {
        setShowReviewModal2(true);
      }
    }, 300);
  };
  const handleShowProposeRepairModalProps = () => {
    setShowImageModal3(true);
  };

  const handleSubmitProposeRepairModalProps = () => {
    reloadData();
  };
  const handleSubmitCheckInModalProps = (data: any) => {
    reloadData();
    setShowCheckInModal(false);
  };
  const handleSubmitServiceReview = (review: ReviewData) => {
    handleSubmitReview2(review);
    setShowReviewModal2(false);
  };
  const handleSubmitReview = async (review: ReviewData) => {
    try {
      const payLoad = {
        idRequestService: idRequest,
        rating: review.rating || 5,
        comment: review.comment,
        fixerId: requestData.fixerId,
        userId: requestData.userId,
        type: "userReviewFixer",
      };
      const res = await reviewApi.createReview(payLoad);
      if (res) {
        // Reload data để cập nhật trạng thái review
        reloadData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleSubmitReview2 = async (review: ReviewData) => {
    try {
      const payLoad = {
        idRequestService: idRequest,
        rating: review.rating || 5,
        comment: review.comment,
        userId: user?.id,
        type: "userReviewService",
      };
      const res = await reviewApi.createReview(payLoad);
      if (res) {
        Alert.alert(
          "Thông báo",
          "Đánh giá thành công , Cảm ơn đánh giá của bạn"
        );
        // Reload data để cập nhật trạng thái review
        reloadData();
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleShowConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmApproved = () => {
    setShowConfirmModal(false);
    handleFixerApproved();
  };

  const reloadData = async () => {
    try {
      // Reset các state quan trọng trước khi fetch lại
      setFixerChecked(false);
      setFixerPropose(false);
      setUserPropose(false);
      setUserConfirmed(false);
      setCheckUserReview(false);
      setConfirmCompleted(false);
      setFixerGoing(undefined);

      await fetchDataRequestDetail();
      // Không cần gọi fetchUserData riêng vì nó đã được gọi trong fetchDataRequestDetail
      await checkFixerCheckIn();
    } catch (error) {
      console.error("Error reloading data:", error);
    }
  };

  const handleShowCompleteModal = () => {
    setShowCompleteModal(true);
  };

  const handleCompleteRequest = async () => {
    try {
      // TODO: Call API to complete request
      // const res = await requestServiceApi.completeRequest(requestData.id);
      // if (res) {
      //   reloadData();
      // }
      reloadData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancelRequest = async (
    selectedReasons: string[],
    note: string
  ) => {
    if (fixerGoing) {
      Alert.alert(
        "Thông báo",
        "Bạn không thể hủy yêu cầu khi nhân viên đã xác nhận sẽ đến trong khoảng thời gian nhất định."
      );
      reloadData();
      return;
    }
    try {
      const payload = {
        requestId: idRequest,
        reasons: selectedReasons,
        note: note,
      };
      const formData = new FormData();
      if (user?.roles === "system_user") {
        formData.append("activityType", "user_reject");
        formData.append("userId", user.id);
      }
      if (user?.roles === "system_fixer") {
        formData.append("activityType", "fixer_reject");
        formData.append("userId", user.id);
      }
      formData.append("note", note);
      formData.append("requestServiceId", idRequest as string);
      let res;
      if (user?.roles === "system_user") {
        res = await requestServiceApi.userCancelRequest(idRequest as string);
      } else if (user?.roles === "system_fixer") {
        res = await requestServiceApi.fixerCancelRequest(idRequest as string);
      }
      await ativityLogApi.createRes(formData);
      if (res) {
        router.push({
          pathname: "/notification/success",
          params: {
            type: "success",
            title: "Hủy yêu cầu thành công",
            message: "Yêu cầu của bạn đã được hủy thành công.",
            redirectTo: user?.roles === "system_fixer" ? "/(staff)" : "/(user)",
            buttonText: "Xem danh sách yêu cầu",
          },
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi hủy yêu cầu");
    }
  };

  const handleReportRequest = async (
    selectedReasons: string[],
    note: string
  ) => {
    try {
      const formData = new FormData();
      formData.append("note", selectedReasons.join(", ") + "," + note);
      if (user?.roles === "system_user") {
        formData.append("activityType", "user_report");
        formData.append("userId", user.id);
        formData.append("fixerId", requestData.fixerId);
      }
      if (user?.roles === "system_fixer") {
        formData.append("activityType", "fixer_report");
        formData.append("userId", requestData.userId);
        formData.append("fixerId", user.id);
      }
      formData.append("temp", "pending");

      formData.append("requestServiceId", idRequest as string);
      const res = await ativityLogApi.createRes(formData);
      if (res) {
        Alert.alert(
          "Thành công",
          "Báo cáo của bạn đã được gửi thành công. Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể."
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi gửi báo cáo");
    }
  };

  const handleEditRequest = async (formData: FormData) => {
    try {
      const res = await requestServiceApi.updateRequest(
        formData,
        idRequest as string
      );
      if (res) {
        router.push({
          pathname: "/notification/success",
          params: {
            type: "success",
            title: "Cập nhật thành công",
            message: "Thông tin yêu cầu đã được cập nhật thành công.",
            redirectTo: "/(user)/activate",
            redirectParams: `/(user)/activate`,
            subParams: `${idRequest}`,
          },
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật thông tin");
    }
  };

  useEffect(() => {
    fetchDataRequestDetail();
  }, []);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    console.log("onRefresh");
    try {
      // Gọi đầy đủ các hàm cần thiết để refresh hoàn toàn
      await fetchDataRequestDetail();
      // Không cần gọi fetchUserData riêng vì nó đã được gọi trong fetchDataRequestDetail
      await checkFixerCheckIn();

      // Thêm delay nhỏ để đảm bảo UI được cập nhật
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setRefreshing(false);
    }
  }, [idRequest, user?.id]); // Thêm dependencies cần thiết
  if (loading) {
    return <LoadingOverlay />;
  }

  if (!requestData) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Không tìm thấy thông tin yêu cầu</Text>
      </View>
    );
  }

  const statusInfo = statusMapTyped[requestData?.status as StatusType] || {
    label: requestData?.status || "Không xác định",
    color: "text-gray-500",
    icon: "help-circle-outline",
    bgColor: "bg-gray-50",
  };

  return (
    <View className="flex-1 bg-white">
      <BackButton />
      <InfoButton />
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: hp(15),
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FFC107"]}
            tintColor="#FFC107"
            progressViewOffset={20}
            progressBackgroundColor="#ffffff"
            title="Đang tải..."
            titleColor="#FFC107"
          />
        }
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
                    {userData &&
                      (userData.avatarurl ? (
                        <Image
                          source={{
                            uri: userData.avatarurl,
                          }}
                          className="w-12 h-12 rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Avatar size={48} username={userData?.username} />
                      ))}

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
                    Đang tìm kiếm nhân viên
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
              requestData?.status === "deleted" ||
              (requestData?.status === "pending" &&
                user?.roles === "system_fixer")) && (
              <View className="flex-1 px-4 py-3">
                {user?.roles === "system_user" ? (
                  <Text
                    style={{ color: statusInfo.color }}
                    className="text-green-500 font-bold text-lg -ml-1 mb-1"
                  >
                    Thông tin nhân viên đã nhận yêu cầu
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
                  {user?.roles === "system_fixer" ? (
                    userData ? (
                      <View className="flex-row items-center">
                        {userData.avatarurl ? (
                          <Image
                            source={{
                              uri: userData.avatarurl,
                            }}
                            className="w-12 h-12 rounded-full"
                            resizeMode="cover"
                          />
                        ) : (
                          <Avatar size={48} username={userData?.username} />
                        )}
                        <View>
                          <Text className="font-semibold text-gray-900 ml-3">
                            {userData?.fullName || userData?.username}
                          </Text>
                        </View>
                      </View>
                    ) : (
                      <Text>Trống</Text>
                    )
                  ) : fixerData ? (
                    <View className="flex-row items-center">
                      {fixerData.avatarurl ? (
                        <Image
                          source={{
                            uri: fixerData.avatarurl,
                          }}
                          className="w-12 h-12 rounded-full"
                          resizeMode="cover"
                        />
                      ) : (
                        <Avatar size={48} username={fixerData?.username} />
                      )}
                      <View>
                        <Text className="font-semibold text-gray-900 ml-3">
                          {fixerData?.fullName || fixerData?.username}
                        </Text>
                        <View className="flex-row items-center ml-3">
                          <Ionicons name="star" size={16} color="#eab308" />
                          <Text className="text-gray-600 ml-1">
                            {fixerRating || "Chưa có đánh giá"}
                          </Text>
                        </View>
                      </View>
                    </View>
                  ) : (
                    <Text>Yêu cầu này chưa có nhân viên nhận</Text>
                  )}

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
                  <View className="flex-row justify-start mt-3 space-x-4 gap-3 items-center">
                    {(fixerData && user?.roles === "system_fixer") || user?.roles ==="system_user" && (
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
                    )}

                    {(requestData?.status === "approved" ||
                      requestData?.status === "guarantee" ||
                      requestData?.status === "completed") && (
                      <>
                        <TouchableOpacity
                          className=""
                          onPress={() => router.push("/messages")}
                        >
                          <Entypo
                            name="message"
                            size={26}
                            color={statusInfo.color}
                          />
                        </TouchableOpacity>
                        {user?.roles === "system_user" ? (
                          <TouchableOpacity
                            className=""
                            onPress={() => setShowReviewsModal(true)}
                          >
                            <Ionicons
                              name="star"
                              size={24}
                              color={statusInfo.color}
                            />
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity className="">
                            <Entypo
                              name="phone"
                              size={24}
                              color={statusInfo.color}
                            />
                          </TouchableOpacity>
                        )}
                      </>
                    )}
                    {fixerData && user?.roles === "system_fixer" || user?.roles ==="system_user" && (
                      <TouchableOpacity
                        className=""
                        onPress={() => setShowReportModal(true)}
                      >
                        <Entypo
                          name="flag"
                          size={24}
                          color={statusInfo.color}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View className="flex-col">
                    {requestData?.approvedTime && (
                      <Text className="mt-3">
                        Ngày nhận: {formatDateTimeVN(requestData?.approvedTime)}
                      </Text>
                    )}

                    {requestData.deleteAt && (
                      <Text className="">
                        Ngày hủy: {formatDateTimeVN(requestData?.deleteAt)}
                      </Text>
                    )}

                    {(requestData?.status === "guarantee" ||
                      requestData?.status === "done") && (
                      <Text>
                        Hạn BH : {formatDateTimeVN(requestData?.guaranteeTime)}
                      </Text>
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
          {requestData.isUrgent === true && (
            <Text className="text-red-500 font-semibold text-left mb-3">
              Đây là yêu cầu cần gấp
            </Text>
          )}
          {fixerGoing && !fixerChecked && (
            <Text className="text-green-500 font-semibold text-left mb-3">
              Nhân viên sẽ tới trong khoảng {fixerGoing} phút nữa , vui lòng chú
              ý điện thoại
            </Text>
          )}
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
            {requestData?.bouns && (
              <View className="flex-row justify-between py-2 border-b border-gray-200 last:border-b-0">
                <Text
                  numberOfLines={2}
                  ellipsizeMode="tail"
                  className="text-gray-500 font-medium max-w-[35%] text-left"
                >
                  Tiền Tip
                </Text>

                <Text className={`font-semibold max-w-[65%] text-right`}>
                  {requestData?.bouns || "0"} VNĐ
                </Text>
              </View>
            )}
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
            <InfoRow label="Mã yêu cầu" value={requestData?.id?.slice(0, 13)} />
          </View>
        </View>

        <View style={{ width: wp(100) }} className="flex-col gap-1">
          <View className="flex-row justify-center">
            {(((requestData?.status === "pending" ||
              requestData?.status === "approved") &&
              user?.roles === "system_user" &&
              !fixerGoing) ||
              (requestData?.status === "approved" &&
                user?.roles === "system_fixer") ||
              fixerChecked) &&
              requestData?.status !== "deleted" &&
              requestData?.status !== "guarantee" &&
              requestData?.status !== "completed" && (
                <View className="items-center p-2">
                  <TouchableOpacity
                    onPress={() => setShowCancelModal(true)}
                    className="px-6 py-2 rounded-xl border border-red-500 active:opacity-70"
                  >
                    <Text className="text-red-500 font-semibold text-center">
                      Hủy yêu cầu
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            {((requestData?.status === "guarantee" &&
              user?.roles === "system_user") ||
              (requestData?.status === "done" &&
                checkUserReview === false)) && (
              <View className="items-center p-2">
                <TouchableOpacity
                  onPress={() => {
                    setShowReviewModal(true);
                  }}
                  className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
                >
                  <Text className="text-primary font-semibold text-center">
                    Đánh giá
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {(requestData?.status === "approved" ||
              requestData?.status === "guarantee" ||
              requestData?.status === "completed") &&
              fixerChecked === true &&
              (user?.roles === "system_fixer" ||
                (user?.roles === "system_user" && fixerPropose)) && (
                <View className="items-center p-2">
                  <TouchableOpacity
                    onPress={handleShowProposeRepairModalProps}
                    className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
                  >
                    <Text className="text-primary font-semibold text-center">
                      {user?.roles === "system_fixer" && (
                        <>{fixerPropose ? "Xem đề xuất sửa" : "Đề xuất sửa"}</>
                      )}

                      {user?.roles === "system_user" && "Xem đề xuất sửa"}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            {requestData?.status === "pending" &&
              user?.roles === "system_fixer" && (
                <>
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
                </>
              )}
            {requestData?.status === "approved" &&
              user?.roles === "system_fixer" &&
              !fixerGoing && (
                <>
                  <View className="items-center p-2">
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
                    >
                      <Text className="text-primary font-semibold text-center">
                        Tôi đang tới
                      </Text>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            {requestData?.status === "pending" &&
              user?.roles === "system_user" && (
                <View className="items-center p-2">
                  <TouchableOpacity
                    onPress={() => setShowEditModal(true)}
                    className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
                  >
                    <Text className="text-primary font-semibold text-center">
                      Chỉnh sửa
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
          </View>
          <View className="flex-row justify-center">
            {requestData?.status === "approved" &&
              user?.roles === "system_fixer" &&
              fixerChecked === true &&
              confirmCompleted !== true &&
              userPropose === true && (
                <View className="items-center p-2">
                  <TouchableOpacity
                    onPress={handleShowCompleteModal}
                    className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
                  >
                    <Text className="text-primary font-semibold text-center">
                      Hoàn thành
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            {((user?.roles === "system_user" && fixerChecked === true) ||
              (user?.roles === "system_fixer" &&
                requestData?.status === "approved")) &&
              fixerGoing && (
                <View className="items-center p-2">
                  <TouchableOpacity
                    onPress={() => {
                      setShowCheckInModal(true);
                    }}
                    className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
                  >
                    {fixerChecked && user?.roles === "system_fixer" && (
                      <Text className="text-primary font-semibold text-center">
                        Xem thông tin check-in
                      </Text>
                    )}
                    {!fixerChecked && (
                      <Text className="text-primary font-semibold text-center">
                        Check-In
                      </Text>
                    )}
                    {fixerChecked && user?.roles === "system_user" && (
                      <Text className="text-primary font-semibold text-center">
                        Thông tin check-in của nhân viên
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
          </View>
          <View className="flex-row justify-center">
            {(requestData?.status === "approved" ||
              requestData?.status === "guarantee" ||
              requestData?.status === "completed") &&
              confirmCompleted === true && (
                <View className="items-center p-2">
                  <TouchableOpacity
                    onPress={() => setShowCompleteModal2(true)}
                    className="px-6 py-2 rounded-xl border border-primary active:opacity-70"
                  >
                    {user?.roles === "system_user" ? (
                      <Text className="text-primary font-semibold text-center">
                        {requestData?.status === "guarantee"
                          ? "Xem xác nhận hoàn thành"
                          : "Xem xác nhận hoàn thành của nhân viên"}
                      </Text>
                    ) : (
                      <Text className="text-primary font-semibold text-center">
                        {requestData?.status === "guarantee"
                          ? "Xem xác nhận hoàn thành"
                          : "Xem lại xác nhận hoàn thành"}
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              )}
          </View>
        </View>
        {/* Activity History Section */}
        {activityHistory && activityHistory.length > 0 ? (
          <View className="px-4">
            <Text className="text-lg font-semibold mb-4">
              Lịch sử hoạt động
            </Text>
            <View className="bg-gray-50 rounded-2xl p-4">
              {activityHistory.map((activity, index) => (
                <View key={activity.id} className="flex-row mb-4 last:mb-0">
                  <View className="mr-4 items-center w-2 justify-center ">
                    <View className="w-2 h-2 rounded-full bg-blue-500 mt-2" />
                    {index !== activityHistory.length - 1 && (
                      <View className="w-0.5 h-12 mt-2 bg-gray-300" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {activity.type}
                    </Text>
                    <Text className="text-sm text-gray-500 mb-1">
                      {formatDateTimeVN(activity.createAt)}
                    </Text>
                    <Text className="text-gray-600">{activity.name}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
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
              {images && images.length > 0 ? (
                images.map((imageUrl, index) => (
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
                ))
              ) : (
                <Text className="text-gray-500">Không có hình ảnh</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
      <ArrivalConfirmationModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
      <TechnicianDetailModal
        visible={showTechnicianModal}
        onClose={() => setShowTechnicianModal(false)}
        technician={
          user?.roles === "system_user" ? fixerData || {} : userData || {}
        }
        skills={fixerSkills}
        experience={fixerExperience}
        rating={fixerRating}
        totalReviews={fixerTotalReviews}
        bgColor={statusInfo.bgColor}
        color={statusInfo.color}
        roles={user?.roles as string}
      />
      <ProposeRepairModal
        visible={showImageModal3}
        requestServiceId={requestData.id}
        onClose={() => setShowImageModal3(false)}
        onSubmit={handleSubmitProposeRepairModalProps}
        onSuccess={reloadData}
      />
      <CountdownConfirmModal
        visible={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmApproved}
        title="Xác nhận nhận yêu cầu"
        message="Bạn có chắc chắn muốn nhận yêu cầu này?"
        data={requestData}
      />
      <CheckInModal
        visible={showCheckInModal}
        requestId={requestData?.id}
        onClose={() => setShowCheckInModal(false)}
        onSubmit={handleSubmitCheckInModalProps}
      />
      {user?.roles === "system_user" ? (
        <>
          <ReviewModal
            visible={showReviewModal}
            onClose={() => setShowReviewModal(false)}
            onSubmit={handleSubmitStaffReview}
            type="fixer"
            fixerId={requestData?.fixerId}
          />
          <ReviewModal
            visible={showReviewModal2}
            onClose={() => setShowReviewModal2(false)}
            onSubmit={handleSubmitServiceReview}
            type="service"
          />
        </>
      ) : (
        <ReviewModal
          visible={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          onSubmit={handleSubmitReview}
          type="service"
        />
      )}
      <CompleteRequestModal
        visible={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        onSuccess={handleCompleteRequest}
        requestId={requestData?.id}
        price={fixerCompleteData?.[0].price}
      />
      <CompleteRequestModal
        visible={showCompleteModal2}
        onClose={() => setShowCompleteModal2(false)}
        onSuccess={handleCompleteRequest}
        requestId={requestData?.id}
        fixerData={fixerCompleteData?.[0] || null}
      />
      <CancelRequestModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onSubmit={handleCancelRequest}
      />
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onSubmit={handleReportRequest}
      />
      {user?.roles === "system_user" && (
        <FixerReviewsModal
          visible={showReviewsModal}
          onClose={() => setShowReviewsModal(false)}
          fixerId={fixerData?.id}
        />
      )}
      <EditRequestModal
        id={requestData?.id}
        visible={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSubmit={handleEditRequest}
        initialData={{
          typeEquipment: requestData?.typeEquipment || "",
          calender: requestData?.calender || "",
          note: requestData?.note || "",
          fileImage: requestData?.fileImage || "",
        }}
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
      numberOfLines={3}
      ellipsizeMode="tail"
      className="text-gray-900 font-semibold max-w-[65%] text-right"
    >
      {value ? value : "Trống"}
    </Text>
  </View>
);

export default RequestDetail;
