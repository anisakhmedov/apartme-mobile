import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import {
  ToggleRow,
  Section,
  ScreenScroll,
  Pill,
} from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/store";
import {
  setLanguage,
  setCurrency,
  toggleDarkMode,
  togglePush,
  setBiometric,
} from "@/store/preferencesSlice";
import { PrimaryButton } from "@/components/ui";
import { logout } from "@/store/authSlice";

const languageOptions = ["ru", "en", "uz"] as const;
const currencyOptions = ["UZS", "USD", "EUR"] as const;

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const parentNavigation = useNavigation<any>();
  const { t } = useTranslation("profile");
  const dispatch = useAppDispatch();
  const preferences = useAppSelector((state: any) => state.preferences);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <Section title={t("language")}>
          <Animated.View
            entering={FadeIn.duration(400).delay(100)}
            style={styles.inlineChoices}
          >
            {languageOptions.map((code, index) => (
              <Animated.View key={code} entering={FadeIn.delay(index * 50).duration(400)}>
                <Pill
                  label={code.toUpperCase()}
                  active={preferences.language === code}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    dispatch(setLanguage(code));
                  }}
                />
              </Animated.View>
            ))}
          </Animated.View>
        </Section>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)}>
        <Section title={t("currency")}>
          <View style={styles.inlineChoices}>
            {currencyOptions.map((code, index) => (
              <Animated.View
                key={code}
                entering={FadeInUp.delay(100 + index * 50).duration(400)}
              >
                <Pill
                  label={code}
                  active={preferences.currency === code}
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    dispatch(setCurrency(code));
                  }}
                />
              </Animated.View>
            ))}
          </View>
        </Section>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)}>
        <Section title={t("notifications")}>
          <ToggleRow
            label={t("pushBookings")}
            value={preferences.pushBookings}
            onToggle={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              dispatch(togglePush("pushBookings"));
            }}
          />
          <ToggleRow
            label={t("pushMessages")}
            value={preferences.pushMessages}
            onToggle={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              dispatch(togglePush("pushMessages"));
            }}
          />
        </Section>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(300)}>
        <Section title={t("security")}>
          <ToggleRow
            label={t("darkMode")}
            value={preferences.darkMode}
            onToggle={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              dispatch(toggleDarkMode());
            }}
          />
          <ToggleRow
            label={t("biometricLogin")}
            value={preferences.biometric}
            onToggle={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              dispatch(setBiometric(!preferences.biometric));
            }}
          />
        </Section>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.buttonContainer}>
        <PrimaryButton
          label={t("changePassword")}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
        
        <PrimaryButton
          label={t("deleteAccount")}
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          }}
          danger
          style={styles.deleteButton}
        />
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  inlineChoices: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  buttonContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },
  deleteButton: {
    marginTop: spacing.lg,
  },
});
