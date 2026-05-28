import React, { useMemo, useState, useRef, useEffect } from "react";
import { Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { properties as mockProperties, users } from "@/data/mockData";
import { useGetPropertiesQuery } from "@/services/api";
import { alpha, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import {
  GlassContainer,
  IconButton,
  Pill,
  PropertyCard,
  PropertyCardSkeleton,
  ScreenScroll,
  SearchBar,
} from "@/components/ui";

const categories = ["apartments", "houses", "rooms", "guesthouses", "daily"] as const;
const categoryParamMap: Record<(typeof categories)[number], string> = {
  apartments: "apartment",
  houses: "house",
  rooms: "room",
  guesthouses: "guesthouse",
  daily: "daily",
};

const createStyles = (theme: ReturnType<typeof useAppTheme>) =>
  StyleSheet.create({
    container: {
      flex: 1, // Kept theme.colors.background
      backgroundColor: theme.colors.background,
    },
    scrollContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    topBar: {
      flexDirection: "row",
      alignItems: "flex-start", // Kept theme.spacing.md
      justifyContent: "space-between",
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    eyebrow: {
      ...typography.caption,
      color: theme.colors.primary,
      letterSpacing: 0.5, // Kept theme.colors.primary
      textTransform: "uppercase",
    },
    title: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      marginTop: 6,
    },
    subtitle: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 8,
      maxWidth: 280,
    },
    searchWrap: {
      marginBottom: spacing.md,
    },
    chipRow: {
      flexDirection: "row", // Kept theme.spacing.sm
      flexWrap: "wrap",
      gap: spacing.sm,
      marginBottom: spacing.lg,
    },
    statsPanel: {
      marginBottom: spacing.xl,
      borderRadius: 22,
    }, // Kept theme.spacing.md
    statsContent: {
      padding: spacing.md,
      gap: spacing.md,
    },
    statsHeading: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    statsCaption: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
    },
    statsGrid: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    statCell: {
      flex: 1,
      padding: spacing.md,
      borderRadius: 18, // Kept theme.colors.surface
      backgroundColor: alpha(theme.colors.surface, 0.6),
      borderWidth: 1,
      borderColor: alpha(theme.colors.white, 0.38),
    },
    statValue: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    statLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 4,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
    },
    sectionTitle: { // Kept theme.colors.textPrimary
      ...typography.heading,
      color: theme.colors.textPrimary,
    },
    sectionSubtitle: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 4,
    },
    linkButton: {
      minHeight: 44, // Kept theme.colors.primary
      justifyContent: "center",
    },
    linkText: {
      ...typography.body,
      fontWeight: "600",
      color: theme.colors.primary,
    },
    cardStack: {
      gap: spacing.md, // Kept theme.spacing.xl
      marginBottom: spacing.xl,
    },
    highlightRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.xl,
    },
    highlightCard: { // Kept theme.colors.glassBorder
      flex: 1,
      borderRadius: 22,
      overflow: "hidden",
      padding: spacing.md,
      minHeight: 132,
      justifyContent: "space-between",
      borderWidth: 1, // Kept theme.colors.white
      borderColor: alpha(theme.colors.white, 0.38),
    },
    highlightTitle: { // Kept theme.colors.white
      ...typography.heading,
      color: theme.colors.white,
      maxWidth: 148,
    },
    highlightMeta: {
      ...typography.caption,
      color: alpha(theme.colors.white, 0.78),
    },
  });

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t, i18n } = useTranslation("home");
  const theme = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const motionDuration = theme.motion.duration.normal;
  const language = i18n.language;
  const tabBarHeight = useBottomTabBarHeight();
  const [refreshing, setRefreshing] = useState(false);
  const [isTabBarVisible, setIsTabBarVisible] = useState(true);
  const { data = [], isLoading, refetch } = useGetPropertiesQuery();

  const lastOffset = useRef(0);
  const featured = useMemo(() => (isLoading ? Array(2).fill({}) : data.slice(0, 2)), [data, isLoading]);
  const verified = useMemo(() => (isLoading ? Array(3).fill({}) : data.filter((item) => item.isVerified).slice(0, 3)), [data, isLoading]);

  // Передаем состояние видимости в родительский навигатор
  useEffect(() => {
    navigation.getParent()?.setOptions({
      tabBarVisible: isTabBarVisible,
    });
  }, [isTabBarVisible, navigation]);

  const handleScroll = (event: any) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    const dif = currentOffset - lastOffset.current;

    if (currentOffset <= 0) {
      if (!isTabBarVisible) setIsTabBarVisible(true);
    } else if (Math.abs(dif) > 10) {
      if (dif > 0 && isTabBarVisible && currentOffset > 100) {
        setIsTabBarVisible(false);
      } else if (dif < 0 && !isTabBarVisible) {
        setIsTabBarVisible(true);
      }
    }
    lastOffset.current = currentOffset;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <ScreenScroll
        style={{ backgroundColor: theme.colors.background }} // Kept theme.colors.background
        onScroll={handleScroll}
        scrollEventThrottle={16}
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
        <Animated.View entering={FadeInUp.duration(400)} style={styles.topBar}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>SamarkandRent</Text>
            <Text style={styles.title}>{t("welcome")}</Text>
            <Text style={styles.subtitle}>
              Curated homes, verified hosts, and pricing that stays visible the whole way through.
            </Text>
          </View>
          <IconButton
            icon="bell-outline"
            label={t("notifications")}
            badge={3}
            onPress={() => navigation.getParent()?.navigate("ProfileTab", { screen: "Notifications" })}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(400)} style={styles.searchWrap}>
          <SearchBar placeholder={t("searchPlaceholder")} onPress={() => navigation.getParent()?.navigate("SearchTab")} />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(400)} style={styles.chipRow}>
          {categories.map((category) => (
            <Pill
              key={category}
              label={t(category)}
              onPress={() => navigation.navigate("Listings", { category: categoryParamMap[category] })}
            />
          ))}
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(160).duration(400)}>
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

        <Animated.View entering={FadeInDown.delay(220).duration(400)}>
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
            {isLoading
              ? featured.map((_, index) => <PropertyCardSkeleton key={`skeleton-featured-${index}`} />)
              : featured.map((property, index) => (
                  <Animated.View key={property.id} entering={FadeInDown.delay(260 + index * 60).duration(400)}>
                    <PropertyCard
                      item={property}
                      language={language}
                      onPress={() => navigation.navigate("PropertyDetail", { id: property.id })}
                    />
                  </Animated.View>
                ))}
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(320).duration(400)}>
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

        <Animated.View entering={FadeInDown.delay(380).duration(400)}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>{t("nearbyListings")}</Text>
              <Text style={styles.sectionSubtitle}>Verified homes with clear nightly pricing and strong review history.</Text>
            </View>
          </View>
          <View style={styles.cardStack}>
            {isLoading
              ? verified.map((_, index) => <PropertyCardSkeleton key={`skeleton-verified-${index}`} />)
              : verified.map((property, index) => (
                  <Animated.View key={property.id} entering={FadeInDown.delay(420 + index * 60).duration(400)}>
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
