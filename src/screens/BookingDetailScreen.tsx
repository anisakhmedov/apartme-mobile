import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, spacing, typography } from "@/theme";
import { ScreenScroll, InfoRow, PrimaryButton, SecondaryButton } from "@/components/ui";
import { bookings } from "@/data/mockData";

export function BookingDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const bookingId = route.params?.id || "booking-1";
  const booking = bookings.find(b => b.id === bookingId) || bookings[0];

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <Animated.Text style={styles.title}>Детали бронирования</Animated.Text>
        <Animated.Text style={styles.subtitle}>#{booking.id}</Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(100)} style={styles.infoCard}>
        <InfoRow label="Заезд" value={booking.checkIn} />
        <InfoRow label="Выезд" value={booking.checkOut} />
        <InfoRow label="Гости" value="2 взрослых" />
        <InfoRow label="Способ оплаты" value={booking.paymentMethod} />
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(200)} style={styles.buttonContainer}>
        <SecondaryButton
          label="Отменить бронирование"
          onPress={() => {
            navigation.navigate("CancelBooking", { id: booking.id });
          }}
          danger
        />
        <SecondaryButton
          label="Связаться с хостом"
          onPress={() => {
            navigation.getParent()?.navigate("ChatTab", {
              screen: "ChatThread",
              params: { id: "msg-1", title: "Azizbek Karimov" }
            });
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
  title: {
    fontSize: 28,
    fontWeight: "500", // Kept colors.textPrimary
    color: colors.textPrimary, // Kept colors.textPrimary
    marginBottom: 8,
  }, // Kept colors.textSecondary
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  infoCard: {
    backgroundColor: colors.surface.DEFAULT, // Kept colors.surface
    borderRadius: 12, // Kept 12
    padding: spacing.md, // Kept spacing.md
    marginBottom: 24, // Kept 24
  }, // Kept spacing.md
  buttonContainer: {
    gap: spacing.md, // Kept spacing.md
  }, // Kept spacing.md
});
