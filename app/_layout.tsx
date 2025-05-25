import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { UserStoreProviderProps } from "@/stores/user-store";
import { PaperProvider } from "react-native-paper";
import CustomAlertProvider from "@/components/others/CustomAlertProvider";
import Animated from "react-native-reanimated";
import { useLocation } from "@/hooks/useLocation";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Khởi tạo GPS
  useLocation();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserStoreProviderProps>
      <PaperProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <CustomAlertProvider />
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            <Stack.Screen name="(user)" options={{ headerShown: false }} />
            <Stack.Screen name="(staff)" options={{ headerShown: false }} />
            <Stack.Screen
              name="search/[query]"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="service/detailService"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="service/listServiceForUser"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="notification/success"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="service/verifyService"
              options={{
                headerTitle: "Xác nhận dịch vụ",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="news/detailNews"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="requestService/listRequestSerivce"
              options={{
                headerTitle: "Lịch sử hoạt động",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="(other)/policy"
              options={{
                headerTitle: "Chính sách của chúng tôi",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="(other)/support"
              options={{
                headerTitle: "Hỗ trợ",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="post/ListPost"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profile/detailProfile"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="profile/editProfile"
              options={{
                headerTitle: "Chỉnh sửa thông tin",
                headerBackTitle: "Trở lại",
              }}
            />
            <Stack.Screen
              name="service/requestSuccess"
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="requestService/detail"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="news/listNews"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="review/list"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="message/[id]"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="news/[id]"
              options={{
                headerShown: false,
              }}
            />
             <Stack.Screen
              name="notification/index"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </PaperProvider>
    </UserStoreProviderProps>
  );
}
