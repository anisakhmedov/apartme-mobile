import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { AppScreen, PrimaryButton, ScreenScroll, TextField } from "@/components/ui";
import { colors, radii, spacing, typography } from "@/theme";

export function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 900));
    setLoading(false);
    setSent(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  return (
    <AppScreen>
      <ScreenScroll contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Забыли пароль?</Text>
          <Text style={styles.subtitle}>Введите email, и мы отправим ссылку для сброса пароля</Text>
        </View>

        {sent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>Письмо отправлено</Text>
            <Text style={styles.successText}>Проверьте почту и следуйте инструкциям в письме.</Text>
            <PrimaryButton label="Вернуться к входу" onPress={() => navigation.navigate("Login")} />
          </View>
        ) : (
          <View style={styles.form}>
            <TextField label="Email" placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <PrimaryButton label={loading ? "Отправка..." : "Отправить ссылку"} onPress={handleSubmit} loading={loading} disabled={!email.trim()} />
            <Pressable onPress={() => navigation.goBack()} style={styles.backLinkWrap} accessibilityRole="button">
              <Text style={styles.backLink}>← Вернуться к входу</Text>
            </Pressable>
          </View>
        )}
      </ScreenScroll>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xl,
  },
  title: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    gap: spacing.md,
  },
  successContainer: {
    backgroundColor: colors.surface,
    borderRadius: radii.modal,
    padding: spacing.lg,
    gap: spacing.md,
  },
  successTitle: {
    ...typography.heading,
    color: colors.success,
  },
  successText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  backLinkWrap: {
    alignItems: "center",
    paddingVertical: spacing.sm,
  },
  backLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
});
