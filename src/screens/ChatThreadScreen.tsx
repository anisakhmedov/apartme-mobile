import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";

import { colors, spacing } from "@/theme";
import { MessageBubble, ScreenScroll } from "@/components/ui";
import { messages as mockMessages } from "@/data/mockData";

export function ChatThreadScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const messageId = route.params?.id;

  const messages = [
    { id: 1, text: "Здравствуйте! Добро пожаловать в Самарканд.", mine: false },
    { id: 2, text: "Спасибо! Мы хотели бы забронировать жилье.", mine: true },
    { id: 3, text: "Конечно! Какие даты вас интересуют?", mine: false },
    { id: 4, text: "С 15 по 20 июня, 2 взрослых и 1 ребенок.", mine: true },
    { id: 5, text: "Отлично! У меня есть подходящий вариант. Отправляю ссылку.", mine: false },
  ];

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Чат с хостом</Animated.Text>
      </Animated.View>

      <ScreenScroll contentContainerStyle={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <Animated.View
            key={msg.id}
            entering={FadeInUp.delay(index * 100).duration(400)}
          >
            <MessageBubble text={msg.text} mine={msg.mine} />
          </Animated.View>
        ))}
      </ScreenScroll>

      <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.inputContainer}>
        <View style={styles.input}>
          {/* TODO: Add TextInput for new message */}
        </View>
        <Animated.View entering={FadeIn.duration(400).delay(400)} style={styles.sendButton}>
          <Text style={styles.sendText}>Отправить</Text>
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
  },
  messagesContainer: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  inputContainer: {
    flexDirection: "row",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    gap: spacing.sm,
  },
  input: {
    flex: 1,
    minHeight: 44,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sendButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  sendText: {
    color: colors.white,
    fontWeight: "600",
  },
});
