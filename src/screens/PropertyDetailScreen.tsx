import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { properties, users } from "@/data/mockData";
import { addRecentViewed } from "@/store/searchSlice";
import { useAppDispatch } from "@/store";
import { analytics } from "@/services/analytics";
import { saveRecentProperty } from "@/services/cache";
import { useGetPropertyByIdQuery, useGetReviewsQuery } from "@/services/api";
import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import {
  AmenitiesGrid,
  Avatar,
  Badge,
  Card,
  ContactCTA,
  GalleryStrip,
  GlassContainer,
  IconButton,
  MapPreview,
  PropertyCard,
  RatingStars,
  formatCurrency,
} from "@/components/ui";
import { useItemLanguage } from "./index";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
      zIndex: theme.zIndex.overlay,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    headerRight: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    scrollContent: {
      paddingBottom: 220,
    },
    summaryWrap: {
      marginTop: -44,
      paddingHorizontal: spacing.md,
      zIndex: theme.zIndex.raised,
    },
    summaryCard: {
      borderRadius: 26,
    },
    summaryContent: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    summaryTopRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    priceBlock: {
      flex: 1,
      minWidth: 0,
    },
    price: {
      ...typography.heroPrice,
      color: theme.colors.textPrimary,
    },
    priceCaption: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    title: {
      ...typography.heading,
      color: theme.colors.textPrimary,
      marginTop: spacing.xs,
    },
    address: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 6,
    },
    summaryMetaRow: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    summaryMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: 999,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.64),
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
    },
    summaryMetaText: {
      ...typography.caption,
      color: theme.colors.textPrimary,
    },
    sectionWrap: {
      paddingHorizontal: spacing.md,
      marginTop: spacing.xl,
    },
    sectionTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary,
      marginBottom: spacing.md,
    },
    solidCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: spacing.md,
      ...theme.elevation.card,
    },
    overviewRow: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    overviewCell: {
      flex: 1,
      padding: spacing.md,
      borderRadius: 18,
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
      gap: 8,
    },
    overviewValue: {
      ...typography.heading,
      color: theme.colors.textPrimary,
    },
    overviewLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary,
    },
    hostRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
    },
    hostCopy: {
      flex: 1,
      minWidth: 0,
    },
    hostHeaderRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.xs,
    },
    hostName: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
      flexShrink: 1,
    },
    hostBio: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    description: {
      ...typography.body,
      color: theme.colors.textPrimary,
      lineHeight: 22,
    },
    reviewCard: {
      marginBottom: spacing.sm,
    },
    reviewText: {
      ...typography.body,
      color: theme.colors.textPrimary,
      marginTop: spacing.sm,
    },
    similarStack: {
      gap: spacing.md,
    },
    ctaBar: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
      zIndex: theme.zIndex.sticky,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

const DetailMeta = ({
  icon,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}) => {
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;

  return (
    <View style={styles.summaryMetaItem}>
      <MaterialCommunityIcons name={icon} size={16} color={theme.colors.textSecondary} />
      <Text style={styles.summaryMetaText}>{label}</Text>
    </View>
  );
};

export function PropertyDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { t } = useTranslation(["property", "booking"]);
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const language = useItemLanguage();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const [scrollY, setScrollY] = useState(0);

  const propertyId = route.params?.id ?? "prop-1";
  const { data: property } = useGetPropertyByIdQuery(propertyId);
  const { data: reviews = [] } = useGetReviewsQuery(propertyId);

  const currentProperty =
    property ||
    properties.find((item) => item.id === propertyId) ||
    properties[0];
  const host = users.find((item) => item.id === currentProperty.hostId) ?? users[0];
  const similarProperties = useMemo(
    () => properties.filter((item) => item.id !== currentProperty.id).slice(0, 2),
    [currentProperty.id]
  );

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: "none" } });

    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  useEffect(() => {
    dispatch(addRecentViewed(currentProperty));
    saveRecentProperty(currentProperty);
    analytics.logEvent("view_property", { propertyId: currentProperty.id });
  }, [currentProperty, dispatch]);

  const headerTint: "glass" | "solid" = scrollY > 120 ? "solid" : "glass";

  return (
    <View style={styles.container}>
      <Animated.View
        entering={FadeIn.duration(theme.motion.standard)}
        style={[styles.header, { top: Math.max(insets.top + 8, 18) }]}
      >
        <IconButton
          icon="arrow-back-ios-new"
          label="Back"
          tone={headerTint}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.goBack();
          }}
        />
        <View style={styles.headerRight}>
          <IconButton icon="favorite-border" label="Save" tone={headerTint} />
          <IconButton icon="ios-share" label="Share" tone={headerTint} />
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={(event) => setScrollY(event.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        <GalleryStrip photos={currentProperty.photos} />

        <Animated.View entering={FadeInDown.delay(60).duration(theme.motion.standard)} style={styles.summaryWrap}>
          <GlassContainer variant="panel" style={styles.summaryCard}>
            <View style={styles.summaryContent}>
              <View style={styles.summaryTopRow}>
                <View style={styles.priceBlock}>
                  <Text style={styles.price}>{formatCurrency(currentProperty.price, currentProperty.currency)}</Text>
                  <Text style={styles.priceCaption}>{t("booking:perNight")}</Text>
                  <Text style={styles.title}>{currentProperty.title[language]}</Text>
                  <Text style={styles.address}>{currentProperty.address}</Text>
                </View>
                <View style={{ alignItems: "flex-end", gap: spacing.xs }}>
                  <Badge label="Verified" tone="success" />
                  <RatingStars rating={currentProperty.rating} count={currentProperty.reviewCount} />
                </View>
              </View>
              <View style={styles.summaryMetaRow}>
                {typeof currentProperty.bedrooms === "number" ? <DetailMeta icon="bed-queen-outline" label={`${currentProperty.bedrooms} bedrooms`} /> : null}
                {typeof currentProperty.bathrooms === "number" ? <DetailMeta icon="shower" label={`${currentProperty.bathrooms} baths`} /> : null}
                {typeof currentProperty.guestLimit === "number" ? <DetailMeta icon="account-group-outline" label={`${currentProperty.guestLimit} guests`} /> : null}
              </View>
            </View>
          </GlassContainer>
        </Animated.View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.overviewRow}>
            <View style={styles.overviewCell}>
              <MaterialCommunityIcons name="shield-check-outline" size={20} color={theme.colors.primary} />
              <Text style={styles.overviewValue}>Verified</Text>
              <Text style={styles.overviewLabel}>Listing and host reviewed before publishing</Text>
            </View>
            <View style={styles.overviewCell}>
              <MaterialCommunityIcons name="clock-fast" size={20} color={theme.colors.primary} />
              <Text style={styles.overviewValue}>Fast reply</Text>
              <Text style={styles.overviewLabel}>Typical response within a few minutes</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>{t("property:verifiedHost")}</Text>
          <Pressable
            onPress={() => navigation.navigate("HostPublicProfile", { id: host.id })}
            style={({ pressed }) => [styles.solidCard, pressed && { opacity: 0.94 }]}
            accessibilityRole="button"
            accessibilityLabel="Host profile"
          >
            <View style={styles.hostRow}>
              <Avatar uri={host.avatar} size={60} />
              <View style={styles.hostCopy}>
                <View style={styles.hostHeaderRow}>
                  <Text style={styles.hostName}>{host.name}</Text>
                  <Badge label={t("property:verifiedHost")} tone="success" />
                </View>
                <Text style={styles.hostBio}>{host.bio ?? "Helpful local host with a focus on clear communication."}</Text>
              </View>
            </View>
          </Pressable>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>{t("property:amenities")}</Text>
          <Card style={styles.solidCard}>
            <AmenitiesGrid amenities={currentProperty.amenities} language={language} />
          </Card>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>{t("property:description")}</Text>
          <Card style={styles.solidCard}>
            <Text style={styles.description}>{currentProperty.description[language]}</Text>
          </Card>
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>{t("property:location")}</Text>
          <MapPreview title={currentProperty.address} subtitle={currentProperty.district} />
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>{t("property:reviews")}</Text>
          {reviews.map((review) => (
            <Card key={review.id} style={[styles.solidCard, styles.reviewCard]}>
              <RatingStars rating={review.rating} />
              <Text style={styles.reviewText}>{review.text[language]}</Text>
            </Card>
          ))}
        </View>

        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>{t("property:similarProperties")}</Text>
          <View style={styles.similarStack}>
            {similarProperties.map((item) => (
              <PropertyCard
                key={item.id}
                item={item}
                language={language}
                onPress={() => navigation.push("PropertyDetail", { id: item.id })}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={[styles.ctaBar, { bottom: Math.max(insets.bottom + 10, 16) }]}>
        <ContactCTA
          price={formatCurrency(currentProperty.price, currentProperty.currency)}
          caption="per night - clear pricing before booking"
          primaryLabel={t("property:bookNow")}
          onPrimaryPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            navigation.navigate("BookingModal", {
              screen: "Booking",
              params: { propertyId: currentProperty.id },
            });
          }}
          actions={[
            {
              icon: "phone-outline",
              label: "Call",
            },
            {
              icon: "chat-processing-outline",
              label: "Message",
              onPress: () =>
                navigation.getParent()?.navigate("ChatTab", {
                  screen: "ChatThread",
                  params: { id: "msg-1", title: host.name },
                }),
            },
            {
              icon: "calendar-clock-outline",
              label: "Visit",
            },
          ]}
        />
      </View>
    </View>
  );
}
