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
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import {
  formatPrice,
  getNumericPrice,
  getPriceSuggestions,
} from "@/utils/priceFormat";
import RequestConfirmServiceApi from "@/api/requestConfirmServiceApi";
import { useUserStore } from "@/stores/user-store";

interface RepairItem {
  id?: string;
  type: string;
  name: string;
  images: ImagePicker.ImagePickerAsset[];
  price: string;
  note: string;
}

interface ProposeRepairModalProps {
  visible: boolean;
  requestServiceId: string;
  onClose: () => void;
  onSubmit: (data: {
    type: string;
    name: string;
    images: ImagePicker.ImagePickerAsset[];
    price: string;
    note: string;
  }) => void;
  onSuccess?: () => void;
}

const PriceSuggestions: React.FC<{
  basePrice: string;
  onSelect: (price: string) => void;
}> = ({ basePrice, onSelect }) => {
  const suggestions = getPriceSuggestions(basePrice);

  if (suggestions.length === 0) return null;

  return (
    <View className="flex-row flex-wrap gap-2 mt-2">
      {suggestions.map((suggestion, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => onSelect(suggestion)}
          className="bg-gray-100 px-3 py-1 rounded-full"
        >
          <Text className="text-gray-700">{formatPrice(suggestion)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const ProposeRepairModal: React.FC<ProposeRepairModalProps> = ({
  visible,
  requestServiceId,
  onClose,
  onSubmit,
  onSuccess,
}) => {
  const [type, setType] = useState("repair");
  const [name, setName] = useState("");
  const [images, setImages] = useState<ImagePicker.ImagePickerAsset[]>([]);
  const [price, setPrice] = useState("");
  const [note, setNote] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const { user } = useUserStore();
  const [repairHistory, setRepairHistory] = useState<RepairItem[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [idReuqestConfirmTotal, setIdReuqestConfirmTotal] = useState();
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState<number | null>(null);
  const [checkAccpet, setCheckAccpet] = useState("null");
  const requestConfirmServiceApi = new RequestConfirmServiceApi();
  // Calculate total price
  const totalPrice = repairHistory.reduce((sum, repair) => {
    const price = parseFloat(repair.price.replace(/[^0-9.-]+/g, "")) || 0;
    return sum + price;
  }, 0);

  // Fetch repair proposals when modal opens
  useEffect(() => {
    const fetchRepairProposals = async () => {
      if (visible && requestServiceId) {
        try {
          const response = await requestConfirmServiceApi.getByRequestId(
            requestServiceId,
            { type: "repair" }
          );
          const response2 = await requestConfirmServiceApi.getByRequestId(
            requestServiceId,
            { type: "total" }
          );
          if (Array.isArray(response2) && response2.length > 0) {
            setIdReuqestConfirmTotal(response2[0].id);

            if (response2[0].userAccept) {
              setCheckAccpet("Accepted");
            } else {
              setCheckAccpet("Pending");
            }
          }
          if (response && Array.isArray(response)) {
            // Transform the response data to match RepairItem interface
            const transformedData = response.map((item) => ({
              id: item.id,
              type: item.type,
              name: item.name,
              images: item.images
                ? item.images.map((img: string) => ({
                    uri: img,
                    type: "image",
                    width: 0,
                    height: 0,
                  }))
                : [],
              price: item.price,
              note: item.note,
            }));
            setRepairHistory(transformedData);
          }
        } catch (error) {
          console.error("Error fetching repair proposals:", error);
        }
      }
    };

    fetchRepairProposals();
  }, [visible, requestServiceId]);
  const handleFinalUserConfirm = async () => {
    try {
      const res = await requestConfirmServiceApi.userAccept(
        idReuqestConfirmTotal
      );
      if (res.statusCode === 500) {
        Alert.alert("Thông báo", "Hiện chưa có yêu cầu nào");
        setShowSummaryModal(false);
        onClose();
        onSuccess?.();
        return;
      }
      if (res) {
        setShowSummaryModal(false);
        onClose();
        Alert.alert("Thông báo", "Đã chấp nhận đề xuất");
        onSuccess?.();
      }
    } catch (error) {
      console.log(error);
    }
  };
  // Function to check if form data has changed
  const hasFormChanged = () => {
    if (editingIndex === null) {
      // For new repair, check if any field is filled
      return (
        type !== "repair" ||
        name !== "" ||
        images.length > 0 ||
        price !== "" ||
        note !== ""
      );
    }

    const originalRepair = repairHistory[editingIndex];
    const currentData = {
      type,
      name,
      images: images.filter((img) => img !== undefined),
      price: getNumericPrice(price).toString(),
      note,
    };

    // Compare each field
    const typeChanged = originalRepair.type !== currentData.type;
    const nameChanged = originalRepair.name !== currentData.name;
    const priceChanged = originalRepair.price !== currentData.price;
    const noteChanged = originalRepair.note !== currentData.note;

    // Compare images
    const imagesChanged =
      JSON.stringify(originalRepair.images) !==
      JSON.stringify(currentData.images);

    return (
      typeChanged || nameChanged || priceChanged || noteChanged || imagesChanged
    );
  };

  const handleConfirmRequestTotal = async () => {
    if (user?.roles === "system_fixer") {
      try {
        setLoading2(true);
        const formData = new FormData();
        formData.append("price", totalPrice.toString());
        formData.append("type", "total");
        formData.append("userId", user?.id);
        formData.append("requestServiceId", requestServiceId);
        formData.append("name", "Đề xuất sửa chữa của nhân viên");
        const res = await requestConfirmServiceApi.createRequest(formData);
        if (res) {
          setShowSummaryModal(false);
          onClose();
          Alert.alert("Thông báo", "Đã gửi đề xuất tới người dùng");
          onSuccess?.();
        }
      } catch (error) {
        setShowSummaryModal(false);
        onClose();
        console.log(error);
      } finally {
        setLoading2(false);
      }
    }
    if (user?.roles === "system_user") {
      try {
        setLoading2(true);

        const res = await requestConfirmServiceApi.userAccept(requestServiceId);
        if (res) {
          setShowSummaryModal(false);
          onClose();
          Alert.alert("Thông báo", "Đã xác nhận");
          onSuccess?.();
        }
      } catch (error) {}
    }
  };
  // Update hasChanges whenever form data changes
  useEffect(() => {
    setHasChanges(hasFormChanged());
  }, [type, name, images, price, note]);

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

  // Format price as user types
  const handlePriceChange = (text: string) => {
    setPrice(formatPrice(text));
  };

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập tên sửa chữa");
      return;
    }
    if (!price.trim()) {
      Alert.alert("Lỗi", "Vui lòng nhập giá tiền");
      return;
    }
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    const newRepair = {
      type,
      name,
      images: images.filter((img) => img !== undefined),
      price: getNumericPrice(price).toString(),
      note,
    };
    try {
      setLoading(true);
      const formData = new FormData();
      if (editingIndex !== null) {
        if (user?.id) {
          formData.append("userId", user.id);
        }
        formData.append("name", newRepair.name);
        formData.append("type", newRepair.type);
        formData.append("price", newRepair.price);
        formData.append("note", newRepair.note);
        newRepair.images.forEach((image, index) => {
          formData.append(`file`, {
            uri: image.uri,
            name: image.uri.split("/").pop() || `image${index}.jpg`,
            type: image.type || "image/jpeg",
          } as any);
        });
      } else {
        if (user?.id) {
          formData.append("userId", user.id);
        }
        formData.append("name", newRepair.name);
        formData.append("type", newRepair.type);
        formData.append("price", newRepair.price);
        formData.append("note", newRepair.note);
        formData.append("requestServiceId", requestServiceId);

        newRepair.images.forEach((image, index) => {
          formData.append(`file`, {
            uri: image.uri,
            name: image.uri.split("/").pop() || `image${index}.jpg`,
            type: image.type || "image/jpeg",
          } as any);
        });
      }

      if (editingIndex !== null) {
        // Update existing repair
        const repair = repairHistory[editingIndex];
        if (!repair.id) {
          Alert.alert("Lỗi", "Không thể cập nhật đề xuất sửa chữa này");
          return;
        }
        const res = await requestConfirmServiceApi.updateRequest(
          formData,
          repair.id
        );
        if (res) {
          setRepairHistory((prev) => {
            const updated = [...prev];
            updated[editingIndex] = { ...newRepair, id: repair.id };
            return updated;
          });
        }
      } else {
        // Create new repair
        const res = await requestConfirmServiceApi.createRequest(formData);
        if (res && res.id) {
          setRepairHistory((prev) => [...prev, { ...newRepair, id: res.id }]);
        }
      }

      // Reset form
      setType("repair");
      setName("");
      setImages([]);
      setPrice("");
      setNote("");
      setShowConfirmModal(false);
      setShowForm(false);
      setEditingIndex(null);
    } catch (error) {
      console.log(error);
      Alert.alert("Lỗi", "Có lỗi xảy ra khi lưu đề xuất sửa chữa");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    const repair = repairHistory[index];
    setType(repair.type);
    setName(repair.name);
    setImages(repair.images);
    // Format the stored numeric price when editing
    setPrice(formatPrice(repair.price));
    setNote(repair.note);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDelete = async (index: number) => {
    Alert.alert("Xác nhận xóa", "Bạn có chắc chắn muốn xóa sửa chữa này?", [
      {
        text: "Hủy",
        style: "cancel",
      },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            setDeleteLoading(index);
            const repair = repairHistory[index];
            if (!repair.id) {
              Alert.alert("Lỗi", "Không thể xóa đề xuất sửa chữa này");
              return;
            }
            const res = await requestConfirmServiceApi.deleteRequest(repair.id);
            if (res) {
              setRepairHistory((prev) => prev.filter((_, i) => i !== index));
            }
          } catch (error) {
            console.log(error);
            Alert.alert("Lỗi", "Có lỗi xảy ra khi xóa đề xuất sửa chữa");
          } finally {
            setDeleteLoading(null);
          }
        },
      },
    ]);
  };

  const handleFinalConfirm = () => {
    if (repairHistory.length === 0) {
      Alert.alert("Lỗi", "Vui lòng thêm ít nhất một đề xuất sửa chữa");
      return;
    }
    setShowSummaryModal(true);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] rounded-2xl p-4 max-h-[80%]">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold">Đề xuất sửa chữa</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {!showForm && (
              <Text className="mb-2">Các đề xuất của nhân viên :</Text>
            )}
            {!showForm ? (
              <View className="space-y-4">
                {repairHistory.map((repair, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleEdit(index)}
                    className="bg-gray-100 py-4 px-4 rounded-lg mt-3"
                  >
                    <View className="flex-row justify-between items-center">
                      <View className="flex-1">
                        <Text className="text-gray-700 font-medium">
                          {repair.name}
                        </Text>
                        <Text className="text-gray-500 text-sm">
                          Giá: {repair.price} VNĐ
                        </Text>
                      </View>
                      {checkAccpet !== "Accepted" &&
                        user?.roles === "system_fixer" && (
                          <TouchableOpacity
                            onPress={(e) => {
                              e.stopPropagation();
                              handleDelete(index);
                            }}
                            className="bg-red-500 p-2 rounded-lg"
                            disabled={deleteLoading === index}
                          >
                            {deleteLoading === index ? (
                              <ActivityIndicator color="white" size="small" />
                            ) : (
                              <Ionicons
                                name="trash-outline"
                                size={20}
                                color="white"
                              />
                            )}
                          </TouchableOpacity>
                        )}
                    </View>
                  </TouchableOpacity>
                ))}
                {checkAccpet !== "Accepted" &&
                  user?.roles === "system_fixer" && (
                    <TouchableOpacity
                      onPress={() => setShowForm(true)}
                      className="py-4 rounded-lg w-full border border-dashed border-primary mt-3"
                    >
                      <Text className="text-primary text-center font-semibold">
                        Thêm đề xuất
                      </Text>
                    </TouchableOpacity>
                  )}
                {user?.roles === "system_fixer" && (
                  <View>
                    {checkAccpet === "Pending" && (
                      <Text className="mt-2">
                        Note : Yêu cầu của bạn đã được gửi, vui lòng chờ người
                        dùng chấp nhận yêu cầu của bạn, và trong lúc này bạn
                        cũng có thể sửa đổi nếu muốn
                      </Text>
                    )}
                    {checkAccpet === "Accepted" && (
                      <Text className="mt-2">
                        Note : Khách hàng đã chấp nhận yêu cầu này
                      </Text>
                    )}
                    {checkAccpet !== "Accepted" && (
                      <TouchableOpacity
                        disabled={checkAccpet === "Accepted"}
                        onPress={handleFinalConfirm}
                        className="bg-green-500 py-4 rounded-lg w-full mt-5"
                      >
                        <Text className="text-white text-center font-semibold">
                          {checkAccpet === "Pending"
                            ? "Gửi lại yêu cầu"
                            : "Gửi yêu cầu"}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                {user?.roles === "system_user" && (
                  <View>
                    <View className=" p-2 rounded-lg">
                      <Text className="text-gray-600 text-center mb-2">
                        Tổng giá tiền
                      </Text>
                      <Text className="text-2xl font-bold text-center text-primary">
                        {formatPrice(totalPrice)} VNĐ
                      </Text>
                    </View>
                    {checkAccpet !== "Accepted" && (
                      <Text className="mt-2">
                        Note : Đây là các yêu cầu sửa chữa của nhân viên, nếu
                        bạn với nhân viên đã thỏa thuận xong hãy nhấn xác nhận
                      </Text>
                    )}
                    {checkAccpet === "Accepted" && (
                      <Text className="mt-2">
                        Note :Bạn đã chấp nhận yêu cầu này
                      </Text>
                    )}
                    {checkAccpet !== "Accepted" && repairHistory.length > 0 && (
                      <TouchableOpacity
                        disabled={checkAccpet === "Accepted"}
                        onPress={handleFinalUserConfirm}
                        className="bg-green-500 py-4 rounded-lg w-full mt-5"
                      >
                        <Text className="text-white text-center font-semibold">
                          Chấp nhận yêu cầu
                        </Text>
                      </TouchableOpacity>
                    )}
                    {checkAccpet !== "Accepted" && repairHistory.length <= 0 && (
                      <Text className="mt-2">
                        Hiện chưa có yêu cầu nào
                      </Text>
                    )}
                  </View>
                )}
              </View>
            ) : (
              <ScrollView
                className="space-y-4"
                keyboardShouldPersistTaps="handled"
              >
                <View className="flex-row items-center">
                  <Text className="text-gray-700 mb-2 mr-2">Loại sửa chữa</Text>
                  <View className="flex-1 flex-row space-x-4 gap-5 items-center">
                    <TouchableOpacity
                      disabled={checkAccpet === "Accepted"}
                      onPress={() => setType("repair")}
                      className="flex-1 flex-row items-center space-x-2 bg-gray-100 p-3 rounded-lg"
                    >
                      <View
                        className={`w-5 h-5 rounded-full border-2 ${
                          type === "repair"
                            ? "border-primary"
                            : "border-gray-400"
                        } items-center justify-center`}
                      >
                        {type === "repair" && (
                          <View className="w-3 h-3 rounded-full bg-primary" />
                        )}
                      </View>
                      <Text className="text-gray-700 ml-3">Sửa chữa</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      disabled={
                        checkAccpet === "Accepted" ||
                        user?.roles === "system_user"
                      }
                      onPress={() => setType("replace")}
                      className="flex-1 flex-row items-center space-x-2 bg-gray-100 p-3 rounded-lg"
                    >
                      <View
                        className={`w-5 h-5 rounded-full border-2 ${
                          type === "replace"
                            ? "border-primary"
                            : "border-gray-400"
                        } items-center justify-center`}
                      >
                        {type === "replace" && (
                          <View className="w-3 h-3 rounded-full bg-primary" />
                        )}
                      </View>
                      <Text className="text-gray-700 ml-3">Thay mới</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <Text className="text-gray-700 my-2">Tên sửa chữa</Text>
                  <TextInput
                    className="border border-gray-300 rounded-lg p-3"
                    value={name}
                    editable={
                      checkAccpet !== "Accepted" &&
                      user?.roles !== "system_user"
                    }
                    onChangeText={setName}
                    placeholder="Nhập tên sửa chữa"
                  />
                </View>

                <View className="flex-row gap-3">
                  <View>
                    <Text className="text-gray-700 my-2">Hình ảnh</Text>
                    <View className="flex-row gap-3">
                      {[0].map((index) => {
                        const img = images[index];
                        return (
                          <View key={index} className="relative">
                            <TouchableOpacity
                              disabled={
                                checkAccpet === "Accepted" ||
                                user?.roles === "system_user"
                              }
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
                                disabled={checkAccpet === "Accepted"}
                                onPress={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-red-500 rounded-full p-1"
                              >
                                <Ionicons
                                  name="close"
                                  size={12}
                                  color="white"
                                />
                              </TouchableOpacity>
                            )}
                          </View>
                        );
                      })}
                    </View>
                  </View>
                  <View className="flex-1">
                    <View className="w-full">
                      <Text className="text-gray-700 my-2">Giá tiền</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg p-3 w-full"
                        value={price}
                        onChangeText={handlePriceChange}
                        editable={
                          checkAccpet !== "Accepted" &&
                          user?.roles !== "system_user"
                        }
                        placeholder="Nhập giá tiền"
                        keyboardType="numeric"
                      />
                      {checkAccpet !== "Accepted" && (
                        <PriceSuggestions
                          basePrice={getNumericPrice(price).toString()}
                          onSelect={(suggestedPrice) => {
                            const formattedPrice = new Intl.NumberFormat(
                              "vi-VN"
                            ).format(parseInt(suggestedPrice));
                            setPrice(formattedPrice);
                          }}
                        />
                      )}
                    </View>

                    <View>
                      <Text className="text-gray-700 my-2">Ghi chú</Text>
                      <TextInput
                        className="border border-gray-300 rounded-lg p-3"
                        value={note}
                        onChangeText={setNote}
                        placeholder="Nhập ghi chú (Không bắt buộc"
                        multiline
                        editable={
                          checkAccpet !== "Accepted" &&
                          user?.roles !== "system_user"
                        }
                        numberOfLines={3}
                      />
                    </View>
                  </View>
                </View>

                <View className="flex-row space-x-4 my-2 gap-2">
                  <TouchableOpacity
                    onPress={() => {
                      setShowForm(false);
                      setEditingIndex(null);
                      setType("repair");
                      setName("");
                      setImages([]);
                      setPrice("");
                      setNote("");
                    }}
                    className="flex-1 bg-gray-200 py-3 rounded-lg"
                    disabled={loading}
                  >
                    <Text className="text-gray-700 text-center font-semibold">
                      {checkAccpet === "Accepted" ? "Quay lại" : "Hủy"}
                    </Text>
                  </TouchableOpacity>
                  {checkAccpet !== "Accepted" && (
                    <TouchableOpacity
                      onPress={handleSubmit}
                      className={`flex-1 py-3 rounded-lg ${
                        hasChanges ? "bg-primary" : "bg-gray-400"
                      }`}
                      disabled={!hasChanges || loading}
                    >
                      {loading ? (
                        <ActivityIndicator color="white" />
                      ) : (
                        <Text className="text-white text-center font-semibold">
                          {editingIndex !== null ? "Cập nhật" : "Xác nhận"}
                        </Text>
                      )}
                    </TouchableOpacity>
                  )}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] rounded-2xl p-4">
            <Text className="text-xl font-bold mb-4 text-center">
              Xác nhận thông tin
            </Text>

            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Loại sửa chữa:</Text>
                <Text className="font-medium">
                  {type === "repair" ? "Sửa chữa" : "Thay mới"}
                </Text>
              </View>

              <View className="flex-row justify-between ">
                <Text className="text-gray-600">Tên sửa chữa:</Text>
                <Text className="font-medium">{name}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Giá tiền:</Text>
                <Text className="font-medium">{price}</Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600">Ghi chú:</Text>
                <Text className="font-medium">{note || "Không có"}</Text>
              </View>
            </View>

            <View className="flex-row justify-end space-x-4 mt-6">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="bg-gray-200 py-3 px-6 rounded-lg"
              >
                <Text className="text-gray-700">Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirm}
                className="bg-primary py-3 px-6 rounded-lg"
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">
                    {editingIndex !== null ? "Cập nhật" : "Xác nhận"}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Summary Modal */}
      <Modal
        visible={showSummaryModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSummaryModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="bg-white w-[90%] rounded-2xl p-4">
            <Text className="text-xl font-bold mb-4 text-center">
              Tổng kết đề xuất
            </Text>

            <View className="space-y-4">
              <View className=" p-2 rounded-lg">
                <Text className="text-gray-600 text-center mb-2">
                  Số lượng đề xuất
                </Text>
                <Text className="text-2xl font-bold text-center text-primary">
                  {repairHistory.length}
                </Text>
              </View>

              <View className=" p-2 rounded-lg">
                <Text className="text-gray-600 text-center mb-2">
                  Tổng giá tiền
                </Text>
                <Text className="text-2xl font-bold text-center text-primary">
                  {formatPrice(totalPrice)} VNĐ
                </Text>
              </View>
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
            <View className="flex-row justify-between space-x-4 mt-6">
              <TouchableOpacity
                onPress={() => setShowSummaryModal(false)}
                className="bg-gray-200 py-3 px-6 rounded-lg"
              >
                <Text className="text-gray-700">Quay lại</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  handleConfirmRequestTotal();
                }}
                className="bg-primary py-3 px-6 rounded-lg"
                disabled={loading2}
              >
                {loading2 ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Hoàn tất</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Modal>
  );
};

export default ProposeRepairModal;
