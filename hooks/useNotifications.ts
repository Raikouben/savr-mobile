import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useUserQuery } from "./queries/authQuery";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: false,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const { user, updateUserLoggedInfo } = useUserQuery();
const NOTIFICATION_IDENTIFIER = "savr-daily-reminder";

async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(NOTIFICATION_IDENTIFIER, {
      name: "Daily Reminder",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleDailyReminder(
  hour: number = 20,
  minute: number = 0,
) {
  const granted = await requestPermissions();
  if (!granted) return;

  const streak = user?.streak ?? 0;
  const message =
    streak > 0
      ? `You're on a ${streak}-day streak! Keep it going by logging today's spending! 🔥`
      : "Don't forget to log today's spending!";

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDENTIFIER,
    content: {
      title: "Savr",
      body: message,
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelDailyReminder() {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDENTIFIER,
  ).catch(() => {});
}

export function useNotifications(hour: number = 20, minute: number = 0) {
  useEffect(() => {
    scheduleDailyReminder(hour, minute);
  }, [hour, minute]);
}
