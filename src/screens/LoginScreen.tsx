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
  SlideOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { colors, spacing } from "@/theme";
import { PrimaryButton, SecondaryButton, GhostButton, TextField } from "@/components/ui";
import { useAppDispatch } from "@/store";
import { setUser, persistAuth } from "@/store/authSlice";
import { users } from "@/data/mockData";

const loginSchema = z.object({
  emailOrPhone: z.string().min(1, "Заполните поле").email("Неверный формат email"),
  password: z.string().min(6, "Минимум 6 символов"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const shake = useSharedValue(0);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setApiError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock: check if user exists
      const user = users[1];
      dispatch(setUser(user));
      dispatch(persistAuth({ isLoggedIn: true, user }));

      navigation.replace("MainTabs");
    } catch (error) {
      setApiError("Неверный пароль");

      // Shake animation
      shake.value = withSequence(
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(-8, { duration: 50 }),
        withTiming(8, { duration: 50 }),
        withTiming(0, { duration: 50 })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    // TODO: Implement expo-auth-session Google flow
    console.log("Google login pressed");
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      enableOnAndroid
      extraScrollHeight={20}
    >
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.logoText}>SamarkandRent</Animated.Text>
        <Animated.Text style={styles.subtitle}>Войдите в свой аккаунт</Animated.Text>
      </Animated.View>

      <Animated.View entering={SlideInRight.duration(400).delay(100)} style={styles.form}>
        {/* Email/Phone Field */}
        <Controller
          control={control}
          name="emailOrPhone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <TextField
                label="Email или телефон"
                placeholder="Email или телефон"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.emailOrPhone?.message}
                style={errors.emailOrPhone ? styles.fieldError : undefined}
              />
            </View>
          )}
        />

        {/* Password Field */}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.fieldContainer}>
              <View style={styles.passwordContainer}>
                <TextField
                  label="Пароль"
                  placeholder="Пароль"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={secureTextEntry}
                  error={errors.password?.message}
                  style={[styles.passwordInput, errors.password ? styles.fieldError : undefined]}
                />
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    setSecureTextEntry(!secureTextEntry);
                  }}
                  style={styles.eyeIcon}
                >
                  <MaterialIcons
                    name={secureTextEntry ? "visibility" : "visibility-off"}
                    size={20}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>
          )}
        />

        {/* API Error Toast */}
        {apiError ? (
          <Animated.View entering={SlideInRight.duration(300)} style={styles.errorToast}>
            <Text style={styles.errorToastText}>{apiError}</Text>
          </Animated.View>
        ) : null}

        {/* Login Button */}
        <Animated.View style={[styles.buttonContainer, shakeStyle]}>
          <PrimaryButton
            label={loading ? "" : "Войти"}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            disabled={!isValid}
            style={!isValid ? styles.disabledButton : undefined}
          />
        </Animated.View>

        {/* Google Login */}
        <SecondaryButton
          label="Войти через Google"
          onPress={handleGoogleLogin}
          icon="google"
          style={styles.googleButton}
        />

        {/* Forgot Password */}
        <View style={styles.forgotContainer}>
          <GhostButton
            label="Забыли пароль?"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate("ForgotPassword");
            }}
          />
        </View>
      </Animated.View>

      {/* Register Link */}
      <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.footer}>
        <Text style={styles.footerText}>Нет аккаунта? </Text>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate("Register");
          }}
        >
          <Text style={styles.registerLink}>Зарегистрироваться</Text>
        </Pressable>
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
    marginBottom: 40,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  form: {
    gap: spacing.md,
  },
  fieldContainer: {
    marginBottom: spacing.md,
  },
  passwordContainer: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeIcon: {
    position: "absolute",
    right: 12,
    top: 55,
    padding: 4,
  },
  fieldError: {
    borderColor: colors.error,
    borderWidth: 2,
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
  buttonContainer: {
    marginTop: spacing.sm,
  },
  disabledButton: {
    opacity: 0.6,
    backgroundColor: "#F4F4F4",
  },
  googleButton: {
    marginTop: spacing.md,
  },
  forgotContainer: {
    alignItems: "center",
    marginTop: spacing.md,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  footerText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  registerLink: {
    fontSize: 15,
    color: colors.primary,
    fontWeight: "500",
    textDecorationLine: "underline",
  },
});
