import React, { useMemo, useState } from "react";
import { View, StyleSheet, Text } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppTheme, useAppTheme, spacing, typography } from "@/theme";
import {
  PrimaryButton,
  GlassContainer,
  IconButton,
  Pill,
  TextField,
  Card,
  InfoRow,
  ScreenScroll,
} from "@/components/ui";
import { formatCurrency } from "@/components/ui";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: { // Changed from theme.spacing.md to spacing.md
      padding: spacing.md,
      paddingBottom: spacing.xl,
    },
    topBar: {
      borderRadius: 22,
      marginBottom: spacing.md,
    },
    topBarContent: {
      padding: spacing.xs,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    topBarTitle: {
      fontSize: 18,
      fontWeight: "700",
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    header: {
      marginBottom: spacing.md,
    },
    title: {
      fontSize: 28,
      fontWeight: "500",
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      lineHeight: 22,
    },
    methodsContainer: {
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    paymentMethod: {
      width: "100%",
    },
    cardDetails: {
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    cardRow: {
      flexDirection: "row",
      gap: theme.spacing.md,
    },
    halfInput: {
      flex: 1,
    },
    couponContainer: {
      marginBottom: spacing.lg,
    },
    summaryCard: {
      marginBottom: spacing.lg,
    },
    divider: {
      height: 1,
      backgroundColor: theme.colors.border, // Kept theme.colors.border
      marginVertical: spacing.sm,
    },
    totalRow: {
      marginTop: spacing.sm,
    },
    buttonContainer: {
      marginTop: spacing.md,
    },
  });

export function PaymentScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const params = route.params || {};
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme as any), [theme]);

  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("card");

  const paymentMethods = [
    { id: "card", label: "Банковская карта", icon: "credit-card" },
    { id: "click", label: "Click", icon: "wallet" },
    { id: "payme", label: "Payme", icon: "wallet" },
    { id: "cash", label: "Наличные при заезде", icon: "cash" },
  ];

  const handlePayment = async () => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 2000));
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate("BookingSuccess", {
        bookingId: "BK-1042",
        propertyId: params.propertyId,
      });
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(300)} style={{ paddingTop: Math.max(insets.top, theme.spacing.xs) }}>
        <GlassContainer variant="navbar" style={styles.topBar}>
          <View style={styles.topBarContent}>
            <IconButton icon="arrow-back" label="Назад" onPress={() => navigation.goBack()} />
            <Text style={styles.topBarTitle}>Оплата</Text>
          </View>
        </GlassContainer>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Оплата</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Выберите способ оплаты
        </Animated.Text>
      </Animated.View>

      {/* Payment Methods */}
      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.methodsContainer}>
        {paymentMethods.map((method, index) => (
          <Animated.View
            key={method.id}
            entering={FadeInUp.delay(index * 100).duration(400)}
          >
            <Pill
              label={method.label}
              active={selectedMethod === method.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedMethod(method.id);
              }}
              style={styles.paymentMethod}
            />
          </Animated.View>
        ))}
      </Animated.View>

      {/* Card Details (shown only for card payment) */}
      {selectedMethod === "card" && (
        <Animated.View entering={FadeInUp.duration(400)} style={styles.cardDetails}>
          <TextField
            label="Номер карты"
            placeholder="XXXX XXXX XXXX XXXX"
            keyboardType="number-pad"
          />
          <View style={styles.cardRow}>
            <TextField
              label="Срок"
              placeholder="MM/YY"
              style={styles.halfInput}
            />
            <TextField
              label="CVV"
              placeholder="XXX"
              style={styles.halfInput}
              secureTextEntry
            />
          </View>
        </Animated.View>
      )}

      {/* Coupon Code */}
      <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.couponContainer}>
        <TextField
          label="Промокод"
          placeholder="Введите промокод"
        />
      </Animated.View>

      {/* Order Summary */}
      <Animated.View entering={FadeInUp.duration(400).delay(300)}>
        <Card style={styles.summaryCard}>
          <InfoRow label="Сумма" value={formatCurrency(params.totalPrice || 1260000, "UZS")} />
          <View style={styles.divider} />
          <InfoRow
            label="Итого"
            value={formatCurrency(params.totalPrice || 1260000, "UZS")}
            style={styles.totalRow}
          />
        </Card>
      </Animated.View>

      {/* Pay Button */}
      <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.buttonContainer}>
        <PrimaryButton
          label={loading ? "" : "Оплатить"}
          onPress={handlePayment}
          loading={loading}
        />
      </Animated.View>
    </ScreenScroll>
  );
}
