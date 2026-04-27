import React, { startTransition, useDeferredValue, useEffect, useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown, LinearTransition } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { properties as mockProperties } from "@/data/mockData";
import { useGetPropertiesQuery } from "@/services/api";
import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import {
  GlassContainer,
  Pill,
  PropertyCard,
  ScreenScroll,
  SearchBar,
  formatCurrency,
  useResponsive,
} from "@/components/ui";
import MapView, { Marker, PROVIDER_GOOGLE } from "@/components/map";
import { Property } from "@/types/models";
import { useItemLanguage } from "./index";

type ViewMode = "list" | "map";
type SortMode = "best" | "priceLow" | "priceHigh" | "rating";

const categoryOptions = [
  { id: null, label: "All" },
  { id: "apartment", label: "Apartment" },
  { id: "house", label: "House" },
  { id: "room", label: "Room" },
  { id: "guesthouse", label: "Guesthouse" },
] as const;

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
      top: -130,
      right: -90,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: "absolute",
      bottom: -140,
      left: -90,
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: theme.colors.ambientBottom,
    },
    scrollContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    floatingFilter: {
      borderRadius: 24,
      marginBottom: spacing.md,
    },
    floatingContent: {
      padding: spacing.sm,
      gap: spacing.sm,
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    toggleFill: {
      flex: 1,
      flexDirection: "row",
      gap: spacing.sm,
    },
    filterToggle: {
      minHeight: 44,
      paddingHorizontal: spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
      flexDirection: "row",
      alignItems: "center",
      gap: 8,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.06 : 0.42),
    },
    filterToggleText: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary,
    },
    chipRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    filterPanel: {
      marginTop: spacing.xs,
      gap: spacing.md,
      paddingTop: spacing.xs,
    },
    filterSectionTitle: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5,
    },
    sliderCard: {
      padding: spacing.md,
      borderRadius: 18,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.52),
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
    },
    sliderHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: spacing.sm,
    },
    sliderLabel: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    sliderValue: {
      ...typography.bodyStrong,
      color: theme.colors.primary,
    },
    resultRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: spacing.md,
      gap: spacing.md,
    },
    resultTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary,
    },
    resultSubtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    resultLink: {
      ...typography.bodyStrong,
      color: theme.colors.primary,
    },
    cardStack: {
      gap: spacing.md,
    },
    mapWrap: {
      height: 560,
      borderRadius: 28,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    map: {
      flex: 1,
    },
    marker: {
      minWidth: 54,
      height: 34,
      borderRadius: 17,
      paddingHorizontal: 12,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: alpha(theme.colors.white, 0.8),
      backgroundColor: theme.colors.surface,
      ...theme.elevation.soft,
    },
    markerActive: {
      backgroundColor: theme.colors.primary,
      borderColor: alpha(theme.colors.white, 0.18),
    },
    markerText: {
      ...typography.caption,
      color: theme.colors.textPrimary,
    },
    markerTextActive: {
      color: theme.colors.white,
    },
    mapListing: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
      bottom: spacing.md,
      borderRadius: 24,
    },
    mapListingContent: {
      padding: spacing.sm,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation("home");
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const responsive = useResponsive();
  const language = useItemLanguage();
  const tabBarHeight = useBottomTabBarHeight();
  const { data = mockProperties } = useGetPropertiesQuery();

  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [query, setQuery] = useState("");
  const [price, setPrice] = useState(900000);
  const [selectedCategory, setSelectedCategory] = useState<Property["type"] | null>(null);
  const [sortMode, setSortMode] = useState<SortMode>("best");
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(data[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query);

  const filteredData = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const result = data
      .filter((property) => !selectedCategory || property.type === selectedCategory)
      .filter((property) => property.price <= price)
      .filter((property) => {
        if (!normalizedQuery) {
          return true;
        }

        return [
          property.title[language],
          property.address,
          property.district,
          property.description[language],
        ]
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((left, right) => {
        switch (sortMode) {
          case "priceLow":
            return left.price - right.price;
          case "priceHigh":
            return right.price - left.price;
          case "rating":
            return right.rating - left.rating;
          default:
            return Number(right.isVerified) - Number(left.isVerified) || right.reviewCount - left.reviewCount;
        }
      });

    return result;
  }, [data, deferredQuery, language, price, selectedCategory, sortMode]);

  const selectedProperty = filteredData.find((item) => item.id === selectedPropertyId) ?? filteredData[0];

  useEffect(() => {
    if (!filteredData.length) {
      setSelectedPropertyId(null);
      return;
    }

    if (!filteredData.some((item) => item.id === selectedPropertyId)) {
      setSelectedPropertyId(filteredData[0].id);
    }
  }, [filteredData, selectedPropertyId]);

  const toggleCategory = (nextCategory: Property["type"] | null) => {
    startTransition(() => {
      setSelectedCategory((current) => (current === nextCategory ? null : nextCategory));
    });
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
      <ScreenScroll contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + spacing.xxxl }]}>
        <Animated.View entering={FadeIn.duration(theme.motion.standard)}>
          <GlassContainer variant="navbar" style={styles.floatingFilter}>
            <View style={styles.floatingContent}>
              <SearchBar
                placeholder={t("searchPlaceholder")}
                value={query}
                onChangeText={setQuery}
                editable
                autoFocus
              />
              <View style={styles.toggleRow}>
                <View style={styles.toggleFill}>
                  <Pill
                    label={t("listView")}
                    active={viewMode === "list"}
                    onPress={() => startTransition(() => setViewMode("list"))}
                    icon="view-grid-outline"
                  />
                  <Pill
                    label={t("mapView")}
                    active={viewMode === "map"}
                    onPress={() => startTransition(() => setViewMode("map"))}
                    icon="map-outline"
                  />
                </View>
                <Pressable
                  onPress={() => setFiltersExpanded((current) => !current)}
                  style={styles.filterToggle}
                  accessibilityRole="button"
                  accessibilityLabel="Toggle filters"
                >
                  <MaterialCommunityIcons
                    name={filtersExpanded ? "tune-vertical-variant" : "tune"}
                    size={18}
                    color={theme.colors.textPrimary}
                  />
                  <Text style={styles.filterToggleText}>Filters</Text>
                </Pressable>
              </View>
              <View style={styles.chipRow}>
                {categoryOptions.map((option) => (
                  <Pill
                    key={option.label}
                    label={option.label}
                    active={selectedCategory === option.id}
                    onPress={() => toggleCategory(option.id)}
                  />
                ))}
              </View>
              {filtersExpanded ? (
                <Animated.View entering={FadeInDown.duration(theme.motion.standard)} layout={LinearTransition.springify()}>
                  <View style={styles.filterPanel}>
                    <Text style={styles.filterSectionTitle}>Price cap</Text>
                    <View style={styles.sliderCard}>
                      <View style={styles.sliderHeader}>
                        <Text style={styles.sliderLabel}>{t("priceRange")}</Text>
                        <Text style={styles.sliderValue}>{formatCurrency(price, "UZS")}</Text>
                      </View>
                      <Slider
                        minimumValue={120000}
                        maximumValue={2000000}
                        step={20000}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={alpha(theme.colors.textSecondary, 0.2)}
                        thumbTintColor={theme.colors.primary}
                        value={price}
                        onValueChange={setPrice}
                      />
                    </View>
                    <Text style={styles.filterSectionTitle}>Sort by</Text>
                    <View style={styles.chipRow}>
                      {[
                        { id: "best", label: "Best match" },
                        { id: "priceLow", label: "Lowest price" },
                        { id: "priceHigh", label: "Highest price" },
                        { id: "rating", label: "Top rated" },
                      ].map((option) => (
                        <Pill
                          key={option.id}
                          label={option.label}
                          active={sortMode === option.id}
                          onPress={() => setSortMode(option.id as SortMode)}
                        />
                      ))}
                    </View>
                  </View>
                </Animated.View>
              ) : null}
            </View>
          </GlassContainer>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(theme.motion.standard)} style={styles.resultRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultTitle}>{filteredData.length} matches</Text>
            <Text style={styles.resultSubtitle}>
              Verified homes surface first, and pricing stays visible before you tap in.
            </Text>
          </View>
          <Pressable onPress={() => navigation.navigate("MapView")} accessibilityRole="button">
            <Text style={styles.resultLink}>Open map</Text>
          </Pressable>
        </Animated.View>

        {viewMode === "map" ? (
          <Animated.View entering={FadeInDown.delay(120).duration(theme.motion.standard)}>
            <View style={[styles.mapWrap, { height: responsive.mapHeight }]}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: 39.6547,
                  longitude: 66.9758,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                {filteredData.map((property) => {
                  const active = property.id === selectedProperty?.id;
                  return (
                    <Marker
                      key={property.id}
                      coordinate={property.coords}
                      onPress={() => setSelectedPropertyId(property.id)}
                    >
                      <View style={[styles.marker, active && styles.markerActive]}>
                        <Text style={[styles.markerText, active && styles.markerTextActive]}>
                          {Math.round(property.price / 1000)}k
                        </Text>
                      </View>
                    </Marker>
                  );
                })}
              </MapView>
              {selectedProperty ? (
                <GlassContainer variant="overlay" style={styles.mapListing}>
                  <View style={styles.mapListingContent}>
                    <PropertyCard
                      item={selectedProperty}
                      language={language}
                      onPress={() => navigation.navigate("PropertyDetail", { id: selectedProperty.id })}
                    />
                  </View>
                </GlassContainer>
              ) : null}
            </View>
          </Animated.View>
        ) : (
          <View style={styles.cardStack}>
            {filteredData.map((property, index) => (
              <Animated.View
                key={property.id}
                entering={FadeInDown.delay(120 + index * 40).duration(theme.motion.standard)}
              >
                <PropertyCard
                  item={property}
                  language={language}
                  onPress={() => navigation.navigate("PropertyDetail", { id: property.id })}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </ScreenScroll>
    </View>
  );
}
