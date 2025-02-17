import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  roles: string;
}

interface UserStoreContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User) => void;
  clearUser: () => void;
}
interface UserStoreProviderProps {
  children: React.ReactNode;
}

const UserStoreContext = createContext<UserStoreContextType | undefined>(
  undefined
);

export const useUserStore = () => {
  const context = useContext(UserStoreContext);
  if (!context) {
    throw new Error("useUserStore must be used within a UserStoreProvider");
  }
  return context;
};

export const UserStoreProvider: React.FC<UserStoreProviderProps> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = await AsyncStorage.getItem("USER");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };

    fetchUserData();
  }, []);

  const setUserState = (userData: User) => {
    setUser(userData);
    AsyncStorage.setItem("USER", JSON.stringify(userData));
  };

  const clearUser = () => {
    setUser(null);
    AsyncStorage.removeItem("USER");
  };

  const isAuthenticated = user !== null;

  return (
    <UserStoreContext.Provider
      value={{ user, isAuthenticated, setUser: setUserState, clearUser }}
    >
      {children}
    </UserStoreContext.Provider>
  );
};
