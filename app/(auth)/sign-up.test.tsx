import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignUp from "./sign-up";

const mockReplace = jest.fn();
const mockPush = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: mockPush }),
  Link: ({ children }: any) => children,
}));

const mockCreate = jest.fn();
const mockSetActive = jest.fn();

jest.mock("@/themes/useAppTheme", () => ({
  useAppTheme: () => ({ backgroundColor: "#fff" }),
}));
const mockPrepareEmailAddressVerification = jest.fn();
const mockAttemptEmailAddressVerification = jest.fn();
const mockCreateUser = jest.fn();

jest.mock("@clerk/clerk-expo", () => ({
  useSignUp: () => ({
    signUp: {
      create: mockCreate,
      prepareEmailAddressVerification: mockPrepareEmailAddressVerification,
      attemptEmailAddressVerification: mockAttemptEmailAddressVerification,
    },
    setActive: mockSetActive,
    isLoaded: true,
  }),
  useAuth: () => ({ getToken: jest.fn() }),
}));

jest.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({ createUser: mockCreateUser }),
}));

describe("Sign Up", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("successfully signs up with valid details and verification code", async () => {
    mockCreate.mockResolvedValueOnce({});
    mockPrepareEmailAddressVerification.mockResolvedValueOnce({});
    mockAttemptEmailAddressVerification.mockResolvedValueOnce({
      status: "complete",
      createdSessionId: "session_abc",
      createdUserId: "user_123",
    });
    mockSetActive.mockResolvedValueOnce({});
    mockCreateUser.mockResolvedValueOnce({});

    const { getByText, getAllByText, getAllByTestId } = render(<SignUp />);

    const [emailInput, usernameInput, passwordInput] = getAllByTestId(
      "text-input-outlined",
    );

    fireEvent.changeText(emailInput, "maharjankozmo@gmail.com");
    fireEvent.changeText(usernameInput, "kozmo");
    fireEvent.changeText(passwordInput, "agua");

    // getAllByText because "Sign up" appears in both card title and button
    const signUpButtons = getAllByText("Sign up");
    fireEvent.press(signUpButtons[signUpButtons.length - 1]);

    // After pressing Sign up, the verification screen should appear
    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        emailAddress: "maharjankozmo@gmail.com",
        password: "agua",
      });
      expect(mockPrepareEmailAddressVerification).toHaveBeenCalledWith({
        strategy: "email_code",
      });
      expect(getByText("Email Verification")).toBeTruthy();
    });

    // Enter the verification code and submit
    const [codeInput] = getAllByTestId("text-input-outlined");
    fireEvent.changeText(codeInput, "123456");
    fireEvent.press(getByText("Verify"));

    await waitFor(() => {
      expect(mockAttemptEmailAddressVerification).toHaveBeenCalledWith({
        code: "123456",
      });
      expect(mockSetActive).toHaveBeenCalledWith({ session: "session_abc" });
      expect(mockReplace).not.toHaveBeenCalled();
    });
  });
});
