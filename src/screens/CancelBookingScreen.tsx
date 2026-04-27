import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import { PrimaryButton, SecondaryButton, ScreenScroll } from "@/components/ui";

export function CancelBookingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const bookingId = route.params?.id || "BK-1042";

  const handleConfirmCancel = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    // TODO: API call to cancel booking
    navigation.goBack();
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Отменить бронирование</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Вы уверены, что хотите отменить бронирование?
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.warningCard}>
        <Animated.Text style={styles.warningText}>
          При отмене бронирования может взиматься штраф в размере одной ночи проживания.
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.bookingInfo}>
        <Animated.Text style={styles.bookingId}>
          Бронирование #{bookingId}
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.buttonContainer}>
        <PrimaryButton
          label="Да, отменить"
          onPress={handleConfirmCancel}
          danger
        />
        <SecondaryButton
          label="Нет, оставить"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        />
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
    marginBottom: 24,
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
  warningCard: {
    backgroundColor: colors.primaryTint,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: 24,
  },
  warningText: {
    fontSize: 15,
    color: colors.primary,
    lineHeight: 22,
  },
  bookingInfo: {
    marginBottom: 32,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  buttonContainer: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
});
