import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useSurveyQuery } from "@/hooks/queries/surveyQuery";

const lifestyleQuestions = [
  {
    id: "housing_impact",
    question:
      "How much do rent or mortgage payments impact your monthly budget?",
    options: [
      { label: "A significant portion", value: 3 },
      { label: "A moderate portion", value: 2 },
      { label: "A small portion", value: 1 },
      { label: "Not applicable (I don't pay rent/mortgage)", value: 0 },
    ],
  },
  {
    id: "utilities_impact",
    question: "How much do utility payments impact your monthly expenses?",
    options: [
      { label: "A significant portion", value: 3 },
      { label: "A moderate portion", value: 2 },
      { label: "A small portion", value: 1 },
      { label: "Not applicable (included / someone else pays)", value: 0 },
    ],
  },
  {
    id: "transportation_mode",
    question: "What is your primary mode of transportation?",
    options: [
      { label: "Personal vehicle", value: 3 },
      { label: "Public transport", value: 2 },
      { label: "Walking / biking", value: 1 },
      { label: "Not applicable", value: 0 },
    ],
  },
  {
    id: "transport_frequency",
    question: "How often do you use your primary mode of transportation?",
    options: [
      { label: "Daily", value: 3 },
      { label: "Weekly", value: 2 },
      { label: "Rarely", value: 1 },
      { label: "Not applicable", value: 0 },
    ],
  },
  {
    id: "grocery_shopping",
    question: "How much do you spend on groceries and food shopping?",
    options: [
      { label: "A significant portion of my budget", value: 3 },
      { label: "A moderate portion", value: 2 },
      { label: "A small portion", value: 1 },
      { label: "Not applicable (meal plan/someone else pays)", value: 0 },
    ],
  },
  {
    id: "eating_habits",
    question: "How often do you eat out or order takeout?",
    options: [
      { label: "Frequently", value: 3 },
      { label: "Occasionally", value: 2 },
      { label: "Rarely", value: 1 },
      { label: "Never", value: 0 },
    ],
  },
  {
    id: "shopping_habits",
    question: "How often do you go shopping for non-essential items?",
    options: [
      { label: "Frequently", value: 3 },
      { label: "Occasionally", value: 2 },
      { label: "Rarely", value: 1 },
      { label: "Never", value: 0 },
    ],
  },
  {
    id: "health_maintenance",
    question: "How consistently is health and wellness part of your lifestyle?",
    options: [
      { label: "A core part of my routine", value: 3 },
      { label: "Somewhat consistent", value: 2 },
      { label: "Not really part of my lifestyle", value: 0 },
    ],
  },
  {
    id: "entertainment_spending",
    question:
      "How often do you spend money on entertainment and leisure activities?",
    options: [
      { label: "Frequently", value: 3 },
      { label: "Occasionally", value: 2 },
      { label: "Rarely", value: 1 },
      { label: "Never", value: 0 },
    ],
  },
  {
    id: "savings_habits",
    question: "How regularly do you set aside money for savings?",
    options: [
      { label: "Regularly", value: 3 },
      { label: "Sometimes", value: 2 },
      { label: "Rarely", value: 1 },
      { label: "Never", value: 0 },
    ],
  },
  {
    id: "debt_impact",
    question: "How much do monthly debt payments affect your budget?",
    options: [
      { label: "They play a significant role", value: 3 },
      { label: "They play a moderate role", value: 2 },
      { label: "They play a minimal role", value: 1 },
      { label: "Not applicable (no debt)", value: 0 },
    ],
  },
];

interface LifestyleSurveyProps {}

export default function LifestyleSurvey({}: LifestyleSurveyProps) {
  const router = useRouter();
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const {
    surveyAnswers,
    isLoading,
    submitSurveyAnswers,
    updateSurveyAnswers,
    isSubmitting,
  } = useSurveyQuery();

  const [hasExistingAnswers, setHasExistingAnswers] = useState(false);

  useEffect(() => {
    if (surveyAnswers) {
      setAnswers(surveyAnswers);
      setHasExistingAnswers(true);
    }
  }, [surveyAnswers]);

  const handleSelect = (questionId: string, value: number) => {
    setAnswers({ ...answers, [questionId]: value });
  };
  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: "white" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleSubmit = async () => {
    try {
      if (hasExistingAnswers) {
        await updateSurveyAnswers(answers);
      } else {
        await submitSurveyAnswers(answers);
      }
      router.replace("/(tabs)");
      setAnswers({});
    } catch (error) {
      console.error("Error submitting survey:", error);
    }
  };

  const allAnswered = lifestyleQuestions.every(
    (q) => answers[q.id] !== undefined
  );

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView>
        <View>
          <Text>Lifestyle Survey</Text>

          {lifestyleQuestions.map((question) => (
            <View key={question.id}>
              <Text>{question.question}</Text>
              {question.options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => handleSelect(question.id, option.value)}
                >
                  <Text>
                    {answers[question.id] === option.value ? "✓ " : ""}
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!allAnswered || isSubmitting}
          >
            <Text>
              {isSubmitting
                ? hasExistingAnswers
                  ? "Updating..."
                  : "Submitting..."
                : hasExistingAnswers
                ? "Update"
                : "Submit"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
