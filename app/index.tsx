import { StyleSheet, Text, View, Button } from "react-native";
import { useRouter } from "expo-router";
import Constants from "expo-constants";
export default function Page() {
  const router = useRouter();

  const API_URL = Constants.expoConfig?.extra?.API_URL;
  console.log(API_URL);
  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Hello World</Text>
        <Text style={styles.subtitle}>This is the first page of your app.</Text>
        <Button
          title="Go to Home Page"
          onPress={() => router.push("/(tabs)")}
        />
         <Button
          title="Go to Sign in"
          onPress={() => router.push("/(auth)/sign-in")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
  },
  main: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 960,
    marginHorizontal: "auto",
  },
  title: {
    fontSize: 64,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 36,
    color: "#38434D",
  },
});
