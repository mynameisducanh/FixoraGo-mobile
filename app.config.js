export default {
  expo: {
    name: "Fixorago",
    slug: "fixorago",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    entryPoint: "./src/app",
    scheme: "fixorago",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSPhotoLibraryUsageDescription: "Ứng dụng cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh gửi kèm dịch vụ.",
        NSLocationWhenInUseUsageDescription: "Ứng dụng cần quyền truy cập vị trí để có thể theo dõi vị trí của bạn và cung cấp các dịch vụ liên quan đến vị trí.",
        NSLocationAlwaysUsageDescription: "Ứng dụng cần quyền truy cập vị trí để có thể theo dõi vị trí của bạn và cung cấp các dịch vụ liên quan đến vị trí."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: [
        "ACCESS_COARSE_LOCATION",
        "ACCESS_FINE_LOCATION"
      ]
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
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: process.env.API_URL ||'http://localhost:3333/api',
      API_NETWORK: process.env.API_NETWORK || 'http://192.168.80.220:3333/api',
      SOCKET_URL: process.env.SOCKET_URL || 'http://192.168.1.6:3333',
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN || 'YOUR_MAPBOX_ACCESS_TOKEN',
    },
  },
};
