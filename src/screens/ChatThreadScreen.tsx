import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { AppTheme, useAppTheme, alpha, darkTheme, lightTheme, spacing, typography, elevation } from "@/theme";
import { Avatar, GlassContainer } from "@/components/ui";
import { users } from "@/data/mockData";

type ChatTheme = Omit<AppTheme, "mode"> & { mode: "light" | "dark" };

const createStyles = (theme: ChatTheme) =>
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
      top: -120,
      right: -80, // Kept theme.colors.ambientTop
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: alpha(theme.colors.primary, theme.mode === "dark" ? 0.22 : 0.14),
    },
    ambientBottom: {
      position: "absolute",
      left: -90,
      bottom: -140, // Kept theme.colors.ambientBottom
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: alpha(theme.colors.accent, theme.mode === "dark" ? 0.18 : 0.12),
    },
    header: {
      marginHorizontal: theme.spacing.md,
      borderRadius: 24, // Kept theme.spacing.sm
    },
    headerContent: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
    },
    headerTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    headerSubtitle: {
      ...typography.caption,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 2,
    },
    scrollContent: {
      paddingHorizontal: theme.spacing.md,
      paddingTop: theme.spacing.md,
      paddingBottom: 128,
      gap: theme.spacing.sm,
    }, // Kept theme.spacing.sm
    dayChip: {
      alignSelf: "center",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.1 : 0.72),
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      marginBottom: spacing.sm,
    },
    dayChipText: {
      ...theme.typography.caption,
      color: theme.colors.textSecondary,
    },
    bubbleRowMine: {
      alignItems: "flex-end",
    },
    bubbleRowTheirs: {
      alignItems: "flex-start",
    },
    bubble: {
      maxWidth: "82%",
      borderRadius: 22,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: spacing.sm,
    },
    bubbleMine: {
      backgroundColor: theme.colors.primary,
      borderBottomRightRadius: 8,
      ...(elevation.card as any),
    },
    bubbleTheirs: {
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.18 : 0.88),
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      borderBottomLeftRadius: 8,
    },
    bubbleText: {
      ...typography.body,
      lineHeight: 21,
      color: theme.colors.textPrimary,
    },
    bubbleTextMine: {
      color: theme.colors.white,
    },
    bubbleMeta: {
      ...typography.caption,
      marginTop: 6,
      color: alpha(theme.colors.textSecondary, 0.92),
    },
    bubbleMetaMine: {
      color: alpha(theme.colors.white, 0.78),
    },
    composerWrap: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
    },
    composer: {
      borderRadius: 24,
    },
    composerContent: {
      padding: spacing.sm,
      flexDirection: "row",
      alignItems: "flex-end",
      gap: theme.spacing.sm,
    },
    attachButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.62),
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
    },
    composerInputWrap: {
      flex: 1,
      minHeight: 52,
      maxHeight: 120,
      borderRadius: 20,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.68),
      borderWidth: 1,
      borderColor: theme.colors.borderStrong,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      justifyContent: "center",
    },
    composerInput: {
      ...theme.typography.body,
      color: theme.colors.textPrimary,
      padding: 0,
      margin: 0,
    },
    sendButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.primary,
      ...(typeof elevation.button === "object"
        ? elevation.button
        : { elevation: Number(elevation.button) }),
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

const demoMessages = [
  { id: "1", text: "Здравствуйте! Добро пожаловать в Самарканд.", mine: false, time: "09:14" },
  { id: "2", text: "Спасибо! Мы хотели бы забронировать жилье.", mine: true, time: "09:16" },
  { id: "3", text: "Конечно. Какие даты вас интересуют?", mine: false, time: "09:18" },
  { id: "4", text: "С 15 по 20 июня, 2 взрослых и 1 ребенок.", mine: true, time: "09:19" },
  { id: "5", text: "Отлично. У меня есть подходящий вариант. Отправляю ссылку.", mine: false, time: "09:20" },
];

export function ChatThreadScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation("common");
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles; // This line already exists, no change needed here.
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState("");
  const host = useMemo(() => users[0], []);

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

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

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 12 : 0}
      >
        <Animated.View
          entering={FadeIn.duration(400)}
          style={{ paddingTop: Math.max(insets.top + 8, 18) }}
        >
          <GlassContainer variant="navbar" style={styles.header}>
            <View style={styles.headerContent}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.attachButton, pressed && { opacity: 0.92 }]}
                accessibilityRole="button"
                accessibilityLabel={t("back")}
              >
                <MaterialCommunityIcons name="chevron-left" size={22} color={theme.colors.textPrimary} />
              </Pressable>
              <Avatar uri={host.avatar} size={42} />
              <View style={styles.headerCopy}>
                <Text style={styles.headerTitle}>{host.name}</Text>
                <Text style={styles.headerSubtitle}>{t("chatRecentlyOnline")}</Text>
              </View>
              <Pressable
                onPress={() =>
                  Alert.alert(t("chatActionsTitle"), t("chatActionsMessage"), [
                    { text: t("chatCancel"), style: "cancel" },
                    { text: t("chatReport"), onPress: () => Alert.alert(t("chatReportedTitle"), t("chatReportedMessage")) },
                  ])
                }
                style={({ pressed }) => [styles.attachButton, pressed && { opacity: 0.92 }]}
                accessibilityRole="button"
                accessibilityLabel={t("chatActionsTitle")}
              >
                <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.colors.textPrimary} />
              </Pressable>
            </View>
          </GlassContainer>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.dayChip}>
            <Text style={styles.dayChipText}>{t("today")}</Text>
          </View>
          {demoMessages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInUp.delay(index * 50).duration(Number(theme.motion.duration.normal))}
              style={message.mine ? styles.bubbleRowMine : styles.bubbleRowTheirs}
            >
              <View style={[styles.bubble, message.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={[styles.bubbleText, message.mine && styles.bubbleTextMine]}>{message.text}</Text>
                <Text style={[styles.bubbleMeta, message.mine && styles.bubbleMetaMine]}>{message.time}</Text>
              </View>
            </Animated.View>
          ))}
        </ScrollView>

        <Animated.View
          entering={FadeInDown.delay(80).duration(400)}
          style={[styles.composerWrap, { bottom: Math.max(insets.bottom + 12, 16) }]}
        >
          <GlassContainer variant="navbar" style={styles.composer}>
            <View style={styles.composerContent}>
              <Pressable
                onPress={() => Alert.alert(t("chatAttachmentsTitle"), t("chatAttachmentsMessage"))}
                style={({ pressed }) => [styles.attachButton, pressed && { opacity: 0.92 }]}
                accessibilityRole="button"
                accessibilityLabel={t("chatAttachmentsTitle")}
              >
                <MaterialCommunityIcons name="paperclip" size={20} color={theme.colors.textPrimary} />
              </Pressable>
              <View style={styles.composerInputWrap}>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder={t("chatPlaceholder")}
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  style={styles.composerInput}
                />
              </View>
              <Pressable
                onPress={() => setDraft("")}
                style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.9 }]}
                accessibilityRole="button"
                accessibilityLabel={t("send")}
              >
                <MaterialCommunityIcons name="send" size={20} color={theme.colors.white} />
              </Pressable>
            </View>
          </GlassContainer>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}
