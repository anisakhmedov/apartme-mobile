import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { AppScreen, PrimaryButton, SecondaryButton, TextField } from "@/components/ui";
import { colors, spacing, typography } from "@/theme";
import { useAppDispatch } from "@/store";
import { persistAuth, setUser } from "@/store/authSlice";
import { users } from "@/data/mockData";

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      setApiError("Заполните email и пароль");
      return;
    }

    setApiError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await new Promise((resolve) => setTimeout(resolve, 900));
    const user = users[1];
    dispatch(setUser(user));
    dispatch(persistAuth({ isLoggedIn: true, user }));
    setLoading(false);
  };

  return (
    <AppScreen>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logoText}>SamarkandRent</Text>
          <Text style={styles.subtitle}>Войдите в свой аккаунт</Text>
        </View>

        <View style={styles.form}>
          <TextField label="Email или телефон" placeholder="Email или телефон" value={emailOrPhone} onChangeText={setEmailOrPhone} keyboardType="email-address" autoCapitalize="none" />
          <View>
            <TextField label="Пароль" placeholder="Пароль" value={password} onChangeText={setPassword} secureTextEntry={secureTextEntry} />
            <Pressable onPress={() => setSecureTextEntry((current) => !current)} style={styles.toggleLink} accessibilityRole="button">
              <Text style={styles.toggleLinkText}>{secureTextEntry ? "Показать" : "Скрыть"}</Text>
            </Pressable>
          </View>

          {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

          <PrimaryButton label={loading ? "Входим..." : "Войти"} onPress={handleLogin} loading={loading} disabled={!emailOrPhone.trim() || !password.trim()} />
          <SecondaryButton label="Войти через Google" onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />

          <Pressable onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotLink} accessibilityRole="button">
            <Text style={styles.forgotText}>Забыли пароль?</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Нет аккаунта? </Text>
            <Pressable onPress={() => navigation.navigate("Register")} accessibilityRole="button">
              <Text style={styles.registerLink}>Зарегистрироваться</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  header: {
    marginBottom: spacing.xl,
  },
  logoText: {
    ...typography.title,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
  },
  form: {
    gap: spacing.md,
  },
  toggleLink: {
    alignSelf: "flex-end",
    marginTop: spacing.xs,
  },
  toggleLinkText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: "600",
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
  },
  forgotLink: {
    alignSelf: "center",
    paddingVertical: spacing.sm,
  },
  forgotText: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: spacing.sm,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.body,
    color: colors.primary,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
