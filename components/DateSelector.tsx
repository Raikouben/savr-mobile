import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { DatePickerInput } from "react-native-paper-dates";
import { DatePickerModal } from "react-native-paper-dates";
interface DateSelectorProps {
  date: Date | null;
  onDateChange: (date: Date | null) => void;
  label?: string;
}

export default function DateSelector({
  date,
  onDateChange,
  label = "Select Date",
}: DateSelectorProps) {
  const [showPicker, setShowPicker] = useState(false);
  const handleDateChange = (event: any, selectedDate: any) => {
    setShowPicker(false);
    if (selectedDate) {
      onDateChange(selectedDate);
    }
  };
  return (
    <View>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Text>
          {label}: {date ? date.toLocaleDateString() : "Not selected"}
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
