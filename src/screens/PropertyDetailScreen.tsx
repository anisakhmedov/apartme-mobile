import React, { useEffect, useRef, useState } from "react";
import { View, StyleSheet, ScrollView, Animated as RNAnimated } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";

import { colors, spacing } from "@/theme";
import {
  PropertyCard,
  GalleryStrip,
  RatingStars,
  InfoRow,
  PrimaryButton,
  SecondaryButton,
  Badge,
  Section,
  MapPreview,
  AmenitiesGrid,
} from "@/components/ui";
import { useGetPropertyByIdQuery, useGetReviewsQuery } from "@/services/api";
import { properties, mockProperties } from "@/data/mockData";
import { useItemLanguage } from "./index";
import { useAppDispatch } from "@/store";
import { addRecentViewed } from "@/store/searchSlice";
import { saveRecentProperty } from "@/services/cache";
import { analytics } from "@/services/analytics";

export function PropertyDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation("property");
  const language = useItemLanguage();
  const dispatch = useAppDispatch();

  const [scrollY, setScrollY] = useState(0);
  const headerOpacity = RNAnimated.interpolate(scrollY, [0, 300], [0, 1], "clamp");

  const propertyId = route.params?.id ?? "prop-1";
  const { data: property } = useGetPropertyByIdQuery(propertyId);
  const { data: reviews = [] } = useGetReviewsQuery(propertyId);

  const currentProperty = property || mockProperties.find((p) => p.id === propertyId) || mockProperties[0];

  useEffect(() => {
    if (currentProperty) {
      dispatch(addRecentViewed(currentProperty));
      saveRecentProperty(currentProperty);
      analytics.logEvent("view_property", { propertyId: currentProperty.id });
    }
  }, [currentProperty]);

  const headerAnimatedStyle = {
    opacity: headerOpacity,
    backgroundColor: colors.surface,
  };

  const iconColor = scrollY > 100 ? colors.textPrimary : colors.surface;

  return (
    <View style={styles.container}>
      {/* Animated Header */}
      <RNAnimated.View style={[styles.header, headerAnimatedStyle]}>
        <Pressable
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
          style={styles.backButton}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color={iconColor}
          />
        </Pressable>

        <View style={styles.headerRight}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              name="heart-outline"
              size={20}
              color={iconColor}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            style={styles.iconButton}
          >
            <MaterialCommunityIcons
              name="share-variant"
              size={20}
              color={iconColor}
            />
          </Pressable>
        </View>
      </RNAnimated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={RNAnimated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Gallery */}
        <GalleryStrip photos={currentProperty.photos} />

        {/* Property Info */}
        <View style={styles.propertyInfo}>
          <View style={styles.titleRow}>
            <Text style={styles.propertyTitle}>
              {currentProperty.title[language]}
            </Text>
            {currentProperty.isVerified && (
              <MaterialCommunityIcons
                name="check-decagram"
                size={20}
                color={colors.primary}
              />
            )}
          </View>

          <Text style={styles.propertyAddress}>
            {currentProperty.address}
          </Text>

          <View style={styles.ratingRow}>
            <RatingStars
              rating={currentProperty.rating}
              count={currentProperty.reviewCount}
            />
          </View>

          {/* Host Info */}
          <Section title={t("host")}>
            <View style={styles.hostRow}>
              <View style={styles.hostAvatar} />
              <View style={styles.hostInfo}>
                <Text style={styles.hostName}>
                  {currentProperty.hostName || "Хост"}
                </Text>
                <Badge label={t("verifiedHost")} tone="success" />
              </View>
            </View>
          </Section>

          {/* Amenities */}
          <Section title={t("amenities")}>
            <AmenitiesGrid
              amenities={currentProperty.amenities}
              language={language}
            />
          </Section>

          {/* Description */}
          <Section title={t("description")}>
            <Text style={styles.description}>
              {currentProperty.description[language]}
            </Text>
          </Section>

          {/* Location */}
          <Section title={t("location")}>
            <MapPreview
              title={currentProperty.address}
              subtitle={currentProperty.district}
            />
          </Section>

          {/* Reviews */}
          <Section title={t("reviews")}>
            {reviews.map((review: any) => (
              <View key={review.id} style={styles.reviewCard}>
                <RatingStars rating={review.rating} />
                <Text style={styles.reviewText}>
                  {review.text[language]}
                </Text>
              </View>
            ))}
          </Section>
        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <View>
          <Text style={styles.price}>
            {currentProperty.price.toLocaleString()} {currentProperty.currency}
          </Text>
          <Text style={styles.perNight}>{t("perNight")}</Text>
        </View>
        <PrimaryButton
          label={t("bookNow")}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate("Booking", { propertyId: currentProperty.id });
          }}
          style={styles.bookButton}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  propertyInfo: {
    padding: spacing.md,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  propertyTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.textPrimary,
    flex: 1,
  },
  propertyAddress: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  ratingRow: {
    marginBottom: spacing.lg,
  },
  hostRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  hostAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.border,
  },
  hostInfo: {
    flex: 1,
  },
  hostName: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    color: colors.textPrimary,
    lineHeight: 22,
  },
  reviewCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: 12,
  },
  reviewText: {
    fontSize: 15,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    lineHeight: 22,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  price: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.primary,
  },
  perNight: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  bookButton: {
    minWidth: 160,
  },
});
