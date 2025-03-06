import React, { useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import LottieView from "lottie-react-native";

const DropdownComponent = ({ data, onSelect }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          className={`absolute left-6 -top-2 z-10 px-2 text-sm ${
            isFocus ? "text-blue-500" : "text-gray-500"
          } bg-white`}
        >
          Tôi đang cần sửa
        </Text>
      );
    }
    return null;
  };

  return (
    <View className="bg-white rounded-lg">
      {renderLabel()}
      <Dropdown
        style={{
          height: 54,
          borderWidth: 1,
          paddingHorizontal: 8,
          borderRadius: 8,
          borderColor: isFocus ? "#FFC107" : "#d1d5db",
        }}
        placeholderStyle={{ fontSize: 16 }}
        selectedTextStyle={{ fontSize: 16 }}
        inputSearchStyle={{ height: 40, fontSize: 16 }}
        iconStyle={{ width: 20, height: 20 }}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="id"
        placeholder={!isFocus ? "Bạn đang cần sửa gì ..." : "..."}
        searchPlaceholder="Tìm kiếm nhanh"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onSelect(item.id);
          setValue(item.id);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <LottieView
            source={require("@/assets/icons/wrench-icon.json")}
            autoPlay
            loop
            style={{ width: 50, height: 50 }}
          />
        )}
      />
    </View>
  );
};

export default DropdownComponent;
