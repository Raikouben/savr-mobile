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

    const data = {
      start_date: budget.start_date,
      end_date: budget.end_date,
      housing: budget.housing,
      utilities: budget.utilities,
      transportation: budget.transportation,
      groceries: budget.groceries,
      eating_out: budget.eating_out,
      shopping: budget.shopping,
      health: budget.health,
      entertainment: budget.entertainment,
      savings: budget.savings,
      debt: budget.debt,
      miscellaneous: budget.miscellaneous,
      total_budget: budget.total_budget,
    };

    categories.forEach((cat) => {
      const value = parseFloat(budgetForm[cat] || "0");
      data[cat] = value;
      data.total_budget += value;
    });

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
      />

      {editable ? (
        <Card.Content>
          <Text variant="headlineSmall" style={{ marginBottom: 10 }}>
            Total: £{calculateTotal().toFixed(2)}
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
