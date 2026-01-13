import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  budgetCategories,
  getCategoryIcon,
  getCategoryDisplayName,
} from "../constants/config";

interface CategoryPickerProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = budgetCategories.map((category) => ({
  label: getCategoryDisplayName(category),
  value: category,
}));

export default function CategoryPicker({
  selectedCategory,
  onCategoryChange,
}: CategoryPickerProps) {
  return (
    <View>
      <Picker selectedValue={selectedCategory} onValueChange={onCategoryChange}>
        <Picker.Item label="Select Category" value="" />
        {categories.map((category) => (
          <Picker.Item
            key={category.value}
            label={category.label}
            value={category.value}
          />
        ))}
      </Picker>
    </View>
  );
}
