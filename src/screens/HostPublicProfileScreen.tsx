import React from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import { AppScreen, Avatar, Card, PrimaryButton, ScreenScroll, Section } from "@/components/ui";
import { colors, radii, spacing, typography } from "@/theme";

export function HostPublicProfileScreen() {
  const { t } = useTranslation("profile");

  return (
    <AppScreen>
      <ScreenScroll contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
        <Section title={t("hostDashboard")} subtitle={t("hostDashboardSubtitle")}>
          <Card style={{ alignItems: "center", gap: spacing.sm }}>
            <Avatar size={88} />
            <Text style={[typography.heading, { color: colors.textPrimary }]}>Azizbek</Text>
            <Text style={[typography.body, { color: colors.textSecondary, textAlign: "center" }]}>Host from Samarkand with verified listings and fast response time.</Text>
            <PrimaryButton label="Написать хосту" />
          </Card>
        </Section>
      </ScreenScroll>
    </AppScreen>
  );
}
