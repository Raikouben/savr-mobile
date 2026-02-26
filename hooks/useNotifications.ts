import { useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Controls how notifications appear when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const NOTIFICATION_IDENTIFIER = "savr-daily-reminder";

const DAILY_MESSAGES = [
  "Don't forget to log today's spending! 💰",
  "How's your budget looking today? Open Savr to check in 📊",
  "A quick spending check-in keeps you on track! 🎯",
  "Your finances are waiting for you — open Savr! 📱",
  "Stay on top of your budget. Log your transactions today! ✅",
];

function getRandomMessage() {
  return DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)];
}

async function requestPermissions(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync(
      NOTIFICATION_IDENTIFIER,
      {
        name: "Daily Reminder",
        importance: Notifications.AndroidImportance.DEFAULT,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      }
    );
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  if (existingStatus === "granted") return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

/**
 * Schedules a daily local notification at the given hour and minute (24-hour).
 * Cancels any previously scheduled Savr reminder before scheduling a new one.
 *
 * @param hour   Hour in 24-hour format (default: 20 = 8 PM)
 * @param minute Minute (default: 0)
 */
export async function scheduleDailyReminder(
  hour: number = 20,
  minute: number = 0
) {
  const granted = await requestPermissions();
  if (!granted) return;

  // Cancel any existing daily reminder to avoid duplicates
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDENTIFIER
  ).catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: NOTIFICATION_IDENTIFIER,
    content: {
      title: "Savr",
      body: getRandomMessage(),
      sound: false,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

/** Cancels the scheduled daily reminder. */
export async function cancelDailyReminder() {
  await Notifications.cancelScheduledNotificationAsync(
    NOTIFICATION_IDENTIFIER
  ).catch(() => {});
}

/**
 * Hook that sets up daily reminder notifications when the app mounts.
 * Place this in the root layout so it runs once for the whole app session.
 *
 * @param hour   Hour in 24-hour format (default: 20 = 8 PM)
 * @param minute Minute (default: 0)
 */
export function useNotifications(hour: number = 20, minute: number = 0) {
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    scheduleDailyReminder(hour, minute);

    // Optional: listen for received notifications (foreground)
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("[Savr] Notification received:", notification);
      });

    // Optional: listen for user tapping a notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("[Savr] Notification tapped:", response);
        // You can add deep-link navigation here, e.g. navigate to transactions tab
      });

    return () => {
      notificationListener.current?.remove();
      responseListener.current?.remove();
    };
  }, [hour, minute]);
}
