import { useAppTheme } from "@/themes/useAppTheme";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import React from "react";
import { Icon, Text, TouchableRipple } from "react-native-paper";
import themes from "@/themes/theme";
import { Card } from "react-native-paper";
import { useThemeContext } from "@/contexts/ThemeContext";

const themeList = [
  { name: "Ocean", key: "oceanTheme" as const, theme: themes.oceanTheme },
  { name: "Velvet", key: "velvetTheme" as const, theme: themes.velvetTheme },
  { name: "Coffee", key: "coffeeTheme" as const, theme: themes.coffeeTheme },
  { name: "Luxury", key: "luxuryTheme" as const, theme: themes.luxuryTheme },
];

export default function ThemeSelector() {
  const { backgroundColor, textColor, surfaceColor } = useAppTheme();
  const { themeName, setTheme } = useThemeContext();

  const handleThemeSelect = async (
    themeKey: (typeof themeList)[number]["key"],
  ) => {
    await setTheme(themeKey);
    console.log("Selected theme:", themeKey);
  };

  return (
    <Card style={{ padding: 16, overflow: "hidden" }}>
      <Card.Title
        title="Select your preferred theme"
        titleStyle={{
          fontSize: 18,
          fontWeight: "bold",
          textAlign: "center",
        }}
      />
      <View style={styles.themeContainer}>
        {themeList.map((themeItem) => (
          <TouchableRipple
            key={themeItem.key}
            onPress={() => handleThemeSelect(themeItem.key)}
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
              {themeName === themeItem.key && (
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
          </TouchableRipple>
        ))}
      </View>
    </Card>
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
