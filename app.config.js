export default {
  expo: {
    name: "Fixorago",
    slug: "fixorago-app",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./logo.png",
    entryPoint: "./src/app",
    scheme: "fixorago",
    owner: "ducanh1122ks",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.fixorago.app",
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          "Ứng dụng cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh gửi kèm dịch vụ.",
        NSCameraUsageDescription:
          "Ứng dụng cần quyền truy cập camera để bạn có thể chụp ảnh gửi kèm dịch vụ.",
        NSLocationWhenInUseUsageDescription:
          "Ứng dụng cần quyền truy cập vị trí để có thể theo dõi vị trí của bạn và cung cấp các dịch vụ liên quan đến vị trí.",
        NSLocationAlwaysUsageDescription:
          "Ứng dụng cần quyền truy cập vị trí để có thể theo dõi vị trí của bạn và cung cấp các dịch vụ liên quan đến vị trí.",
      },
    },
    android: {
      package: "com.fixorago.app",
      versionCode: 1,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION",
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE",
      ],
      config: {
        googleMaps: {
          apiKey: "AIzaSyBf43woGp51ykRNyXnVje4N8KUUua1U3Po"
        }
      },
    },
   
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splash-icon.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-image-picker",
        {
          photosPermission:
            "Ứng dụng cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh gửi kèm dịch vụ.",
          cameraPermission:
            "Ứng dụng cần quyền truy cập camera để bạn có thể chụp ảnh gửi kèm dịch vụ.",
        },
      ],
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission:
            "Ứng dụng cần quyền truy cập vị trí để có thể theo dõi vị trí của bạn và cung cấp các dịch vụ liên quan đến vị trí.",
        },
      ],
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "ad29c4c5-c1b4-4c3e-a207-547ea1042876",
      },
      API_URL: process.env.API_URL || "https://fixorago-api.online/api",
      API_NETWORK: process.env.API_NETWORK || "https://fixorago-api.online/api",
      SOCKET_URL: process.env.SOCKET_URL || "https://fixorago-api.online",
      MAPBOX_ACCESS_TOKEN:
        process.env.MAPBOX_ACCESS_TOKEN ||
        "",
    },
  },
};
