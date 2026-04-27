import React, { useState, useRef } from "react";
import { View, StyleSheet, KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useNavigation } from "@react-navigation/native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Animated, {
  FadeIn,
  FadeOut,
  SlideInRight,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  interpolateColor,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import { PrimaryButton, SecondaryButton, TextField } from "@/components/ui";
import { useAppDispatch } from "@/store";
import { setUser, persistAuth } from "@/store/authSlice";
import { users } from "@/data/mockData";

const passwordStrength = (password: string): { score: number; label: string; color: string } => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return { score, label: "Слабый", color: colors.error };
  if (score <= 2) return { score, label: "Средний", color: colors.warning };
  return { score, label: "Сильный", color: colors.success };
};

const registerSchema = z.object({
  fullName: z.string().min(2, "Введите имя"),
  phone: z.string().min(9, "Введите корректный номер"),
  email: z.string().email("Неверный формат email"),
  password: z.string().min(6, "Минимум 6 символов"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [apiError, setApiError] = useState("");
  const [googleData, setGoogleData] = useState<any>(null);

  const { control, handleSubmit, formState: { errors, isValid }, watch } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const watchedFields = watch();
  const progress = useSharedValue(0);

  // Calculate progress based on completed fields
  React.useEffect(() => {
    const fields = [
      watchedFields.fullName,
      watchedFields.phone,
      watchedFields.email,
      watchedFields.password,
      watchedFields.confirmPassword,
    ];
    const completed = fields.filter((f) => f && f.length > 0).length;
    const newProgress = completed / fields.length;
    progress.value = withTiming(newProgress, { duration: 300 });
  }, [watchedFields, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: colors.primary,
  }));

  const onSubmit = async (data: RegisterFormData) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const user = users[1];
      dispatch(setUser(user));
      dispatch(persistAuth({ isLoggedIn: true, user }));

      navigation.replace("OTPVerification");
    } catch (error) {
      setApiError("Ошибка регистрации");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const Checkmark = ({ valid }: { valid: boolean }) => {
    const scale = useSharedValue(0);

    React.useEffect(() => {
      if (valid) {
        scale.value = withSpring(1, { damping: 15, stiffness: 120 });
      } else {
        scale.value = 0;
      }
    }, [valid, scale]);

    const style = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
      opacity: scale.value,
    }));

    if (!valid) return null;

    return (
      <Animated.View style={[styles.checkmark, style]}>
        <MaterialIcons name="check-circle" size={20} color={colors.success} />
      </Animated.View>
    );
  };

  const PasswordStrengthBar = ({ password }: { password: string }) => {
    if (!password) return null;

    const strength = passwordStrength(password);

    return (
      <Animated.View entering={FadeIn.duration(200)} style={styles.strengthContainer}>
        <View style={styles.strengthBar}>
          {[1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={[
                styles.strengthSegment,
                { backgroundColor: level <= strength.score ? strength.color : colors.border },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.strengthLabel, { color: strength.color }]}>
          {strength.label}
        </Text>
      </Animated.View>
    );
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Регистрация</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Создайте аккаунт для аренды жилья
        </Animated.Text>
      </Animated.View>

      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <Animated.View style={[styles.progressBar, progressStyle]} />
      </Animated.View>

      <Animated.View entering={SlideInRight.duration(400).delay(100)} style={styles.form}>
        {/* Full Name */}
        <Controller
          control={control}
          name="fullName"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <View style={styles.fieldWithCheck}>
                <TextField
                  label="Полное имя"
                  placeholder="Введите имя"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="words"
                  error={errors.fullName?.message}
                />
                <Checkmark valid={!errors.fullName && value.length >= 2} />
              </View>
            </View>
          )}
        />

        {/* Phone */}
        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <View style={styles.fieldWithCheck}>
                <View style={styles.phoneContainer}>
                  <View style={styles.phonePrefix}>
                    <Text style={styles.phonePrefixText}>+998</Text>
                  </View>
                  <TextField
                    placeholder="(XX) XXX-XX-XX"
                    value={value}
                    onChangeText={(text) => {
                      // Format: (XX) XXX-XX-XX
                      const cleaned = text.replace(/\D/g, "").slice(0, 9);
                      const formatted = cleaned.replace(
                        /(\d{2})(\d{3})(\d{2})(\d{2})/,
                        "($1) $2-$3-$4"
                      );
                      onChange(formatted || cleaned);
                    }}
                    onBlur={onBlur}
                    keyboardType="phone-pad"
                    style={styles.phoneInput}
                  />
                </View>
              </View>
              {errors.phone && (
                <Text style={styles.errorText}>{errors.phone.message}</Text>
              )}
            </View>
          )}
        />

        {/* Email */}
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <View style={styles.fieldWithCheck}>
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
                <Checkmark valid={!errors.email && value.includes("@")} />
              </View>
            </View>
          )}
        />

        {/* Password */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <TextField
                label="Пароль"
                placeholder="Минимум 6 символов"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                secureTextEntry
                error={errors.password?.message}
              />
              <PasswordStrengthBar password={value} />
            </View>
          )}
        />

        {/* Confirm Password */}
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <View style={styles.fieldWithCheck}>
                <TextField
                  label="Подтвердите пароль"
                  placeholder="Повторите пароль"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry
                  error={errors.confirmPassword?.message}
                />
                <Checkmark valid={!errors.confirmPassword && value === watchedFields.password && value.length > 0} />
              </View>
            </View>
          )}
        />

        {apiError ? (
          <Animated.View entering={FadeIn.duration(300)} style={styles.errorToast}>
            <Text style={styles.errorToastText}>{apiError}</Text>
          </Animated.View>
        ) : null}

        <PrimaryButton
          label="Зарегистрироваться"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitButton}
        />

        <View style={styles.loginLink}>
          <Text style={styles.loginText}>Уже есть аккаунт? </Text>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("Login");
            }}
          >
            <Text style={styles.loginLinkText}>Войти</Text>
          </Pressable>
        </View>
      </Animated.View>
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
    fontWeight: "400",
    color: colors.textSecondary,
    lineHeight: 22,
  },
  progressContainer: {
    height: 4,
    backgroundColor: colors.border,
    borderRadius: 2,
    marginBottom: 24,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
  form: {
    gap: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.sm,
  },
  fieldWithCheck: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  checkmark: {
    position: "absolute",
    right: 12,
    top: 55,
  },
  phoneContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  phonePrefix: {
    backgroundColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 16,
    borderRadius: 8,
  },
  phonePrefixText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  phoneInput: {
    flex: 1,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthBar: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  submitButton: {
    marginTop: spacing.md,
  },
  errorToast: {
    backgroundColor: colors.textPrimary,
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  errorToastText: {
    color: colors.white,
    fontSize: 13,
    fontWeight: "400",
  },
  loginLink: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    marginBottom: 16,
  },
  loginText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  loginLinkText: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
