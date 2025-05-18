import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { getRandomColor, getInitials } from "@/utils/function";

interface AvatarProps {
  size?: number;
  fullName?: string;
  username?: string;
  email?: string;
  backgroundColor?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  size,
  fullName,
  username,
  email,
  backgroundColor,
}) => {
  const bgColor = backgroundColor || getRandomColor();
  const initials = getInitials(fullName, username, email);

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: 999,
          backgroundColor: bgColor,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: size * 0.4,
          },
        ]}
      >
        {initials}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});

export default Avatar;
