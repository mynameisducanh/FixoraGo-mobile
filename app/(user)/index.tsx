import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { useUserStore } from "@/stores/user-store";

const HomeUser = () => {
  const { user, isAuthenticated } = useUserStore();
  console.log("TT user : ",user);
  
  return (
    <View className='flex-1 items-center justify-center'>
      {isAuthenticated ? (
        <Text>Xin chào, {user?.username}!</Text>
      ) : (
        <Text>Bạn chưa đăng nhập</Text>
      )}
    </View>
  );
};

export default HomeUser;

const styles = StyleSheet.create({});
