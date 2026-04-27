import React from "react";
import { Text } from "react-native";
import { useTranslation } from "react-i18next";

import { AppScreen, BookingCard, ScreenScroll, Section } from "@/components/ui";
import { colors, spacing, typography } from "@/theme";

export function BookingRequestsScreen() {
  const { t } = useTranslation("profile");

  return (
    <AppScreen>
      <ScreenScroll contentContainerStyle={{ padding: spacing.md, paddingBottom: spacing.xl }}>
        <Section title={t("bookingRequests")} subtitle={t("bookingRequestsSubtitle")}>
          <Text style={[typography.body, { color: colors.textSecondary, marginBottom: spacing.md }]}>Новые запросы от гостей отображаются здесь.</Text>
          <BookingCard id="req-1" title="Madina Ismailova" status="upcoming" subtitle="2 guests · 3 nights" />
          <BookingCard id="req-2" title="Rustam Karimov" status="warning" subtitle="1 guest · 1 night" />
        </Section>
      </ScreenScroll>
    </AppScreen>
  );
}
