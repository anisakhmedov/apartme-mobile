import React, { useState } from "react";
import { Pressable, View, StyleSheet } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn, FadeInUp } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import { RatingStars, PrimaryButton, TextField, ScreenScroll } from "@/components/ui";

export function WriteReviewScreen() {
  const navigation = useNavigation<any>();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    navigation.goBack();
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <Animated.Text style={styles.title}>Написать отзыв</Animated.Text>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.ratingContainer}>
        <Animated.Text style={styles.ratingLabel}>Ваша оценка:</Animated.Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <Animated.View key={star} entering={FadeIn.delay(star * 100).duration(300)}>
              <Pressable
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setRating(star);
                }}
                style={styles.star}
              >
                <RatingStars rating={star} count={undefined} />
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)} style={styles.form}>
        <TextField
          label="Ваш отзыв"
          placeholder="Расскажите о вашем опыте..."
          multiline
          numberOfLines={6}
          value={review}
          onChangeText={setReview}
          style={styles.textArea}
        />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(300)} style={styles.buttonContainer}>
        <PrimaryButton
          label="Отправить отзыв"
          onPress={handleSubmit}
          disabled={rating === 0 || !review}
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
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  ratingContainer: {
    marginBottom: 24,
  },
  ratingLabel: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  star: {
    padding: 4,
  },
  form: {
    marginBottom: 24,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: spacing.md,
  },
});
