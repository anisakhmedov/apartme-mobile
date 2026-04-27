import React, { useMemo, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { AppScreen, PrimaryButton, SecondaryButton, TextField } from "@/components/ui";
import { colors, radii, spacing, typography } from "@/theme";

export function RegisterScreen() {
  const navigation = useNavigation<any>();
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
      setError("Проверьте все поля формы");
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
      setError("Не удалось создать аккаунт");
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
            <Text style={styles.title}>Регистрация</Text>
            <Text style={styles.subtitle}>Создайте аккаунт для аренды жилья в Самарканде</Text>
          </View>

          <View style={styles.card}>
            <TextField label="Полное имя" placeholder="Имя и фамилия" value={fullName} onChangeText={setFullName} />
            <TextField label="Телефон" placeholder="+998 90 123 45 67" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <TextField label="Email" placeholder="name@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <TextField label="Пароль" placeholder="Минимум 6 символов" value={password} onChangeText={setPassword} secureTextEntry />
            <TextField label="Повторите пароль" placeholder="Повторите пароль" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

            <View style={styles.documentsBox}>
              <Text style={styles.sectionTitle}>Документы</Text>
              <CheckRow label="Паспорт загружен" checked />
              <CheckRow label="Селфи с паспортом" checked={false} />
              <CheckRow label="Подтверждение адреса" checked={false} />
            </View>

            {error ? (
              <View style={styles.errorBox}>
                <MaterialCommunityIcons name="alert-circle-outline" size={18} color={colors.error} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            <PrimaryButton label={loading ? "Создание..." : "Создать аккаунт"} onPress={handleSubmit} loading={loading} />
            <SecondaryButton label="Уже есть аккаунт? Войти" onPress={() => navigation.navigate("Login")} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AppScreen>
  );
}

function CheckRow({ label, checked }: { label: string; checked: boolean }) {
  return (
    <View style={styles.checkRow}>
      <View style={styles.checkCopy}>
        <Text style={styles.checkLabel}>{label}</Text>
        <Text style={styles.checkHint}>{checked ? "Готово" : "Требуется"}</Text>
      </View>
      <View style={[styles.checkCircle, checked && styles.checkCircleActive]}>
        {checked ? <MaterialCommunityIcons name="check" size={14} color={colors.white} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  screen: {
    flex: 1,
    backgroundColor: colors.background,
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
    ...typography.title,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: radii.modal,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  documentsBox: {
    marginTop: spacing.sm,
    gap: spacing.xs,
    padding: spacing.md,
    backgroundColor: colors.background,
    borderRadius: radii.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    ...typography.subheading,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    minHeight: 44,
  },
  checkCopy: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  checkLabel: {
    ...typography.body,
    color: colors.textPrimary,
  },
  checkHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
  },
  checkCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.sm,
    borderRadius: radii.card,
    backgroundColor: colors.primaryTint,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
});
