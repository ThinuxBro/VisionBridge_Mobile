import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PageHeader } from "../components/layout/PageHeader";
import { Screen } from "../components/layout/Screen";
import { Card } from "../components/ui/Card";

export default function StudentsScreen() {
  return (
    <Screen>
      <PageHeader title="Students" subtitle="Manage and monitor student performance"/>
      <View style={styles.body}>
        <Card>
          <Text style={styles.h}>Coming soon</Text>
          <Text style={styles.p}>This page will list students, filters, and detailed profiles.</Text>
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


