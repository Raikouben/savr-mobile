import { useAppTheme } from "@/themes/useAppTheme";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Icon, Text } from "react-native-paper";
import themes from "@/themes/theme";

const themeList = [
  { name: "Ocean", theme: themes.oceanTheme },
  { name: "Velvet", theme: themes.velvetTheme },
  { name: "Coffee", theme: themes.coffeeTheme },
  { name: "Luxury", theme: themes.luxuryTheme },
];

export default function ThemeSelector() {
  const { backgroundColor, textColor, surfaceColor } = useAppTheme();
  const [selectedTheme, setSelectedTheme] = useState("Coffee");

  const handleThemeSelect = (themeName: string) => {
    setSelectedTheme(themeName);
    console.log("Selected theme:", themeName);
  };

  return (
    <View
      style={{
        backgroundColor: surfaceColor,
        padding: 20,
      }}
    >
      <Text
        variant="titleMedium"
        style={{ color: textColor, marginBottom: 16 }}
      >
        Select Theme
      </Text>
      <View style={styles.themeContainer}>
        {themeList.map((themeItem) => (
          <TouchableOpacity
            key={themeItem.name}
            onPress={() => handleThemeSelect(themeItem.name)}
            style={styles.themeItemContainer}
          >
            <View
              style={[
                styles.themeCircle,
                {
                  backgroundColor: themeItem.theme.colors.background,
                },
              ]}
            >
              {selectedTheme === themeItem.name && (
                <View
                  style={{
                    backgroundColor: themeItem.theme.colors.onSurface,
                    borderRadius: 50,
                    padding: 0.1,
                  }}
                >
                  <Icon
                    source="check-circle"
                    size={60}
                    color={themeItem.theme.colors.surface}
                  />
                </View>
              )}
            </View>
            {/* 
            <Text
              variant="bodySmall"
              style={{
                color: themeItem.theme.colors.onSurface,
                marginTop: 8,
                textAlign: "center",
              }}
            >
              {themeItem.name}
            </Text> */}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  themeContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  themeItemContainer: {
    alignItems: "center",
    marginBottom: 8,
  },
  themeCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
