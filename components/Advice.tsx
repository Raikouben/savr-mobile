import { useBudget } from "@/hooks/useBudget";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useEffect, useState } from "react";

export const AdviceModal = ({
  visible,
  onClose,
  category,
  budgetAmount,
  actualSpent,
}: {
  visible: boolean;
  onClose: () => void;
  category: string;
  budgetAmount: number;
  actualSpent: number;
}) => {
  const { getBudgetAdvice } = useBudget();
  const [advice, setAdvice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      try {
        const adviceData = await getBudgetAdvice(
          category,
          budgetAmount,
          actualSpent
        );
        setAdvice(adviceData.advice || "No advice available.");
      } catch (error) {
        setAdvice("Error fetching advice.");
      }
      setLoading(false);
    };
    if (visible) {
      fetchAdvice();
    } else {
      setAdvice(null);
    }
  }, [visible, category, budgetAmount, actualSpent]);
  return (
    <Modal>
      <View>
        <Text>Advice for {category}</Text>
        {loading ? <ActivityIndicator /> : <Text>{advice}</Text>}
        <TouchableOpacity onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
