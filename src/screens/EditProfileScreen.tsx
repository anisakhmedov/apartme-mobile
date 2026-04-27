import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import { TextField, PrimaryButton, SecondaryButton, ScreenScroll } from "@/components/ui";
import { users } from "@/data/mockData";

export function EditProfileScreen() {
  const navigation = useNavigation<any>();
  const parentNavigation = useNavigation<any>();

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Редактировать профиль</Animated.Text>
        <Animated.Text style={styles.subtitle}>
          Обновите вашу информацию
        </Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.form}>
        <TextField
          label="Имя"
          defaultValue={users[1].name}
          style={styles.field}
        />
        
        <TextField
          label="Телефон"
          defaultValue="+998 90 123 45 67"
          keyboardType="phone-pad"
          style={styles.field}
        />

        <TextField
          label="Email"
          defaultValue={users[1].email}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.field}
        />

        <TextField
          label="О себе"
          placeholder="Расскажите о себе..."
          multiline
          numberOfLines={4}
          style={[styles.field, styles.bioField]}
        />

        <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.buttonContainer}>
          <PrimaryButton
            label="Сохранить"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              parentNavigation?.goBack();
            }}
          />
          
          <SecondaryButton
            label="Загрузить фото"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={styles.secondaryButton}
          />

          <SecondaryButton
            label="Загрузить паспорт"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          />
        </Animated.View>
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.md,
    marginBottom: spacing.md,
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
  form: {
    padding: spacing.md,
    gap: spacing.md,
  },
  field: {
    marginBottom: spacing.md,
  },
  bioField: {
    height: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  secondaryButton: {
    marginTop: spacing.sm,
  },
});
