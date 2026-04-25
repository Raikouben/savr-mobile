//Clerk. (2026). Expo Quickstart - Getting started | Clerk Docs. [online] Available at: https://clerk.com/docs/expo/getting-started/quickstart.
import { useClerk } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { Button } from "react-native-paper";
import { useQueryClient } from "@tanstack/react-query";
export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk();
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    try {
      queryClient.clear();
      await signOut();
      // Redirect to your desired page
      router.replace("/(auth)/sign-in");
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Button mode="contained-tonal" onPress={handleSignOut}>
      Sign out
    </Button>
  );
};
