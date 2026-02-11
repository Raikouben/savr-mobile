import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DatePickerInput } from "react-native-paper-dates";
import { DatePickerModal } from "react-native-paper-dates";
import { Button } from "react-native-paper";
interface DateSelectorProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  label?: string;
  mode?: "modal" | "input";
}

export default function DateSelector({
  date,
  onDateChange,
  mode = "modal",
  label = "Select Date",
}: DateSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);

  if (mode === "input") {
    return (
      <DatePickerInput
        locale="en-GB"
        label={label}
        value={date || undefined}
        onChange={(d) => onDateChange(d || null)}
        inputMode="start"
        mode="outlined"
      />
    );
  }

  return (
    <View>
      <Button
        onPress={() => setShowPicker(true)}
        uppercase={false}
        mode="contained"
      >
        Select Date
      </Button>
      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={showPicker}
        onDismiss={() => setShowPicker(false)}
        date={date || new Date()}
        onConfirm={(params) => {
          setShowPicker(false);
          onDateChange(params.date || null);
        }}
      />
    </View>
  );
}
