import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import RequestConfirmServiceApi from "@/api/requestConfirmServiceApi";
import { useUserStore } from "@/stores/user-store";
import ReviewApi from "@/api/reviewApi";
import FixerApi from "@/api/fixerApi";
import UserApi from "@/api/userApi";
import TechnicianDetailModal from "../technicianDetailModal";
import SkillFixerApi from "@/api/skillFixerApi";
import { useRouter } from "expo-router";
import PayFeesModal from "./PayFeesModal";
import RevenueApi from "@/api/revenueApi";
import { formatDecimalToWhole, getNumericPrice } from "@/utils/priceFormat";

export interface OverviewRef {
  reload: () => Promise<void>;
}

const Overview = forwardRef<OverviewRef>((props, ref) => {
  const requestConfirmServiceApi = new RequestConfirmServiceApi();
  const reviewApi = new ReviewApi();
  const fixerApi = new FixerApi();
  const userApi = new UserApi();
  const revenueApi = new RevenueApi();
  const skillFixerApi = new SkillFixerApi();
  const [showTechnicianModal, setShowTechnicianModal] = useState(false);
  const [showPayFeesModal, setShowPayFeesModal] = useState(false);

  const [revenue, setRevenua] = useState();
  const [totalReview, setTotalReview] = useState();
  const [dataDetail1, setDataDetail1] = useState();
  const [dataDetail2, setDataDetail2] = useState();
  const [dataDetail3, setDataDetail3] = useState();
  const [isLastDayOfMonth, setIsLastDayOfMonth] = useState(false);
  const [showPaymentWarning, setShowPaymentWarning] = useState(false);
  const [fixerSkills, setFixerSkills] = useState<string[]>([]);
  const router = useRouter();
  const { user } = useUserStore();

  const checkLastDayOfMonth = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Check if tomorrow is the first day of next month
    setIsLastDayOfMonth(tomorrow.getDate() === 1);
  };

  const handlePaymentPress = () => {
    setShowPayFeesModal(true);
  };

  const handlePayFeesSubmit = async (data: { images: any[]; note: string }) => {
    try {
      // Here you would typically handle the payment submission
      // console.log("Payment submitted:", data);
      // After successful submission, you might want to refresh the revenue data
      await getDataRevenuaDashboash();
    } catch (error) {
      console.error("Error submitting payment:", error);
    }
  };

  useEffect(() => {
    checkLastDayOfMonth();
    // Check every hour
    const interval = setInterval(checkLastDayOfMonth, 3600000);
    return () => clearInterval(interval);
  }, []);

  const getDataRevenuaDashboash = async () => {
    try {
      const res = await requestConfirmServiceApi.getRevenuaDashboash(
        user?.id as string
      );
      const res2 = await reviewApi.getReviewAverageByFixerId(
        user?.id as string
      );
      const res3 = await fixerApi.getByUserId(user?.id as string);
      const res4 = await revenueApi.getOverview(
        (user?.id as string) + "_total"
      );
      
      if (res) {
        setRevenua(res);
      }
      if (res2) {
        setTotalReview(res2);
      }
      if (res3) {
        setDataDetail2(res3);
      }
      if (res4) {
        setDataDetail3(res4);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useImperativeHandle(ref, () => ({
    reload: getDataRevenuaDashboash
  }));

  useEffect(() => {
    getDataRevenuaDashboash();
  }, []);

  const fetchDataDetailFixer = async () => {
    try {
      const res = await userApi.getByUserId(user?.id as string);
      const res2 = await fixerApi.getByUserId(user?.id as string);
      const skillFixer = await skillFixerApi.getByUserId(user?.id as string);

      if (res) {
        setDataDetail1(res);
      }
      if (res2) {
        setDataDetail2(res2);
      }
      if (skillFixer && Array.isArray(skillFixer) && skillFixer.length > 0 ) {
        const fixerSkillNames = skillFixer.map((skill: any) => skill.name);
        setFixerSkills(fixerSkillNames);
      } else {
        setFixerSkills([]); // Set empty array if no skills found
      }
      setShowTechnicianModal(true);
    } catch (error) {
      console.error("Error fetching fixer details:", error);
      // Set default values in case of error
      setFixerSkills([]);
      setShowTechnicianModal(true);
    }
  };

  return (
    <View
      className="bg-blue-100 rounded-2xl p-4 m-auto"
      style={{ width: wp(95) }}
    >
      <View className="flex-row justify-between">
        <View>
          <Text className="text-blue-800 font-semibold text-lg">
            Xin chào {dataDetail2?.employeeCode}
          </Text>
          <View className="flex-row gap-5 mt-2">
            <TouchableOpacity onPress={() => router.push("/notification")}>
              <FontAwesome name="bell-o" size={24} color="#1e40af" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/(staff)/messages")}>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={24}
                color="#1e40af"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                fetchDataDetailFixer();
              }}
            >
              <Ionicons
                name="person-circle-outline"
                size={24}
                color="#1e40af"
              />
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex-col justify-end items-end">
          <Text className="text-blue-700 mt-1">
            Tổng phí: {formatDecimalToWhole(dataDetail3?.unpaidFees)} VNĐ
          </Text>

          <TouchableOpacity
            onPress={handlePaymentPress}
            className="mt-2  rounded-md py-2 px-3 self-end bg-blue-600"
          >
            <Text className="text-white font-semibold">Đóng phí</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* <View className="mt-2 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
        <View className="flex-row items-center">
          <Text className="text-yellow-800 ml-2 flex-1">
            Trong vòng 2 tháng không đủ 50% lần nào, tài khoản sẽ bị khóa.
          </Text>
        </View>
      </View> */}

      <Text className="font-semibold text-blue-700 mt-2">Tổng quan</Text>
      <View className="flex-row justify-between p-1">
        <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">
            {formatDecimalToWhole(dataDetail3?.totalRevenue)}
          </Text>
          <Text className="text-sm text-gray-500">Tổng doanh thu</Text>
        </View>
        {/* <View className="items-center">
          <Text className="text-lg font-bold text-gray-700">
            {formatDecimalToWhole(revenue?.currentMonthRevenue)}
          </Text>
          <Text className="text-sm text-gray-500">Doanh thu tháng này</Text>
        </View> */}
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/review/list")}
        >
          <Text className="text-lg font-bold text-gray-700">
            ⭐ {totalReview?.average}
          </Text>
          <Text className="text-sm text-gray-500">
            Đánh giá({totalReview?.count} bài)
          </Text>
        </TouchableOpacity>
      </View>
      <TechnicianDetailModal
        visible={showTechnicianModal}
        onClose={() => setShowTechnicianModal(false)}
        technician={
          dataDetail1
            ? dataDetail1
            : {
                username: "",
                avatarurl: "",
                fullName: "",
                address: "",
                phonenumber: "",
                authdata: "",
              }
        }
        skills={fixerSkills}
        rating={totalReview?.average}
        totalReviews={totalReview?.count}
        roles={user?.roles as string}
        bgColor="#fff"
        color="#000"
        experience={dataDetail2?.experience || 0}
      />
      <PayFeesModal
        visible={showPayFeesModal}
        onClose={() => setShowPayFeesModal(false)}
        onSubmit={handlePayFeesSubmit}
        feeAmount={dataDetail3?.unpaidFees || 0}
      />
    </View>
  );
});

export default Overview;
