import * as Location from 'expo-location';
import { MAPBOX_ACCESS_TOKEN } from '@/constants/config';

// Chuyển địa chỉ thành tọa độ
export const getCoordinatesFromAddress = async (address: string) => {
  try {
    console.log('Searching address:', address);

    // Chuẩn hóa địa chỉ
    const normalizedAddress = address
      .replace(/\s+/g, ' ') // Xóa khoảng trắng thừa
      .trim();

    // Thêm "Đà Nẵng" nếu không có
    const searchAddress = normalizedAddress.includes('Đà Nẵng') 
      ? normalizedAddress 
      : `${normalizedAddress}, Đà Nẵng`;


    const response = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchAddress)}.json?access_token=${MAPBOX_ACCESS_TOKEN}&language=vi&country=vn&types=address,poi,neighborhood,place,locality,district,region&limit=1`
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Mapbox API error: ${data.message || 'Unknown error'}`);
    }

    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const context = feature.context || [];

      // Tách thông tin địa chỉ
      const addressInfo = {
        lat: parseFloat(feature.center[1]),
        lon: parseFloat(feature.center[0]),
        displayName: feature.place_name,
        houseNumber: feature.address || '',
        road: feature.text || '',
        suburb: context.find((c: any) => c.id.startsWith('neighborhood'))?.text || '',
        quarter: context.find((c: any) => c.id.startsWith('neighborhood'))?.text || '',
        neighbourhood: context.find((c: any) => c.id.startsWith('neighborhood'))?.text || '',
        district: context.find((c: any) => c.id.startsWith('district'))?.text || '',
        city: context.find((c: any) => c.id.startsWith('place'))?.text || '',
        state: context.find((c: any) => c.id.startsWith('region'))?.text || '',
        country: context.find((c: any) => c.id.startsWith('country'))?.text || '',
      };

      // Xử lý địa chỉ chi tiết
      let detailedAddress = '';
      
      // Thêm số nhà nếu có
      if (addressInfo.houseNumber) {
        detailedAddress += addressInfo.houseNumber + ' ';
      }
      
      // Thêm tên đường
      if (addressInfo.road) {
        detailedAddress += addressInfo.road;
      }

      // Thêm các thông tin khác
      const additionalInfo = [
        addressInfo.suburb || addressInfo.quarter || addressInfo.neighbourhood,
        addressInfo.district,
        addressInfo.city,
        addressInfo.state
      ].filter(Boolean).join(', ');

      if (additionalInfo) {
        detailedAddress += ', ' + additionalInfo;
      }

      return {
        ...addressInfo,
        detailedAddress,
        shortAddress: [
          detailedAddress,
          addressInfo.district,
          addressInfo.city,
          addressInfo.state
        ].filter(Boolean).join(', ')
      };
    }
    throw new Error('Không tìm thấy địa chỉ');
  } catch (error) {
    console.error('Full error:', error);
    throw new Error(`Lỗi khi tìm kiếm địa chỉ: ${error.message}`);
  }
};

// Lấy vị trí hiện tại
export const getCurrentLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Không có quyền truy cập vị trí');
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High
    });

    return {
      lat: location.coords.latitude,
      lon: location.coords.longitude
    };
  } catch (error) {
    throw new Error('Lỗi khi lấy vị trí hiện tại');
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
      throw new Error('Không tìm thấy tuyến đường');
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
    console.error('Lỗi khi lấy thông tin tuyến đường:', error);
    throw new Error(`Lỗi khi lấy thông tin tuyến đường: ${error.message}`);
  }
};

// Lấy chỉ đường chi tiết
export const getDirections = async (startLat: number, startLon: number, endLat: number, endLon: number) => {
  try {
    const response = await fetch(
      `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&steps=true&geometries=geojson`
    );
    const data = await response.json();

    if (data.code !== 'Ok') {
      throw new Error('Không thể lấy chỉ đường');
    }

    const route = data.routes[0];
    return {
      distance: route.distance,
      duration: route.duration,
      steps: route.legs[0].steps.map((step: any) => ({
        instruction: step.maneuver.instruction,
        distance: step.distance,
        duration: step.duration,
        geometry: step.geometry
      }))
    };
  } catch (error) {
    throw new Error('Lỗi khi lấy chỉ đường');
  }
};

// Tính khoảng cách giữa 2 điểm (theo đường chim bay)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371e3; // Bán kính trái đất (mét)
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c; // Khoảng cách theo mét
};

// Chuyển tọa độ thành địa chỉ sử dụng Mapbox
export const getAddressFromCoordinates = async (latitude: number, longitude: number) => {
  try {
    console.log('Coordinates:', { latitude, longitude });

    // Thêm tham số để lấy thông tin chi tiết hơn
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${MAPBOX_ACCESS_TOKEN}&language=vi&types=address,poi,neighborhood,place,locality,district,region,country&limit=1&autocomplete=true`;

    const response = await fetch(url);

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Mapbox API error: ${data.message || 'Unknown error'}`);
    }
    
    if (data && data.features && data.features.length > 0) {
      const feature = data.features[0];
      const context = feature.context || [];
      
      // Tách thông tin địa chỉ từ context và text
      const address = {
        fullAddress: feature.place_name,
        houseNumber: feature.address || '',
        road: feature.text || '',
        suburb: context.find((c: any) => c.id.startsWith('neighborhood'))?.text || '',
        quarter: context.find((c: any) => c.id.startsWith('neighborhood'))?.text || '',
        neighbourhood: context.find((c: any) => c.id.startsWith('neighborhood'))?.text || '',
        district: context.find((c: any) => c.id.startsWith('district'))?.text || '',
        city: context.find((c: any) => c.id.startsWith('place'))?.text || '',
        state: context.find((c: any) => c.id.startsWith('region'))?.text || '',
        country: context.find((c: any) => c.id.startsWith('country'))?.text || '',
      };

      // Xử lý địa chỉ chi tiết
      let detailedAddress = '';
      
      // Thêm số nhà nếu có
      if (address.houseNumber) {
        detailedAddress += address.houseNumber + ' ';
      }
      
      // Thêm tên đường
      if (address.road) {
        detailedAddress += address.road;
      }

      // Thêm các thông tin khác
      const additionalInfo = [
        address.suburb || address.quarter || address.neighbourhood,
        address.district,
        address.city,
        address.state
      ].filter(Boolean).join(', ');

      if (additionalInfo) {
        detailedAddress += ', ' + additionalInfo;
      }

      // Tạo địa chỉ ngắn gọn
      const shortAddress = [
        detailedAddress,
        address.district,
        address.city,
        address.state
      ].filter(Boolean).join(', ');

      return {
        fullAddress: address.fullAddress,
        shortAddress,
        detailedAddress,
        details: {
          ...address,
          detailedAddress
        },
        rawData: data
      };
    }
    throw new Error('Không tìm thấy địa chỉ trong response');
  } catch (error) {
    console.error('Full error:', error);
    throw new Error(`Lỗi khi tìm kiếm địa chỉ: ${error.message}`);
  }
}; 