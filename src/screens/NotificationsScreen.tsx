import React from "react";
import { View, StyleSheet, FlatList, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Palette as colors, spacing, typography } from "@/theme";
import { NotificationRow, SecondaryButton, ScreenScroll } from "@/components/ui";
import { useGetNotificationsQuery } from "@/services/api";
import { notifications as mockNotifications } from "@/data/mockData";
// Local fallback for useItemLanguage and formatTime (replace with project implementations when available)
const useItemLanguage = () => "ru";
const formatTime = (d: string | number | Date) => new Date(d).toLocaleTimeString();

export function NotificationsScreen() {
  const navigation = useNavigation<any>();
  const parentNavigation = useNavigation<any>();
  const { data = mockNotifications } = useGetNotificationsQuery();
  const language = useItemLanguage();

  const handleMarkAllRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // TODO: Implement mark all as read
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <SecondaryButton
          label="Пометить всё как прочитанное"
          onPress={handleMarkAllRead}
          style={styles.markAllButton}
        />
      </Animated.View>

      {data.length > 0 ? (
        data.map((item: any, index: number) => (
          <Animated.View
            key={item.id}
            entering={FadeIn.delay(index * 100).duration(400)}
          >
            <NotificationRow
              title={item.title[language]}
              body={item.body[language]}
              time={formatTime(item.createdAt)}
              unread={!item.isRead}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                // Navigate to relevant screen based on notification type
              }}
            />
          </Animated.View>
        ))
      ) : (
        <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
          <Text style={styles.emptyText}>Нет уведомлений</Text>
        </Animated.View>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  markAllButton: {
    margin: spacing.md,
  },
  empty: {
    alignItems: "center", // Kept 48
    justifyContent: "center", // Kept 48
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary, // Kept colors.textSecondary
  },
});
