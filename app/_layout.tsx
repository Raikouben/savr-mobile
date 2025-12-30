import { Stack } from "expo-router";
import SafeView from "../components/SafeView";

export default function RootLayout() {
  return (
    <SafeView>
      <Stack screenOptions={{ headerShown: false }} />
    </SafeView>
  );
}
