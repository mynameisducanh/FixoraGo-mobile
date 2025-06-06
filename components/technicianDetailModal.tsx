import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Linking,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import Avatar from "@/components/others/Avatar";
import FixerReviewsModal from "./review/FixerReviewsModal";

interface TechnicianDetailModalProps {
  visible: boolean;
  onClose: () => void;
  technician: {
    id: string;
    username: string;
    avatarurl: string;
    fullName: string;
    address: string;
    phonenumber: string;
    authdata: string;
  };
  bgColor: string;
  color: string;
  skills: string[];
  experience: string;
  rating: number;
  totalReviews: number;
  roles: string;
}

const TechnicianDetailModal = ({
  visible,
  onClose,
  technician,
  bgColor,
  color,
  skills,
  experience,
  rating,
  totalReviews,
  roles,
}: TechnicianDetailModalProps) => {
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  const handleShowReviews = () => {
    console.log("Opening reviews modal for fixer:", technician.id);
    setShowReviewsModal(true);
  };

  const handleCall = async () => {
    try {
      const phoneNumber = technician.phonenumber.replace(/\s+/g, '');
      const url = `tel:${phoneNumber}`;
      const canOpen = await Linking.canOpenURL(url);
      
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Lỗi', 'Không thể mở ứng dụng gọi điện thoại');
      }
    } catch (error) {
      console.error('Error making phone call:', error);
      Alert.alert('Lỗi', 'Không thể thực hiện cuộc gọi');
    }
  };

  return (
    <View>
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View
            style={{ height: hp(60), width: wp(90) }}
            className="bg-white rounded-2xl"
          >
            {/* Header */}
            <View className="flex-row justify-end items-center mt-4 px-4 ">
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#4b5563" />
              </TouchableOpacity>
            </View>

            <ScrollView className="flex-1">
              {/* Avatar and Basic Info */}
              <View className="items-center pb-4">
                {technician.avatarurl ? (
                  <Image
                    source={{ uri: technician.avatarurl }}
                    className="w-24 h-24 rounded-full mb-4"
                    resizeMode="cover"
                  />
                ) : (
                  <Avatar size={96} username={technician?.username} />
                )}

                <Text className="text-2xl font-bold text-gray-900 mb-1 mt-3">
                  {technician.fullName || technician.username}
                </Text>
                {roles === "system_user" && (
                  <View className="flex-row items-center">
                    <Ionicons name="star" size={20} color="#eab308" />
                    <Text className="text-gray-700 font-semibold ml-1">
                      {rating || "Chưa có đánh giá"}
                    </Text>
                    <Text className="text-gray-500 ml-1">
                      ({totalReviews || "chưa có"} đánh giá)
                    </Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View className="flex-row justify-center gap-3 mb-3">
                <TouchableOpacity className="items-center">
                  <View className={` p-3 rounded-full mb-1 ${bgColor}`}>
                    <Entypo name="message" size={24} color={color} />
                  </View>
                  <Text className="text-gray-600 text-sm">Nhắn tin</Text>
                </TouchableOpacity>
                <TouchableOpacity className="items-center" onPress={handleCall}>
                  <View className={` p-3 rounded-full mb-1 ${bgColor}`}>
                    <Entypo name="phone" size={24} color={color} />
                  </View>
                  <Text className="text-gray-600 text-sm">Gọi điện</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity className="items-center">
                  <View className={` p-3 rounded-full mb-1 ${bgColor}`}>
                    <Entypo name="flag" size={24} color={color} />
                  </View>
                  <Text className="text-gray-600 text-sm">Báo cáo</Text>
                </TouchableOpacity> */}
              </View>

              {/* Detailed Information */}
              <View className="px-4 space-y-4">
                <InfoItem
                  icon="location"
                  title="Quê quán"
                  value={technician.address}
                  color={color}
                />

                <InfoItem
                  icon="call"
                  title="Số điện thoại"
                  value={technician.phonenumber}
                  color={color}
                />
                {technician.authdata && (
                  <InfoItem
                    icon="hammer"
                    title="Kĩ năng chính"
                    value={technician.authdata}
                    color={color}
                    iconType="MaterialCommunityIcons"
                  />
                )}

                {/* Skills */}
                <View className="mb-4 mt-2">
                  <View className="flex-row flex-wrap">
                    {skills.map((skill, index) => (
                      <View
                        key={index}
                        style={{ backgroundColor: color }}
                        className="bg-primary px-3 py-1 rounded-full mr-2 mb-2"
                      >
                        <Text className="text-white">{skill}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {roles === "system_user" && (
        <FixerReviewsModal
          visible={showReviewsModal}
          onClose={() => setShowReviewsModal(false)}
          fixerId={technician.id}
        />
      )}
    </View>
  );
};

const InfoItem = ({
  icon,
  title,
  value,
  color,
  iconType = "Ionicons",
}: {
  icon: string;
  title: string;
  value: string;
  color: string;
  iconType?: "Ionicons" | "MaterialCommunityIcons";
}) => (
  <View className="flex-row items-center">
    <View className="p-2 rounded-full mr-3">
      {iconType === "Ionicons" ? (
        <Ionicons name={icon as any} size={20} color={color} />
      ) : (
        <MaterialCommunityIcons name={icon as any} size={20} color={color} />
      )}
    </View>
    <View className="flex-1 flex-row">
      <Text className="text-gray-900 font-medium">{value}</Text>
    </View>
  </View>
);

export default TechnicianDetailModal;
