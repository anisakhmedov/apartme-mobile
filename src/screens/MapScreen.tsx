import React, { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { properties as mockProperties } from "@/data/mockData";
import { useGetPropertiesQuery } from "@/services/api"; // Removed unused import of `colors`
import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import { GlassContainer, IconButton, formatCurrency } from "@/components/ui";
import MapView, { Marker, PROVIDER_GOOGLE } from "@/components/map";
import { useItemLanguage } from "./index";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1, // Kept theme.colors.background
      backgroundColor: theme.colors.background,
    },
    map: {
      flex: 1,
    },
    header: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md, // Kept theme.zIndex.sticky
      zIndex: theme.zIndex.sticky,
    },
    headerContent: {
      padding: spacing.sm, // Kept spacing.sm
      flexDirection: "row", // Kept spacing.sm
      alignItems: "center",
      gap: spacing.sm,
    },
    headerCopy: {
      flex: 1,
      minWidth: 0,
    }, // Kept typography.subheading
    headerTitle: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    headerSubtitle: {
      ...typography.caption,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 2,
    },
    marker: {
      minWidth: 56,
      height: 36,
      borderRadius: 18,
      paddingHorizontal: 12,
      alignItems: "center",
      justifyContent: "center", // Kept theme.colors.white
      borderWidth: 1,
      borderColor: alpha(theme.colors.white, 0.82),
      backgroundColor: theme.colors.surface,
      ...theme.elevation.soft,
    },
    markerActive: {
      backgroundColor: theme.colors.primary, // Kept theme.colors.primary
      borderColor: alpha(theme.colors.white, 0.18),
    },
    markerText: {
      ...typography.caption,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    markerTextActive: {
      color: theme.colors.white,
    },
    listingPanel: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md, // Kept theme.zIndex.sticky
      zIndex: theme.zIndex.sticky,
    },
    listingContent: {
      padding: spacing.md, // Kept spacing.md
      gap: spacing.sm, // Kept spacing.sm
    },
    listingTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md, // Kept spacing.md
    },
    listingEyebrow: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      textTransform: "uppercase",
      letterSpacing: 0.5, // Kept theme.colors.textSecondary
    },
    listingTitle: {
      ...typography.subheading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      marginTop: 6,
    },
    listingAddress: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 4,
    },
    listingPrice: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    listingActions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    actionButton: {
      flex: 1, // Kept 46
      minHeight: 46, // Kept 16
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.border, // Kept theme.colors.border
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.62),
      alignItems: "center",
      justifyContent: "center",
    },
    actionButtonPrimary: {
      backgroundColor: theme.colors.primary, // Kept theme.colors.primary
      borderColor: theme.colors.primary, // Kept theme.colors.primary
    },
    actionText: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    actionTextPrimary: {
      color: theme.colors.white,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

export function MapScreen() {
  const navigation = useNavigation<any>();
  const language = useItemLanguage();
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const insets = useSafeAreaInsets();
  const { data = mockProperties } = useGetPropertiesQuery();
  const [selectedPropertyId, setSelectedPropertyId] = useState(data[0]?.id ?? mockProperties[0]?.id);

  const selectedProperty = useMemo(
    () => data.find((property) => property.id === selectedPropertyId) ?? data[0] ?? mockProperties[0],
    [data, selectedPropertyId]
  );

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(theme.motion.standard)} style={StyleSheet.absoluteFillObject}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 39.6547,
            longitude: 66.9758,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
        >
          {data.map((property) => {
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
      </Animated.View>

      <Animated.View
        entering={FadeInDown.duration(theme.motion.standard)}
        style={[styles.header, { top: Math.max(insets.top + 8, 20) }]}
      >
        <GlassContainer variant="navbar">
          <View style={styles.headerContent}>
            <IconButton icon="arrow-back-ios-new" label="Back" onPress={() => navigation.goBack()} />
            <View style={styles.headerCopy}>
              <Text style={styles.headerTitle}>Map view</Text>
              <Text style={styles.headerSubtitle}>{data.length} visible listings in Samarkand</Text>
            </View>
            <IconButton icon="tune" label="Filters" onPress={() => navigation.goBack()} />
          </View>
        </GlassContainer>
      </Animated.View>

      {selectedProperty ? (
        <Animated.View
          entering={FadeInDown.delay(100).duration(theme.motion.standard)}
          style={[styles.listingPanel, { bottom: Math.max(insets.bottom + 16, 24) }]}
        >
          <GlassContainer variant="panel">
            <View style={styles.listingContent}>
              <View style={styles.listingTopRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.listingEyebrow}>Selected listing</Text>
                  <Text style={styles.listingTitle} numberOfLines={2}>
                    {selectedProperty.title[language]}
                  </Text>
                  <Text style={styles.listingAddress} numberOfLines={1}>
                    {selectedProperty.address}
                  </Text>
                </View>
                <Text style={styles.listingPrice}>{formatCurrency(selectedProperty.price, selectedProperty.currency)}</Text>
              </View>
              <View style={styles.listingActions}>
                <Pressable
                  onPress={() => navigation.navigate("PropertyDetail", { id: selectedProperty.id })}
                  style={({ pressed }) => [styles.actionButton, pressed && { opacity: 0.92 }]}
                  accessibilityRole="button"
                  accessibilityLabel="Preview listing"
                >
                  <Text style={styles.actionText}>Preview</Text>
                </Pressable>
                <Pressable
                  onPress={() => navigation.navigate("PropertyDetail", { id: selectedProperty.id })}
                  style={({ pressed }) => [
                    styles.actionButton,
                    styles.actionButtonPrimary,
                    pressed && { opacity: 0.92 },
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel="View listing"
                >
                  <Text style={[styles.actionText, styles.actionTextPrimary]}>View listing</Text>
                </Pressable>
              </View>
            </View>
          </GlassContainer>
        </Animated.View>
      ) : null}
    </View>
  );
}
