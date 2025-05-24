import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/stores/user-store";

interface CancelRequestModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (selectedReasons: string[], note: string) => void;
}

const CANCEL_REASONS_FIXER = [
  "Không liên lạc được với khách hàng",
  "Khách hàng không có nhu cầu sửa chữa",
  "Địa chỉ không chính xác",
  "Không có thiết bị cần thiết để sửa chữa",
  "Không đủ kỹ năng để sửa chữa",
  "Lý do khác",
];

const CANCEL_REASONS_CUSTOMER = [
  "Không liên lạc được với kỹ thuật viên",
  "Kỹ thuật viên không có nhu cầu sửa chữa",
  "Tôi không cần nữa",
  "Tôi muốn thay đổi một số thông tin",
];

const CancelRequestModal: React.FC<CancelRequestModalProps> = ({
  visible,
  onClose,
  onSubmit,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useUserStore();

  const toggleReason = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason)
        ? prev.filter((r) => r !== reason)
        : [...prev, reason]
    );
  };

  const handleSubmit = async () => {
    if (selectedReasons.length === 0) {
      alert("Vui lòng chọn ít nhất một lý do hủy");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(selectedReasons, note);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-white rounded-2xl w-full max-w-[400px] overflow-hidden">
          <View className="p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-red-500">
                Hủy yêu cầu
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4">
              Vui lòng chọn lý do hủy yêu cầu (có thể chọn nhiều):
            </Text>
            {user?.roles === "system_fixer" ? (
              <ScrollView className="max-h-[300px] mb-4">
                {CANCEL_REASONS_FIXER.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => toggleReason(reason)}
                    className={`p-3 rounded-lg mb-2 border ${
                      selectedReasons.includes(reason)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-5 h-5 rounded-full border mr-3 ${
                          selectedReasons.includes(reason)
                            ? "border-red-500 bg-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedReasons.includes(reason) && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="white"
                            style={{ marginLeft: 2 }}
                          />
                        )}
                      </View>
                      <Text
                        className={`flex-1 ${
                          selectedReasons.includes(reason)
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        {reason}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            ) : (
              <ScrollView className="max-h-[300px] mb-4">
                {CANCEL_REASONS_CUSTOMER.map((reason) => (
                  <TouchableOpacity
                    key={reason}
                    onPress={() => toggleReason(reason)}
                    className={`p-3 rounded-lg mb-2 border ${
                      selectedReasons.includes(reason)
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200"
                    }`}
                  >
                    <View className="flex-row items-center">
                      <View
                        className={`w-5 h-5 rounded-full border mr-3 ${
                          selectedReasons.includes(reason)
                            ? "border-red-500 bg-red-500"
                            : "border-gray-300"
                        }`}
                      >
                        {selectedReasons.includes(reason) && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color="white"
                            style={{ marginLeft: 2 }}
                          />
                        )}
                      </View>
                      <Text
                        className={`flex-1 ${
                          selectedReasons.includes(reason)
                            ? "text-red-500"
                            : "text-gray-700"
                        }`}
                      >
                        {reason}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <Text className="text-gray-600 mb-2">Ghi chú thêm:</Text>
            <TextInput
              className="border border-gray-200 rounded-lg p-3 mb-4 min-h-[100px] text-gray-700"
              multiline
              placeholder="Nhập ghi chú (nếu có)"
              value={note}
              onChangeText={setNote}
            />

            <View className="flex-row justify-end space-x-4 gap-3">
              <TouchableOpacity
                onPress={onClose}
                className="bg-gray-200 py-3 px-6 rounded-lg"
                disabled={loading}
              >
                <Text className="text-gray-700">Đóng</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSubmit}
                className="bg-red-500 py-3 px-6 rounded-lg"
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text className="text-white">Xác nhận hủy</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CancelRequestModal;
