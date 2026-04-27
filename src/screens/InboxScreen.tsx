import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, spacing } from "@/theme";
import { ConversationRow, ScreenScroll, EmptyState } from "@/components/ui";
import { messages as mockMessages, users } from "@/data/mockData";
import { formatTime } from "./index";

export function InboxScreen() {
  const navigation = useNavigation<any>();

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Сообщения</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Ваши переписки с хостами
        </Animated.Text>
      </Animated.View>

      {mockMessages.length > 0 ? (
        mockMessages.map((message: any, index: number) => (
          <Animated.View
            key={message.id}
            entering={FadeInDown.delay(index * 100).duration(400)}
          >
            <ConversationRow
              title="Azizbek"
              preview={message.text}
              time={formatTime(message.createdAt)}
              unread={1}
              avatar={users[0].avatar}
              onPress={() => navigation.navigate("ChatThread", { id: message.id })}
            />
          </Animated.View>
        ))
      ) : (
        <EmptyState
          title="Нет сообщений"
          description="Начните общение с хостом"
        />
      )}
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
});
