import { avgScoreOverTime, dashboardStats, recentActivity, topicPerformance, weakTopics } from "@/data/dashboard";
import { colors } from "@/theme/colors";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BarChart } from "../components/charts/BarChart";
import { LineChart } from "../components/charts/LineChart";
import { PageHeader } from "../components/layout/PageHeader";
import { Screen } from "../components/layout/Screen";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { StatCard } from "../components/ui/StatCard";

export default function DashboardScreen() {
  const { width } = useWindowDimensions();
  const isWide = width >= 960;
  const colGap = 14;

  return (
    <Screen>
      <PageHeader title="Dashboard Overview" subtitle="Grade 10 & 11 ICT"/>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={[styles.grid, { gap: colGap }]}>
          {dashboardStats.map((s) => (
            <View key={s.label} style={[styles.statCell, isWide && styles.statCellWide]}>
              <StatCard label={s.label} value={s.value} delta={s.delta} icon={s.icon} tone={s.tone} />
            </View>
          ))}
        </View>

        <View style={[styles.twoCol, { gap: colGap }]}>
          <Card style={[styles.panel, isWide ? styles.half : undefined]}>
            <Text style={styles.panelTitle}>Average Performance Over Time</Text>
            <View style={{ marginTop: 10 }}>
              <LineChart data={avgScoreOverTime} width={Math.max(260, (isWide ? (width * 0.56) : width) - 64)} height={240} minY={60} maxY={90} />
              <View style={styles.legendRow}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>Average Score (%)</Text>
              </View>
            </View>
          </Card>

          <Card style={[styles.panel, isWide ? styles.half : undefined]}>
            <Text style={styles.panelTitle}>Topic-wise Performance</Text>
            <View style={{ marginTop: 10 }}>
              <BarChart data={topicPerformance} width={Math.max(260, (isWide ? (width * 0.44) : width) - 64)} height={240} maxY={100} />
              <View style={styles.legendRow}>
                <Ionicons name="square" size={14} color={colors.text} />
                <Text style={styles.legendText}>Average Score (%)</Text>
              </View>
            </View>
          </Card>
        </View>

        <Card style={styles.panel}>
          <Text style={styles.panelTitle}>Recent Student Activity</Text>
          <View style={styles.tableHead}>
            <Text style={[styles.th, { flex: 2 }]}>Name</Text>
            <Text style={[styles.th, { flex: 2 }]}>Last Quiz</Text>
            <Text style={[styles.th, { flex: 1, textAlign: "right" }]}>Score</Text>
          </View>
          {recentActivity.map((r, idx) => (
            <View key={`${r.name}-${idx}`} style={[styles.tr, idx === 0 ? { paddingTop: 12 } : undefined]}>
              <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>
                {r.name}
              </Text>
              <Text style={[styles.td, { flex: 2 }]} numberOfLines={1}>
                {r.lastQuiz}
              </Text>
              <Text style={[styles.td, { flex: 1, textAlign: "right", color: r.score >= 80 ? colors.success : r.score < 60 ? colors.danger : colors.primary, fontWeight: "800" }]}>
                {r.score}%
              </Text>
            </View>
          ))}
        </Card>

        <Card style={styles.panel}>
          <View style={styles.weakTitleRow}>
            <Ionicons name="warning-outline" size={18} color={colors.warning} />
            <Text style={styles.panelTitle}>Top 5 Weak Topics</Text>
          </View>

          <View style={{ gap: 12, marginTop: 10 }}>
            {weakTopics.map((t, i) => (
              <View key={t.title} style={styles.weakItem}>
                <View style={styles.rank}>
                  <Text style={styles.rankText}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.weakName}>{t.title}</Text>
                  <Text style={styles.weakMeta}>
                    {t.students} students · Avg score: {t.avg}%
                  </Text>
                  <View style={styles.actionsRow}>
                    {t.actions.map((a) => (
                      <Button key={a.label} label={a.label} icon={a.icon} variant={a.variant ?? "outline"} />
                    ))}
                  </View>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: { padding: 16, paddingBottom: 24, gap: 14 },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  statCell: { width: "100%" },
  statCellWide: { width: "24%" },
  twoCol: { flexDirection: "row", flexWrap: "wrap" },
  half: { width: "49%" },
  panel: { padding: 16 },
  panelTitle: { fontSize: 18, fontWeight: "800", color: colors.text },
  legendRow: { marginTop: 6, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 99, backgroundColor: colors.primary },
  legendText: { color: colors.primary, fontWeight: "700", fontSize: 12 },
  tableHead: { marginTop: 10, paddingTop: 8, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row" },
  th: { color: colors.muted, fontWeight: "700", fontSize: 12 },
  tr: { flexDirection: "row", paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "rgba(230,234,242,0.6)" },
  td: { color: colors.text, fontSize: 13 },
  weakTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  weakItem: { flexDirection: "row", gap: 12, backgroundColor: "#F8FAFF", borderRadius: 14, padding: 14, borderWidth: 1, borderColor: "rgba(230,234,242,0.8)" },
  rank: { width: 28, height: 28, borderRadius: 999, backgroundColor: "#FFE4C7", alignItems: "center", justifyContent: "center" },
  rankText: { fontWeight: "900", color: colors.warning, fontSize: 12 },
  weakName: { fontWeight: "800", color: colors.text },
  weakMeta: { marginTop: 4, color: colors.muted, fontSize: 12, fontWeight: "600" },
  actionsRow: { marginTop: 10, flexDirection: "row", flexWrap: "wrap", gap: 10 }
});


