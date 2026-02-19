import { useState } from "react";
import { View, FlatList } from "react-native";
import {
  TextInput,
  Text,
  Chip,
  Surface,
  Divider,
  TouchableRipple,
  Card,
} from "react-native-paper";
import { merchants, categoryColors } from "@/constants/config";

type CategoryKey = keyof typeof categoryColors;

function fuzzyMatch(query: string, text: string) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.includes(q)) return true;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length;
}

function scoreMatch(query: string, text: string) {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  if (t.startsWith(q)) return 3;
  if (t.includes(q)) return 2;
  return 1;
}

export default function MerchantSearch({
  onSelect,
}: {
  onSelect?: (merchant: any) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  function handleChangeText(text: string) {
    setQuery(text);
    if (text.trim().length < 1) {
      setResults([]);
      return;
    }
    const filtered = merchants
      .filter((m) => fuzzyMatch(text, m.name))
      .sort((a, b) => scoreMatch(text, b.name) - scoreMatch(text, a.name))
      .slice(0, 8);
    setResults(filtered);
  }

  function handleSelect(merchant: any) {
    setQuery(merchant.name);
    setResults([]);
    onSelect?.(merchant);
  }

  function handleClear() {
    setQuery("");
    setResults([]);
  }

  return (
    <View style={{ zIndex: 10 }}>
      <TextInput
        // style={{ marginBottom: 8 }}
        label="Merchant"
        mode="outlined"
        value={query}
        onChangeText={handleChangeText}
        placeholder="Search e.g. Sainsbury's"
        left={<TextInput.Icon icon="magnify" />}
        right={
          query ? <TextInput.Icon icon="close" onPress={handleClear} /> : null
        }
      />

      {results.length > 0 && (
        <Surface
          elevation={3}
          style={{
            position: "absolute",
            top: 58,
            left: 0,
            right: 0,
            borderRadius: 8,
            overflow: "hidden",
            zIndex: 20,
          }}
        >
          <FlatList
            style={{ backgroundColor: "white" }}
            data={results}
            keyboardShouldPersistTaps="handled"
            keyExtractor={(item) => item.name}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <Divider />}
            renderItem={({ item }) => {
              const c = categoryColors[item.category as CategoryKey];
              return (
                <TouchableRipple onPress={() => handleSelect(item)}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                    }}
                  >
                    <Text variant="bodyMedium">{item.name}</Text>
                    <Chip
                      compact
                      style={{ backgroundColor: c?.bg }}
                      textStyle={{ color: c?.text, fontSize: 11 }}
                    >
                      {item.category}
                    </Chip>
                  </View>
                </TouchableRipple>
              );
            }}
          />
        </Surface>
      )}
    </View>
  );
}
