import React, { useState } from "react";
import { View, StyleSheet, KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Animated, { FadeIn, SlideInRight } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import { PrimaryButton, TextField } from "@/components/ui";

const forgotSchema = z.object({
  email: z.string().min(1, "Введите email").email("Неверный формат email"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export function ForgotPasswordScreen() {
  const navigation = useNavigation<any>();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotFormData) => {
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSent(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Забыли пароль?</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Введите email, и мы отправим ссылку для сброса пароля
        </Animated.Text>
      </Animated.View>

      {sent ? (
        <Animated.View entering={FadeIn.duration(400)} style={styles.successContainer}>
          <Animated.Text style={styles.successTitle}>Письмо отправлено!</Animated.Text>
          <Animated.Text style={styles.successText}>
            Проверьте вашу почту и следуйте инструкциям в письме
          </Animated.Text>
          <Animated.View entering={SlideInRight.duration(400).delay(200)} style={styles.buttonContainer}>
            <PrimaryButton
              label="Вернуться к входу"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.navigate("Login");
              }}
            />
          </Animated.View>
        </Animated.View>
      ) : (
        <Animated.View entering={SlideInRight.duration(400).delay(100)} style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.fieldContainer}>
                <TextField
                  label="Email"
                  placeholder="email@example.com"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                />
              </View>
            )}
          />

          <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.buttonContainer}>
            <PrimaryButton
              label={loading ? "" : "Отправить ссылку"}
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              disabled={!isValid}
            />
          </Animated.View>

          <Animated.View entering={FadeIn.duration(400).delay(400)} style={styles.backContainer}>
            <Animated.Text
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                navigation.goBack();
              }}
              style={styles.backLink}
            >
              ← Вернуться к входу
            </Animated.Text>
          </Animated.View>
        </Animated.View>
      )}
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    gap: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
  backContainer: {
    alignItems: "center",
    marginTop: 24,
  },
  backLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "500",
  },
  successContainer: {
    alignItems: "center",
    padding: spacing.xl,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.success,
    marginBottom: 12,
    textAlign: "center",
  },
  successText: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
    textAlign: "center",
    marginBottom: 32,
  },
});
