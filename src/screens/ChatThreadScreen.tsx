import React, { useEffect, useMemo, useState } from "react";
import {
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

import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import { Avatar, GlassContainer } from "@/components/ui";
import { users } from "@/data/mockData";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    ambientTop: {
      position: "absolute",
      top: -120,
      right: -80,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: "absolute",
      left: -90,
      bottom: -140,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: theme.colors.ambientBottom,
    },
    header: {
      marginHorizontal: spacing.md,
      borderRadius: 24,
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
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    headerSubtitle: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingTop: spacing.md,
      paddingBottom: 128,
      gap: spacing.sm,
    },
    dayChip: {
      alignSelf: "center",
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.1 : 0.72),
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
      marginBottom: spacing.sm,
    },
    dayChipText: {
      ...typography.caption,
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
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
    },
    bubbleMine: {
      backgroundColor: theme.colors.primary,
      borderBottomRightRadius: 8,
      ...theme.elevation.soft,
    },
    bubbleTheirs: {
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.18 : 0.88),
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
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
      ...typography.micro,
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
      gap: spacing.sm,
    },
    attachButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.62),
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
    },
    composerInputWrap: {
      flex: 1,
      minHeight: 52,
      maxHeight: 120,
      borderRadius: 20,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.68),
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
      paddingHorizontal: spacing.md,
      paddingVertical: 12,
      justifyContent: "center",
    },
    composerInput: {
      ...typography.body,
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
      ...theme.elevation.soft,
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
  const route = useRoute<any>();
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const insets = useSafeAreaInsets();
  const [draft, setDraft] = useState("");

  const host = useMemo(() => users[0], []);
  const title = route.params?.title ?? host.name;

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
          entering={FadeIn.duration(theme.motion.standard)}
          style={{ paddingTop: Math.max(insets.top + 8, 18) }}
        >
          <GlassContainer variant="navbar" style={styles.header}>
            <View style={styles.headerContent}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [styles.attachButton, pressed && { opacity: 0.92 }]}
                accessibilityRole="button"
                accessibilityLabel="Back"
              >
                <MaterialCommunityIcons name="chevron-left" size={22} color={theme.colors.textPrimary} />
              </Pressable>
              <Avatar uri={host.avatar} size={42} />
              <View style={styles.headerCopy}>
                <Text style={styles.headerTitle}>{title}</Text>
                <Text style={styles.headerSubtitle}>в сети недавно</Text>
              </View>
              <Pressable
                onPress={() => undefined}
                style={({ pressed }) => [styles.attachButton, pressed && { opacity: 0.92 }]}
                accessibilityRole="button"
                accessibilityLabel="More"
              >
                <MaterialCommunityIcons name="dots-horizontal" size={20} color={theme.colors.textPrimary} />
              </Pressable>
            </View>
          </GlassContainer>
        </Animated.View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.dayChip}>
            <Text style={styles.dayChipText}>Сегодня</Text>
          </View>
          {demoMessages.map((message, index) => (
            <Animated.View
              key={message.id}
              entering={FadeInUp.delay(index * 50).duration(theme.motion.standard)}
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
          entering={FadeInDown.delay(80).duration(theme.motion.standard)}
          style={[styles.composerWrap, { bottom: Math.max(insets.bottom + 12, 16) }]}
        >
          <GlassContainer variant="navbar" style={styles.composer}>
            <View style={styles.composerContent}>
              <Pressable
                onPress={() => undefined}
                style={({ pressed }) => [styles.attachButton, pressed && { opacity: 0.92 }]}
                accessibilityRole="button"
                accessibilityLabel="Attach"
              >
                <MaterialCommunityIcons name="paperclip" size={20} color={theme.colors.textPrimary} />
              </Pressable>
              <View style={styles.composerInputWrap}>
                <TextInput
                  value={draft}
                  onChangeText={setDraft}
                  placeholder="Сообщение"
                  placeholderTextColor={theme.colors.textSecondary}
                  multiline
                  style={styles.composerInput}
                />
              </View>
              <Pressable
                onPress={() => setDraft("")}
                style={({ pressed }) => [styles.sendButton, pressed && { opacity: 0.9 }]}
                accessibilityRole="button"
                accessibilityLabel="Send"
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
