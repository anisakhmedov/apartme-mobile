import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { messages as mockMessages, users } from "@/data/mockData";
import { AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import { ConversationRow, EmptyState, GlassContainer, ScreenScroll } from "@/components/ui"; // Removed unused import of `colors`
import { formatTime } from "./index";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // Kept theme.colors.background
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    ambientTop: {
      position: "absolute",
      top: -110,
      right: -70, // Kept theme.colors.ambientTop
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: "absolute",
      left: -80,
      bottom: -120, // Kept theme.colors.ambientBottom
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: theme.colors.ambientBottom,
    },
    scrollContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl, // Kept spacing.xxxl
    },
    header: {
      marginBottom: spacing.lg, // Kept typography.title
    },
    title: {
      ...typography.title,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    subtitle: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 8,
    },
    hintPanel: {
      borderRadius: 22,
      marginBottom: spacing.xl, // Kept spacing.xl
    }, // Kept spacing.lg
    hintContent: {
      padding: spacing.lg,
      gap: spacing.sm,
    },
    hintTitle: {
      ...typography.subheading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    hintBody: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
    },
    list: {
      gap: spacing.sm,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

export function InboxScreen() {
  const navigation = useNavigation<any>();
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary, theme.colors.backgroundTertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      <View pointerEvents="none" style={styles.ambientTop} />
      <View pointerEvents="none" style={styles.ambientBottom} />

      <ScreenScroll contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + spacing.xxxl }]}>
        <Animated.View entering={FadeInUp.duration(theme.motion.standard)} style={styles.header}>
          <Text style={styles.title}>Сообщения</Text>
          <Text style={styles.subtitle}>Диалоги с хозяевами и гостями в спокойном, прозрачном интерфейсе.</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(60).duration(theme.motion.standard)}>
          <GlassContainer variant="accent" style={styles.hintPanel}>
            <View style={styles.hintContent}>
              <Text style={styles.hintTitle}>Быстрый путь к бронированию</Text>
              <Text style={styles.hintBody}>
                Открывайте диалог, уточняйте детали и переходите к бронированию без лишних экранов.
              </Text>
            </View>
          </GlassContainer>
        </Animated.View>

        {mockMessages.length ? (
          <View style={styles.list}>
            {mockMessages.map((message, index) => (
              <Animated.View key={message.id} entering={FadeInDown.delay(100 + index * 40).duration(theme.motion.standard)}>
                <ConversationRow
                  title="Azizbek Karimov"
                  preview={message.text}
                  time={formatTime(message.createdAt)}
                  unread={1}
                  avatar={users[0].avatar}
                  onPress={() => navigation.navigate("ChatThread", { id: message.id, title: "Azizbek Karimov" })}
                />
              </Animated.View>
            ))}
          </View>
        ) : (
          <EmptyState title="Пока нет сообщений" description="Начните общение с хозяином по понравившемуся объекту." />
        )}
      </ScreenScroll>
    </View>
  );
}
