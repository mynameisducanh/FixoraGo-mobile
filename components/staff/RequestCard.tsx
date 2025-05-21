import { Text, View, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

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

interface RequestCardProps {
  data: RequestData;
  onPress: () => void;
  onShowMap: (address: string) => void;
}

const RequestCard: React.FC<RequestCardProps> = ({
  data,
  onPress,
  onShowMap,
}) => {
  const router = useRouter();
  const [showMap, setShowMap] = useState(false);

  let imageUrl = null;
  if (data.fileImage) {
    try {
      const arr = JSON.parse(data.fileImage);
      if (Array.isArray(arr) && arr.length > 0) imageUrl = arr[0];
    } catch {}
  }

  return (
    <TouchableOpacity
      key={data.id}
      className="bg-white rounded-xl p-4 mb-3"
      disabled={true}
      onPress={onPress}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-1 mr-3">
          <Text
            className="text-lg font-bold text-gray-900 mb-1"
            numberOfLines={1}
          >
            {data.nameService}
          </Text>
          <Text className="text-gray-500 text-sm mb-1" numberOfLines={1}>
            {data.listDetailService} - {data.priceService}
          </Text>
        </View>
      </View>

      <View className="flex-row items-start mb-2">
        <Ionicons
          name="location-outline"
          size={18}
          color="#6b7280"
          style={{ marginTop: 2 }}
        />
        <Text className="text-gray-600 text-sm flex-1 ml-2" numberOfLines={2}>
          {data.address}
        </Text>
      </View>

      <View className="flex-row items-center mb-2">
        <Ionicons name="calendar-outline" size={18} color="#6b7280" />
        <Text className="text-gray-600 text-sm ml-2">{data.calender}</Text>
      </View>

      <View className="flex-row items-start">
        <Ionicons
          name="chatbubble-outline"
          size={18}
          color="#6b7280"
          style={{ marginTop: 2 }}
        />
        <Text className="text-gray-500 text-sm ml-2 flex-1" numberOfLines={2}>
          {data.note ? data.note : "Trống"}
        </Text>
      </View>
      <View className="flex-row justify-between mt-3">
        <TouchableOpacity
          className="bg-green-500 p-3 rounded-lg"
          onPress={() => onShowMap(data.address)}
        >
          <Text className="text-white font-semibold text-center">
            Xem đường đi trên Map
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-primary p-3 rounded-lg"
          onPress={() => {
            if (data.id) {
              router.push(`/requestService/detail?idRequest=${data.id}`);
            }
          }}
        >
          <Text className="text-white font-semibold text-center">
            Xem chi tiết
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default RequestCard;
