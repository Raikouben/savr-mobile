import { useBudgetQuery } from "@/hooks/queries/budgetQuery";
import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";

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
    <View>
      <View>
        <Text>{editable ? "Edit Budget" : "Budget Overview"}</Text>
        <Feather
          name={editable ? "x" : "edit"}
          size={24}
          onPress={() => setEditable(!editable)}
        />
      </View>

      {editable ? (
        <View>
          <Text>Total: £{calculateTotal().toFixed(2)}</Text>
          {categories.map((category) => (
            <View key={category}>
              <Text>{category}</Text>
              <TextInput
                placeholder="Amount"
                keyboardType="decimal-pad"
                value={budgetForm[category]}
                onChangeText={(val) =>
                  setBudgetForm({ ...budgetForm, [category]: val })
                }
              />
            </View>
          ))}

          <TouchableOpacity onPress={handleSubmit} disabled={isUpdating}>
            <Text>{isUpdating ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text>Total: £{budget.total_budget}</Text>
          {categories.map((category) => (
            <Text key={category}>
              {category}: £{budget[category]}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
}
