import React, { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { properties } from "@/data/mockData";
import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import { EmptyState, GlassContainer, PropertyCard, ScreenScroll } from "@/components/ui";
import { useItemLanguage } from "./index";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    ambientTop: {
      position: "absolute",
      top: -100,
      right: -70,
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: "absolute",
      left: -80,
      bottom: -120,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: theme.colors.ambientBottom,
    },
    scrollContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    header: {
      marginBottom: spacing.lg,
    },
    title: {
      ...typography.title,
      color: theme.colors.textPrimary,
    },
    subtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 8,
    },
    summaryPanel: {
      borderRadius: 24,
      marginBottom: spacing.xl,
    },
    summaryContent: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    summaryHeading: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    summaryCaption: {
      ...typography.body,
      color: theme.colors.textSecondary,
    },
    summaryStats: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    statCell: {
      flex: 1,
      padding: spacing.md,
      borderRadius: 18,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.56),
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
    },
    statValue: {
      ...typography.heading,
      color: theme.colors.textPrimary,
    },
    statLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    cardStack: {
      gap: spacing.md,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

export function WishlistScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation("profile");
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const language = useItemLanguage();
  const tabBarHeight = useBottomTabBarHeight();
  const wishlistItems = useMemo(() => properties.slice(0, 3), []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary, theme.colors.backgroundTertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      <View pointerEvents="none" style={styles.ambientTop} />
      <View pointerEvents="none" style={styles.ambientBottom} />
      <ScreenScroll contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + spacing.xxxl }]}>
        <Animated.View entering={FadeInUp.duration(theme.motion.standard)} style={styles.header}>
          <Text style={styles.title}>{t("wishlist")}</Text>
          <Text style={styles.subtitle}>
            Shortlist homes with clear pricing, verified hosts, and enough visual detail to compare quickly.
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(70).duration(theme.motion.standard)}>
          <GlassContainer variant="accent" style={styles.summaryPanel}>
            <View style={styles.summaryContent}>
              <View>
                <Text style={styles.summaryHeading}>Saved for comparison</Text>
                <Text style={styles.summaryCaption}>
                  Keep favorites lightweight here, then move straight into details, contact, or booking.
                </Text>
              </View>
              <View style={styles.summaryStats}>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{wishlistItems.length}</Text>
                  <Text style={styles.statLabel}>Saved</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{wishlistItems.filter((item) => item.isVerified).length}</Text>
                  <Text style={styles.statLabel}>Verified</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>2</Text>
                  <Text style={styles.statLabel}>Ready to book</Text>
                </View>
              </View>
            </View>
          </GlassContainer>
        </Animated.View>

        {wishlistItems.length ? (
          <View style={styles.cardStack}>
            {wishlistItems.map((property, index) => (
              <Animated.View
                key={property.id}
                entering={FadeInDown.delay(120 + index * 50).duration(theme.motion.standard)}
              >
                <PropertyCard
                  item={property}
                  language={language}
                  onPress={() => navigation.navigate("PropertyDetail", { id: property.id })}
                />
              </Animated.View>
            ))}
          </View>
        ) : (
          <EmptyState title={t("wishlist")} description={t("wishlistSubtitle")} />
        )}
      </ScreenScroll>
    </View>
  );
}
