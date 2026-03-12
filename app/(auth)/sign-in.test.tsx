import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import SignIn from "./sign-in";

const mockReplace = jest.fn();
jest.mock("expo-router", () => ({
  useRouter: () => ({ replace: mockReplace, push: jest.fn() }),
  Link: ({ children }: any) => children,
}));

const mockCreate = jest.fn();
const mockSetActive = jest.fn();
jest.mock("@clerk/clerk-expo", () => ({
  useSignIn: () => ({
    signIn: { create: mockCreate },
    setActive: mockSetActive,
    isLoaded: true,
  }),
}));

jest.mock("@/themes/useAppTheme", () => ({
  useAppTheme: () => ({ backgroundColor: "#fff" }),
}));

describe("Sign In", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("logs in successfully with correct credentials", async () => {
    mockCreate.mockResolvedValueOnce({
      status: "complete",
      createdSessionId: "session_123",
    });

    const { getByText, getAllByTestId } = render(<SignIn />);

    const [emailInput, passwordInput] = getAllByTestId("text-input-outlined");

    fireEvent.changeText(emailInput, "maharjankozmo@gmail.com");
    fireEvent.changeText(passwordInput, "agua");

    fireEvent.press(getByText("Continue"));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        identifier: "maharjankozmo@gmail.com",
        password: "agua",
      });
      expect(mockSetActive).toHaveBeenCalledWith({
        session: "session_123",
      });
      expect(mockReplace).toHaveBeenCalledWith("/(tabs)");
    });
  });

  it("shows an error message with incorrect credentials", async () => {
    mockCreate.mockRejectedValueOnce(new Error("Invalid email or password"));

    const { getByText, getAllByTestId } = render(<SignIn />);

    const [emailInput, passwordInput] = getAllByTestId("text-input-outlined");

    fireEvent.changeText(emailInput, "wrong@example.com");
    fireEvent.changeText(passwordInput, "wrongpassword");

    fireEvent.press(getByText("Continue"));

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        identifier: "wrong@example.com",
        password: "wrongpassword",
      });
      expect(mockSetActive).not.toHaveBeenCalled();
      expect(mockReplace).not.toHaveBeenCalled();
      expect(getByText("Invalid email or password")).toBeTruthy();
    });
  });
});
