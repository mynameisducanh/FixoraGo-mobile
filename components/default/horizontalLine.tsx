import React from 'react';
import { View } from 'react-native';

interface HorizontalLineProps {
  color?: string;     // Màu dòng kẻ: tailwind class hoặc mã HEX
  length?: number;    // Độ dài: số pixel
  thickness?: number; // Độ dày: số pixel
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({
  color = '#FFC107',    
  length = 100,
  thickness = 1,
}) => {
  return (
    <View
      className="my-2 rounded-full"
      style={{
        backgroundColor: color,
        width: length,
        height: thickness,
      }}
    />
  );
};

export default HorizontalLine;
