import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DateSelectorProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  label?: string;
  defaultToToday?: boolean;
}

export default function DateSelector({
  date,
  onDateChange,
  label = "Select Date",
  defaultToToday = false,
}: DateSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const handleDateChange = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text>
          {label}: {date ? date.toLocaleDateString() : "All Dates"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={date || new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
});
