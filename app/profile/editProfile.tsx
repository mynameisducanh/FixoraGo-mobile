import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { EvilIcons, Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import Avatar from "@/components/others/Avatar";
import UserApi from "@/api/userApi";
import LocationPicker from "@/components/default/locationPicker";
import { useUserStore } from "@/stores/user-store";

interface Location {
  code: string;
  name: string;
}

const genderOptions = [
  { label: "Nam", value: "Nam" },
  { label: "Nữ", value: "Nữ" },
  { label: "Khác", value: "Khác" },
];

const convertGender = (genderString: string) => {
  switch (genderString) {
    case "Nam":
      return "Nam";
    case "Nữ":
      return "Nữ";
    case "Khác":
      return "Khác";
    default:
      return "";
  }
};

const EditProfile = () => {
  const router = useRouter();
  const { user } = useUserStore();
  const userApi = new UserApi();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    gioitinh: "",
    avatar: "",
    username: "",
    address: "",
  });

  const [loading, setLoading] = useState(true);
  const [isLocationModalVisible, setIsLocationModalVisible] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState<Location | null>(
    null
  );
  const [selectedDistrict, setSelectedDistrict] = useState<Location | null>(
    null
  );
  const [selectedWard, setSelectedWard] = useState<Location | null>(null);
  const [detailAddress, setDetailAddress] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await userApi.getByUserId(user?.id);
        console.log("User API response:", response);
        if (response) {
          setFormData({
            firstName: response.firstname || "",
            lastName: response.lastname || "",
            phone: response.phonenumber || "",
            gioitinh: convertGender(response.gioitinh),
            avatar: response.avatarurl || "",
            username: response.username || "",
            address: response.address || "",
          });
        }
      } catch (error) {
        console.log("Lỗi lấy thông tin người dùng:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const pickImage = async (type: "avatar" | "coverImage") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setFormData((prev) => ({
        ...prev,
        [type]: uri,
      }));
    }
  };

  const handleSave = async () => {
    const data = new FormData();
    data.append("firstName", formData.firstName);
    data.append("lastName", formData.lastName);
    data.append("phone", formData.phone);
    data.append("gioitinh", formData.gioitinh);
    if (selectedProvince?.name && selectedDistrict?.name) {
      data.append(
        "address",
        `${detailAddress} ${selectedWard?.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}` ||
          ""
      );
    }

    if (formData.avatar?.startsWith("file")) {
      data.append("avatar", {
        uri: formData.avatar,
        name: "avatar.jpg",
        type: "image/jpeg",
      } as any);
    }

    try {
      await userApi.updateUser(data, user?.id as string);
      router.back();
    } catch (error) {
      console.log("Lỗi cập nhật:", error);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Avatar */}
        <View className="items-center mt-6">
          <View className="relative w-[200px] h-[200px] rounded-full border border-primary">
            {formData.avatar ? (
              <Image
                source={{ uri: formData.avatar }}
                className="w-full h-full rounded-full"
              />
            ) : (
              <Avatar size={200} username={formData.username || "user"} />
            )}
            <TouchableOpacity
              onPress={() => pickImage("avatar")}
              className="absolute w-[50px] h-[50px] items-center justify-center bottom-3 right-3 bg-white/90 rounded-full border border-primary"
            >
              <Ionicons name="camera" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="px-4 py-6 ">
          <TextInputField
            label="Họ"
            value={formData.firstName}
            onChangeText={(text) =>
              setFormData({ ...formData, firstName: text })
            }
            placeholder="Nhập họ"
          />
          <TextInputField
            label="Tên"
            value={formData.lastName}
            onChangeText={(text) =>
              setFormData({ ...formData, lastName: text })
            }
            placeholder="Nhập tên"
          />
          <TextInputField
            label="Số điện thoại"
            value={formData.phone}
            onChangeText={(text) => setFormData({ ...formData, phone: text })}
            placeholder="Nhập số điện thoại"
            keyboardType="phone-pad"
          />

          {/* Gender */}
          <View>
            <Text className="text-gray-600 my-3">Giới tính</Text>
            <View className="flex-row gap-5 mb-3">
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() =>
                    setFormData({ ...formData, gioitinh: option.value })
                  }
                  className="flex-row items-center"
                >
                  <View
                    className={`w-5 h-5 rounded-full border ${
                      formData.gioitinh === option.value
                        ? "bg-primary border-primary"
                        : "border-gray-400"
                    }`}
                  />
                  <Text className="ml-3">{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Address */}
          <View className="mb-3">
            <Text className="text-gray-600 my-3">Địa chỉ</Text>

            <TouchableOpacity
              className="flex-row justify-between items-center border border-primary rounded-lg p-4 bg-gray-100"
              onPress={() => setIsLocationModalVisible(true)}
            >
              <Text numberOfLines={1}>
                {selectedWard
                  ? `${selectedWard.name}, ${selectedDistrict?.name}, ${selectedProvince?.name}`
                  : selectedDistrict
                  ? `${selectedDistrict.name}, ${selectedProvince?.name}`
                  : selectedProvince
                  ? selectedProvince.name
                  : `${formData.address}` || "Chọn địa điểm"}
              </Text>
              <LottieView
                source={require("@/assets/icons/location-icon.json")}
                autoPlay={false}
                loop={false}
                style={{ width: 20, height: 20 }}
              />
            </TouchableOpacity>
            {detailAddress && (
              <Text className="text-gray-600 text-sm mt-2">
                Địa chỉ chi tiết: {detailAddress}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary py-3 rounded-xl"
          >
            <Text className="text-white text-center font-semibold text-base">
              Lưu thay đổi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Location Picker */}
      <LocationPicker
        visible={isLocationModalVisible}
        onClose={() => setIsLocationModalVisible(false)}
        onSelect={(address) => {
          setSelectedProvince(address.province);
          setSelectedDistrict(address.district);
          setSelectedWard(address.ward);
          setDetailAddress(address.detail);
        }}
      />
    </View>
  );
};

// Reusable TextInput Field
const TextInputField = ({ label, ...props }) => (
  <View>
    <Text className="text-gray-600 my-3">{label}</Text>
    <TextInput className="border border-gray-300 rounded-xl p-3" {...props} />
  </View>
);

export default EditProfile;
