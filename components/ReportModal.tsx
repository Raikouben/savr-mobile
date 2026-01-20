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
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const { report, isLoading, error, refetch } = useReportQuery();
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
        <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
          Financial Report
        </Text>
      </Modal>
    </Portal>
  );
}
