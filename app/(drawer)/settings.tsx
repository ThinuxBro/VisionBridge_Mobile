import { colors } from "@/theme/colors";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { PageHeader } from "../components/layout/PageHeader";
import { Screen } from "../components/layout/Screen";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function SettingsScreen() {
  return (
    <Screen>
      <PageHeader title="Settings" subtitle="Configure your account and preferences"/>
      <View style={styles.body}>
        <Card style={{ gap: 10 }}>
          <Text style={styles.h}>Quick actions</Text>
          <Button label="Edit profile" icon="person-outline" />
          <Button label="Notification preferences" icon="notifications-outline" />
          <Button label="Sign out" icon="log-out-outline" />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { padding: 16 },
  h: { fontSize: 16, fontWeight: "800", color: colors.text }
});


