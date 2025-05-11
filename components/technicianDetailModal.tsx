import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Entypo from "@expo/vector-icons/Entypo";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
interface TechnicianDetailModalProps {
  visible: boolean;
  onClose: () => void;
  technician: {
    avatar: string;
    name: string;
    hometown: string;
    phone: string;
    rating: number;
    totalReviews: number;
    experience: string;
    skills: string[];
  };
  bgColor:string;
  color:string;
}

const TechnicianDetailModal = ({
  visible,
  onClose,
  technician,
  bgColor,
  color
}: TechnicianDetailModalProps) => {
  return (
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
              <Image
                source={{ uri: technician.avatar }}
                className="w-24 h-24 rounded-full mb-4"
                resizeMode="cover"
              />
              <Text className="text-2xl font-bold text-gray-900 mb-1">
                {technician.name}
              </Text>
              <View className="flex-row items-center">
                <Ionicons name="star" size={20} color="#eab308" />
                <Text className="text-gray-700 font-semibold ml-1">
                  {technician.rating}
                </Text>
                <Text className="text-gray-500 ml-1">
                  ({technician.totalReviews} đánh giá)
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row justify-center gap-3 mb-3">
              <TouchableOpacity className="items-center">
                <View className={` p-3 rounded-full mb-1 ${bgColor}`}>
                  <Entypo name="message" size={24} color={color} />
                </View>
                <Text className="text-gray-600 text-sm">Nhắn tin</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className={` p-3 rounded-full mb-1 ${bgColor}`}>
                  <Entypo name="phone" size={24} color={color} />
                </View>
                <Text className="text-gray-600 text-sm">Gọi điện</Text>
              </TouchableOpacity>
              <TouchableOpacity className="items-center">
                <View className={` p-3 rounded-full mb-1 ${bgColor}`}>
                  <Entypo name="flag" size={24} color={color} />
                </View>
                <Text className="text-gray-600 text-sm">Báo cáo</Text>
              </TouchableOpacity>
            </View>

            {/* Detailed Information */}
            <View className="px-4 space-y-4">
              <InfoItem
                icon="location"
                title="Quê quán"
                value={technician.hometown}
                color={color}
              />
              <InfoItem
                icon="call"
                title="Số điện thoại"
                value={technician.phone}
                 color={color}
              />
              <InfoItem
                icon="time"
                title="Kinh nghiệm"
                value={technician.experience}
                 color={color}
              />

              {/* Skills */}
              <View className="mb-4 mt-2">
                <Text className="text-gray-700 font-semibold mb-2">
                  Kỹ năng
                </Text>
                <View className="flex-row flex-wrap">
                  {technician.skills.map((skill, index) => (
                    <View
                      key={index}
                      style={{backgroundColor:color}}
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
  );
};

const InfoItem = ({
  icon,
  title,
  value,
  color
}: {
  icon: string;
  title: string;
  value: string;
  color:string;
}) => (
  <View className="flex-row items-center">
    <View className=" p-2 rounded-full mr-3">
      <Ionicons name={icon as any} size={20} color={color} />
    </View>
    <View className="flex-1 flex-row">
      <Text className="text-gray-900 font-medium">{value}</Text>
    </View>
  </View>
);

export default TechnicianDetailModal;
