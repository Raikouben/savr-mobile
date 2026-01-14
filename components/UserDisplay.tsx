import { useUserQuery } from "@/hooks/queries/authQuery";
import { View, ScrollView, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  MD2Colors,
  Text,
  TextInput,
  Button,
  Card,
  List,
  TouchableRipple,
  Portal,
  Modal,
  Dialog,
  IconButton,
  ToggleButton,
  SegmentedButtons,
  Surface,
} from "react-native-paper";

const userFields = ["username", "email"] as const;

export default function UserDisplay() {
  const { user, isLoading, updateUser, isUpdating } = useUserQuery();
  const [editable, setEditable] = useState(false);
  const [userForm, setUserForm] = useState<any>({});

  useEffect(() => {
    if (editable && user) {
      const form: any = {};
      userFields.forEach((field) => {
        form[field] = user[field];
      });
      setUserForm(form);
    }
  }, [editable, user]);

  const handleSubmit = async () => {
    if (!user) return;
    const data: any = {
      username: userForm.username || user.username,
      email: userForm.email || user.email,
    };
    await updateUser(data);
    setEditable(false);
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Card>
      <Card.Title
        title={editable ? "Edit Information" : "User Information"}
        right={(props) => (
          <IconButton
            {...props}
            icon={editable ? "close" : "pencil"}
            onPress={() => setEditable(!editable)}
          />
        )}
      />
      <Card.Content style={{ gap: 16 }}>
        {editable ? (
          <View style={{ gap: 12 }}>
            {userFields.map((field) => (
              <TextInput
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={userForm[field]}
                onChangeText={(val) =>
                  setUserForm({ ...userForm, [field]: val })
                }
                mode="outlined"
              />
            ))}
            <Button
              mode="contained"
              onPress={handleSubmit}
              disabled={isUpdating}
              loading={isUpdating}
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
          </View>
        ) : (
          <View style={{ gap: 8 }}>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Username</Text>
              <Text style={{ fontWeight: "bold" }}>{user?.username}</Text>
            </View>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <Text>Email</Text>
              <Text style={{ fontWeight: "bold" }}>{user?.email}</Text>
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
}
