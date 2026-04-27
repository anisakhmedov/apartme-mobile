import React, { memo, useMemo, useState } from "react";
import {
  ActivityIndicator,
  DimensionValue,
  Dimensions,
  FlatList,
  ImageStyle,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { amenitiesMap, districts } from "@/data/mockData";
import {
  AppTheme,
  alpha,
  darkTheme,
  lightTheme,
  radii,
  spacing,
  typography,
  useAppTheme,
} from "@/theme";
import { CurrencyCode, LocalizedText, Property } from "@/types/models";

const { width: INITIAL_WIDTH, height: INITIAL_HEIGHT } = Dimensions.get("window");

const PROPERTY_TYPE_LABELS: Record<Property["type"], string> = {
  apartment: "Apartment",
  house: "House",
  room: "Room",
  guesthouse: "Guesthouse",
  daily: "Daily stay",
};

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    screenGradient: {
      flex: 1,
    },
    ambientTop: {
      position: "absolute",
      top: -120,
      right: -80,
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: "absolute",
      left: -120,
      bottom: -150,
      width: 320,
      height: 320,
      borderRadius: 160,
      backgroundColor: theme.colors.ambientBottom,
    },
    scrollContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.xxxl,
    },
    section: {
      marginBottom: spacing.xl,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md,
      marginBottom: spacing.md,
    },
    sectionHeadingBlock: {
      flex: 1,
      minWidth: 0,
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
    card: {
      backgroundColor: theme.colors.surface,
      borderRadius: radii.card,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.elevation.card,
    },
    gradientCard: {
      overflow: "hidden",
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: theme.colors.glassBorder,
      ...theme.elevation.soft,
    },
    glassShell: {
      position: "relative",
      overflow: "hidden",
      borderRadius: radii.card,
      borderWidth: 1,
      ...theme.elevation.floating,
    },
    glassLayer: {
      ...StyleSheet.absoluteFillObject,
    },
    glassHighlight: {
      position: "absolute",
      top: 1,
      left: 1,
      right: 1,
      height: "42%",
      borderRadius: radii.card - 1,
      opacity: 0.9,
    },
    glassContent: {
      position: "relative",
      zIndex: 1,
    },
    pill: {
      minHeight: 44,
      borderRadius: radii.pill,
      paddingHorizontal: spacing.md,
      paddingVertical: 10,
      borderWidth: 1,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "row",
      gap: 8,
    },
    pillText: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary,
    },
    pillTextActive: {
      color: theme.mode === "dark" ? theme.colors.textPrimary : theme.colors.primaryDark,
    },
    iconButton: {
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      ...theme.elevation.soft,
    },
    iconBadge: {
      position: "absolute",
      top: -4,
      right: -4,
      minWidth: 18,
      height: 18,
      borderRadius: 9,
      backgroundColor: theme.colors.badgeNew,
      paddingHorizontal: 4,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.surface,
    },
    iconBadgeText: {
      ...typography.micro,
      color: theme.colors.white,
    },
    pressed: {
      opacity: 0.92,
      transform: [{ scale: 0.985 }],
    },
    searchShell: {
      minHeight: 56,
      borderRadius: 22,
      paddingHorizontal: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
    },
    searchValue: {
      flex: 1,
      ...typography.body,
      color: theme.colors.textPrimary,
    },
    searchPlaceholder: {
      color: theme.colors.textSecondary,
    },
    primaryButton: {
      borderRadius: radii.pill,
      overflow: "hidden",
      minHeight: 54,
      ...theme.elevation.card,
    },
    primaryButtonGradient: {
      minHeight: 54,
      paddingHorizontal: spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      gap: 10,
    },
    primaryButtonText: {
      color: theme.colors.white,
      fontSize: 15,
      fontWeight: "700",
    },
    primaryButtonTextDanger: {
      color: theme.colors.error,
    },
    secondaryButton: {
      minHeight: 52,
      borderRadius: radii.pill,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.surface,
      paddingHorizontal: spacing.lg,
    },
    secondaryButtonText: {
      fontSize: 15,
      fontWeight: "700",
      color: theme.colors.textPrimary,
    },
    fieldWrap: {
      marginBottom: spacing.md,
    },
    fieldLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginBottom: spacing.xs,
    },
    field: {
      minHeight: 52,
      borderRadius: radii.card,
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      color: theme.colors.textPrimary,
      ...typography.body,
    },
    fieldError: {
      ...typography.caption,
      color: theme.colors.error,
      marginTop: spacing.xs,
    },
    toggleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      paddingVertical: spacing.sm,
    },
    toggleCopy: {
      flex: 1,
      minWidth: 0,
    },
    toggleLabel: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    toggleSubtitle: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    toggleTrack: {
      width: 54,
      height: 32,
      borderRadius: 16,
      padding: 3,
      backgroundColor: theme.colors.surfaceMuted,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    toggleTrackActive: {
      backgroundColor: theme.colors.primaryTint,
      borderColor: theme.colors.primaryBorder,
    },
    toggleThumb: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      ...theme.elevation.soft,
    },
    toggleThumbActive: {
      alignSelf: "flex-end",
      backgroundColor: theme.colors.primary,
    },
    checkboxRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      paddingVertical: spacing.xs,
    },
    checkboxLabel: {
      flex: 1,
      ...typography.body,
      color: theme.colors.textPrimary,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radii.pill,
      alignItems: "center",
      justifyContent: "center",
    },
    badgeText: {
      ...typography.micro,
      textTransform: "uppercase",
      letterSpacing: 0.4,
    },
    ratingWrap: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    ratingText: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary,
    },
    ratingCount: {
      ...typography.caption,
      color: theme.colors.textSecondary,
    },
    statCard: {
      flex: 1,
      minWidth: 0,
      backgroundColor: theme.colors.surface,
      borderRadius: radii.card,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      ...theme.elevation.soft,
    },
    statValue: {
      ...typography.heroPrice,
      fontSize: 26,
      color: theme.colors.textPrimary,
    },
    statLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 6,
      textAlign: "center",
    },
    emptyState: {
      alignItems: "center",
      justifyContent: "center",
      gap: spacing.sm,
      paddingVertical: spacing.xxxl,
    },
    emptyTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary,
      textAlign: "center",
    },
    emptyDescription: {
      ...typography.body,
      color: theme.colors.textSecondary,
      textAlign: "center",
    },
    skeleton: {
      borderRadius: 14,
      backgroundColor: theme.mode === "dark" ? alpha(theme.colors.white, 0.08) : alpha(theme.colors.primary, 0.08),
    },
    avatarFallback: {
      backgroundColor: theme.colors.primaryTint,
    },
    propertyCard: {
      width: "100%",
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      overflow: "hidden",
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.elevation.card,
    },
    propertyMedia: {
      position: "relative",
    },
    propertyImage: {
      width: "100%",
    },
    propertyImageScrim: {
      ...StyleSheet.absoluteFillObject,
    },
    propertyOverlayTop: {
      position: "absolute",
      top: spacing.md,
      left: spacing.md,
      right: spacing.md,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    propertyOverlayBadgeRow: {
      flexDirection: "row",
      gap: spacing.xs,
      flexWrap: "wrap",
    },
    propertyOverlayInfo: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
      bottom: spacing.md,
      minHeight: 86,
      borderRadius: 20,
      justifyContent: "center",
    },
    propertyOverlayPrice: {
      ...typography.heroPrice,
      fontSize: 22,
      lineHeight: 28,
      color: theme.colors.white,
    },
    propertyOverlayCaption: {
      ...typography.caption,
      color: alpha(theme.colors.white, 0.82),
      marginTop: 4,
      lineHeight: 16,
    },
    propertyBody: {
      padding: spacing.md,
      gap: spacing.sm,
    },
    propertyTitle: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    propertyAddress: {
      ...typography.body,
      color: theme.colors.textSecondary,
    },
    propertyMetaRow: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    propertyMetaItem: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: radii.pill,
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    propertyMetaText: {
      ...typography.caption,
      color: theme.colors.textSecondary,
    },
    propertyFooter: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: spacing.sm,
      marginTop: spacing.xs,
    },
    propertyFooterText: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      flexShrink: 1,
      marginLeft: "auto",
    },
    bookingCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: radii.card,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.elevation.soft,
    },
    bookingTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    bookingTitle: {
      flex: 1,
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    bookingSubtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: spacing.xs,
    },
    bookingId: {
      ...typography.caption,
      color: theme.colors.textTertiary,
      marginTop: spacing.xs,
    },
    notificationRowCard: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: radii.card,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.elevation.soft,
    },
    notificationUnread: {
      borderColor: theme.colors.primaryBorder,
      backgroundColor: theme.colors.primaryLight,
    },
    notificationDot: {
      width: 10,
      height: 10,
      borderRadius: 5,
      marginTop: 4,
      backgroundColor: theme.colors.primary,
    },
    notificationTextWrap: {
      flex: 1,
      minWidth: 0,
    },
    notificationTitle: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    notificationBody: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    notificationTime: {
      ...typography.caption,
      color: theme.colors.textTertiary,
      marginTop: spacing.xs,
    },
    conversationRowCard: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      backgroundColor: theme.colors.surface,
      borderRadius: radii.card,
      padding: spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.elevation.soft,
    },
    conversationCopy: {
      flex: 1,
      minWidth: 0,
    },
    conversationTopRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    conversationTitle: {
      flex: 1,
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    conversationTime: {
      ...typography.caption,
      color: theme.colors.textTertiary,
    },
    conversationPreview: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    unreadBadge: {
      minWidth: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 6,
    },
    unreadBadgeText: {
      ...typography.micro,
      color: theme.colors.white,
    },
    messageBubble: {
      maxWidth: "84%",
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: 18,
      marginBottom: spacing.sm,
    },
    messageMine: {
      alignSelf: "flex-end",
      backgroundColor: theme.colors.primary,
    },
    messageTheirs: {
      alignSelf: "flex-start",
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    messageText: {
      ...typography.body,
      color: theme.colors.textPrimary,
    },
    messageTextMine: {
      color: theme.colors.white,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.sm,
      paddingVertical: spacing.sm,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    infoLabel: {
      flex: 1,
      ...typography.body,
      color: theme.colors.textSecondary,
    },
    infoValue: {
      flex: 1,
      textAlign: "right",
      ...typography.bodyStrong,
      color: theme.colors.textPrimary,
    },
    stepsWrap: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: spacing.sm,
    },
    stepItem: {
      flex: 1,
      alignItems: "center",
      gap: 6,
    },
    stepTrack: {
      width: "100%",
      height: 4,
      borderRadius: 999,
      backgroundColor: theme.colors.surfaceMuted,
    },
    stepTrackActive: {
      backgroundColor: theme.colors.primary,
    },
    stepLabel: {
      ...typography.caption,
      color: theme.colors.textTertiary,
      textAlign: "center",
    },
    stepLabelActive: {
      color: theme.colors.textPrimary,
    },
    galleryWrap: {
      paddingRight: spacing.md,
    },
    galleryImage: {
      borderRadius: 0,
    },
    galleryPagination: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
      bottom: spacing.md,
      flexDirection: "row",
      justifyContent: "center",
      gap: 6,
    },
    galleryDot: {
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: alpha(theme.colors.white, 0.48),
    },
    galleryDotActive: {
      width: 22,
      backgroundColor: theme.colors.white,
    },
    galleryCountBadge: {
      position: "absolute",
      top: spacing.md,
      right: spacing.md,
    },
    mapPreview: {
      backgroundColor: theme.colors.surfaceSecondary,
      borderRadius: radii.card,
      borderWidth: 1,
      borderColor: theme.colors.border,
      overflow: "hidden",
    },
    mapPreviewHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.sm,
      padding: spacing.md,
    },
    mapPreviewTitle: {
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    mapPreviewSubtitle: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    mapMock: {
      height: 172,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
      backgroundColor: theme.mode === "dark" ? alpha(theme.colors.primary, 0.12) : alpha(theme.colors.primary, 0.08),
      alignItems: "center",
      justifyContent: "center",
    },
    mapMockText: {
      ...typography.bodyStrong,
      color: theme.colors.primary,
    },
    amenitiesGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: spacing.sm,
    },
    amenityChip: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
      paddingHorizontal: 12,
      paddingVertical: 9,
      borderRadius: radii.pill,
      backgroundColor: theme.colors.surfaceSecondary,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    amenityText: {
      ...typography.caption,
      color: theme.colors.textPrimary,
    },
    bottomStickyBar: {
      position: "absolute",
      left: spacing.md,
      right: spacing.md,
      bottom: spacing.md,
      zIndex: theme.zIndex.sticky,
      borderRadius: 22,
      overflow: "hidden",
      ...theme.elevation.overlay,
    },
    contactCta: {
      backgroundColor: theme.colors.ctaSurface,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: theme.colors.border,
      padding: spacing.md,
      gap: spacing.md,
    },
    contactHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: spacing.md,
    },
    contactPrice: {
      ...typography.heroPrice,
      fontSize: 26,
      color: theme.colors.textPrimary,
    },
    contactCaption: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    contactActions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    contactActionButton: {
      flex: 1,
      minHeight: 44,
      borderRadius: radii.pill,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
      flexDirection: "row",
      backgroundColor: theme.colors.surfaceSecondary,
    },
    contactActionLabel: {
      ...typography.caption,
      color: theme.colors.textPrimary,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

const useUiStyles = () => {
  const theme = useAppTheme();
  return theme.mode === "dark" ? darkStyles : lightStyles;
};

const resolveDistrictLabel = (districtId: string, language: keyof LocalizedText) =>
  districts.find((district) => district.id === districtId)?.label[language] ?? districtId;

const compactPrice = (value: number) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  }

  if (value >= 1000) {
    return `${Math.round(value / 1000)}k`;
  }

  return `${value}`;
};

export const useResponsive = () => {
  const { width, height } = useWindowDimensions();

  return useMemo(() => {
    const safeWidth = width || INITIAL_WIDTH;
    const safeHeight = height || INITIAL_HEIGHT;
    const scale = safeWidth / 390;
    const verticalScale = safeHeight / 844;

    return {
      width: safeWidth,
      height: safeHeight,
      scale,
      verticalScale,
      isSmallDevice: safeWidth < 375,
      isMediumDevice: safeWidth >= 375 && safeWidth < 430,
      isLargeDevice: safeWidth >= 430,
      horizontalPadding: Math.max(spacing.md, spacing.md * scale),
      propertyImageHeight: Math.max(220, Math.min(320, 260 * verticalScale)),
      galleryImageHeight: Math.max(320, Math.min(520, safeHeight * 0.48)),
      galleryImageWidth: safeWidth,
      mapHeight: Math.max(320, Math.min(560, safeHeight * 0.62)),
    };
  }, [height, width]);
};

export const formatCurrency = (value: number, currency: CurrencyCode) => {
  const symbol = currency === "UZS" ? "UZS" : currency;
  return `${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value)} ${symbol}`;
};

export const useLocalizedText = (
  text: LocalizedText | undefined,
  language: keyof LocalizedText = "en"
) => {
  if (!text) {
    return "";
  }

  return text[language] ?? text.en ?? text.uz ?? text.ru;
};

export const AppScreen = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <SafeAreaView style={[styles.screen, style]}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary, theme.colors.backgroundTertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.screenGradient}
      >
        <View pointerEvents="none" style={styles.ambientTop} />
        <View pointerEvents="none" style={styles.ambientBottom} />
        {children}
      </LinearGradient>
    </SafeAreaView>
  );
};

export const ScreenScroll = ({
  children,
  style,
  contentContainerStyle,
  ...rest
}: ScrollViewProps & { children: React.ReactNode }) => {
  const styles = useUiStyles();

  return (
    <ScrollView
      {...rest}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      style={style}
      contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
    >
      {children}
    </ScrollView>
  );
};

export const Section = ({
  title,
  subtitle,
  action,
  children,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) => {
  const styles = useUiStyles();

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeadingBlock}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {!!subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
        </View>
        {action}
      </View>
      <View>{children}</View>
    </View>
  );
};

export const Card = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useUiStyles();
  return <View style={[styles.card, style]}>{children}</View>;
};

export const GradientCard = ({
  children,
  colors: gradientColors,
  style,
}: {
  children: React.ReactNode;
  colors: [string, string];
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useUiStyles();

  return (
    <LinearGradient colors={gradientColors} style={[styles.gradientCard, style]}>
      {children}
    </LinearGradient>
  );
};

export const GlassContainer = ({
  children,
  style,
  contentStyle,
  variant = "panel",
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  variant?: "panel" | "accent" | "overlay" | "navbar" | "chip";
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  const variantConfig = {
    panel: {
      backgroundColor: theme.colors.glassPanel,
      borderColor: theme.colors.glassBorderStrong,
      gradient: [theme.colors.glassHighlight, alpha(theme.colors.white, theme.mode === "dark" ? 0.02 : 0.14)] as [string, string],
    },
    accent: {
      backgroundColor: theme.colors.glassAccent,
      borderColor: theme.colors.glassBorderStrong,
      gradient: [alpha(theme.colors.white, 0.2), alpha(theme.colors.primary, theme.mode === "dark" ? 0.04 : 0.1)] as [string, string],
    },
    overlay: {
      backgroundColor: theme.colors.glassOverlay,
      borderColor: alpha(theme.colors.white, theme.mode === "dark" ? 0.12 : 0.26),
      gradient: [alpha(theme.colors.white, 0.22), alpha(theme.colors.white, 0.03)] as [string, string],
    },
    navbar: {
      backgroundColor: theme.colors.glassShell,
      borderColor: theme.colors.glassBorderStrong,
      gradient: [alpha(theme.colors.white, 0.26), alpha(theme.colors.white, 0.02)] as [string, string],
    },
    chip: {
      backgroundColor: theme.colors.glassShell,
      borderColor: theme.colors.glassBorder,
      gradient: [alpha(theme.colors.white, 0.18), alpha(theme.colors.white, 0.02)] as [string, string],
    },
  }[variant];

  return (
    <View
      style={[
        styles.glassShell,
        {
          backgroundColor: variantConfig.backgroundColor,
          borderColor: variantConfig.borderColor,
        },
        style,
      ]}
    >
      <LinearGradient colors={variantConfig.gradient} style={styles.glassLayer} />
      <View
        pointerEvents="none"
        style={[styles.glassHighlight, { backgroundColor: theme.colors.glassHighlight }]}
      />
      <View style={[styles.glassContent, contentStyle]}>{children}</View>
    </View>
  );
};

export const Pill = ({
  label,
  active,
  onPress,
  style,
  icon,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        {
          backgroundColor: active ? theme.colors.glassAccent : theme.colors.glassShell,
          borderColor: active ? theme.colors.primaryBorder : theme.colors.glassBorderStrong,
        },
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {icon ? <MaterialCommunityIcons name={icon} size={16} color={active ? theme.colors.primaryDark : theme.colors.textSecondary} /> : null}
      <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
    </Pressable>
  );
};

export const IconButton = ({
  icon,
  onPress,
  label,
  style,
  badge,
  tone = "glass",
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  onPress?: () => void;
  label: string;
  style?: StyleProp<ViewStyle>;
  badge?: number;
  tone?: "glass" | "solid";
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.iconButton,
        {
          backgroundColor: tone === "glass" ? theme.colors.glassShell : theme.colors.surface,
          borderColor: tone === "glass" ? theme.colors.glassBorderStrong : theme.colors.border,
        },
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {badge ? (
        <View style={styles.iconBadge}>
          <Text style={styles.iconBadgeText}>{badge}</Text>
        </View>
      ) : null}
      <MaterialIcons name={icon} size={20} color={theme.colors.textPrimary} />
    </Pressable>
  );
};

export const SearchBar = ({
  placeholder,
  onPress,
  autoFocus,
  value,
  onChangeText,
  editable,
}: {
  placeholder: string;
  onPress?: () => void;
  autoFocus?: boolean;
  value?: string;
  onChangeText?: (text: string) => void;
  editable?: boolean;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();
  const interactive = editable || !!onChangeText;

  if (interactive) {
    return (
      <GlassContainer variant="navbar" style={{ borderRadius: 22 }}>
        <View style={styles.searchShell}>
          <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
          <TextInput
            autoFocus={autoFocus}
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={theme.colors.textSecondary}
            style={[styles.searchValue, { paddingVertical: 0 }]}
          />
          <MaterialIcons name="tune" size={20} color={theme.colors.textSecondary} />
        </View>
      </GlassContainer>
    );
  }

  return (
    <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={placeholder}>
      {({ pressed }) => (
        <GlassContainer variant="navbar" style={[pressed && styles.pressed, { borderRadius: 22 }]}>
          <View style={styles.searchShell}>
            <MaterialIcons name="search" size={20} color={theme.colors.textSecondary} />
            <Text style={[styles.searchValue, !value && styles.searchPlaceholder]} numberOfLines={1}>
              {value || placeholder}
            </Text>
            <MaterialIcons name="tune" size={20} color={theme.colors.textSecondary} />
          </View>
        </GlassContainer>
      )}
    </Pressable>
  );
};

export const PrimaryButton = ({
  label,
  onPress,
  loading,
  icon,
  style,
  disabled,
  danger,
}: {
  label: string;
  onPress?: () => void;
  loading?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  danger?: boolean;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.primaryButton,
        disabled && { opacity: 0.55 },
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <LinearGradient
        colors={
          danger
            ? [alpha(theme.colors.error, theme.mode === "dark" ? 0.16 : 0.08), alpha(theme.colors.error, theme.mode === "dark" ? 0.1 : 0.04)]
            : [theme.colors.primary, theme.colors.primaryDark]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.primaryButtonGradient}
      >
        {loading ? (
          <ActivityIndicator color={danger ? theme.colors.error : theme.colors.white} />
        ) : icon ? (
          <MaterialCommunityIcons
            name={icon}
            size={18}
            color={danger ? theme.colors.error : theme.colors.white}
          />
        ) : null}
        <Text style={[styles.primaryButtonText, danger && styles.primaryButtonTextDanger]}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
};

export const SecondaryButton = ({
  label,
  onPress,
  style,
  danger,
  disabled,
}: {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  danger?: boolean;
  disabled?: boolean;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.secondaryButton,
        danger && {
          borderColor: alpha(theme.colors.error, 0.24),
          backgroundColor: alpha(theme.colors.error, theme.mode === "dark" ? 0.12 : 0.04),
        },
        disabled && { opacity: 0.55 },
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      <Text style={[styles.secondaryButtonText, danger && { color: theme.colors.error }]}>{label}</Text>
    </Pressable>
  );
};

export const TextField = (props: TextInputProps & { label?: string; error?: string }) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <View style={styles.fieldWrap}>
      {props.label ? <Text style={styles.fieldLabel}>{props.label}</Text> : null}
      <TextInput
        {...props}
        placeholderTextColor={theme.colors.textTertiary}
        style={[
          styles.field,
          props.multiline && {
            minHeight: 120,
            textAlignVertical: "top",
          },
          props.style as StyleProp<TextStyle>,
        ]}
      />
      {props.error ? <Text style={styles.fieldError}>{props.error}</Text> : null}
    </View>
  );
};

export const ToggleRow = ({
  label,
  value,
  onToggle,
  subtitle,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  subtitle?: string;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <Pressable
      onPress={onToggle}
      style={({ pressed }) => [styles.toggleRow, pressed && styles.pressed]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
    >
      <View style={styles.toggleCopy}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {subtitle ? <Text style={styles.toggleSubtitle}>{subtitle}</Text> : null}
      </View>
      <View style={[styles.toggleTrack, value && styles.toggleTrackActive]}>
        <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
      </View>
    </Pressable>
  );
};

export const CheckboxRow = ({
  label,
  checked,
  onPress,
}: {
  label: string;
  checked: boolean;
  onPress?: () => void;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.checkboxRow, pressed && styles.pressed]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={label}
    >
      <MaterialCommunityIcons
        name={checked ? "checkbox-marked" : "checkbox-blank-outline"}
        size={22}
        color={checked ? theme.colors.primary : theme.colors.textSecondary}
      />
      <Text style={styles.checkboxLabel}>{label}</Text>
    </Pressable>
  );
};

export const Badge = ({
  label,
  tone = "neutral",
}: {
  label: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "brand";
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  const tones = {
    neutral: {
      backgroundColor: theme.colors.badgeNeutral,
      color: theme.colors.textPrimary,
    },
    success: {
      backgroundColor: theme.colors.badgeVerified,
      color: theme.colors.white,
    },
    warning: {
      backgroundColor: theme.colors.warning,
      color: theme.colors.black,
    },
    danger: {
      backgroundColor: theme.colors.error,
      color: theme.colors.white,
    },
    brand: {
      backgroundColor: theme.colors.badgeNew,
      color: theme.colors.white,
    },
  }[tone];

  return (
    <View style={[styles.badge, { backgroundColor: tones.backgroundColor }]}>
      <Text style={[styles.badgeText, { color: tones.color }]}>{label}</Text>
    </View>
  );
};

export const RatingStars = ({ rating, count }: { rating: number; count?: number }) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <View style={styles.ratingWrap}>
      <MaterialIcons name="star" size={16} color={theme.colors.warning} />
      <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
      {typeof count === "number" ? <Text style={styles.ratingCount}>({count})</Text> : null}
    </View>
  );
};

export const StatCard = ({ label, value }: { label: string; value: string }) => {
  const styles = useUiStyles();

  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
};

export const EmptyState = ({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <Card style={styles.emptyState}>
      <MaterialCommunityIcons name="home-search-outline" size={46} color={theme.colors.textSecondary} />
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? <Text style={styles.emptyDescription}>{description}</Text> : null}
      {action}
    </Card>
  );
};

export const SkeletonBlock = ({
  width = "100%",
  height = 16,
  style,
}: {
  width?: DimensionValue;
  height?: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useUiStyles();
  return <View style={[styles.skeleton, { width, height }, style]} />;
};

export const Avatar = ({
  uri,
  size = 48,
  style,
}: {
  uri?: string;
  size?: number;
  style?: StyleProp<ImageStyle>;
}) => {
  const styles = useUiStyles();

  return uri ? (
    <Image
      source={{ uri }}
      style={[{ width: size, height: size, borderRadius: size / 2 }, style]}
      contentFit="cover"
    />
  ) : (
    <View
      style={[
        styles.avatarFallback,
        { width: size, height: size, borderRadius: size / 2 },
        style as StyleProp<ViewStyle>,
      ]}
    />
  );
};

const PropertyMeta = ({
  icon,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <View style={styles.propertyMetaItem}>
      <MaterialCommunityIcons name={icon} size={14} color={theme.colors.textSecondary} />
      <Text style={styles.propertyMetaText}>{label}</Text>
    </View>
  );
};

export const PropertyCard = memo(
  ({
    item,
    onPress,
    language = "en",
  }: {
    item: Property;
    onPress?: () => void;
    language?: keyof LocalizedText;
  }) => {
    const theme = useAppTheme();
    const styles = useUiStyles();
    const responsive = useResponsive();

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.propertyCard, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={item.title[language]}
      >
        <View style={styles.propertyMedia}>
          <Image
            source={{ uri: item.photos[0] }}
            style={[styles.propertyImage, { height: responsive.propertyImageHeight }]}
            contentFit="cover"
            transition={160}
          />
          <LinearGradient
            colors={["transparent", alpha(theme.colors.black, theme.mode === "dark" ? 0.32 : 0.2)]}
            style={styles.propertyImageScrim}
          />
          <View style={styles.propertyOverlayTop}>
            <View style={styles.propertyOverlayBadgeRow}>
              {item.isVerified ? <Badge label="Verified" tone="success" /> : null}
              <Badge label={PROPERTY_TYPE_LABELS[item.type]} tone="neutral" />
            </View>
            <GlassContainer variant="chip" style={{ borderRadius: radii.round }}>
              <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
                <MaterialCommunityIcons name="heart-outline" size={16} color={theme.colors.white} />
              </View>
            </GlassContainer>
          </View>
          <GlassContainer variant="overlay" style={styles.propertyOverlayInfo}>
            <View style={{ paddingHorizontal: spacing.md, paddingVertical: spacing.md, justifyContent: "center" }}>
              <Text style={styles.propertyOverlayPrice}>{formatCurrency(item.price, item.currency)}</Text>
              <Text style={styles.propertyOverlayCaption} numberOfLines={2}>
                {resolveDistrictLabel(item.district, language)} - {item.address}
              </Text>
            </View>
          </GlassContainer>
        </View>
        <View style={styles.propertyBody}>
          <Text style={styles.propertyTitle} numberOfLines={2}>
            {item.title[language]}
          </Text>
          <Text style={styles.propertyAddress} numberOfLines={2}>
            {item.description[language]}
          </Text>
          <View style={styles.propertyMetaRow}>
            {typeof item.bedrooms === "number" ? <PropertyMeta icon="bed-king-outline" label={`${item.bedrooms} bd`} /> : null}
            {typeof item.bathrooms === "number" ? <PropertyMeta icon="shower" label={`${item.bathrooms} ba`} /> : null}
            {typeof item.guestLimit === "number" ? <PropertyMeta icon="account-group-outline" label={`${item.guestLimit} guests`} /> : null}
          </View>
          <View style={styles.propertyFooter}>
            <RatingStars rating={item.rating} count={item.reviewCount} />
            <Text style={styles.propertyFooterText}>from {compactPrice(item.price)} / night</Text>
          </View>
        </View>
      </Pressable>
    );
  }
);

export const BookingCard = memo(
  ({
    id,
    title,
    status,
    subtitle,
    onPress,
  }: {
    id: string;
    title: string;
    status: string;
    subtitle: string;
    onPress?: () => void;
  }) => {
    const styles = useUiStyles();

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.bookingCard, pressed && styles.pressed]}
        accessibilityRole="button"
        accessibilityLabel={title}
      >
        <View style={styles.bookingTopRow}>
          <Text style={styles.bookingTitle}>{title}</Text>
          <Badge
            label={status}
            tone={status === "completed" ? "success" : status === "cancelled" ? "danger" : "brand"}
          />
        </View>
        <Text style={styles.bookingSubtitle}>{subtitle}</Text>
        <Text style={styles.bookingId}>#{id}</Text>
      </Pressable>
    );
  }
);

export const NotificationRow = memo(
  ({
    title,
    body,
    time,
    unread,
    onPress,
  }: {
    title: string;
    body: string;
    time: string;
    unread?: boolean;
    onPress?: () => void;
  }) => {
    const styles = useUiStyles();

    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={[styles.notificationRowCard, unread && styles.notificationUnread]}>
          <View style={styles.notificationDot} />
          <View style={styles.notificationTextWrap}>
            <Text style={styles.notificationTitle}>{title}</Text>
            <Text style={styles.notificationBody}>{body}</Text>
            <Text style={styles.notificationTime}>{time}</Text>
          </View>
        </View>
      </Pressable>
    );
  }
);

export const ConversationRow = memo(
  ({
    title,
    preview,
    time,
    unread,
    avatar,
    onPress,
  }: {
    title: string;
    preview: string;
    time: string;
    unread?: number;
    avatar?: string;
    onPress?: () => void;
  }) => {
    const styles = useUiStyles();

    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={title}
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        <View style={styles.conversationRowCard}>
          <Avatar uri={avatar} size={52} />
          <View style={styles.conversationCopy}>
            <View style={styles.conversationTopRow}>
              <Text style={styles.conversationTitle}>{title}</Text>
              <Text style={styles.conversationTime}>{time}</Text>
            </View>
            <Text numberOfLines={1} style={styles.conversationPreview}>
              {preview}
            </Text>
          </View>
          {unread ? (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadBadgeText}>{unread}</Text>
            </View>
          ) : null}
        </View>
      </Pressable>
    );
  }
);

export const MessageBubble = ({ text, mine }: { text: string; mine?: boolean }) => {
  const styles = useUiStyles();

  return (
    <View style={[styles.messageBubble, mine ? styles.messageMine : styles.messageTheirs]}>
      <Text style={[styles.messageText, mine && styles.messageTextMine]}>{text}</Text>
    </View>
  );
};

export const InfoRow = ({
  label,
  value,
  children,
  style,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) => {
  const styles = useUiStyles();

  return (
    <View style={[styles.infoRow, style]}>
      <Text style={styles.infoLabel}>{label}</Text>
      {children ?? <Text style={styles.infoValue}>{value}</Text>}
    </View>
  );
};

export const FilterChip = Pill;

export const StepIndicator = ({ steps, current }: { steps: string[]; current: number }) => {
  const styles = useUiStyles();

  return (
    <View style={styles.stepsWrap}>
      {steps.map((step, index) => (
        <View key={step} style={styles.stepItem}>
          <View style={[styles.stepTrack, index <= current && styles.stepTrackActive]} />
          <Text style={[styles.stepLabel, index === current && styles.stepLabelActive]}>{step}</Text>
        </View>
      ))}
    </View>
  );
};

export const GalleryStrip = ({ photos }: { photos: string[] }) => {
  const theme = useAppTheme();
  const styles = useUiStyles();
  const responsive = useResponsive();
  const [index, setIndex] = useState(0);

  const onMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(
      event.nativeEvent.contentOffset.x / Math.max(event.nativeEvent.layoutMeasurement.width, 1)
    );
    setIndex(nextIndex);
  };

  return (
    <View style={{ position: "relative" }}>
      <FlatList
        horizontal
        pagingEnabled
        data={photos}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.galleryWrap}
        onMomentumScrollEnd={onMomentumScrollEnd}
        renderItem={({ item }) => (
          <Image
            source={{ uri: item }}
            style={[
              styles.galleryImage,
              {
                width: responsive.galleryImageWidth,
                height: responsive.galleryImageHeight,
              },
            ]}
            contentFit="cover"
            transition={180}
          />
        )}
      />
      <GlassContainer variant="overlay" style={styles.galleryCountBadge}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 8 }}>
          <Text style={{ color: theme.colors.white, ...typography.caption }}>
            {index + 1}/{photos.length}
          </Text>
        </View>
      </GlassContainer>
      <View style={styles.galleryPagination}>
        {photos.map((photo, photoIndex) => (
          <View
            key={photo}
            style={[styles.galleryDot, photoIndex === index && styles.galleryDotActive]}
          />
        ))}
      </View>
    </View>
  );
};

export const ImageCarousel = GalleryStrip;

export const MapPreview = ({ title, subtitle }: { title: string; subtitle: string }) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <View style={styles.mapPreview}>
      <View style={styles.mapPreviewHeader}>
        <MaterialCommunityIcons name="map-marker-radius" size={22} color={theme.colors.primary} />
        <View style={{ flex: 1 }}>
          <Text style={styles.mapPreviewTitle}>{title}</Text>
          <Text style={styles.mapPreviewSubtitle}>{subtitle}</Text>
        </View>
      </View>
      <View style={styles.mapMock}>
        <Text style={styles.mapMockText}>Map preview</Text>
      </View>
    </View>
  );
};

export const AmenitiesGrid = ({
  amenities,
  language = "en",
}: {
  amenities: string[];
  language?: keyof LocalizedText;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <View style={styles.amenitiesGrid}>
      {amenities.map((amenity) => (
        <View key={amenity} style={styles.amenityChip}>
          <MaterialCommunityIcons name="check-circle-outline" size={16} color={theme.colors.primary} />
          <Text style={styles.amenityText}>{amenitiesMap[amenity]?.[language] ?? amenity}</Text>
        </View>
      ))}
    </View>
  );
};

export const BottomStickyBar = ({ children }: { children: React.ReactNode }) => {
  const styles = useUiStyles();

  return (
    <GlassContainer variant="navbar" style={styles.bottomStickyBar}>
      <View style={{ padding: spacing.sm }}>{children}</View>
    </GlassContainer>
  );
};

export const ContactCTA = ({
  price,
  caption,
  primaryLabel,
  onPrimaryPress,
  actions,
}: {
  price: string;
  caption: string;
  primaryLabel: string;
  onPrimaryPress?: () => void;
  actions?: Array<{
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    onPress?: () => void;
  }>;
}) => {
  const theme = useAppTheme();
  const styles = useUiStyles();

  return (
    <View style={styles.contactCta}>
      <View style={styles.contactHeader}>
        <View style={{ flex: 1 }}>
          <Text style={styles.contactPrice}>{price}</Text>
          <Text style={styles.contactCaption}>{caption}</Text>
        </View>
        <PrimaryButton label={primaryLabel} onPress={onPrimaryPress} style={{ width: 164 }} />
      </View>
      {actions?.length ? (
        <View style={styles.contactActions}>
          {actions.map((action) => (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              style={({ pressed }) => [styles.contactActionButton, pressed && styles.pressed]}
              accessibilityRole="button"
              accessibilityLabel={action.label}
            >
              <MaterialCommunityIcons name={action.icon} size={18} color={theme.colors.textPrimary} />
              <Text style={styles.contactActionLabel}>{action.label}</Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
};
