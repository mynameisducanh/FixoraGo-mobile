import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { userData, genderOptions, districts } from "@/temp/userData";
import BackButton from "@/components/buttonDefault/backButton";

const EditProfile = () => {
  const router = useRouter();
  const [formData, setFormData] = useState(userData);
  const [selectedDistrict, setSelectedDistrict] = useState(userData.address);

  const pickImage = async (type: "avatar" | "cover") => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: type === "avatar" ? [1, 1] : [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      if (type === "avatar") {
        setFormData({ ...formData, avatar: result.assets[0].uri });
      } else {
        setFormData({ ...formData, coverImage: result.assets[0].uri });
      }
    }
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    console.log("Saving profile:", formData);
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />
      <ScrollView className="flex-1">
        {/* Cover Image */}
        <View className="relative h-48">
          <Image
            source={{ uri: formData.coverImage }}
            className="w-full h-full"
            resizeMode="cover"
          />
          <TouchableOpacity
            onPress={() => pickImage("cover")}
            className="absolute bottom-4 right-4 bg-white/80 p-2 rounded-full"
          >
            <EvilIcons name="pencil" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View className="relative -mt-16 items-center">
          <View className="relative">
            <Image
              source={{ uri: formData.avatar }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />
            <TouchableOpacity
              onPress={() => pickImage("avatar")}
              className="absolute bottom-0 right-0 bg-white/80 p-2 rounded-full"
            >
              <EvilIcons name="pencil" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <View className="px-4 py-6">
          <View className="mb-4">
            <Text className="text-gray-600 mb-2">Họ</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3"
              value={formData.firstName}
              onChangeText={(text) =>
                setFormData({ ...formData, firstName: text })
              }
              placeholder="Nhập họ"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-2">Tên</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3"
              value={formData.lastName}
              onChangeText={(text) =>
                setFormData({ ...formData, lastName: text })
              }
              placeholder="Nhập tên"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-2">Số điện thoại</Text>
            <TextInput
              className="border border-gray-300 rounded-xl p-3"
              value={formData.phone}
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-2">Giới tính</Text>
            <View className="border border-gray-300 rounded-xl">
              {/* <Picker
                selectedValue={formData.gender}
                onValueChange={(value) =>
                  setFormData({ ...formData, gender: value })
                }
              >
                {genderOptions.map((option) => (
                  <Picker.Item
                    key={option.value}
                    label={option.label}
                    value={option.value}
                  />
                ))}
              </Picker> */}
            </View>
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-2">Quận/Huyện</Text>
            <View className="border border-gray-300 rounded-xl">
              {/* <Picker
                selectedValue={selectedDistrict}
                onValueChange={(value) => {
                  setSelectedDistrict(value);
                  setFormData({ ...formData, address: value });
                }}
              >
                {districts.map((district) => (
                  <Picker.Item
                    key={district}
                    label={district}
                    value={district}
                  />
                ))}
              </Picker> */}
            </View>
          </View>

          <TouchableOpacity
            onPress={handleSave}
            className="bg-primary py-3 rounded-xl mt-4"
          >
            <Text className="text-white text-center font-semibold text-base">
              Lưu thay đổi
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;
