import { useState } from "react";
import { View } from "react-native";
import { List, Text, ActivityIndicator } from "react-native-paper";
import { useReportQuery } from "@/hooks/queries/reportQuery";
import ReportModal from "@/components/ReportModal";
import { useAppTheme } from "@/themes/useAppTheme";

export default function HistoricalReport() {
  const { reports, isLoading } = useReportQuery();
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null);
  const [accordionExpanded, setAccordionExpanded] = useState(false);
  const { surfaceColor, backgroundColor, textColor } = useAppTheme();

  if (isLoading)
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: backgroundColor,
          alignItems: "center",
          justifyContent: "center",
          gap: 12,
        }}
      >
        <ActivityIndicator size="large" />

        <Text style={{ color: textColor }}>Loading reports...</Text>
      </View>
    );
  if (!reports || reports.length === 0) return null;

  const lastFour = [...reports]
    .sort((a: any, b: any) => b.id - a.id)
    .slice(0, 4);

  return (
    <View>
      <List.Section
        style={{ backgroundColor: surfaceColor, elevation: 2, borderRadius: 8 }}
      >
        <List.Accordion
          title="Recent Reports"
          left={(props) => <List.Icon {...props} icon="history" />}
          expanded={accordionExpanded}
          onPress={() => setAccordionExpanded(!accordionExpanded)}
          style={{
            backgroundColor: surfaceColor,
            elevation: 1,
            borderRadius: 8,
          }}
        >
          {lastFour.map((report: any) => (
            <List.Item
              key={report.id}
              title={`Report — ${report.period}`}
              left={(props) => (
                <List.Icon {...props} icon="file-chart-outline" />
              )}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => setSelectedReportId(report.id)}
            />
          ))}
        </List.Accordion>
      </List.Section>

      {selectedReportId !== null && (
        <ReportModal
          visible={selectedReportId !== null}
          onClose={() => setSelectedReportId(null)}
          reportId={selectedReportId}
        />
      )}
    </View>
  );
}
