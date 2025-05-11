import React, { useRef, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import jobsCategoryList from "@/constants/Categories";

type Props = {
  onCategoryChanged: (category: string) => void;
};

const Categories = ({ onCategoryChanged }: Props) => {
  const scrollRef = useRef<ScrollView>(null);
  const itemRef = useRef<(View | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelectCategory = (index: number) => {
    const selected = itemRef.current[index];
    setActiveIndex(index);
    selected?.measure((x, y, width, height, pageX, pageY) => {
      scrollRef.current?.scrollTo({ x: pageX - 20, y: 0, animated: true });
    });
    onCategoryChanged(jobsCategoryList[index].slug);
  };

  return (
    <View>
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        {jobsCategoryList.map((item, index) => (
          <TouchableOpacity
            ref={(el) => (itemRef.current[index] = el)}
            key={index}
            className={`border px-4 py-2 rounded-xl mr-4 ${
              activeIndex === index
                ? "bg-blue-600 border-blue-600"
                : "border-gray-400"
            }`}
            onPress={() => handleSelectCategory(index)}
          >
            <Text
              className={`text-sm ${
                activeIndex === index
                  ? "text-white font-semibold"
                  : "text-gray-600"
              }`}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default Categories;
