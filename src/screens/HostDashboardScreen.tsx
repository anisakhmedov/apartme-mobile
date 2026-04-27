import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useNavigationParent } from "@react-navigation/native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import { StatCard, Section, PrimaryButton, Card, ScreenScroll, BookingCard } from "@/components/ui";
import { formatCurrency } from "@/components/ui";

export function HostDashboardScreen() {
  const navigation = useNavigation<any>();
  const parentNavigation = useNavigationParent();

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Панель управления</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Управляйте своими обьектами
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(100)} style={styles.statsRow}>
        <StatCard label="Сегодня" value={formatCurrency(1200000, "UZS")} />
        <StatCard label="Неделя" value={formatCurrency(8400000, "UZS")} />
        <StatCard label="Месяц" value={formatCurrency(32000000, "UZS")} />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(200)}>
        <Section title="Ожидающие заявки">
          <BookingCard
            id="req-1"
            title="Гостевой запрос"
            status="upcoming"
            subtitle="2 ночи"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        </Section>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(300)}>
        <Section title="Календарь занятости">
          <Card style={styles.calendarCard}>
            {/* TODO: Add calendar component */}
            <Animated.Text style={styles.comingSoon}>
              Календарь будет доступен в следующей версии
            </Animated.Text>
          </Card>
        </Section>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(400)} style={styles.buttonContainer}>
        <PrimaryButton
          label="Мои обьекты"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            parentNavigation?.navigate("HostFlow", { screen: "MyListings" });
          }}
          style={styles.button}
        />
        
        <PrimaryButton
          label="Добавить обьект"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            parentNavigation?.navigate("HostFlow", { screen: "AddEditListing" });
          }}
          style={styles.button}
        />
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  calendarCard: {
    padding: spacing.md,
    alignItems: "center",
  },
  comingSoon: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
  },
  buttonContainer: {
    padding: spacing.md,
    gap: spacing.md,
  },
  button: {
    width: "100%",
  },
});
