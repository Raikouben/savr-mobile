import {
  cancelDailyReminder,
  scheduleDailyReminder,
  NOTIFICATIONS_ENABLED_KEY,
} from "@/hooks/useNotifications";
import { useUserQuery } from "@/hooks/queries/authQuery";
import { Switch, List } from "react-native-paper";
import { useAppTheme } from "@/themes/useAppTheme";
import * as SecureStore from "expo-secure-store";
import { useState, useEffect } from "react";

export default function NotificationToggle() {
  const { textColor } = useAppTheme();
  const { user } = useUserQuery();
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync(NOTIFICATIONS_ENABLED_KEY).then((val) => {
      if (val !== null) setEnabled(val === "true");
    });
  }, []);

  const handleToggle = async (value: boolean) => {
    await SecureStore.setItemAsync(NOTIFICATIONS_ENABLED_KEY, String(value));
    if (value) {
      await scheduleDailyReminder(user?.streak ?? 0);
    } else {
      await cancelDailyReminder();
    }
    setEnabled(value);
  };

  return (
    <List.Item
      title="Daily Reminder"
      titleStyle={{ color: textColor }}
      left={(props) => (
        <List.Icon {...props} icon="bell-outline" color={textColor} />
      )}
      right={() => <Switch value={enabled} onValueChange={handleToggle} />}
    />
  );
}
