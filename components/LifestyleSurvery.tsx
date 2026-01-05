import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import { useRecommender } from "@/hooks/useRecommender";
import { useSurveyQuery } from "@/hooks/queries/surveyQuery";

export default function UserDisplay() {
  const [editable, setEditable] = useState(false);
  const [surveyForm, setSurveyForm] = useState<any>({});
  const { surveyAnswers, updateSurveyAnswers, isLoading } = useSurveyQuery();

  useEffect(() => {
    if (editable && surveyAnswers) {
      const form: any = {};

      setSurveyForm(form);
    }
  }, [editable, surveyAnswers]);

  const handleSubmit = async () => {
    if (!surveyAnswers) return;
    const data: any = {
      username: surveyForm.username || surveyAnswers.username,
      email: surveyForm.email || surveyAnswers.email,
    };
    await updateSurveyAnswers(data);
    setEditable(false);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Modal>
      <View></View>
    </Modal>
  );
}
