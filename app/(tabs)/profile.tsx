import { View, ScrollView } from "react-native";
import React, { useEffect } from "react";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useRouter } from "expo-router";
import { useAppTheme } from "@/themes/useAppTheme";
import BudgetDisplay from "@/components/BudgetDisplay";
import { SignOutButton } from "../../components/SignOutButton";
import UserDisplay from "@/components/UserDisplay";
import { Text, Button, Card, Divider } from "react-native-paper";
import ThemeSelector from "@/components/ThemeSelector";
import HistoricalReport from "@/components/HistoricalReport";
import NotificationToggle from "@/components/NotificationToggle";

export default function profile() {
  const {
    backgroundColor,
    textColor,
    primaryColor,
    surfaceColor,
    surfaceVariant,
    textSecondaryColor,
  } = useAppTheme();
  const { user, isLoading: userLoading } = useUserQuery();
  const { budget } = useBudgetQuery();
  const router = useRouter();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        gap: 20,
        backgroundColor: backgroundColor,
        flexGrow: 1,
      }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", color: textColor }}>
        Profile
      </Text>

      {/* User info */}
      {/* <UserDisplay /> */}

      {/* Stats */}
      <Card>
        <Card.Title title="Stats" titleStyle={{ fontWeight: "bold" }} />
        <Card.Content>
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                padding: 8,
                backgroundColor: surfaceVariant,
                borderRadius: 12,
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 28 }}>🔥</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: textSecondaryColor,
                }}
              >
                {user?.streak ?? 0}
              </Text>
              <Text
                style={{
                  color: textSecondaryColor,
                }}
              >
                day streak
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                padding: 8,
                backgroundColor: surfaceVariant,
                borderRadius: 12,
                gap: 4,
              }}
            >
              <Text style={{ fontSize: 28 }}>📅</Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: textSecondaryColor,
                }}
              >
                {user?.days_logged ?? 0}
              </Text>
              <Text
                style={{
                  color: textSecondaryColor,
                }}
              >
                days logged
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Budget */}
      <View style={{ gap: 8 }}>
        {/* <Text style={{ fontSize: 18, fontWeight: "bold", color: textColor }}>
          Budget
        </Text> */}
        <BudgetDisplay />
        <Button
          mode="contained"
          onPress={() => router.push("../(setup)?edit=true")}
        >
          Update lifestyle & income
        </Button>
      </View>

      {/* Historical Report */}
      <View style={{ gap: 8 }}>
        {/* <Text style={{ fontSize: 18, fontWeight: "bold", color: textColor }}>
          Reports
        </Text> */}
        <HistoricalReport />
      </View>

      {/* Settings */}
      <View style={{ gap: 8 }}>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: textColor }}>
          Settings
        </Text>
        <Card>
          <NotificationToggle />
        </Card>
        <ThemeSelector />
      </View>

      <SignOutButton />
    </ScrollView>
  );
}
