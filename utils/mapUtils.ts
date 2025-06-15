import * as Location from "expo-location";
import { MAPBOX_ACCESS_TOKEN } from "@/constants/config";

// Chuyển địa chỉ thành tọa độ
export const getCoordinatesFromAddress = async (address: string) => {
  try {
    console.log("Searching address:", address);

    // Chuẩn hóa địa chỉ
    const normalizedAddress = address
      .replace(/\s+/g, " ") // Xóa khoảng trắng thừa
      .trim();

    // Thêm "Đà Nẵng" nếu không có
    const searchAddress = normalizedAddress.includes("Đà Nẵng")
      ? normalizedAddress
      : `${normalizedAddress}, Đà Nẵng`;

    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        searchAddress
      )}.json?access_token=${MAPBOX_ACCESS_TOKEN}&language=vi&country=vn&types=address,poi,neighborhood,place,locality,district,region&limit=1`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${data.message || "Unknown error"}`);
    }

    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const context = feature.context || [];

      // Tách thông tin địa chỉ
      const addressInfo = {
        lat: parseFloat(feature.center[1]),
        lon: parseFloat(feature.center[0]),
        displayName: feature.place_name,
        houseNumber: feature.address || "",
        road: feature.text || "",
        suburb:
          context.find((c: any) => c.id.startsWith("neighborhood"))?.text || "",
        quarter:
          context.find((c: any) => c.id.startsWith("neighborhood"))?.text || "",
        neighbourhood:
          context.find((c: any) => c.id.startsWith("neighborhood"))?.text || "",
        district:
          context.find((c: any) => c.id.startsWith("district"))?.text || "",
        city: context.find((c: any) => c.id.startsWith("place"))?.text || "",
        state: context.find((c: any) => c.id.startsWith("region"))?.text || "",
        country:
          context.find((c: any) => c.id.startsWith("country"))?.text || "",
      };
      console.log(addressInfo);
      // Xử lý địa chỉ chi tiết
      let detailedAddress = "";

      // Thêm số nhà nếu có
      // if (addressInfo.houseNumber) {
      //   detailedAddress += addressInfo.houseNumber + ' ';
      // }

      // Thêm tên đường
      if (addressInfo.road) {
        detailedAddress += addressInfo.road;
      }

      // Thêm các thông tin khác
      const additionalInfo = [
        addressInfo.suburb || addressInfo.quarter || addressInfo.neighbourhood,
        addressInfo.district,
        addressInfo.city,
        addressInfo.state,
      ]
        .filter(Boolean)
        .join(", ");

      if (additionalInfo) {
        detailedAddress += ", " + additionalInfo;
      }

      return {
        ...addressInfo,
        detailedAddress,
        shortAddress: [
          detailedAddress,
          addressInfo.district,
          addressInfo.city,
          addressInfo.state,
        ]
          .filter(Boolean)
          .join(", "),
      };
    }
    throw new Error("Không tìm thấy địa chỉ");
  } catch (error) {
    console.error("Full error:", error);
    throw new Error(`Lỗi khi tìm kiếm địa chỉ: ${error.message}`);
  }
};

// Lấy vị trí hiện tại
export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Không có quyền truy cập vị trí");
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      lat: location.coords.latitude,
      lon: location.coords.longitude,
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy vị trí hiện tại");
  }
};

// Tính khoảng cách và thời gian di chuyển
export const getRouteInfo = async (
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
) => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLon},${startLat};${endLon},${endLat}?geometries=geojson&access_token=${MAPBOX_ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data.routes || data.routes.length === 0) {
      throw new Error("Không tìm thấy tuyến đường");
    }

    // Lấy route đầu tiên từ mảng routes
    const route = data.routes[0];

    // Chuyển đổi coordinates từ GeoJSON sang định dạng cho Polyline
    const coordinates = route.geometry.coordinates.map((coord: number[]) => ({
      latitude: coord[1],
      longitude: coord[0],
    }));

    return {
      distance: route.distance,
      duration: route.duration,
      geometry: {
        coordinates: coordinates,
      },
    };
  } catch (error: any) {
    console.error("Lỗi khi lấy thông tin tuyến đường:", error);
    throw new Error(`Lỗi khi lấy thông tin tuyến đường: ${error.message}`);
  }
};

// Lấy chỉ đường chi tiết
export const getDirections = async (
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
) => {
  try {
    const response = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&steps=true&geometries=geojson`
    );
    const data = await response.json();

    if (data.code !== "Ok") {
      throw new Error("Không thể lấy chỉ đường");
    }

    const route = data.routes[0];
    return {
      distance: route.distance,
      duration: route.duration,
      steps: route.legs[0].steps.map((step: any) => ({
        instruction: step.maneuver.instruction,
        distance: step.distance,
        duration: step.duration,
        geometry: step.geometry,
      })),
    };
  } catch (error) {
    throw new Error("Lỗi khi lấy chỉ đường");
  }
};

// Tính khoảng cách giữa 2 điểm (theo đường chim bay)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) => {
  const R = 6371e3; // Bán kính trái đất (mét)
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // Khoảng cách theo mét
};

// Chuyển tọa độ thành địa chỉ sử dụng Mapbox
export const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
) => {
  try {
    console.log("Coordinates:", { latitude, longitude });

    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&language=vi&types=address,poi,neighborhood,place,locality,district,region,country&limit=1&autocomplete=true`;

    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${data.message || "Unknown error"}`);
    }

    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const context = feature.context || [];

      const fullPlaceName = data.features[0].place_name_vi;
      const parts = fullPlaceName.split(",").map((part: any) => part.trim());
      const street = removeAlleyNumbers(parts.slice(0, 2).join(", "));
      // Sử dụng hàm trong xử lý địa chỉ

      // Tên đường từ text_vi
      // const street = feature.place_name_vi || "";

      // Phường/Xã
      // const ward = context.find((item: any) => item.id.startsWith("place_name_vi"))?.text_vi || "";

      // Quận/Huyện
      const district =
        context.find(
          (item: any) =>
            item.id.startsWith("district") || item.id.startsWith("locality")
        )?.text_vi || "";

      // Thành phố/Tỉnh
      const city =
        context.find((item: any) => item.id.startsWith("region"))?.text_vi ||
        "";

      const detailedAddressCurrent = `${street}, ${district}, ${city}`;
      console.log("Địa chỉ chi tiết:", detailedAddressCurrent);

      return {
        details: feature,
        detailedAddress: detailedAddressCurrent,
      };
    }

    throw new Error("Không tìm thấy địa chỉ");
  } catch (error) {
    console.error("Error getting address:", error);
    throw error;
  }
};

export const fetchDataStepByStep = async (
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
) => {
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startLon},${startLat};${endLon},${endLat}?geometries=geojson&steps=true&language=vi&access_token=${MAPBOX_ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok || !data.routes || data.routes.length === 0) {
      throw new Error("Không thể lấy chỉ dẫn đường đi");
    }

    const route = data.routes[0];
    const legs = route.legs[0];

    const stepList = legs.steps.map((step: any, index: number) => ({
      id: `step-${index}`,
      instruction: step.maneuver.instruction,
      distance: step.distance,
      duration: step.duration,
      geometry: step.geometry,
    }));

    return {
      stepList,
      totalDistance: legs.distance,
      totalDuration: legs.duration,
    };
  } catch (error: any) {
    console.error("Lỗi khi lấy chỉ dẫn chi tiết:", error);
    throw new Error(`Lỗi khi lấy chỉ dẫn chi tiết: ${error.message}`);
  }
};

const removeAlleyNumbers = (address: string): string => {
  // Danh sách các từ khóa cần loại bỏ
  const alleyKeywords = [
    "kiệt",
    "hẻm",
    "ngõ",
    "ngách",
    "lô",
    "lầu",
    "tầng",
    "phòng",
    "khu",
    "block",
    "tòa",
    "căn",
    "số",
    "đường",
    "phố",
  ];

  // Tách địa chỉ thành các phần
  const parts = address.split(",").map((part) => part.trim());

  // Xử lý từng phần của địa chỉ
  const processedParts = parts.map((part) => {
    // Tách phần thành các từ
    const words = part.split(" ");

    // Lọc bỏ các từ khóa và số đi kèm
    const filteredWords = words.filter((word, index) => {
      const lowerWord = word.toLowerCase();

      // Kiểm tra nếu từ hiện tại là từ khóa
      if (alleyKeywords.includes(lowerWord)) {
        return false;
      }

      // Kiểm tra nếu từ trước đó là từ khóa và từ hiện tại là số
      if (
        index > 0 &&
        alleyKeywords.includes(words[index - 1].toLowerCase()) &&
        !isNaN(Number(word))
      ) {
        return false;
      }

      // Giữ lại các từ khác
      return true;
    });

    return filteredWords.join(" ");
  });

  // Loại bỏ các phần rỗng và nối lại
  return processedParts.filter((part) => part.trim() !== "").join(", ");
};
