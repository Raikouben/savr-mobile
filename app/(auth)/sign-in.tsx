//Clerk. (2026). Expo Quickstart - Getting started | Clerk Docs. [online] Available at: https://clerk.com/docs/expo/getting-started/quickstart.
import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import React from "react";
import { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { KeyboardAvoidingView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppTheme } from "@/themes/useAppTheme";
export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();
  const { backgroundColor } = useAppTheme();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );
  const [code, setCode] = useState("");
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
        router.replace("/(setup)");
      } else if (signInAttempt.status === "needs_second_factor") {
        setPendingVerification(true);
        await signIn.prepareSecondFactor({
          strategy: "email_code",
        });
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
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const emailError = error?.toLowerCase().includes("email");
  const passwordError = error?.toLowerCase().includes("password");

  const onVerifyPress = async () => {
    if (!signIn || !isLoaded) return;

    try {
      const signInAttempt = await signIn.attemptSecondFactor({
        strategy: "email_code",
        code: code.trim(),
      });
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/(setup)");
      } else {
        setVerificationError("Sign-in not complete. Please try again.");
      }
    } catch (err: any) {
      const message = err.errors?.[0]?.message || "Invalid verification code";
      setVerificationError(message);
    }
  };

  if (pendingVerification) {
    return (
      <KeyboardAvoidingView
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 20,
          backgroundColor: backgroundColor,
        }}
        behavior="padding"
      >
        <Card style={{ width: "100%", maxWidth: 400 }}>
          <Card.Title title="Email Verification" />
          <Card.Content>
            {verificationError && (
              <Text style={{ color: "red" }}>{verificationError}</Text>
            )}
            <TextInput
              mode="outlined"
              label="Verification Code"
              value={code}
              placeholder="Enter your verification code"
              onChangeText={(code) => setCode(code)}
              error={!!verificationError}
            />
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={onVerifyPress}>
              Verify
            </Button>
            <Button onPress={() => setPendingVerification(false)}>
              Cancel
            </Button>
          </Card.Actions>
        </Card>
      </KeyboardAvoidingView>
    );
  }

  return (
    // <KeyboardAwareScrollView
    //   contentContainerStyle={{
    //     flexGrow: 1,
    //     justifyContent: "center",
    //     alignItems: "center",
    //     padding: 20,
    //     backgroundColor: "#7852b6",
    //   }}
    //   keyboardShouldPersistTaps="handled"
    // >
    <KeyboardAvoidingView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: backgroundColor,
      }}
      behavior="padding"
    >
      <Card style={{ width: "100%", maxWidth: 400 }}>
        <Card.Title title="Sign In" />
        <Card.Content>
          {error ? <Text>{error}</Text> : null}

          <TextInput
            testID="email-input"
            mode="outlined"
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={emailAddress}
            onChangeText={setEmailAddress}
            error={!!emailError}
          />

          <TextInput
            testID="password-input"
            mode="outlined"
            label="Password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            error={!!passwordError}
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
    </KeyboardAvoidingView>
    // </KeyboardAwareScrollView>
  );
}
