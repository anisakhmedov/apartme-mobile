import React, { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import { AppScreen, PrimaryButton, SecondaryButton, TextField } from "../components/ui";
import { Palette as rawColors, spacing, typography, radii } from "../theme";
import { useAppDispatch } from "../store";
import { persistAuth, setUser } from "../store/authSlice";
import { users } from "../data/mockData";

const colors: any = rawColors;

export function LoginScreen() {
  const { t } = useTranslation("auth");
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [secureTextEntry, setSecureTextEntry] = useState(true);

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      setApiError(t("loginFillRequired"));
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
          <Text style={styles.subtitle}>{t("loginSubtitle")}</Text>
        </View>

        <View style={styles.form}>
          <TextField label={t("emailOrPhone")} placeholder={t("emailOrPhone")} value={emailOrPhone} onChangeText={setEmailOrPhone} keyboardType="email-address" autoCapitalize="none" />
          <View>
            <TextField label={t("password")} placeholder={t("password")} value={password} onChangeText={setPassword} secureTextEntry={secureTextEntry} />
            <Pressable onPress={() => setSecureTextEntry((current) => !current)} style={styles.toggleLink} accessibilityRole="button">
              <Text style={styles.toggleLinkText}>{secureTextEntry ? t("showPassword") : t("hidePassword")}</Text>
            </Pressable>
          </View>

          {apiError ? <Text style={styles.errorText}>{apiError}</Text> : null}

          <PrimaryButton label={loading ? t("loginLoading") : t("login")} onPress={handleLogin} loading={loading} disabled={!emailOrPhone.trim() || !password.trim()} />
          <SecondaryButton label={t("loginWithGoogle")} onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)} />

          <Pressable onPress={() => navigation.navigate("ForgotPassword")} style={styles.forgotLink} accessibilityRole="button">
            <Text style={styles.forgotText}>{t("forgotPassword")}</Text>
          </Pressable>

          <View style={styles.footer}>
            <Text style={styles.footerText}>{t("noAccount")} </Text>
            <Pressable onPress={() => navigation.navigate("Register")} accessibilityRole="button">
              <Text style={styles.registerLink}>{t("register")}</Text>
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
    padding: spacing.md,
    justifyContent: "center",
    backgroundColor: colors.background.DEFAULT,
  },
  header: {
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  logoText: {
    ...typography.heading,
    color: colors.primary.DEFAULT,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: colors.textSecondary,
  },
  form: {
    width: "100%",
  },
  toggleLink: {
    position: "absolute",
    right: spacing.sm,
    top: spacing.sm,
    padding: spacing.xs,
  },
  toggleLinkText: {
    ...typography.label,
    color: colors.primary.DEFAULT,
  },
  errorText: {
    color: colors.error,
    marginTop: spacing.sm,
  },
  forgotLink: {
    alignSelf: "flex-end",
    marginTop: spacing.sm,
  },
  forgotText: {
    ...typography.body,
    color: colors.primary.DEFAULT,
    fontWeight: "600",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  registerLink: {
    ...typography.body,
    color: colors.primary.DEFAULT,
    fontWeight: "600",
  },
});
