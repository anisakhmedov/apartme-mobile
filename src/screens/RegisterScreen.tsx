import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { AppScreen, PrimaryButton, SecondaryButton, TextField } from "@/components/ui";
import { AppTheme, useAppTheme, spacing, typography, radii } from "@/theme";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background, // Kept theme.colors.background
    },
    container: {
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    header: {
      marginBottom: spacing.md,
      paddingTop: spacing.sm,
      gap: spacing.xs,
    },
    title: {
      ...theme.typography.title,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    subtitle: {
      ...theme.typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: 28,
      padding: theme.spacing.md,
      gap: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border, // Kept theme.colors.border
    },
    documentsBox: {
      marginTop: spacing.sm,
      gap: spacing.sm,
      padding: spacing.md,
      backgroundColor: theme.colors.background, // Kept theme.colors.background
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border, // Kept theme.colors.border
    },
    sectionTitle: {
      ...theme.typography.subheading,
      color: theme.colors.textPrimary,
      marginBottom: theme.spacing.xs,
    },
    checkRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      minHeight: 44,
    },
    checkCopy: { // Kept theme.spacing.sm
      flex: 1,
      paddingRight: theme.spacing.sm,
    },
    checkLabel: {
      ...theme.typography.body,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    checkHint: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 2,
    },
    checkCircle: {
      width: 24,
      height: 24,
      borderRadius: 12, // Kept theme.colors.border
      borderWidth: 1.5,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surface,
    },
    checkCircleActive: {
      backgroundColor: theme.colors.primary, // Kept theme.colors.primary
      borderColor: theme.colors.primary, // Kept theme.colors.primary
    },
    errorBox: {
      flexDirection: "row",
      alignItems: "center", // Kept theme.spacing.xs
      gap: spacing.xs,
      padding: spacing.sm,
      borderRadius: 18,
      backgroundColor: theme.colors.primary, // fallback
    }, // Kept theme.colors.error
    errorText: {
      ...theme.typography.caption,
      color: theme.colors.error || "#FF4444",
    },
  });

export function RegisterScreen() {
  const { t } = useTranslation("auth");
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = useMemo(() => {
    const nameOk = fullName.trim().split(/\s+/).filter(Boolean).length >= 2;
    const phoneOk = phone.replace(/\D/g, "").length >= 9;
    const emailOk = /\S+@\S+\.\S+/.test(email);
    const passwordOk = password.length >= 6;
    const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;
    return nameOk && phoneOk && emailOk && passwordOk && passwordsMatch;
  }, [confirmPassword, email, fullName, password, phone]);

  const handleSubmit = async () => {
    if (!canSubmit || loading) {
      setError(t("registerValidationError"));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setError("");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate("OTPVerification", {
        pendingName: fullName,
        pendingEmail: email,
        pendingPhone: phone,
      });
    } catch {
      setError(t("registerFailed"));
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppScreen style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.title}>{t("registerTitle")}</Text>
            <Text style={styles.subtitle}>{t("registerSubtitle")}</Text>
          </View>

          <View style={styles.card}>
            <TextField label={t("fullName")} placeholder={t("fullNamePlaceholder")} value={fullName} onChangeText={setFullName} />
            <TextField label={t("phone")} placeholder={t("phonePlaceholder")} value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextField label={t("email")} placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextField label={t("password")} placeholder={t("passwordMinPlaceholder")} value={password} onChangeText={setPassword} secureTextEntry />
            <TextField label={t("confirmPassword")} placeholder={t("confirmPassword")} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <View style={styles.documentsBox}>
              <Text style={styles.sectionTitle}>{t("documents")}</Text>
              <CheckRow theme={theme} styles={styles} label={t("passportUploaded")} checked readyLabel={t("ready")} requiredLabel={t("required")} />
              <CheckRow theme={theme} styles={styles} label={t("selfieWithPassport")} checked={false} readyLabel={t("ready")} requiredLabel={t("required")} />
              <CheckRow theme={theme} styles={styles} label={t("proofOfAddress")} checked={false} readyLabel={t("ready")} requiredLabel={t("required")} />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={theme.colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <PrimaryButton label={loading ? t("registerLoading") : t("register")} onPress={handleSubmit} loading={loading} />
            <SecondaryButton label={t("alreadyHaveAccountLogin")} onPress={() => navigation.navigate("Login")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

function CheckRow({ label, checked, readyLabel, requiredLabel, theme, styles }: { label: string; checked: boolean; readyLabel: string; requiredLabel: string; theme: AppTheme; styles: any }) {
  return (
    <View style={styles.checkRow}>
      <View style={styles.checkCopy}>
        <Text style={styles.checkLabel}>{label}</Text>
        <Text style={styles.checkHint}>{checked ? readyLabel : requiredLabel}</Text>
      </View>
      <View style={[styles.checkCircle, checked && styles.checkCircleActive]}>
        {checked ? <MaterialCommunityIcons name="check" size={14} color={theme.colors.white} /> : null}
      </View>
    </View>
  );
}
