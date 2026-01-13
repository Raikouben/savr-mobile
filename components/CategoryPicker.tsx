import React, { useState } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  budgetCategories,
  getCategoryIcon,
  getCategoryDisplayName,
} from "../constants/config";
import { Button, Menu, Divider, PaperProvider } from "react-native-paper";
import Ionicons from "@expo/vector-icons/build/Ionicons";

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
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Menu
      visible={visible}
      onDismiss={closeMenu}
      contentStyle={{ maxHeight: 400 }}
      anchor={
        <Button
          mode="outlined"
          onPress={openMenu}
          icon="chevron-down"
          contentStyle={{ justifyContent: "space-between" }}
          style={{ marginTop: 5 }}
        >
          {selectedCategory
            ? getCategoryDisplayName(selectedCategory)
            : `Select Category`}
        </Button>
      }
    >
      <ScrollView style={{ maxHeight: 400 }}>
        {budgetCategories.map((category) => (
          <Menu.Item
            key={category}
            onPress={() => {
              onCategoryChange(category);
              closeMenu();
            }}
            title={getCategoryDisplayName(category)}
            leadingIcon={() => (
              <Ionicons
                name={getCategoryIcon(category) as any}
                size={20}
                color="#ffffff"
              />
            )}
          />
        ))}
      </ScrollView>
    </Menu>
  );
}
