import { useBudget } from "@/hooks/useBudget";
import { getCategoryDisplayName } from "@/constants/config";
import { View, StyleSheet, TouchableOpacity } from "react-native";
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
} from "react-native-paper";
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
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          backgroundColor: "white",
          padding: 20,
          margin: 20,
          borderRadius: 8,
        }}
      >
        <View>
          <Text style={{ color: "black" }}>
            Advice for {getCategoryDisplayName(category)}
          </Text>
          {loading ? <ActivityIndicator /> : <Text style={{ color: "rgba(98, 79, 168, 0.96)" }}>{advice}</Text>}
        </View>
      </Modal>
    </Portal>
  );
};
