import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Text, TextInput, Button, Card } from "react-native-paper";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const trimmedEmail = emailAddress.trim();
      const signInAttempt = await signIn.create({
        identifier: trimmedEmail,
        password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(tabs)");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        setError(`Sign-in not complete. Status: ${signInAttempt.status}`);
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <Card >
      <Card.Title title="Sign In" />

      <Card.Content>
        {error ? <Text>{error}</Text> : null}

        <TextInput
          mode="outlined"
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={emailAddress}
          onChangeText={setEmailAddress}
        />

        <TextInput
          mode="outlined"
          label="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </Card.Content>

      <Card.Actions>
        <Button mode="contained" onPress={onSignInPress}>
          Continue
        </Button>

        <Button mode="text" onPress={() => router.push("/(auth)/sign-up")}>
          Sign up
        </Button>
      </Card.Actions>
    </Card>
  );
}
