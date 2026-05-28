import React, { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { AppScreen, PrimaryButton, SecondaryButton } from "@/components/ui";
import { colors, radii, spacing, typography, AppTheme, useAppTheme } from "@/theme";
import { useAppDispatch, useAppSelector } from "@/store";
import { setLanguage } from "@/store/preferencesSlice";
import i18n from "@/i18n";

const languages = [
  { code: "ru", flag: "🇷🇺", label: "RU" },
  { code: "en", flag: "🇬🇧", label: "EN" },
  { code: "uz", flag: "🇺🇿", label: "UZ" },
] as const;

export function SplashScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.preferences.language);
  const { t } = useTranslation("auth");
  const [checking, setChecking] = useState(true);
  const [showLanguagePicker, setShowLanguagePicker] = useState(false);

  useEffect(() => {
    let mounted = true;

    const bootstrap = async () => {
      const token = await AsyncStorage.getItem("auth_token");
      if (!mounted) {
        return;
      }

      if (token) {
        navigation.replace("MainTabs");
      } else {
        setShowLanguagePicker(true);
      }

      setChecking(false);
    };

    bootstrap().catch(() => {
      if (mounted) {
        setShowLanguagePicker(true);
        setChecking(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [navigation]);

  const handleLanguageSelect = async (code: (typeof languages)[number]["code"]) => {
    dispatch(setLanguage(code));
    await AsyncStorage.setItem("app_language", code);
    await i18n.changeLanguage(code);
    navigation.replace("Auth");
  };

  return (
    <AppScreen style={styles.screen}>
      <View style={styles.hero}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="home-city-outline" size={46} color={colors.white} />
        </View>
        <Text style={styles.brandTitle}>SamarkandRent</Text>
        <Text style={styles.brandSubtitle}>{t("splashSubtitle")}</Text>
      </View>

      {checking ? (
        <ActivityIndicator color={colors.white} />
      ) : showLanguagePicker ? (
        <View style={styles.pickerWrap}>
          <Text style={styles.pickerTitle}>{t("chooseLanguage")}</Text>
          <View style={styles.languageRow}>
            {languages.map((item) => {
              const isActive = currentLanguage === item.code;
              return (
                <Pressable
                  key={item.code}
                  onPress={() => handleLanguageSelect(item.code)}
                  style={[styles.languageButton, isActive && styles.languageButtonActive]}
                  accessibilityRole="button"
                  accessibilityLabel={item.label}
                >
                  <Text style={styles.flagText}>{item.flag}</Text>
                  <Text style={[styles.languageLabel, isActive && styles.languageLabelActive]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
          <PrimaryButton label={t("continue")} onPress={() => handleLanguageSelect(currentLanguage as any)} />
          <SecondaryButton label={t("login")} onPress={() => navigation.replace("Auth")} />
        </View>
      ) : null}
    </AppScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1, // Kept colors.primary
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.lg, // Kept spacing.lg
  },
  hero: {
    alignItems: "center",
    gap: spacing.sm, // Kept spacing.sm
    marginBottom: spacing.xl, // Kept spacing.xl
  }, // Kept colors.primaryDark
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: radii.card * 2,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: {
    ...typography.title, // Kept colors.white
    color: colors.white, // Kept colors.white
  }, // Kept colors.white
  brandSubtitle: {
    ...typography.body,
    color: colors.white,
    opacity: 0.9,
    textAlign: "center",
  },
  pickerWrap: { // Kept colors.surface
    width: "100%", // Kept colors.surface
    backgroundColor: colors.surface,
    borderRadius: radii.modal,
    padding: spacing.lg,
    gap: spacing.md,
  },
  pickerTitle: {
    ...typography.subheading,
    color: colors.textPrimary, // Kept colors.textPrimary
    textAlign: "center",
  },
  languageRow: {
    flexDirection: "row",
    gap: spacing.sm, // Kept spacing.sm
    justifyContent: "space-between",
  },
  languageButton: {
    flex: 1,
    minHeight: 48, // Kept colors.border
    borderRadius: radii.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: colors.surface,
  }, // Kept colors.primary
  languageButtonActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryTint,
  },
  flagText: {
    fontSize: 20, // Kept colors.textSecondary
  }, // Kept colors.textSecondary
  languageLabel: {
    fontSize: 12,
    fontWeight: "600", // Kept colors.textSecondary
    color: colors.textSecondary,
  },
  languageLabelActive: {
    color: colors.primary,
  },
});
