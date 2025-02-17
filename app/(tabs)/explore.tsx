import { StyleSheet, Image, Platform, Text, View } from 'react-native';

export default function TabTwoScreen() {
  return (
    <View className='flex-1 items-center justify-center bg-blue-200'>
      <Text className='text-3xl'>FixoraGo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
