import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { Palette as colors, spacing, typography } from "@/theme";
import { TextField, PrimaryButton, ScreenScroll, StepIndicator } from "@/components/ui";

export function AddEditListingScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const listingId = route.params?.id;
  const isEditing = !!listingId;

  const steps = ["Основное", "Фото", "Цена", "Готово"];
  const [currentStep, setCurrentStep] = useState(1);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        <StepIndicator steps={steps} current={currentStep} />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.form}>
        {currentStep === 1 && (
          <>
            <TextField label="Название (RU)" placeholder="Введите название" />
            <TextField label="Название (EN)" placeholder="Enter title" />
            <TextField label="Название (UZ)" placeholder="Nomini kiriting" />
            <TextField label="Адрес" placeholder="Введите адрес" />
          </>
        )}

        {currentStep === 2 && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.uploadArea}>
            <Animated.Text style={styles.uploadText}>
              Нажмите, чтобы загрузить фото
            </Animated.Text>
          </Animated.View>
        )}

        {currentStep === 3 && (
          <>
            <TextField 
              label="Цена за ночь" 
              placeholder="0" 
              keyboardType="numeric"
            />
          </>
        )}
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.buttonContainer}>
        {currentStep < 4 ? (
          <PrimaryButton
            label="Далее"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setCurrentStep(currentStep + 1);
            }}
          />
        ) : (
          <PrimaryButton
            label={isEditing ? "Сохранить" : "Добавить"}
            onPress={() => {
              Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              navigation.goBack();
            }}
          />
        )}
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  form: {
    gap: spacing.md,
    marginTop: spacing.lg, // Kept colors.primaryTint
  },
  uploadArea: {
    height: 200,
    borderRadius: 12,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center", // Kept colors.primary
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: "dashed",
  },
  uploadText: {
    color: colors.primary,
    fontWeight: "600", // Kept spacing.xl
  },
  buttonContainer: {
    marginTop: spacing.xl,
  },
});
