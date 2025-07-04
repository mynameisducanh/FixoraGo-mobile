import { StyleSheet, Text, TouchableOpacity, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/user-store";
import UserApi from "@/api/userApi";
const FooterDetailService = ({ unit, serviceId, typeService, isActive }) => {
  const router = useRouter();
  const { user } = useUserStore();
  const userApi = new UserApi();
  const [userData, setUserData] = useState();
  const [checkActive, setCheckActive] = useState(false);
  const [limit, setLimit] = useState(false);
 
  const CheckActive = () => {
    if (isActive && user) {
      setCheckActive(true);
    } else {
      setCheckActive(false);
    }
  };
  useEffect(() => {
    CheckActive();
    const featchDataUser = async () => {
      if(user?.id){
 try {
        const response = await userApi.getByUserId(user?.id as string);
        console.log("1",response);
        if (response) {
          setUserData(response);
          if (response?.lastcheckin && response.lastcheckin >= 3) {
            console.log(response.lastcheckin);
            setLimit(true);
            setCheckActive(false);
          }
        }
      } catch (error) {}
      }
    };
    featchDataUser()
    
  }, [isActive, user]);
  return (
    <View
      className="px-6 bg-background absolute w-full z-50"
      style={{ height: hp(12), bottom: 0 }}
    >
      <View className="flex-row items-center justify-between my-3">
        <AntDesign name="hearto" size={24} color="black" />
        <TouchableOpacity
          disabled={!isActive}
          style={{
            width: wp(70),
            height: hp(6),
            opacity: isActive ? 1 : 0.5,
          }}
          className="flex justify-center items-center bg-primary rounded-md"
          onPress={() => {
            if (checkActive && !limit) {
              router.push({
                pathname: "/service/verifyService",
                params: {
                  serviceId: serviceId,
                  unit: unit,
                  typeServiceId: typeService,
                },
              });
            } else if (limit && !checkActive) {
              Alert.alert(
                "Thông báo",
                "Bạn đã đạt đến số yêu cầu tối đa có thể tạo. Vui lòng hoàn thành các yêu cầu hiện tại hoặc hủy bỏ một số yêu cầu trước khi tạo yêu cầu mới"
              );
              return;
            } else {
              router.push({
                pathname: "/(tabs)/profile",
              });
            }
          }}
        >
          <Text className="text-white font-bold">Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterDetailService;
