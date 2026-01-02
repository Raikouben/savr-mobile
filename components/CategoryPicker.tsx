import React from "react";
import { View, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";

interface CategoryPickerProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { label: "Housing", value: "housing" },
  { label: "Utilities", value: "utilities" },
  { label: "Transportation", value: "transportation" },
  { label: "Food", value: "food" },
  { label: "Shopping", value: "shopping" },
  { label: "Health", value: "health" },
  { label: "Entertainment", value: "entertainment" },
  { label: "Miscellaneous", value: "miscellaneous" },
];

export default function CategoryPicker({
  selectedCategory,
  onCategoryChange,
}: CategoryPickerProps) {
  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});

export { categories };
