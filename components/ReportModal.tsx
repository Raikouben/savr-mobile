import { View, TouchableOpacity, Platform } from "react-native";
import React, { useState } from "react";
import { useReportQuery } from "@/hooks/queries/reportQuery";
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
} from "react-native-paper";
import { useReport } from "@/hooks/useReport";

export default function ReportModal({
  visible,
  onClose,
  reportId,
}: {
  visible: boolean;
  onClose: () => void;
  reportId: string;
}) {
  const { report, isLoading, error, refetch } = useReportQuery(reportId);
  const budget = report?.budget_snapshot;
  const expenses = report?.expenses;
  const insight = report?.insights;
  const period = report?.period;
  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onClose}
        contentContainerStyle={{
          margin: 20,
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
        }}
      >
        {isLoading ? (
          <ActivityIndicator animating={true} />
        ) : (
          <View>
            <Text variant="titleLarge">Report of {period}</Text>
            <Text>{insight}</Text>
            <View>
              <Text>Designated income : {report?.income}</Text>
              <Text>Budget Snapshot :</Text>
              {budget &&
                Object.entries(budget).map(([category, amount]) => (
                  <Text key={category}>
                    {category}: {String(amount)}
                  </Text>
                ))}
              <Text>Expenses :</Text>
              {expenses &&
                Object.entries(expenses).map(([category, amount]) => (
                  <Text key={category}>
                    {category}: {String(amount)}
                  </Text>
                ))}
              <Text>Insights :</Text>
            </View>
          </View>
        )}
      </Modal>
    </Portal>
  );
}
