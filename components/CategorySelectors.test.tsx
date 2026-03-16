import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import CategoryFilter from "./CategoryFilter";
import CategoryPicker from "./CategoryPicker";

// Mock the theme hook
jest.mock("@/themes/useAppTheme", () => ({
  useAppTheme: () => ({
    textOnPrimary: "#FFFFFF",
    backgroundColor: "#000000",
    textColor: "#FFFFFF",
  }),
}));

// Mock config functions
jest.mock("@/constants/config", () => ({
  budgetCategories: ["housing", "transport", "groceries"],
  getCategoryDisplayName: (cat: string) =>
    cat.charAt(0).toUpperCase() + cat.slice(1),
  getCategoryIcon: (cat: string) => "home-outline",
}));

describe("Category Selectors", () => {
  describe("CategoryFilter", () => {
    const mockOnCategoryChange = jest.fn();

    beforeEach(() => {
      mockOnCategoryChange.mockClear();
    });

    it("renders with Filter button when no category selected", () => {
      render(
        <CategoryFilter
          selectedCategory=""
          onCategoryChange={mockOnCategoryChange}
        />,
      );

      expect(screen.getByText("Filter")).toBeTruthy();
    });

    it("renders with selected category name", () => {
      render(
        <CategoryFilter
          selectedCategory="housing"
          onCategoryChange={mockOnCategoryChange}
        />,
      );

      expect(screen.getByText("Housing")).toBeTruthy();
    });

    it("calls onCategoryChange when category is selected", () => {
      render(
        <CategoryFilter
          selectedCategory=""
          onCategoryChange={mockOnCategoryChange}
        />,
      );

      fireEvent.press(screen.getByText("Filter"));
      fireEvent.press(screen.getByText("Housing"));

      expect(mockOnCategoryChange).toHaveBeenCalledWith("housing");
    });
  });

  describe("CategoryPicker", () => {
    const mockOnCategoryChange = jest.fn();

    beforeEach(() => {
      mockOnCategoryChange.mockClear();
    });

    it("renders with Select Category button when no category selected", () => {
      render(
        <CategoryPicker
          selectedCategory=""
          onCategoryChange={mockOnCategoryChange}
        />,
      );

      expect(screen.getByText("Select Category")).toBeTruthy();
    });

    it("renders with selected category name", () => {
      render(
        <CategoryPicker
          selectedCategory="transport"
          onCategoryChange={mockOnCategoryChange}
        />,
      );

      expect(screen.getByText("Transport")).toBeTruthy();
    });

    it("calls onCategoryChange when category is selected", () => {
      render(
        <CategoryPicker
          selectedCategory=""
          onCategoryChange={mockOnCategoryChange}
        />,
      );

      fireEvent.press(screen.getByText("Select Category"));
      fireEvent.press(screen.getByText("Groceries"));

      expect(mockOnCategoryChange).toHaveBeenCalledWith("groceries");
    });
  });
});
