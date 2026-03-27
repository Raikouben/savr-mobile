import React, { useState } from "react";
import { View, ScrollView, Modal, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  budgetCategories,
  getCategoryIcon,
  getCategoryDisplayName,
  getCategoryColor,
  categoryConfig,
} from "../constants/config";
import {
  Button,
  Menu,
  Divider,
  PaperProvider,
  Text,
  List,
  Surface,
} from "react-native-paper";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { useAppTheme } from "@/themes/useAppTheme";
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
  const { backgroundColor, textColor, textOnPrimary } = useAppTheme();
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View>
      <Button
        mode="contained"
        onPress={() => setVisible(true)}
        icon="chevron-down"
        contentStyle={{ justifyContent: "space-between" }}
        style={{ marginTop: 5 }}
      >
        <Text style={{ color: textOnPrimary, fontWeight: "bold" }}>
          {selectedCategory
            ? getCategoryDisplayName(selectedCategory)
            : `Select Category`}
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
              <Text variant="titleLarge" style={{ color: textColor }}>
                Select Category
              </Text>
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
                      <View
                        style={{
                          width: 36,
                          justifyContent: "center",
                          alignItems: "center",
                          paddingLeft: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: 8,
                            backgroundColor: getCategoryColor(category) + "22",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Ionicons
                            name={getCategoryIcon(category) as any}
                            size={20}
                            color={getCategoryColor(category)}
                          />
                        </View>
                      </View>
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
