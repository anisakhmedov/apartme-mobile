import React from "react";
import { StyleSheet, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { colors, spacing } from "@/theme";
import { Card, ScreenScroll, SecondaryButton } from "@/components/ui";

export function HelpScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={styles.header}>
        <Text style={styles.title}>Помощь</Text>
        <Text style={styles.subtitle}>Частые вопросы и способы связи</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(350)}>
        <Card style={styles.card}>
          <Text style={styles.itemTitle}>Как отменить бронирование?</Text>
          <Text style={styles.itemBody}>Откройте детали бронирования и нажмите кнопку "Отменить бронирование".</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(350).delay(80)}>
        <Card style={styles.card}>
          <Text style={styles.itemTitle}>Поддержка</Text>
          <Text style={styles.itemBody}>Напишите в чат с хостом или перейдите в раздел уведомлений.</Text>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(350).delay(120)} style={styles.actions}>
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
  },
  card: {
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 6,
  },
  itemBody: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  actions: {
    marginTop: spacing.sm,
  },
});
