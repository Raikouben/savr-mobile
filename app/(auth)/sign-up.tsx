import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";
import { useState } from "react";
import { Text, TextInput, Button, Card } from "react-native-paper";
import { KeyboardAvoidingView } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useAppTheme } from "@/themes/useAppTheme";
export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { createUser } = useAuth();
  const router = useRouter();
  const { backgroundColor } = useAppTheme();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [signUpError, setSignUpError] = useState<string | null>(null);
  const [verificationError, setVerificationError] = useState<string | null>(
    null,
  );

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    console.log(emailAddress, password);

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      setSignUpError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });
        const trimmedUsername = username.trim();
        const trimmedEmail = emailAddress.trim();
        console.log(signUpAttempt.createdUserId);
        console.log(trimmedEmail);
        console.log(trimmedUsername);
        try {
          const data = await createUser(trimmedUsername, trimmedEmail);
          console.log("User created:", data);
        } catch (error) {
          console.error("Error creating user:", error);
        }
        router.replace("/(tabs)");
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setVerificationError(
          `Verification not complete. Status: ${signUpAttempt.status}`,
        );
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/guides/development/custom-flows/error-handling
      // for more info on error handling
      setVerificationError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
      console.error(JSON.stringify(err, null, 2));
    }
  };
  const emailError = signUpError?.toLowerCase().includes("email");
  const passwordError = signUpError?.toLowerCase().includes("password");

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
        <Card.Title title="Sign up" />
        <Card.Content>
          {signUpError && <Text style={{ color: "red" }}>{signUpError}</Text>}
          <TextInput
            mode="outlined"
            label="Email"
            autoCapitalize="none"
            value={emailAddress}
            placeholder="Enter email"
            onChangeText={(email) => setEmailAddress(email)}
            error={!!emailError}
          />
          <TextInput
            mode="outlined"
            label="Username"
            value={username}
            placeholder="Enter username"
            onChangeText={(username) => setUsername(username)}
          />
          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            placeholder="Enter password"
            secureTextEntry={true}
            onChangeText={(password) => setPassword(password)}
            error={!!passwordError}
          />
        </Card.Content>
        <Card.Actions>
          <Button mode="contained" onPress={onSignUpPress}>
            Sign up
          </Button>

          <Button
            mode="contained-tonal"
            onPress={() => router.push("/(auth)/sign-in")}
          >
            Sign in
          </Button>
        </Card.Actions>
      </Card>
    </KeyboardAvoidingView>
    // {/* </KeyboardAwareScrollView> */}
  );
}
