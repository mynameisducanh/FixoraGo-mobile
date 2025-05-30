import React, { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  TouchableOpacity,
  Text,
  RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Header from "@/components/default/header";
import SearchBar from "@/components/default/searchBar";
import { categoryData, newsData } from "../../temp/service";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import ListService, { ListServiceRef } from "@/components/services/listService";
import NewsRow from "@/components/news/newsRow";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const listServiceRef = useRef<ListServiceRef>(null);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    if (listServiceRef.current) {
      await listServiceRef.current.reload();
    }
    // Thêm logic refresh ở đây, ví dụ:
    // fetchData().then(() => setRefreshing(false));
    // setTimeout(() => {
    //   setRefreshing(false);
    // }, 2000);
    setRefreshing(false);
  }, []);

  return (
    <View className="flex-1 bg-background">
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }}
        className="space-y-6 pt-14"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#FFC107"]}
            tintColor="#FFC107"
            progressViewOffset={20}
            progressBackgroundColor="#ffffff"
            title="Đang tải..."
            titleColor="#FFC107"
          />
        }
      >
        <Header />
        <SearchBar />
        <View>
          <ListService ref={listServiceRef} />
        </View>
        <View className="mt-5">
          <NewsRow />
        </View>
        {/* <TouchableOpacity onPress={() => router.push("/(staff)")}>
          <Text>Staff</Text>
        </TouchableOpacity> */}
      </ScrollView>
    </View>
  );
}
