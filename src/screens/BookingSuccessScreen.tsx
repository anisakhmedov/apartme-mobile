import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInUp, ZoomIn } from "react-native-reanimated";
import QRCode from "react-native-qrcode-svg";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import { PrimaryButton, SecondaryButton } from "@/components/ui";
import { properties } from "@/data/mockData";

export function BookingSuccessScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const bookingId = route.params?.bookingId || "BK-1042";
  const propertyId = route.params?.propertyId;

  React.useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const property = properties.find(p => p.id === propertyId) || properties[0];

  return (
    <View style={styles.container}>
      <Animated.View entering={ZoomIn.duration(600).delay(200)} style={styles.successIcon}>
        <View style={styles.checkCircle}>
          {/* Success checkmark - using a simple view for demo */}
          <View style={styles.checkmark} />
        </View>
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(400).delay(400)} style={styles.textContainer}>
        <Animated.Text style={styles.title}>Бронирование подтверждено!</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Детали отправлены на вашу почту
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(600)} style={styles.bookingInfo}>
        <Animated.Text style={styles.bookingId}>
          Бронирование #{bookingId}
        </Animated.Text>
        
        <View style={styles.qrContainer}>
          <QRCode
            value={`samarkandrent://booking/${bookingId}`}
            size={160}
          />
        </View>
        
        <Animated.Text style={styles.propertyName}>
          {property.title.ru}
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(800)} style={styles.buttonContainer}>
        <PrimaryButton
          label="Посмотреть бронирование"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate("MainTabs", {
              screen: "BookingsTab",
              params: { screen: "BookingDetail", params: { id: bookingId } }
            });
          }}
          style={styles.button}
        />
        
        <SecondaryButton
          label="Вернуться на главную"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("MainTabs", { screen: "HomeTab" });
          }}
          style={styles.button}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  successIcon: {
    marginBottom: 32,
  },
  checkCircle: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
  },
  checkmark: {
    width: 40,
    height: 20,
    borderLeftWidth: 4,
    borderBottomWidth: 4,
    borderColor: colors.white,
    transform: [{ rotate: "-45deg" }],
    marginBottom: 8,
  },
  textContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  bookingInfo: {
    alignItems: "center",
    marginBottom: 32,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 24,
  },
  qrContainer: {
    padding: 16,
    backgroundColor: colors.surface,
    borderRadius: 16,
    marginBottom: 16,
  },
  propertyName: {
    fontSize: 15,
    color: colors.textSecondary,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    gap: spacing.md,
  },
  button: {
    width: "100%",
  },
});
