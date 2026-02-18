import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { getCategoryDisplayName } from "@/constants/config";
import { useState, useEffect } from "react";
import { View, TouchableOpacity, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
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
  const { surfaceColor, textOnPrimary, surfaceVariant } = useAppTheme();
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

  const calculateTotal = () => {
    return categories.reduce((sum, cat) => {
      return sum + parseFloat(budgetForm[cat] || "0");
    }, 0);
  };

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

  const calculateRemaining = () => {
    const income = parseFloat(user?.income || "0");
    const total = calculateTotal();
    return income - total;
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
        titleStyle={{
          fontSize: 18,
          fontWeight: "bold",
        }}
      />

      {editable ? (
        <Card.Content>
          <Text variant="titleMedium" style={{ marginBottom: 10 }}>
            Total Allocated: £{calculateTotal().toFixed(2)}
          </Text>
          <Text
            variant="titleMedium"
            style={{
              marginBottom: 10,
              color: calculateRemaining() < 0 ? "#ff6b6b" : "#51cf66",
              fontWeight: "bold",
            }}
          >
            Remaining: £{calculateRemaining().toFixed(2)}
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
        <Card.Content>
          <Text variant="headlineSmall">Total: £{budget.total_budget}</Text>
          {categories.map((category) => (
            <Text key={category}>
              {getCategoryDisplayName(category)}: £{budget[category]}
            </Text>
          ))}
        </Card.Content>
      )}
    </Card>
  );
}
