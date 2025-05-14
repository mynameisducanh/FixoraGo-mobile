import { View, StyleSheet, Dimensions } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const LoadingOverlay = () => {
  return (
    <View style={styles.overlay}>
      <LottieView
        source={require("@/assets/icons/loading-icon.json")}
        autoPlay
        loop
        style={{ width: 30, height: 30 }}
      />
    </View>
  );
};

export default LoadingOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: wp(100),
    height: hp(100),
    backgroundColor: "rgba(128, 128, 128, 0.1)", // xám nhẹ hơn
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
});