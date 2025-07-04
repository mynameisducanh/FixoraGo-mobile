import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { Colors } from "../../constants/Colors";

interface ArrivalConfirmationModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (timeOption: string) => void;
}

const ArrivalConfirmationModal: React.FC<ArrivalConfirmationModalProps> = ({
  visible,
  onClose,
  onConfirm,
}) => {
  const [selectedTime, setSelectedTime] = useState<string>("");

  const timeOptions = [
    { label: "Khoảng 15 phút", value: "15" },
    { label: "Khoảng 30 phút", value: "30" },
    { label: "Khoảng 1 tiếng", value: "60" },
  ];

  const handleConfirm = () => {
    if (selectedTime) {
      onConfirm(selectedTime);
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <ThemedText style={styles.title}>Xác nhận đến điểm hẹn</ThemedText>
          </View>

          {/* Content */}
          <View style={styles.content}>
            <ThemedText style={styles.message}>
              Bạn có chắc chắn rằng bạn đang đến điểm hẹn? Thông báo này sẽ được
              gửi tới người dùng.
            </ThemedText>

            {/* Time Selection */}
            <View style={styles.timeSelectionContainer}>
              <ThemedText style={styles.timeSelectionTitle}>
                Chọn thời gian dự kiến:
              </ThemedText>

              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.timeOption,
                    selectedTime === option.value && styles.selectedTimeOption,
                  ]}
                  onPress={() => setSelectedTime(option.value)}
                >
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioButton,
                        selectedTime === option.value &&
                          styles.radioButtonSelected,
                      ]}
                    />
                  </View>
                  <ThemedText
                    style={[
                      styles.timeOptionText,
                      selectedTime === option.value &&
                        styles.selectedTimeOptionText,
                    ]}
                  >
                    {option.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <ThemedText style={styles.cancelButtonText}>Hủy</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.confirmButton,
                !selectedTime && styles.confirmButtonDisabled,
              ]}
              onPress={handleConfirm}
              disabled={!selectedTime}
            >
              <ThemedText style={styles.confirmButtonText}>Xác nhận</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: Colors.light.background,
    borderRadius: 16,
    padding: 20,
    margin: 20,
    width: Dimensions.get("window").width - 40,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: Colors.light.text,
  },
  content: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.light.text,
  },
  timeSelectionContainer: {
    marginTop: 16,
  },
  timeSelectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    color: Colors.light.text,
  },
  timeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  selectedTimeOption: {
    backgroundColor: Colors.light.tint,
    borderColor: Colors.light.tint,
  },
  radioContainer: {
    marginRight: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#d1d5db",
    justifyContent: "center",
    alignItems: "center",
  },
  radioButtonSelected: {
    borderColor: "white",
    backgroundColor: Colors.light.tint,
  },
  timeOptionText: {
    fontSize: 16,
    color: Colors.light.text,
  },
  selectedTimeOptionText: {
    color: Colors.light.background,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.text,
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
    alignItems: "center",
  },
  confirmButtonDisabled: {
    backgroundColor: "#d1d5db",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.light.background,
  },
});

export default ArrivalConfirmationModal;
