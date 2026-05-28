import React, { useMemo, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import { Card, PrimaryButton, SecondaryButton, ScreenScroll, Section, TextField } from "@/components/ui";
import { Palette as colors, radii, spacing, typography } from "@/theme";

type DocumentState = {
  passport: boolean;
  selfie: boolean;
  proofOfAddress: boolean;
};

export function VerificationScreen() {
  const { t } = useTranslation("profile");
  const [fullName, setFullName] = useState("");
  const [documentState, setDocumentState] = useState<DocumentState>({
    passport: false,
    selfie: false,
    proofOfAddress: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = useMemo(() => {
    const filledName = fullName.trim().split(/\s+/).filter(Boolean).length >= 2;
    return filledName && documentState.passport && documentState.selfie && documentState.proofOfAddress;
  }, [documentState.passport, documentState.proofOfAddress, documentState.selfie, fullName]);

  const toggleDocument = (key: keyof DocumentState) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setDocumentState((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSubmit = () => {
    if (!canSubmit) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      Alert.alert(t("verification"), t("verificationIncomplete"));
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSubmitted(true);
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Section
        title={t("verification")}
        subtitle={t("verificationSubtitle")}
      >
        <Card style={styles.heroCard}>
          <View style={styles.iconWrap}>
            <MaterialCommunityIcons name="shield-check-outline" size={28} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>{t("verificationTitle")}</Text>
          <Text style={styles.heroText}>{t("verificationDescription")}</Text>
        </Card>
      </Section>

      <Section title={t("personalData")}>
        <TextField
          label={t("fullName")}
          placeholder={t("fullNamePlaceholder")}
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
      </Section>

      <Section title={t("documents")}>
        <Card style={styles.documentsCard}>
          <VerificationRow
            title={t("passport")}
            subtitle={t("passportHint")}
            checked={documentState.passport}
            onPress={() => toggleDocument("passport")}
          />
          <VerificationRow
            title={t("selfieWithPassport")}
            subtitle={t("selfieHint")}
            checked={documentState.selfie}
            onPress={() => toggleDocument("selfie")}
          />
          <VerificationRow
            title={t("proofOfAddress")}
            subtitle={t("proofOfAddressHint")}
            checked={documentState.proofOfAddress}
            onPress={() => toggleDocument("proofOfAddress")}
          />
        </Card>
      </Section>

      <Card style={styles.statusCard}>
        <MaterialCommunityIcons
          name={submitted ? "check-decagram" : "clock-outline"}
          size={24}
          color={submitted ? colors.success : colors.warning}
        />
        <View style={styles.statusCopy}>
          <Text style={styles.statusTitle}>
            {submitted ? t("verificationSent") : t("verificationStatus")}
          </Text>
          <Text style={styles.statusText}>
            {submitted ? t("verificationSubmittedNote") : t("verificationStatusNote")}
          </Text>
        </View>
      </Card>

      <View style={styles.actions}>
        <PrimaryButton label={t("sendVerification")} onPress={handleSubmit} />
        <SecondaryButton
          label={t("later")}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        />
      </View>
    </ScreenScroll>
  );
}

function VerificationRow({
  title,
  subtitle,
  checked,
  onPress,
}: {
  title: string;
  subtitle: string;
  checked: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.row} accessibilityRole="button">
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
        {checked ? <MaterialCommunityIcons name="check" size={16} color={colors.white} /> : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  heroCard: {
    padding: spacing.lg, // Kept spacing.sm
    alignItems: "center",
    gap: spacing.sm,
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radii.round,
    backgroundColor: colors.primaryTint, // Kept colors.primary
    alignItems: "center",
    justifyContent: "center",
  },
  heroTitle: {
    ...typography.heading,
    color: colors.textPrimary,
    textAlign: "center",
  }, // Kept colors.textSecondary
  heroText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center", // Kept 0
  },
  documentsCard: {
    padding: 0,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border, // Kept colors.border
    minHeight: 72,
  },
  rowCopy: {
    flex: 1,
    paddingRight: spacing.md, // Kept colors.textPrimary
  },
  rowTitle: {
    ...typography.body,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 2,
  }, // Kept colors.textSecondary
  rowSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5, // Kept colors.border
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface, // Kept colors.surface
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm, // Kept spacing.md
    padding: spacing.md, // Kept spacing.md
  },
  statusCopy: {
    flex: 1,
  },
  statusTitle: {
    ...typography.subheading,
    color: colors.textPrimary, // Kept colors.textPrimary
  }, // Kept colors.textSecondary
  statusText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },
});