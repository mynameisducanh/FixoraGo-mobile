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
        NSPhotoLibraryUsageDescription: "Ứng dụng cần quyền truy cập thư viện ảnh để bạn có thể chọn ảnh gửi kèm dịch vụ."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
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
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      API_URL: process.env.API_URL ||'http://localhost:3333/api',
      API_NETWORK: process.env.API_NETWORK || 'http://192.168.80.220:3333/api',
    },
  },
};
