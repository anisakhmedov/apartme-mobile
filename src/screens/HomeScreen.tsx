import React, { useMemo, useState } from "react";
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { properties as mockProperties } from "@/data/mockData";
import { useGetPropertiesQuery } from "@/services/api";
import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import {
  GlassContainer,
  IconButton,
  Pill,
  PropertyCard,
  ScreenScroll,
  SearchBar,
} from "@/components/ui";
import { useItemLanguage } from "./index";

const categories = ["apartments", "houses", "rooms", "guesthouses", "daily"] as const;
const categoryParamMap: Record<(typeof categories)[number], string> = {
  apartments: "apartment",
  houses: "house",
  rooms: "room",
  guesthouses: "guesthouse",
  daily: "daily",
};

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
      top: -120,
      right: -80,
      width: 240,
      height: 240,
      borderRadius: 120,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: "absolute",
      left: -100,
      bottom: -160,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: theme.colors.ambientBottom,
    },
    scrollContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    eyebrow: {
      ...typography.caption,
      color: theme.colors.primary,
      letterSpacing: 0.5,
      textTransform: "uppercase",
    },
    title: {
      ...typography.title,
      color: theme.colors.textPrimary,
      marginTop: 6,
    },
    subtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 8,
      maxWidth: 280,
    },
    searchWrap: {
      marginBottom: spacing.md,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statsPanel: {
      marginBottom: spacing.xl,
      borderRadius: 22,
    },
    statsContent: {
      padding: spacing.md,
      gap: spacing.md,
    },
    statsHeading: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    statsCaption: {
      ...typography.body,
      color: theme.colors.textSecondary,
    },
    statsGrid: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    statCell: {
      flex: 1,
      padding: spacing.md,
      borderRadius: 18,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.06 : 0.6),
      borderWidth: 1,
      borderColor: alpha(theme.colors.white, theme.mode === "dark" ? 0.06 : 0.38),
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
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    sectionTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary,
    },
    sectionSubtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    linkButton: {
      minHeight: 44,
      justifyContent: "center",
    },
    linkText: {
      ...typography.bodyStrong,
      color: theme.colors.primary,
    },
    cardStack: {
      gap: spacing.md,
      marginBottom: spacing.xl,
    },
    highlightRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    highlightCard: {
      flex: 1,
      borderRadius: 22,
      overflow: "hidden",
      padding: spacing.md,
      minHeight: 132,
      justifyContent: "space-between",
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
    },
    highlightTitle: {
      ...typography.subheading,
      color: theme.colors.white,
      maxWidth: 148,
    },
    highlightMeta: {
      ...typography.caption,
      color: alpha(theme.colors.white, 0.78),
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation("home");
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const language = useItemLanguage();
  const tabBarHeight = useBottomTabBarHeight();
  const [refreshing, setRefreshing] = useState(false);
  const { data = mockProperties, refetch } = useGetPropertiesQuery();

  const featured = useMemo(() => data.slice(0, 2), [data]);
  const verified = useMemo(() => data.filter((item) => item.isVerified).slice(0, 3), [data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

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
      <ScreenScroll
        contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + spacing.xxxl }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.colors.primary}
            colors={[theme.colors.primary]}
          />
        }
      >
        <Animated.View entering={FadeInUp.duration(theme.motion.standard)} style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>SamarkandRent</Text>
            <Text style={styles.title}>{t("welcome")}</Text>
            <Text style={styles.subtitle}>
              Curated homes, verified hosts, and pricing that stays visible the whole way through.
            </Text>
          </View>
          <IconButton
            icon="notifications-none"
            label={t("notifications")}
            badge={3}
            onPress={() => navigation.getParent()?.navigate("ProfileTab", { screen: "Notifications" })}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(theme.motion.standard)} style={styles.searchWrap}>
          <SearchBar placeholder={t("searchPlaceholder")} onPress={() => navigation.getParent()?.navigate("SearchTab")} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(theme.motion.standard)} style={styles.chipRow}>
          {categories.map((category) => (
            <Pill
              key={category}
              label={t(category)}
              onPress={() => navigation.navigate("Listings", { category: categoryParamMap[category] })}
            />
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(theme.motion.standard)}>
          <GlassContainer variant="accent" style={styles.statsPanel}>
            <View style={styles.statsContent}>
              <View>
                <Text style={styles.statsHeading}>Market pulse</Text>
                <Text style={styles.statsCaption}>
                  Clean pricing, verified inventory, and fast-response hosts stay closest to the top.
                </Text>
              </View>
              <View style={styles.statsGrid}>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{data.length}</Text>
                  <Text style={styles.statLabel}>Live listings</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>{verified.length}</Text>
                  <Text style={styles.statLabel}>Verified</Text>
                </View>
                <View style={styles.statCell}>
                  <Text style={styles.statValue}>6m</Text>
                  <Text style={styles.statLabel}>Avg reply</Text>
                </View>
              </View>
            </View>
          </GlassContainer>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(220).duration(theme.motion.standard)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t("featuredListings")}</Text>
              <Text style={styles.sectionSubtitle}>Image-first cards with transparent pricing and quick trust signals.</Text>
            </View>
            <Pressable style={styles.linkButton} onPress={() => navigation.navigate("Listings")}>
              <Text style={styles.linkText}>{t("seeAll")}</Text>
            </Pressable>
          </View>
          <View style={styles.cardStack}>
            {featured.map((property, index) => (
              <Animated.View key={property.id} entering={FadeInDown.delay(260 + index * 60).duration(theme.motion.standard)}>
                <PropertyCard
                  item={property}
                  language={language}
                  onPress={() => navigation.navigate("PropertyDetail", { id: property.id })}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(theme.motion.standard)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t("popularInSamarkand")}</Text>
              <Text style={styles.sectionSubtitle}>Shortcuts into the neighborhoods guests compare most often.</Text>
            </View>
          </View>
          <View style={styles.highlightRow}>
            <LinearGradient colors={[theme.colors.primary, theme.colors.primaryDark]} style={styles.highlightCard}>
              <MaterialCommunityIcons name="map-marker-radius" size={28} color={theme.colors.white} />
              <View>
                <Text style={styles.highlightTitle}>{t("registanPromo")}</Text>
                <Text style={styles.highlightMeta}>Walkable landmarks</Text>
              </View>
            </LinearGradient>
            <LinearGradient colors={["#3C4A5A", theme.colors.primary]} style={styles.highlightCard}>
              <MaterialCommunityIcons name="home-city-outline" size={28} color={theme.colors.white} />
              <View>
                <Text style={styles.highlightTitle}>{t("newSamarkandPromo")}</Text>
                <Text style={styles.highlightMeta}>Longer stays</Text>
              </View>
            </LinearGradient>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(380).duration(theme.motion.standard)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t("nearbyListings")}</Text>
              <Text style={styles.sectionSubtitle}>Verified homes with clear nightly pricing and strong review history.</Text>
            </View>
          </View>
          <View style={styles.cardStack}>
            {verified.map((property, index) => (
              <Animated.View key={property.id} entering={FadeInDown.delay(420 + index * 60).duration(theme.motion.standard)}>
                <PropertyCard
                  item={property}
                  language={language}
                  onPress={() => navigation.navigate("PropertyDetail", { id: property.id })}
                />
              </Animated.View>
            ))}
          </View>
        </Animated.View>
      </ScreenScroll>
    </View>
  );
}
