import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PageHeader } from "../components/layout/PageHeader";
import { Screen } from "../components/layout/Screen";
import { Card } from "../components/ui/Card";

export default function WeakTopicsScreen() {
  return (
    <Screen>
      <PageHeader title="Weak Topics" subtitle="Identify and address struggling areas"/>
      <View style={styles.body}>
        <Card>
          <Text style={styles.h}>Coming soon</Text>
          <Text style={styles.p}>This page will include analytics and recommended interventions.</Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16 },
  h: { fontSize: 16, fontWeight: "800", color: colors.text },
  p: { marginTop: 6, color: colors.muted, fontWeight: "600" }
});


