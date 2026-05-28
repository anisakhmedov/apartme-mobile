import React, { useState, useRef, useEffect } from "react";
import { View, StyleSheet, Text, Pressable, TextInput as RNTextInput } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import Animated, {
  FadeIn,
  FadeOut,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withRepeat,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Palette as colors, spacing, typography, radii } from "@/theme";
import { PrimaryButton, SecondaryButton } from "@/components/ui";
import { useAppDispatch } from "@/store";
import { persistAuth, setUser } from "@/store/authSlice";
import { users } from "@/data/mockData";

export function OTPVerificationScreen() {
  const { t } = useTranslation("auth");
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const dispatch = useAppDispatch();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(45);
  const [resendEnabled, setResendEnabled] = useState(false);
  const inputRefs = useRef<RNTextInput[]>([]);

  // Countdown timer
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setResendEnabled(true);
    }
  }, [countdown]);

  const handleChange = (value: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take last character
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const code = otp.join("");
    if (code.length === 6) {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const user = {
        ...users[1],
        name: route.params?.pendingName || users[1].name,
        email: route.params?.pendingEmail || users[1].email,
        phone: route.params?.pendingPhone || users[1].phone,
      };
      dispatch(setUser(user));
      dispatch(persistAuth({ isLoggedIn: true, user }));
    }
  };

  const handleResend = () => {
    if (resendEnabled) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCountdown(45);
      setResendEnabled(false);
      setOtp(["", "", "", "", "", ""]);
    }
  };

  const pulse = useSharedValue(1);
  
  useEffect(() => {
    if (countdown <= 10 && countdown > 0) {
      pulse.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 500 }),
          withTiming(1, { duration: 500 })
        ),
        -1,
        true
      );
    }
  }, [countdown]);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulse.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>{t("otpConfirmPhoneTitle")}</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          {t("otpSentToPhoneSubtitle")}
        </Animated.Text>
      </Animated.View>

      {/* OTP Input */}
      <Animated.View
        entering={FadeIn.duration(400).delay(200)}
        style={styles.otpContainer}
      >
        {otp.map((digit, index) => (
          <RNTextInput
            key={index}
            ref={(ref: RNTextInput | null) => {
              if (ref) inputRefs.current[index] = ref;
            }}
            style={[
              styles.otpCell,
              digit ? styles.otpCellFilled : null,
              { fontSize: 20, fontWeight: "800", color: colors.textPrimary },
            ]}
            value={digit}
            onChangeText={(value) => handleChange(value, index)}
            onKeyPress={(e: any) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </Animated.View>

      {/* Countdown */}
      <Animated.View style={[styles.countdownContainer, pulseStyle]}>
        {countdown > 0 ? (
          <Text style={[styles.countdownText, countdown <= 10 && styles.countdownUrgent]}>
            {t("resendIn", { seconds: countdown })}
          </Text>
        ) : (
          <Pressable onPress={handleResend}>
            <Text style={styles.resendText}>{t("resendCode")}</Text>
          </Pressable>
        )}
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(400)} style={styles.buttonContainer}>
        <PrimaryButton
          label={t("verify")}
          onPress={handleVerify}
          disabled={otp.join("").length !== 6}
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
  },
  header: {
    marginBottom: 40,
  }, // Kept colors.textPrimary
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 8,
  }, // Kept colors.textSecondary
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: "row", // Kept 24
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 8,
  },
  otpCell: {
    flex: 1,
    height: 56, // Kept 12
    borderRadius: 12, // Kept colors.surface
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  otpCellFilled: {
    borderColor: colors.primary, // Kept colors.primary
    borderWidth: 2, // Kept 2
  },
  countdownContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  countdownText: {
    fontSize: 13,
    color: colors.textSecondary, // Kept colors.textSecondary
  },
  countdownUrgent: {
    color: colors.error,
    fontWeight: "600",
  },
  resendText: {
    fontSize: 15,
    color: colors.primary, // Kept colors.primary
    fontWeight: "600", // Kept 600
    textDecorationLine: "underline",
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
