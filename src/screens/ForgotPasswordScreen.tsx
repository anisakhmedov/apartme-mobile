import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import { AppScreen, PrimaryButton, ScreenScroll, TextField } from "@/components/ui";
import { colors, radii, spacing, typography } from "@/theme";
// The imports from "@/theme are already correct and specific.
export function ForgotPasswordScreen() {
  const { t } = useTranslation("auth");
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
          <Text style={styles.title}>{t("forgotPassword")}</Text>
          <Text style={styles.subtitle}>{t("forgotSubtitle")}</Text>
        </View>

        {sent ? (
          <View style={styles.successContainer}>
            <Text style={styles.successTitle}>{t("forgotEmailSentTitle")}</Text>
            <Text style={styles.successText}>{t("forgotEmailSentText")}</Text>
            <PrimaryButton label={t("backToLogin")} onPress={() => navigation.navigate("Login")} />
          </View>
        ) : (
          <View style={styles.form}>
            <TextField label={t("email")} placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <PrimaryButton label={loading ? t("sending") : t("sendResetLink")} onPress={handleSubmit} loading={loading} disabled={!email.trim()} />
            <Pressable onPress={() => navigation.goBack()} style={styles.backLinkWrap} accessibilityRole="button">
              <Text style={styles.backLink}>← {t("backToLogin")}</Text>
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
