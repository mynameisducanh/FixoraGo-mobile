import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useUserStore } from "@/stores/user-store";
import ActivityLogApi from "@/api/activityLogApi";
import CountdownConfirmModal from "../CountdownConfirmModal";
import { ActivityIndicator } from "react-native-paper";
import UserApi from "@/api/userApi";
import FixerApi from "@/api/fixerApi";
import SkillFixerApi from "@/api/skillFixerApi";
import ReviewApi from "@/api/reviewApi";
import TechnicianDetailModal from "../technicianDetailModal";

interface CheckInModalProps {
  visible: boolean;
  requestId: string;
  onClose: () => void;
  onSubmit: (data: {
    images: ImagePicker.ImagePickerAsset[];
    note: string;
  }) => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({
  visible,
  requestId,
  onClose,
  onSubmit,
}) => {
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const { user } = useUserStore();
  const ativityLogApi = new ActivityLogApi();
  const [isLoading, setIsLoading] = useState(false);
  const [fixerData, setFixerData] = useState<any>(null);
  const [userConfirmed, setUserConfirmed] = useState<any>(false);
  const [activityLogData, setActivityLogData] = useState<any>(null);
  const [fixerSkills, setFixerSkills] = useState<string[]>([]);
  const [fixerRating, setFixerRating] = useState<number>(0);
  const [fixerTotalReviews, setFixerTotalReviews] = useState<number>(0);
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [fixerChecked, setFixerChecked] = useState(false);
  const userApi = new UserApi();
  const fixerApi = new FixerApi();
  const skillFixerApi = new SkillFixerApi();
  const reviewApi = new ReviewApi();

  useEffect(() => {
    if (visible && user?.roles === "system_user") {
      fetchFixerData();
    }
  }, [visible]);

  const fetchFixerData = async () => {
    try {
      const activityLog = await ativityLogApi.getByRequestIdStaffCheckIn(requestId);
      if (activityLog && activityLog.fixerId) {
        const resFixer = await userApi.getByUserId(activityLog.fixerId);
        const skillFixer = await skillFixerApi.getByUserId(activityLog.fixerId);
        // const fixerData = await fixerApi.getByUserId(activityLog.fixerId);
        setActivityLogData(activityLog);
        if (resFixer) {
          setFixerData(resFixer);
        }
        if (skillFixer && Array.isArray(skillFixer) && skillFixer.length > 0) {
          const fixerSkillNames = skillFixer.map((skill: any) => skill.name);
          setFixerSkills(fixerSkillNames);
        }
        const average = await reviewApi.getReviewAverageByFixerId(activityLog.fixerId);
        if (average) {
          setFixerRating(average.average);
          setFixerTotalReviews(average.count);
        }
      }
    } catch (error) {
      console.error("Error fetching fixer data:", error);
    }
  };

  const selectImage = async (index: number) => {
    try {
      const permissionResult =
        await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        Alert.alert("Thông báo", "Bạn cần cấp quyền Camera để chụp ảnh!");
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const newImage = {
          ...result.assets[0],
          type: "image" as const,
        };

        setImages((prev) => {
          const updated = [...prev];
          updated[index] = newImage;
          return updated;
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      updated[index] = undefined as any;
      return updated;
    });
  };

  const handleSubmit = () => {
    if (user?.roles === "system_fixer") {
      const validImages = images.filter((img) => img !== undefined);
      if (validImages.length === 0) {
        Alert.alert("Lỗi", "Vui lòng chụp ít nhất một hình ảnh");
        return;
      }
      setShowConfirmModal(true);
    } else {
      // For system_user, just show confirmation modal
      setShowConfirmModal(true);
    }
  };

  const handleConfirm = async () => {
    try {
      setIsLoading(true);
      if (user?.roles === "system_fixer") {
        const formData = new FormData();
        if (user?.id) {
          formData.append("fixerId", user.id);
        }
        formData.append("activityType", "staff_checkin");
        const firstImage = images.find((img) => img !== undefined);
        if (firstImage) {
          formData.append("file", {
            uri: firstImage.uri,
            type: "image/jpeg",
            name: "image.jpg",
          } as any);
        }
        formData.append("note", note);
        formData.append("temp", "pending");
        formData.append("requestServiceId", requestId);
        const res = await ativityLogApi.createRes(formData);
        if (res) {
          onSubmit({
            images: images.filter((img) => img !== undefined),
            note,
          });
          // Reset form
          onClose();
          setImages([]);
          setNote("");
          setShowConfirmModal(false);
        }
      } else {
        // For system_user, handle confirmation
        const res = await ativityLogApi.userConfirmCheckIn(activityLogData.id, "user_confirmed");
        if (res) {
          onSubmit({
            images: [],
            note: "user_confirm",
          });
          onClose();
          setShowConfirmModal(false);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkFixerCheckIn = async () => {
    try {
      const res = await ativityLogApi.CheckFixerCheckIn(requestId as string);
      if (res.hasCheckin === true) {
        setFixerChecked(true);
        // Fetch the check-in data
        const checkInData = await ativityLogApi.getByRequestIdStaffCheckIn(requestId);
        if (checkInData) {
          setActivityLogData(checkInData);
          if(checkInData.temp === "user_confirmed"){
            setUserConfirmed(true);
          }
        }
      }
    } catch (error) {
      console.log("checkFixerCheckIn", error);
    }
  };

  useEffect(() => {
    checkFixerCheckIn();
  }, []);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center">
        <View className="bg-white w-[90%] rounded-2xl p-4 max-h-[80%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold">
              {user?.roles === "system_fixer"
                ? "Xác nhận đã đến"
                : "Xác nhận nhân viên đã đến"}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView className="space-y-4">
            {user?.roles === "system_fixer" && fixerChecked ? (
              <View className="space-y-4">
                <View className="bg-yellow-50 p-3 rounded-lg">
                  <Text className="text-yellow-800 text-center font-medium">
                    {activityLogData?.temp === "user_confirmed"
                      ? "Khách hàng đã xác nhận"
                      : "Đang chờ khách hàng xác nhận"}
                  </Text>
                </View>

                <View>
                  <Text className="text-gray-700 mb-2">Hình ảnh đã gửi</Text>
                  {activityLogData?.imageUrl && (
                    <Image
                      source={{ uri: activityLogData.imageUrl }}
                      className="w-full h-48 rounded-lg"
                      resizeMode="cover"
                    />
                  )}
                </View>

                {activityLogData?.note && (
                  <View>
                    <Text className="text-gray-700 mb-2">Ghi chú đã gửi</Text>
                    <View className="bg-gray-50 p-3 rounded-lg">
                      <Text className="text-gray-700">{activityLogData.note}</Text>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <>
                {user?.roles === "system_fixer" ? (
                  <>
                    <View>
                      <Text className="text-gray-700 mb-2">
                        Hình ảnh <Text className="text-red-500">*</Text>
                      </Text>
                      <View className="flex-row gap-3">
                        {[0].map((index) => {
                          const img = images[index];
                          return (
                            <View key={index} className="relative">
                              <TouchableOpacity
                                onPress={() => selectImage(index)}
                                className="border-dotted border w-20 h-20 border-gray-300 justify-center items-center rounded-lg overflow-hidden"
                              >
                                {img ? (
                                  <Image
                                    source={{ uri: img.uri }}
                                    className="w-full h-full"
                                  />
                                ) : (
                                  <Ionicons
                                    name="camera"
                                    size={24}
                                    color="#9CA3AF"
                                  />
                                )}
                              </TouchableOpacity>
                              {img && (
                                <TouchableOpacity
                                  onPress={() => removeImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                                >
                                  <Ionicons name="close" size={12} color="white" />
                                </TouchableOpacity>
                              )}
                            </View>
                          );
                        })}
                      </View>
                      <Text className="text-gray-500 text-sm mt-2">
                        Vui lòng chụp ảnh rõ nét và đảm bảo có thể xác định địa điểm
                        rõ ràng
                      </Text>
                    </View>

                    <View>
                      <Text className="text-gray-700 mb-2">Ghi chú</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg p-3"
                        value={note}
                        onChangeText={setNote}
                        placeholder="Nhập ghi chú (nếu có)"
                        multiline
                        numberOfLines={3}
                      />
                    </View>
                  </>
                ) : (
                  <>
                    {fixerData && (
                      <View className="bg-gray-50 p-4 rounded-lg">
                        <Text className="text-lg font-semibold mb-3">
                          Thông tin nhân viên
                        </Text>
                        <View className="flex-row items-center mb-3">
                          {fixerData.avatarurl ? (
                            <Image
                              source={{ uri: fixerData.avatarurl }}
                              className="w-16 h-16 rounded-full mr-3"
                            />
                          ) : (
                            <View className="w-16 h-16 rounded-full bg-primary mr-3 justify-center items-center">
                              <Text className="text-xl font-bold text-white">
                                {fixerData.username?.charAt(0).toUpperCase()}
                              </Text>
                            </View>
                          )}
                          <View>
                            <Text className="text-lg font-semibold">
                              {fixerData.fullName || fixerData.username}
                            </Text>
                            <View className="flex-row items-center">
                              <Ionicons name="star" size={16} color="#eab308" />
                              <Text className="text-gray-700 ml-1">
                                {fixerRating || "Chưa có đánh giá"} (
                                {fixerTotalReviews || 0} đánh giá)
                              </Text>
                            </View>
                          </View>
                        </View>
                        <TouchableOpacity
                          onPress={() => setShowTechnicianModal(true)}
                          className="bg-primary py-2 rounded-lg mt-2"
                        >
                          <Text className="text-white text-center">
                            Xem thông tin chi tiết
                          </Text>
                        </TouchableOpacity>
                        <View>
                  <Text className="text-gray-700 my-3">Hình ảnh nhân viên check in</Text>
                  {activityLogData?.imageUrl && (
                    <Image
                      source={{ uri: activityLogData.imageUrl }}
                      className="w-full h-48 rounded-lg"
                      resizeMode="cover"
                    />
                  )}
                </View>

                {activityLogData?.note && (
                  <View>
                    <Text className="text-gray-700 mb-2">Ghi chú đã gửi</Text>
                    <View className="bg-gray-50 p-3 rounded-lg">
                      <Text className="text-gray-700">{activityLogData.note}</Text>
                    </View>
                  </View>
                )}
                      </View>
                    )}
                  </>
                )}
              </>
            )}
            {user?.roles === "system_user" && userConfirmed === true && (<Text className="mt-3">Bạn đã xác nhận là nhân viên đã tới</Text>)}
            {user?.roles === "system_fixer" && userConfirmed === true && (<Text className="mt-3">Người dùng đã xác nhận là bạn đã tới</Text>)}
            {(!fixerChecked || user?.roles === "system_user") && userConfirmed === false && (
              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-primary py-3 rounded-lg mt-4"
              >
                <Text className="text-white text-center font-semibold">
                  {user?.roles === "system_fixer"
                    ? "Xác nhận đã đến"
                    : "Xác nhận nhân viên đã đến"}
                </Text>
              </TouchableOpacity>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] rounded-2xl p-4">
            <Text className="text-base font-bold mb-4 text-center">
              {user?.roles === "system_fixer"
                ? "Xác nhận là bạn đã đến"
                : "Xác nhận nhân viên đã đến"}
            </Text>
            <Text className="text-base font-bold mb-4 text-center">
              {user?.roles === "system_fixer"
                ? "Hãy đảm bảo rằng bạn đã đến đúng địa điểm, nếu bạn cố tình gian lận chúng tôi sẽ có hình phạt thích đáng"
                : "Hãy đảm bảo rằng nhân viên đã đến nơi bạn đã hẹn"}
            </Text>
            <View className="flex-row justify-end space-x-4 mt-6 gap-3">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                disabled={isLoading}
                className="bg-gray-200 py-3 px-6 rounded-lg"
              >
                <Text className="text-gray-700">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-primary py-3 px-6 rounded-lg"
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" size={20} />
                ) : (
                  <Text className="text-white">Xác nhận</Text>
                )}
              </TouchableOpacity>
            </View>
            <View className="mt-4">
              <Text className="text-gray-500 text-sm text-center">
                *Bằng cách nhấn "Xác nhận", bạn đồng ý với{" "}
                <Text className="text-primary font-semibold">
                  điều khoản sử dụng
                </Text>{" "}
                của chúng tôi.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      {/* Technician Detail Modal */}
      <TechnicianDetailModal
        visible={showTechnicianModal}
        onClose={() => setShowTechnicianModal(false)}
        technician={fixerData || {}}
        skills={fixerSkills}
        rating={fixerRating}
        totalReviews={fixerTotalReviews}
        bgColor="#fff"
        color="#000"
        experience="0"
        roles={user?.roles as string}
      />
    </Modal>
  );
};

export default CheckInModal;
