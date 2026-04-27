import React, { useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Calendar } from "react-native-calendars";
import * as Haptics from "expo-haptics";

import { colors, spacing, radii } from "@/theme";
import { PrimaryButton, SecondaryButton, InfoRow, ScreenScroll, Card } from "@/components/ui";
import { formatCurrency } from "@/components/ui";
import { properties } from "@/data/mockData";

export function BookingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const propertyId = route.params?.propertyId;
  const property = properties.find((p) => p.id === propertyId) || properties[0];

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const nights = 3; // Mock calculation
  const totalPrice = property.price * nights;

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Payment", {
      propertyId,
      checkIn,
      checkOut,
      guests,
      totalPrice,
    });
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Text style={styles.title}>Бронирование</Text>
        <Text style={styles.subtitle}>{property.title.ru}</Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)}>
        <Card style={styles.calendarCard}>
          <Calendar
            onDayPress={(day: any) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              if (!checkIn) {
                setCheckIn(day.dateString);
              } else if (!checkOut) {
                setCheckOut(day.dateString);
              }
            }}
            markedDates={(
              checkIn
                ? {
                    [checkIn]: { selected: true, startDate: true },
                    ...(checkOut
                      ? { [checkOut]: { selected: true, endDate: true } }
                      : {}),
                  }
                : {}
            ) as any}
            theme={{
              selectedDayBackgroundColor: colors.primary,
              todayTextColor: colors.primary,
              arrowColor: colors.primary,
            }}
          />
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)}>
        <Card style={styles.infoCard}>
          <InfoRow label="Заезд" value={checkIn || "Выберите дату"} />
          <InfoRow label="Выезд" value={checkOut || "Выберите дату"} />
          <InfoRow label="Гости">
            <View style={styles.guestCounter}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGuests(Math.max(1, guests - 1));
                }}
                style={styles.counterButton}
              >
                <MaterialCommunityIcons name="minus" size={20} color={colors.textPrimary} />
              </Pressable>
              <Text style={styles.guestCount}>{guests}</Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGuests(guests + 1);
                }}
                style={styles.counterButton}
              >
                <MaterialCommunityIcons name="plus" size={20} color={colors.textPrimary} />
              </Pressable>
            </View>
          </InfoRow>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(300)}>
        <Card style={styles.priceCard}>
          <InfoRow label="Цена за ночь" value={formatCurrency(property.price, property.currency)} />
          <InfoRow label={`${nights} ночей`} value={formatCurrency(property.price * nights, property.currency)} />
          <View style={styles.divider} />
          <InfoRow label="Итого" value={formatCurrency(totalPrice, property.currency)} style={styles.totalRow} />
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.buttonContainer}>
        <PrimaryButton
          label="Продолжить"
          onPress={handleContinue}
          disabled={!checkIn || !checkOut}
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
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  calendarCard: {
    marginBottom: spacing.md,
  },
  infoCard: {
    marginBottom: spacing.md,
  },
  guestCounter: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  counterButton: {
    width: 32,
    height: 32,
    borderRadius: radii.pill,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  guestCount: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    minWidth: 24,
    textAlign: "center",
  },
  priceCard: {
    marginBottom: spacing.lg,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  totalRow: {
    marginTop: spacing.sm,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
