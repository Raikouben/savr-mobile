import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Text, View, ScrollView } from "react-native";
import { useState } from "react";
import { SignOutButton } from "../../components/SignOutButton";
import { useEffect } from "react";

export default function Page() {
  const { user } = useUser();
  const clerkId = user?.id;
  const [budget, setBudget] = useState<number | null>(null);
  const [categoryTotals, setCategoryTotals] = useState<Record<
    string,
    number
  > | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  console.log("Clerk ID:", clerkId);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href="/(auth)/sign-in">
          <Text>Sign in</Text>
        </Link>
        <Link href="/(auth)/sign-up">
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
