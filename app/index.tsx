import { Redirect } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const { isLoaded, isSignedIn } = useAuth();
  // Avoid rendering/redirecting until Clerk has loaded,
  // so we don't flash the wrong route group.
  if (!isLoaded) return null;
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }
  // Always enter setup first
  return <Redirect href="/(setup)" />;
}
