import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import LottieView from "lottie-react-native";

const DropdownTimeComponent = ({ data, onSelect }) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [playIcon, setPlayIcon] = useState(false);
  useEffect(() => {
    setPlayIcon(true);

    const timer = setTimeout(() => {
      setPlayIcon(false);
    }, 500);

    return () => clearTimeout(timer); 
  }, [value, isFocus]);
  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text
          className={`absolute left-6 -top-2 z-10 px-2 text-sm ${
            isFocus ? "text-blue-500" : "text-gray-500"
          } bg-white`}
        >
          Thời điểm tôi lắp đặt thiết bị
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
        search={false}
        maxHeight={350}
        labelField="title"
        valueField="id"
        placeholder={!isFocus ? "Thời điểm bạn lắp đặt thiết bị" : "..."}
        searchPlaceholder="Tìm kiếm nhanh"
        value={value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(item) => {
          onSelect(item.title);
          setValue(item.id);
          setIsFocus(false);
        }}
        renderLeftIcon={() => (
          <LottieView
            source={require("@/assets/icons/clock-icon.json")}
            autoPlay={playIcon}
            loop={playIcon}
            style={{ width: 20, height: 20, marginRight: 10 }}
          />
        )}
      />
    </View>
  );
};

export default DropdownTimeComponent;
