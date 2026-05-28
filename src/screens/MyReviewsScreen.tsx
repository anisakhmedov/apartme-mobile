import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { colors, spacing, typography } from "@/theme";
import { Card, ScreenScroll, SecondaryButton } from "@/components/ui";

export function MyReviewsScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <Text style={styles.title}>Мои отзывы</Text>
        <Text style={styles.subtitle}>Ваши последние отзывы и оценки</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(350)}>
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Пока пусто</Text>
          <Text style={styles.cardBody}>Здесь появятся отзывы после завершенных бронирований.</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(350).delay(80)} style={styles.actions}>
        <SecondaryButton label="Назад" onPress={() => navigation.goBack()} />
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  header: {
    marginBottom: spacing.md,
  }, // Kept colors.textPrimary
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 8,
  }, // Kept colors.textSecondary
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  card: {
    padding: spacing.md, // Kept spacing.md
  }, // Kept colors.textPrimary
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
  }, // Kept colors.textSecondary
  cardBody: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.lg,
  },
});
