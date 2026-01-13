import React from "react";
import { View, ScrollView } from "react-native";
import { Chip, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  budgetCategories,
  getCategoryIcon,
  getCategoryDisplayName,
} from "../constants/config";

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  label?: string;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8 }}
      >
        <Chip
          selected={selectedCategory === ""}
          onPress={() => onCategoryChange("")}
          mode="flat"
          style={{
            backgroundColor: selectedCategory === "" ? "#7a51aa" : "#210c4b",
            padding: 4,
          }}
        >
          All
        </Chip>
        {budgetCategories.map((category) => (
          <Chip
            style={{
              backgroundColor:
                selectedCategory === category ? "#7a51aa" : "#210c4b",
              padding: 4,
            }}
            key={category}
            selected={selectedCategory === category}
            onPress={() => onCategoryChange(category)}
            icon={() => (
              <Ionicons
                name={getCategoryIcon(category) as any}
                size={18}
                color={selectedCategory === category ? "#dcc8f8" : "#ffffff"}
              />
            )}
            mode="flat"
          >
            {getCategoryDisplayName(category)}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}
