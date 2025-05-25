import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useRouter } from "expo-router";
import SearchApi from "@/api/searchApi";

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();
  const searchApi = new SearchApi();

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchResults(null);
      setShowResults(false);
      return;
    }
    const payload = {
      query: text,
    };
    try {
      const response = await searchApi.getSearchService(payload);
      setSearchResults(response);
      setShowResults(true);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleServicePress = (id: string) => {
    setShowResults(false);
    router.push({
      pathname: "/service/detailService",
      params: { idService: id },
    });
  };

  const closeResults = () => {
    setShowResults(false);
  };

  return (
    <View className="flex-1">
      <View className="mx-4 flex-row items-center rounded-full bg-black/5 p-[6px]">
        <TextInput
          placeholder="Tìm kiếm gì đó đi..."
          placeholderTextColor={"gray"}
          style={{ fontSize: hp(1.7) }}
          className="flex-1 text-base mb-1 pl-3 tracking-wider"
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <View className="bg-white rounded-full p-3">
          <FontAwesome name="search" size={20} color="gray" />
        </View>
      </View>

      {showResults && searchResults?.services && searchResults.services.length > 0 && (
        <>
          <Pressable 
            className="absolute inset-0 z-40" 
            onPress={closeResults}
          />
          <View className="absolute top-[50px] left-4 right-4 z-50">
            <View className="bg-white rounded-lg shadow-lg">
              <View className="flex-row justify-between items-center p-2 border-b border-gray-100">
                <Text className="text-gray-600">Kết quả tìm kiếm</Text>
                <TouchableOpacity onPress={closeResults}>
                  <FontAwesome name="times" size={16} color="gray" />
                </TouchableOpacity>
              </View>
              <ScrollView className="max-h-60">
                {searchResults.services.map((service: any) => (
                  <TouchableOpacity
                    key={service.id}
                    onPress={() => handleServicePress(service.id)}
                    className="p-3 border-b border-gray-100"
                  >
                    <Text className="text-base">{service.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </>
      )}
    </View>
  );
};

export default SearchBar;
