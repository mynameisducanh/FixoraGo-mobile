import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { StatusBar } from "expo-status-bar";
import {
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Overview from "@/components/staff/overview";
import Categories from "@/components/staff/Categories";
import RequestCard from "@/components/staff/RequestCard";
import { useRouter } from "expo-router";
import { useUserStore } from "@/stores/user-store";
import RequestServiceApi from "@/api/requestService";
import { formatDateTimeVN } from "@/utils/dateFormat";
import { CustomMapView } from "@/components/MapView";
import {
  getCurrentLocation,
  getCoordinatesFromAddress,
  calculateDistance,
} from "@/utils/mapUtils";
import FilterModal from "@/components/staff/FilterModal";
import { getRouteInfo } from "@/utils/mapUtils";

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

const ListPost = () => {
  const router = useRouter();
  const requestService = new RequestServiceApi();
  const [activeData, setActiveData] = useState<RequestData[]>([]);
  const { user } = useUserStore();
  const [approvedRequest, setApprovedRequest] = useState<RequestData>();
  const [showMap, setShowMap] = useState(false);
  const [dataAddress, setDataAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("nearest");
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [activeFilters, setActiveFilters] = useState<{
    districts: string[];
    services: string[];
    priceRange: string;
    status: string[];
    isUrgent: boolean;
    bonusAmount: string;
  }>({
    districts: [],
    services: user?.authdata ? [user.authdata] : [],
    priceRange: "Tất cả",
    status: [],
    isUrgent: false,
    bonusAmount: "",
  });

  const onCatChanged = async (category: string) => {
    setCurrentCategory(category);
    await fetchDataActive(category);
  };

  const handleFilterApply = async (filters: {
    districts: string[];
    services: string[];
    priceRange: string;
    status: string[];
    isUrgent: boolean;
    bonusAmount: string;
  }) => {
    setActiveFilters(filters);
    await fetchDataActive(currentCategory, filters);
  };

  const fetchDataActive = async (
    category: string = currentCategory,
    filters: typeof activeFilters = activeFilters
  ) => {
    try {
      if (user?.roles === "system_fixer") {
        setIsLoading(true);
        const filterParams = {
          nameService: filters.services.join(","),
          sortTime: category ? category : "nearest",
          districts: filters.districts,
          priceRange: filters.priceRange,
          isUrgent: filters.isUrgent,
        };
        const res = await requestService.getAllPendingOrRejected(filterParams);

        if (!res || !Array.isArray(res)) {
          setActiveData([]);
          return;
        }
        if (category !== "newest") {
          // Get user's current location
          const location = await getCurrentLocation();
          setUserLocation(location);

          // Get coordinates for each request and calculate distances
          const requestsWithDistance = await Promise.all(
            res.map(async (request: RequestData) => {
              try {
                const coordinates = await getCoordinatesFromAddress(
                  request.address
                );
                
                // Get actual driving distance using Mapbox Directions API
                const routeInfo = await getRouteInfo(
                  location.lat,
                  location.lon,
                  coordinates.lat,
                  coordinates.lon
                );
                
                const distance = routeInfo.distance / 1000; // Convert to kilometers
                
                return {
                  ...request,
                  distance,
                };
              } catch (error) {
                console.error(
                  `Error getting route info for address: ${request.address}`,
                  error
                );
                return {
                  ...request,
                  distance: Infinity,
                };
              }
            })
          );

          // Sort requests by distance
          const sortedRequests = requestsWithDistance.sort((a, b) => {
            return a.distance - b.distance;
          });
          
         
          
          setActiveData(sortedRequests);
        } else {
          // For "newest" category, just use the API response as is
          setActiveData(res);
        }
      }
    } catch (error) {
      console.log("Lỗi khi fetch:", error);
      setActiveData([]); // Set empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const getApprovedServiceByFixerId = async () => {
    try {
      const res = await requestService.getApprovedServiceByFixerId(
        user?.id as string
      );
      if (res.statusForFixer === "success") {
        setApprovedRequest(res.data);
        return;
      } else {
        fetchDataActive();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getApprovedServiceByFixerId();
  }, []);

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
        className="space-y-4 pt-14"
      >

        {approvedRequest ? (
          <View key="approved-request" className="px-4 mt-3">
            <Text className="text-xl font-bold text-gray-900">
              Thông tin yêu cầu bạn đã nhận
            </Text>
            <View className="bg-yellow-50 p-4 rounded-xl mb-4 flex-row items-center mt-3">
              <Ionicons name="warning" size={24} color="#f59e0b" />
              <Text className="text-yellow-800 ml-2 flex-1">
                Bạn phải hoàn thành yêu cầu này trước khi nhận các yêu cầu khác
              </Text>
            </View>

            <RequestCard
              data={approvedRequest}
              onPress={() => {
                if (approvedRequest.id) {
                  router.push(
                    `/requestService/detail?idRequest=${approvedRequest.id}`
                  );
                }
              }}
              onShowMap={(address) => {
                setDataAddress(address);
                setShowMap(true);
              }}
            />
          </View>
        ) : (
          <View key="request-list" className="px-4 mt-3">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-xl font-bold text-gray-900">
                Danh sách yêu cầu
              </Text>
              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => setShowFilterModal(true)}
                  className="bg-blue-50 p-3 items-center rounded-full"
                >
                  <Ionicons name="filter" size={20} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </View>

            <Categories onCategoryChanged={onCatChanged} />

            <View className="mt-4">
              {isLoading ? (
                <View className="flex-1 items-center justify-center py-8">
                  <ActivityIndicator size="large" color="#3b82f6" />
                  <Text className="text-gray-600 mt-2">
                    Đang tải dữ liệu...
                  </Text>
                </View>
              ) : (
                activeData.map((item) => (
                  <RequestCard
                    key={item.id}
                    data={item}
                    onPress={() =>
                      router.push(`/requestService/detail?idRequest=${item.id}`)
                    }
                    onShowMap={(address) => {
                      setDataAddress(address);
                      setShowMap(true);
                    }}
                  />
                ))
              )}
            </View>
          </View>
        )}
      </ScrollView>

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={handleFilterApply}
        initialFilters={activeFilters}
      />

      <CustomMapView
        mode="route"
        visible={showMap}
        onClose={() => setShowMap(false)}
        destinationAddress={dataAddress}
      />
    </View>
  );
};

export default ListPost;
