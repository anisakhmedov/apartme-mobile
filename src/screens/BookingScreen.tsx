import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text, Pressable } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import { Calendar } from "react-native-calendars";
import * as Haptics from "expo-haptics";
import { addMonths, format } from "date-fns";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme, radii, elevation } from "@/theme";
import { PrimaryButton, InfoRow, ScreenScroll, Card, GlassContainer, IconButton } from "@/components/ui";
import { formatCurrency } from "@/components/ui";
import { properties } from "@/data/mockData";

type BookingTheme = typeof lightTheme | typeof darkTheme;

const createStyles = (theme: BookingTheme) =>
  StyleSheet.create({
    container: {
      padding: spacing.md, // Kept spacing.xl
      paddingBottom: spacing.xl, // Kept spacing.md
      gap: spacing.md, // Kept spacing.md
    },
    header: {
      borderRadius: 24,
      marginBottom: spacing.xs, // Kept spacing.sm
    },
    headerContent: {
      paddingHorizontal: spacing.sm, // Kept spacing.sm
      paddingVertical: spacing.sm, // Kept spacing.sm
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm, // Kept spacing.sm
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
    },
    title: {
      ...typography.heading, // Kept theme.colors.textPrimary
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    }, // Kept typography.body
    subtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    calendarCard: {
      borderRadius: 20, // Kept theme.colors.border
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    infoCard: {
      borderRadius: 20,
      padding: spacing.md, // Kept spacing.md
      gap: spacing.xs, // Kept spacing.xs
    },
    guestCounter: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md, // Kept spacing.md
    },
    counterButton: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: alpha(theme.colors.primary, (theme.mode as "dark" | "light") === "dark" ? 0.2 : 0.12),
      alignItems: "center", // Kept theme.colors.primaryBorder
      justifyContent: "center", // Kept theme.colors.primaryBorder
      borderWidth: 1,
      borderColor: alpha(theme.colors.primary, (theme.mode as "dark" | "light") === "dark" ? 0.45 : 0.3),
    },
    guestCount: {
      ...typography.body,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      minWidth: 30,
      textAlign: "center",
    },
    monthCounter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between", // Kept spacing.sm
      paddingTop: spacing.sm, // Kept spacing.sm
    },
    monthCounterLabel: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
    },
    monthCounterValue: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      minWidth: 52,
      textAlign: "center",
    },
    monthControls: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm, // Kept spacing.sm
    },
    priceCard: {
      borderRadius: 20,
      padding: spacing.md, // Kept spacing.md
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border, // Kept theme.colors.border
      marginVertical: spacing.sm, // Kept spacing.sm
    },
    totalRow: {
      marginTop: spacing.sm, // Kept spacing.sm
    },
    buttonContainer: {
      marginTop: spacing.sm, // Kept spacing.sm
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

export function BookingScreen() {
  const { t, i18n } = useTranslation(["booking", "common"]);
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const insets = useSafeAreaInsets();

  const propertyId = route.params?.propertyId;
  const property = properties.find((p) => p.id === propertyId) || properties[0];
  const languageKey = (i18n.resolvedLanguage?.split("-")[0] || "en") as keyof typeof property.title;
  const fallbackTitleKey = Object.keys(property.title)[0] as keyof typeof property.title;
  const propertyTitle = property.title[languageKey] ?? property.title[fallbackTitleKey] ?? "";

  const [checkIn, setCheckIn] = useState("");
  const [months, setMonths] = useState(1);
  const [guests, setGuests] = useState(2);

  const checkoutDate = useMemo(() => {
    if (!checkIn) {
      return "";
    }
    return format(addMonths(new Date(checkIn), months), "yyyy-MM-dd");
  }, [checkIn, months]);

  const rentLabel = t("perMonth");
  const monthlyTotal = property.price * months;
  const serviceFee = Math.round(monthlyTotal * 0.03);
  const totalPrice = monthlyTotal + serviceFee;

  const handleContinue = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Payment", {
      propertyId,
      checkIn,
      checkOut: checkoutDate,
      months,
      guests,
      totalPrice,
    });
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={{ paddingTop: Math.max(insets.top, spacing.xs) }}>
        <GlassContainer variant="navbar" style={styles.header}>
          <View style={styles.headerContent}>
            <IconButton icon="arrow-back" label={t("common:back")} onPress={() => navigation.goBack()} />
            <View style={styles.headerCopy}>
              <Text style={styles.title}>{t("bookingMonthsTitle")}</Text>
              <Text style={styles.subtitle} numberOfLines={1}>{propertyTitle}</Text>
            </View>
          </View>
        </GlassContainer>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)}>
        <Card style={styles.calendarCard}>
          <Calendar
            onDayPress={(day: any) => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCheckIn(day.dateString);
            }}
            markedDates={(
              checkIn
                ? {
                    [checkIn]: { selected: true, startDate: true },
                    ...(checkoutDate
                      ? { [checkoutDate]: { selected: true, endDate: true } }
                      : {}),
                  }
                : {}
            ) as any}
            theme={{
              selectedDayBackgroundColor: theme.colors.primary,
              todayTextColor: theme.colors.primary,
              arrowColor: theme.colors.primary,
            }}
          />
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)}>
        <Card style={styles.infoCard}>
          <InfoRow label={t("bookingMonthCheckIn")} value={checkIn || t("selectDate")} />
          <InfoRow label={t("bookingMonthCheckOut")} value={checkoutDate || t("selectCheckInDate")} />
          <InfoRow label={t("guests")}>
            <View style={styles.guestCounter}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGuests(Math.max(1, guests - 1));
                }}
                style={styles.counterButton}
              >
                <MaterialCommunityIcons name="minus" size={20} color={theme.colors.textPrimary} />
              </Pressable>
              <Text style={styles.guestCount}>{guests}</Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setGuests(guests + 1);
                }}
                style={styles.counterButton}
              >
                <MaterialCommunityIcons name="plus" size={20} color={theme.colors.textPrimary} />
              </Pressable>
            </View>
          </InfoRow>
          <View style={styles.monthCounter}>
            <Text style={styles.monthCounterLabel}>{t("rentalDuration")}</Text>
            <View style={styles.monthControls}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMonths((current) => Math.max(1, current - 1));
                }}
                style={styles.counterButton}
              >
                <MaterialCommunityIcons name="minus" size={20} color={theme.colors.textPrimary} />
              </Pressable>
              <Text style={styles.monthCounterValue}>{months} {t("monthShort")}</Text>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setMonths((current) => Math.min(24, current + 1));
                }}
                style={styles.counterButton}
              >
                <MaterialCommunityIcons name="plus" size={20} color={theme.colors.textPrimary} />
              </Pressable>
            </View>
          </View>
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(300)}>
        <Card style={styles.priceCard}>
          <InfoRow label={`${t("nightlyRate")} ${rentLabel}`} value={formatCurrency(property.price, property.currency)} />
          <InfoRow label={`${months} ${t("monthShort")}`} value={formatCurrency(monthlyTotal, property.currency)} />
          <InfoRow label={t("serviceFee")} value={formatCurrency(serviceFee, property.currency)} />
          <View style={styles.divider} />
          <InfoRow label={t("total")} value={formatCurrency(totalPrice, property.currency)} style={styles.totalRow} />
        </Card>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.buttonContainer}>
        <PrimaryButton
          label={t("continue")}
          onPress={handleContinue}
          disabled={!checkIn}
        />
      </Animated.View>
    </ScreenScroll>
  );
}
