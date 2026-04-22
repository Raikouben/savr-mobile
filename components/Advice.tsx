import { useBudget } from "@/hooks/useBudget";
import { getCategoryDisplayName } from "@/constants/config";
import { View, StyleSheet, ScrollView } from "react-native";
import {
  ActivityIndicator,
  Text,
  Button,
  Portal,
  Modal,
  Divider,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { useAppTheme } from "@/themes/useAppTheme";

export interface SpendingAdvice {
  headline: string;
  subtitle: string;
  tips: {
    title: string;
    body: string;
  }[];
}

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
  const [advice, setAdvice] = useState<SpendingAdvice | null>(null);
  const [loading, setLoading] = useState(false);
  const { backgroundColor, textColor, surfaceVariant } = useAppTheme();

  useEffect(() => {
    const fetchAdvice = async () => {
      setLoading(true);
      try {
        const { advice: adviceData } = await getBudgetAdvice(
          category,
          budgetAmount,
          actualSpent,
        );
        setAdvice(adviceData);
      } catch (error) {
        console.error("Error fetching advice:", error);
        setAdvice(null);
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
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: backgroundColor },
        ]}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator animating={true} size="large" />
            <Text style={{ color: textColor, marginTop: 12 }}>
              Generating your advice...
            </Text>
          </View>
        ) : advice ? (
          <View>
            <View style={styles.header}>
              <Text variant="titleLarge" style={styles.headerTitle}>
                {advice.headline}
              </Text>
              <Text variant="bodySmall" style={styles.mutedText}>
                {getCategoryDisplayName(category)}
              </Text>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.pageScroll}
            >
              <Text variant="bodyMedium" style={styles.subtitle}>
                {advice.subtitle}
              </Text>

              <Divider style={styles.divider} />

              {advice.tips.map((tip, i) => (
                <View
                  key={i}
                  style={[styles.card, { backgroundColor: surfaceVariant }]}>
                  <Text variant="titleSmall" style={styles.tipTitle}>
                    {tip.title}
                  </Text>
                  <Text variant="bodySmall" style={styles.cardBody}>
                    {tip.body}
                  </Text>
                </View>
              ))}
            </ScrollView>

            <View style={styles.footer}>
              <Button mode="contained" onPress={onClose}>
                Close
              </Button>
            </View>
          </View>
        ) : (
          <View style={styles.pageScroll}>
            <Text variant="titleMedium">No advice available</Text>
            <Text variant="bodySmall" style={{ marginBottom: 20 }}>
              We couldn't generate advice for this category right now.
            </Text>
            <Button mode="contained" onPress={onClose}>
              Close
            </Button>
          </View>
        )}
      </Modal>
    </Portal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: "hidden",
    paddingBottom: 8,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontWeight: "bold",
  },
  subtitle: {
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  pageScroll: {
    paddingBottom: 24,
    gap: 12,
  },
  mutedText: {
    opacity: 0.7,
    marginTop: 2,
  },
  card: {
    borderRadius: 12,
    padding: 12,
    gap: 6,
    marginHorizontal: 16,
  },
  tipTitle: {
    fontWeight: "bold",
  },
  cardBody: {
    lineHeight: 18,
    opacity: 0.9,
  },
  divider: {
    opacity: 0.15,
    marginVertical: 12,
    marginHorizontal: 16,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
});
