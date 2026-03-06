import React, { useState } from "react";
import { View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { Chip, Text, Button, Surface, Divider, List } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import {
  budgetCategories,
  getCategoryIcon,
  getCategoryDisplayName,
} from "../constants/config";
import { useAppTheme } from "@/themes/useAppTheme";
interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  label?: string;
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const [visible, setVisible] = useState(false);
  const { textOnPrimary, backgroundColor, textColor } = useAppTheme();
  return (
    <View>
      <Button
        mode="contained"
        onPress={() => setVisible(true)}
        icon="chevron-down"
        contentStyle={{ justifyContent: "center" }}
      >
        <Text style={{ color: textOnPrimary, fontWeight: "bold" }}>
          {selectedCategory
            ? getCategoryDisplayName(selectedCategory)
            : `Filter`}
        </Text>
      </Button>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            justifyContent: "flex-end",
          }}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View
            style={{
              backgroundColor: backgroundColor,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 16,
              }}
            >
              <Text variant="titleLarge">Filter</Text>
              <Button onPress={() => setVisible(false)}>Done</Button>
            </View>
            <Divider />
            <ScrollView style={{ maxHeight: 400 }}>
              {budgetCategories.map((category) => (
                <View key={category}>
                  <List.Item
                    title={getCategoryDisplayName(category)}
                    onPress={() => {
                      onCategoryChange(category);
                      setVisible(false);
                    }}
                    left={(props) => (
                      <Ionicons
                        name={getCategoryIcon(category) as any}
                        size={24}
                        color={textColor}
                        style={{ marginLeft: 8, alignSelf: "center" }}
                      />
                    )}
                    right={(props) =>
                      selectedCategory === category ? (
                        <Ionicons name="checkmark" size={24} color="#4CAF50" />
                      ) : null
                    }
                  />
                  <Divider />
                </View>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
