import { useUserQuery } from "@/hooks/queries/authQuery";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useState, useEffect } from "react";

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
    <View>
      <View>
        <Text>{editable ? "Edit Information" : "User Information"}</Text>
        <Feather
          name={editable ? "x" : "edit"}
          size={24}
          onPress={() => setEditable(!editable)}
        />
      </View>
      {editable ? (
        <View>
          {userFields.map((field) => (
            <View key={field}>
              <Text>{field}</Text>
              <TextInput
                placeholder="Amount"
                value={userForm[field]}
                onChangeText={(val) =>
                  setUserForm({ ...userForm, [field]: val })
                }
              />
            </View>
          ))}
          {/* <TextInput
            placeholder="username"
            value={userForm.username}
            onChangeText={(text) =>
              setUserForm({ ...userForm, username: text })
            }
          />
          <TextInput
            placeholder="email"
            value={userForm.email}
            onChangeText={(text) => setUserForm({ ...userForm, email: text })}
          /> */}
          <TouchableOpacity onPress={handleSubmit} disabled={isUpdating}>
            <Text>{isUpdating ? "Saving..." : "Save"}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text>Username: {user?.username}</Text>
          <Text>Email: {user?.email}</Text>
        </View>
      )}
    </View>
  );
}
