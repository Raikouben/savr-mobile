import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import {
  getCategoryDisplayName,
  getCategoryIcon,
  getCategoryColor,
  categoryConfig,
} from "@/constants/config";
import { useState, useEffect, useMemo } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  MD2Colors,
  Text,
  TextInput,
  Button,
  Card,
  List,
  TouchableRipple,
  Portal,
  Modal,
  Dialog,
  IconButton,
  ToggleButton,
  SegmentedButtons,
  Surface,
  Divider,
} from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";
import { useUserQuery } from "@/hooks/queries/authQuery";
const categories = [
  "housing",
  "utilities",
  "transportation",
  "groceries",
  "eating_out",
  "shopping",
  "health",
  "entertainment",
  "savings",
  "debt",
  "miscellaneous",
] as const;

export default function BudgetDisplay() {
  const { budget, isLoading, updateBudget, isUpdating } = useBudgetQuery();
  const [editable, setEditable] = useState(false);
  const [budgetForm, setBudgetForm] = useState<any>({});
  const { surfaceColor, textOnPrimary, surfaceVariant, textColor } =
    useAppTheme();
  const { user } = useUserQuery();

  useEffect(() => {
    if (editable && budget) {
      const form: any = {};
      categories.forEach((cat) => {
        form[cat] = budget[cat].toString();
      });
      setBudgetForm(form);
    }
  }, [editable, budget]);

  const calculateTotal = useMemo(() => {
    return categories.reduce((sum, cat) => {
      return sum + parseFloat(budgetForm[cat] || "0");
    }, 0);
  }, [budgetForm]);

  const calculateRemaining = useMemo(() => {
    const income = parseFloat(user?.income || "0");
    return income - calculateTotal;
  }, [user?.income, calculateTotal]);

  const handleSubmit = async () => {
    if (!budget) return;

    const categoryValues = Object.fromEntries(
      categories.map((cat) => [cat, parseFloat(budgetForm[cat] || "0")]),
    ) as Record<(typeof categories)[number], number>;

    const data = {
      start_date: budget.start_date,
      end_date: budget.end_date,
      ...categoryValues,
      total_budget: categories.reduce(
        (sum, cat) => sum + categoryValues[cat],
        0,
      ),
    };

    await updateBudget(data);
    setEditable(false);
  };

  if (isLoading || !budget) return <Text>Loading...</Text>;

  return (
    <Card>
      <Card.Title
        title={editable ? "Edit Budget" : "Budget Overview"}
        right={(props) => (
          <IconButton
            {...props}
            icon={editable ? "close" : "pencil"}
            onPress={() => setEditable(!editable)}
          />
        )}
        titleStyle={{ fontSize: 18, fontWeight: "bold" }}
      />

      {editable ? (
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 4 }}>
            Total Allocated: £{calculateTotal.toFixed(2)}
          </Text>
          <Text
            variant="titleMedium"
            style={{
              marginBottom: 12,
              color: calculateRemaining < 0 ? "#ff6b6b" : "#51cf66",
              fontWeight: "bold",
            }}
          >
            Remaining: £{calculateRemaining.toFixed(2)}
          </Text>
          {categories.map((category) => (
            <View key={category} style={{ marginBottom: 10 }}>
              <TextInput
                mode="outlined"
                placeholder="Amount"
                label={getCategoryDisplayName(category)}
                keyboardType="decimal-pad"
                value={budgetForm[category]}
                onChangeText={(val) =>
                  setBudgetForm({ ...budgetForm, [category]: val })
                }
              />
            </View>
          ))}
          <Card.Actions>
            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </Card.Actions>
        </Card.Content>
      ) : (
        <Card.Content style={{ paddingHorizontal: 0 }}>
          {categories.map((category, index) => {
            const color = getCategoryColor(category);
            const icon = getCategoryIcon(category);
            const name = getCategoryDisplayName(category);
            const amount = Number(budget[category]);
            return (
              <View key={category}>
                <List.Item
                  title={name}
                  titleStyle={{ color: textColor, fontSize: 14 }}
                  left={() => (
                    <View
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        backgroundColor: color + "22",
                        alignItems: "center",
                        justifyContent: "center",
                        marginLeft: 8,
                        alignSelf: "center",
                      }}
                    >
                      <Ionicons name={icon as any} size={18} color={color} />
                    </View>
                  )}
                  right={() => (
                    <Text
                      style={{
                        alignSelf: "center",
                        color: textColor,
                        fontWeight: "600",
                        fontSize: 14,
                        marginRight: 8,
                      }}
                    >
                      £{amount.toFixed(2)}
                    </Text>
                  )}
                />
                {index < categories.length - 1 && (
                  <Divider style={{ marginHorizontal: 16 }} />
                )}
              </View>
            );
          })}
          <Divider style={{ marginTop: 4 }} bold />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingHorizontal: 16,
              paddingVertical: 12,
            }}
          >
            <Text
              style={{ fontWeight: "bold", fontSize: 15, color: textColor }}
            >
              Total
            </Text>
            <Text
              style={{ fontWeight: "bold", fontSize: 15, color: textColor }}
            >
              £{Number(budget.total_budget).toFixed(2)}
            </Text>
          </View>
        </Card.Content>
      )}
    </Card>
  );
}
