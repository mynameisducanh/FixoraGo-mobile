import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
import { ACCESS_TOKEN, REFRESH_TOKEN, USER_STORAGE_KEY } from "../constants";
import { SignInInterface } from "@/types/auth";
import AuthApi from "@/api/authApi";
import { UserInterface } from "@/types/user";

interface UserStoreContextType {
  user: UserInterface | null;
  isAuthenticated: boolean;
  login: (userData: SignInInterface) => void;
  logout: () => void;
  fetchUserData: (token: string) => void;
}

interface UserStoreProviderProps {
  children: React.ReactNode;
}

const UserStoreContext = createContext<UserStoreContextType | undefined>(
  undefined
);
const authApi = new AuthApi();

export const useUserStore = () => {
  const context = useContext(UserStoreContext);
  if (!context) {
    throw new Error("useUserStore must be used within a UserStoreProvider");
  }
  return context;
};

export const UserStoreProviderProps: React.FC<UserStoreProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<UserInterface | null>(null);
  const router = useRouter();

  const fetchUserData = async (token: string) => {
    try {
      const response = await axios.get(
        `${Constants.expoConfig?.extra?.API_NETWORK}/users/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data) {
        await AsyncStorage.setItem(
          USER_STORAGE_KEY,
          JSON.stringify(response.data)
        );
        setUser(response.data);
        handleRedirectUser(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Hàm đăng nhập
  const login = async (userSignIn: SignInInterface) => {
    try {
      const res = await authApi.login(userSignIn);
      if (res) {
        const { refreshToken, accessToken } = res;
        await AsyncStorage.setItem(REFRESH_TOKEN, refreshToken);
        await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
        console.log(userSignIn);
        fetchUserData(accessToken);
        return Promise.resolve(res);
      }
    } catch (error) {
      return Promise.reject(error);
    }
  };
  const handleRedirectUser = (user: UserInterface) => {
    if (user.roles === "system_user") {
      console.log("User");
      router.push("/(user)");
    } else {
      console.log("Staff");
    }
  };
  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem(USER_STORAGE_KEY);
  };

  const isAuthenticated = user !== null;

  useEffect(() => {
    const getStoredUser = async () => {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        console.log("data in AsyncStorage", storedUser);
      }
    };

    getStoredUser();
  }, []);

  return (
    <UserStoreContext.Provider
      value={{ user, isAuthenticated, login, logout, fetchUserData }}
    >
      {children}
    </UserStoreContext.Provider>
  );
};
