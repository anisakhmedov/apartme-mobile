import React, { memo, useMemo } from "react";
import { ActivityIndicator, Dimensions, FlatList, ImageStyle, Pressable, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextInputProps, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

import { amenitiesMap } from "@/data/mockData";
import { colors, radii, spacing, shadow, typography } from "@/theme";
import { CurrencyCode, LocalizedText, Property } from "@/types/models";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const useResponsive = () => {
  return useMemo(() => {
    const scale = SCREEN_WIDTH / 375;
    const verticalScale = SCREEN_HEIGHT / 812;
    return {
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
      scale,
      verticalScale,
      isSmallDevice: SCREEN_WIDTH < 375,
      isMediumDevice: SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414,
      isLargeDevice: SCREEN_WIDTH >= 414,
      horizontalPadding: Math.max(spacing.md, spacing.md * scale),
      propertyImageHeight: 190 * verticalScale,
      galleryImageHeight: 180 * verticalScale,
      galleryImageWidth: 260 * scale,
      mapHeight: 280 * verticalScale,
    };
  }, []);
};

export const formatCurrency = (value: number, currency: CurrencyCode) => {
  const symbol = currency === "UZS" ? "so'm" : currency;
  return `${new Intl.NumberFormat("en-US").format(value)} ${symbol}`;
};

export const useLocalizedText = (text: LocalizedText | undefined, language: keyof LocalizedText = "ru") => {
  if (!text) {
    return "";
  }

  return text[language] ?? text.ru;
};

export const AppScreen = ({ children, style }: { children: React.ReactNode; style?: StyleProp<any> }) => (
  <SafeAreaView style={[styles.screen, style]}>
    {children}
  </SafeAreaView>
);

export const ScreenScroll = ({ children }: { children: React.ReactNode }) => (
  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
    {children}
  </ScrollView>
);

export const Section = ({ title, subtitle, action, children }: { title: string; subtitle?: string; action?: React.ReactNode; children: React.ReactNode }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeadingBlock}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action}
    </View>
    <View>{children}</View>
  </View>
);

export const Card = ({ children, style }: { children: React.ReactNode; style?: StyleProp<any> }) => (
  <View style={[styles.card, style]}>{children}</View>
);

export const GradientCard = ({ children, colors: gradientColors }: { children: React.ReactNode; colors: [string, string] }) => (
  <LinearGradient colors={gradientColors} style={styles.gradientCard}>
    {children}
  </LinearGradient>
);

export const Pill = ({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) => (
  <Pressable onPress={onPress} style={[styles.pill, active && styles.pillActive]} accessibilityRole="button" accessibilityLabel={label}>
    <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
  </Pressable>
);

export const IconButton = ({ icon, onPress, label }: { icon: keyof typeof MaterialIcons.glyphMap; onPress?: () => void; label: string }) => (
  <Pressable onPress={onPress} style={styles.iconButton} accessibilityRole="button" accessibilityLabel={label}>
    <MaterialIcons name={icon} size={20} color={colors.charcoal} />
  </Pressable>
);

export const PrimaryButton = ({ label, onPress, loading, icon }: { label: string; onPress?: () => void; loading?: boolean; icon?: keyof typeof MaterialCommunityIcons.glyphMap }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.primaryButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={label}>
    <LinearGradient colors={[colors.primary, colors.primaryDark]} style={styles.primaryButtonGradient}>
      {loading ? <ActivityIndicator color={colors.white} /> : icon ? <MaterialCommunityIcons name={icon} size={18} color={colors.white} /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </LinearGradient>
  </Pressable>
);

export const SecondaryButton = ({ label, onPress }: { label: string; onPress?: () => void }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.secondaryButton, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={label}>
    <Text style={styles.secondaryButtonText}>{label}</Text>
  </Pressable>
);

export const TextField = (props: TextInputProps & { label?: string }) => (
  <View style={styles.fieldWrap}>
    {!!props.label && <Text style={styles.fieldLabel}>{props.label}</Text>}
    <TextInput
      {...props}
      placeholderTextColor={colors.muted}
      style={[styles.field, props.style]}
    />
  </View>
);

export const ToggleRow = ({ label, value, onToggle, subtitle }: { label: string; value: boolean; onToggle: () => void; subtitle?: string }) => (
  <Pressable onPress={onToggle} style={styles.toggleRow} accessibilityRole="switch" accessibilityState={{ checked: value }} accessibilityLabel={label}>
    <View style={styles.toggleCopy}>
      <Text style={styles.toggleLabel}>{label}</Text>
      {!!subtitle && <Text style={styles.toggleSubtitle}>{subtitle}</Text>}
    </View>
    <View style={[styles.toggleTrack, value && styles.toggleTrackActive]}>
      <View style={[styles.toggleThumb, value && styles.toggleThumbActive]} />
    </View>
  </Pressable>
);

export const CheckboxRow = ({ label, checked, onPress }: { label: string; checked: boolean; onPress?: () => void }) => (
  <Pressable onPress={onPress} style={styles.checkboxRow} accessibilityRole="checkbox" accessibilityState={{ checked }} accessibilityLabel={label}>
    <MaterialCommunityIcons name={checked ? "checkbox-marked" : "checkbox-blank-outline"} size={22} color={checked ? colors.primary : colors.muted} />
    <Text style={styles.checkboxLabel}>{label}</Text>
  </Pressable>
);

export const Badge = ({ label, tone = "neutral" }: { label: string; tone?: "neutral" | "success" | "warning" | "danger" }) => (
  <View style={[styles.badge, toneStyles[tone]]}>
    <Text style={styles.badgeText}>{label}</Text>
  </View>
);

export const RatingStars = ({ rating, count }: { rating: number; count?: number }) => (
  <View style={styles.ratingWrap}>
    <MaterialIcons name="star" size={16} color={colors.primary} />
    <Text style={styles.ratingText}>{rating.toFixed(1)}</Text>
    {typeof count === "number" && <Text style={styles.ratingCount}>({count})</Text>}
  </View>
);

export const StatCard = ({ label, value }: { label: string; value: string }) => (
  <Card style={styles.statCard}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </Card>
);

export const EmptyState = ({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) => (
  <Card style={styles.emptyState}>
    <MaterialCommunityIcons name="home-search-outline" size={48} color={colors.muted} />
    <Text style={styles.emptyTitle}>{title}</Text>
    {!!description && <Text style={styles.emptyDescription}>{description}</Text>}
    {action}
  </Card>
);

export const SkeletonBlock = ({ width = "100%", height = 16, style }: { width?: number | string; height?: number; style?: StyleProp<any> }) => (
  <View style={[styles.skeleton, { width, height }, style]} />
);

export const Avatar = ({ uri, size = 48, style }: { uri?: string; size?: number; style?: StyleProp<ImageStyle> }) => (
  uri ? <Image source={{ uri }} style={[{ width: size, height: size, borderRadius: size / 2 }, style]} contentFit="cover" /> : <View style={[styles.avatarFallback, { width: size, height: size, borderRadius: size / 2 }, style]} />
);

export const PropertyCard = memo(({ item, onPress, language = "ru" }: { item: Property; onPress?: () => void; language?: keyof LocalizedText }) => {
  const responsive = useResponsive();
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.propertyCard, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={item.title[language]}>
      <Image source={{ uri: item.photos[0] }} style={[styles.propertyImage, { height: responsive.propertyImageHeight }]} contentFit="cover" transition={150} />
      <View style={styles.propertyBody}>
        <View style={styles.propertyHeaderRow}>
          <Text numberOfLines={2} style={styles.propertyTitle}>{item.title[language]}</Text>
          {item.isVerified && <MaterialCommunityIcons name="check-decagram" size={18} color={colors.primary} />}
        </View>
        <Text numberOfLines={1} style={styles.propertyAddress}>{item.address}</Text>
        <View style={styles.propertyMetaRow}>
          <RatingStars rating={item.rating} count={item.reviewCount} />
          <Badge label={item.district} tone="neutral" />
        </View>
        <Text style={styles.propertyPrice}>{formatCurrency(item.price, item.currency)} / night</Text>
      </View>
    </Pressable>
  );
});

export const BookingCard = memo(({ id, title, status, subtitle, onPress }: { id: string; title: string; status: string; subtitle: string; onPress?: () => void }) => (
  <Pressable onPress={onPress} style={({ pressed }) => [styles.bookingCard, pressed && styles.pressed]} accessibilityRole="button" accessibilityLabel={title}>
    <View style={styles.bookingTopRow}>
      <Text style={styles.bookingTitle}>{title}</Text>
      <Badge label={status} tone={status === "completed" ? "success" : status === "cancelled" ? "danger" : "warning"} />
    </View>
    <Text style={styles.bookingSubtitle}>{subtitle}</Text>
    <Text style={styles.bookingId}>#{id}</Text>
  </Pressable>
));

export const NotificationRow = memo(({ title, body, time, unread }: { title: string; body: string; time: string; unread?: boolean }) => (
  <Card style={[styles.notificationRow, unread && styles.notificationUnread]}>
    <View style={styles.notificationDot} />
    <View style={styles.notificationTextWrap}>
      <Text style={styles.notificationTitle}>{title}</Text>
      <Text style={styles.notificationBody}>{body}</Text>
      <Text style={styles.notificationTime}>{time}</Text>
    </View>
  </Card>
));

export const ConversationRow = memo(({ title, preview, time, unread, avatar }: { title: string; preview: string; time: string; unread?: number; avatar?: string }) => (
  <Card style={styles.conversationRow}>
    <Avatar uri={avatar} size={52} />
    <View style={styles.conversationCopy}>
      <View style={styles.conversationTopRow}>
        <Text style={styles.conversationTitle}>{title}</Text>
        <Text style={styles.conversationTime}>{time}</Text>
      </View>
      <Text numberOfLines={1} style={styles.conversationPreview}>{preview}</Text>
    </View>
    {!!unread && <View style={styles.unreadBadge}><Text style={styles.unreadBadgeText}>{unread}</Text></View>}
  </Card>
));

export const MessageBubble = ({ text, mine }: { text: string; mine?: boolean }) => (
  <View style={[styles.messageBubble, mine ? styles.messageMine : styles.messageTheirs]}>
    <Text style={[styles.messageText, mine && styles.messageTextMine]}>{text}</Text>
  </View>
);

export const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export const FilterChip = Pill;

export const StepIndicator = ({ steps, current }: { steps: string[]; current: number }) => (
  <View style={styles.stepsWrap}>
    {steps.map((step, index) => (
      <View key={step} style={styles.stepItem}>
        <View style={[styles.stepDot, index <= current && styles.stepDotActive]} />
        <Text style={[styles.stepLabel, index === current && styles.stepLabelActive]}>{step}</Text>
      </View>
    ))}
  </View>
);

export const GalleryStrip = ({ photos }: { photos: string[] }) => {
  const responsive = useResponsive();
  return (
    <FlatList
      horizontal
      data={photos}
      keyExtractor={(item) => item}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.galleryWrap}
      renderItem={({ item }) => <Image source={{ uri: item }} style={[styles.galleryImage, { height: responsive.galleryImageHeight, width: responsive.galleryImageWidth }]} contentFit="cover" />}
    />
  );
};

export const MapPreview = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <Card style={styles.mapPreview}>
    <View style={styles.mapPreviewHeader}>
      <MaterialCommunityIcons name="map-marker-radius" size={22} color={colors.primary} />
      <View style={{ flex: 1 }}>
        <Text style={styles.mapPreviewTitle}>{title}</Text>
        <Text style={styles.mapPreviewSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <View style={styles.mapMock}>
      <Text style={styles.mapMockText}>Google Maps</Text>
    </View>
  </Card>
);

export const AmenitiesGrid = ({ amenities, language = "ru" }: { amenities: string[]; language?: keyof LocalizedText }) => (
  <View style={styles.amenitiesGrid}>
    {amenities.map((amenity) => (
      <View key={amenity} style={styles.amenityChip}>
        <MaterialCommunityIcons name="check-circle-outline" size={16} color={colors.primary} />
        <Text style={styles.amenityText}>{amenitiesMap[amenity]?.[language] ?? amenity}</Text>
      </View>
    ))}
  </View>
);

export const BottomStickyBar = ({ children }: { children: React.ReactNode }) => <View style={styles.bottomStickyBar}>{children}</View>;

const toneStyles = StyleSheet.create({
  neutral: { backgroundColor: colors.primaryLight },
  success: { backgroundColor: "#E5F5F1" },
  warning: { backgroundColor: "#FBF1DB" },
  danger: { backgroundColor: "#FCE9E4" }
});

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scrollContent: { padding: spacing.md, paddingBottom: spacing.xl },
  section: { marginBottom: spacing.xl },
  sectionHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", marginBottom: spacing.md, flexWrap: "wrap" },
  sectionHeadingBlock: { flex: 1, paddingRight: spacing.md },
  sectionTitle: { ...typography.heading, color: colors.charcoal },
  sectionSubtitle: { ...typography.body, color: colors.muted, marginTop: 4 },
  card: { backgroundColor: colors.white, borderRadius: radii.card, padding: spacing.md, ...shadow },
  gradientCard: { borderRadius: radii.card, padding: spacing.md },
  pill: { paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, marginRight: spacing.sm, marginBottom: spacing.sm },
  pillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  pillText: { ...typography.body, color: colors.charcoal, fontWeight: "600" },
  pillTextActive: { color: colors.white },
  iconButton: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border },
  primaryButton: { borderRadius: radii.pill, overflow: "hidden", width: "100%" },
  primaryButtonGradient: { minHeight: 52, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 10, paddingHorizontal: spacing.lg },
  primaryButtonText: { color: colors.white, fontWeight: "700", fontSize: 16 },
  secondaryButton: { minHeight: 52, borderRadius: radii.pill, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg, borderWidth: 1, borderColor: colors.border, width: "100%" },
  secondaryButtonText: { color: colors.charcoal, fontWeight: "700" },
  pressed: { opacity: 0.82, transform: [{ scale: 0.99 }] },
  fieldWrap: { marginBottom: spacing.md },
  fieldLabel: { ...typography.caption, color: colors.muted, marginBottom: spacing.xs, fontWeight: "600" },
  field: { minHeight: 52, borderRadius: radii.card, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, color: colors.charcoal, ...typography.body },
  toggleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, flexWrap: "wrap" },
  toggleCopy: { flex: 1, paddingRight: spacing.md },
  toggleLabel: { ...typography.subheading, color: colors.charcoal },
  toggleSubtitle: { ...typography.caption, color: colors.muted, marginTop: 2 },
  toggleTrack: { width: 52, height: 30, borderRadius: 15, backgroundColor: "#D6D2CA", padding: 3 },
  toggleTrackActive: { backgroundColor: colors.primary },
  toggleThumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.white },
  toggleThumbActive: { alignSelf: "flex-end" },
  checkboxRow: { flexDirection: "row", alignItems: "center", paddingVertical: spacing.xs, flexWrap: "wrap" },
  checkboxLabel: { marginLeft: spacing.sm, ...typography.body, color: colors.charcoal, flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: radii.pill },
  badgeText: { fontSize: 12, color: colors.charcoal, fontWeight: "700", textTransform: "capitalize" },
  ratingWrap: { flexDirection: "row", alignItems: "center", gap: 4, flexWrap: "wrap" },
  ratingText: { fontWeight: "700", color: colors.charcoal },
  ratingCount: { color: colors.muted, fontSize: 12 },
  statCard: { flex: 1, marginRight: spacing.sm, alignItems: "center", minWidth: 0 },
  statValue: { fontSize: 20, fontWeight: "800", color: colors.primary },
  statLabel: { ...typography.caption, color: colors.muted, marginTop: 4, textAlign: "center" },
  emptyState: { alignItems: "center", justifyContent: "center", gap: spacing.sm, paddingVertical: spacing.xl },
  emptyTitle: { ...typography.heading, color: colors.charcoal, textAlign: "center" },
  emptyDescription: { ...typography.body, color: colors.muted, textAlign: "center" },
  skeleton: { backgroundColor: colors.primaryLight, borderRadius: 8 },
  avatarFallback: { backgroundColor: colors.primaryLight },
  propertyCard: { backgroundColor: colors.white, borderRadius: radii.card, overflow: "hidden", marginBottom: spacing.md, ...shadow, width: "100%" },
  propertyImage: { width: "100%", height: 190, resizeMode: "cover" },
  propertyBody: { padding: spacing.md },
  propertyHeaderRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.sm, flexWrap: "wrap" },
  propertyTitle: { ...typography.subheading, color: colors.charcoal, flex: 1, minWidth: 0 },
  propertyAddress: { ...typography.caption, color: colors.muted, marginTop: 4 },
  propertyMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: spacing.sm, flexWrap: "wrap" },
  propertyPrice: { marginTop: spacing.sm, fontSize: 16, fontWeight: "800", color: colors.primary },
  bookingCard: { backgroundColor: colors.white, borderRadius: radii.card, padding: spacing.md, marginBottom: spacing.md, ...shadow, width: "100%" },
  bookingTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" },
  bookingTitle: { ...typography.subheading, color: colors.charcoal, flex: 1, paddingRight: spacing.sm, minWidth: 0 },
  bookingSubtitle: { ...typography.body, color: colors.muted, marginTop: spacing.xs },
  bookingId: { ...typography.caption, color: colors.muted, marginTop: spacing.xs },
  notificationRow: { flexDirection: "row", alignItems: "flex-start", gap: spacing.sm, marginBottom: spacing.md, flexWrap: "wrap" },
  notificationUnread: { borderWidth: 1, borderColor: colors.primary },
  notificationDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary, marginTop: 6 },
  notificationTextWrap: { flex: 1, minWidth: 0 },
  notificationTitle: { ...typography.subheading, color: colors.charcoal },
  notificationBody: { ...typography.body, color: colors.muted, marginTop: 4 },
  notificationTime: { ...typography.caption, color: colors.muted, marginTop: spacing.xs },
  conversationRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md, flexWrap: "wrap" },
  conversationCopy: { flex: 1, minWidth: 0 },
  conversationTopRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" },
  conversationTitle: { ...typography.subheading, color: colors.charcoal, flex: 1, minWidth: 0 },
  conversationTime: { ...typography.caption, color: colors.muted },
  conversationPreview: { ...typography.body, color: colors.muted, marginTop: 4 },
  unreadBadge: { minWidth: 22, height: 22, borderRadius: 11, paddingHorizontal: 6, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  unreadBadgeText: { fontSize: 11, fontWeight: "800", color: colors.white },
  messageBubble: { maxWidth: "84%", padding: spacing.md, borderRadius: radii.card, marginBottom: spacing.sm },
  messageMine: { backgroundColor: colors.primary, alignSelf: "flex-end" },
  messageTheirs: { backgroundColor: colors.white, alignSelf: "flex-start", borderWidth: 1, borderColor: colors.border },
  messageText: { ...typography.body, color: colors.charcoal },
  messageTextMine: { color: colors.white },
  infoRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: spacing.xs, borderBottomWidth: 1, borderBottomColor: colors.border, flexWrap: "wrap" },
  infoLabel: { ...typography.body, color: colors.muted, flex: 1 },
  infoValue: { ...typography.body, color: colors.charcoal, fontWeight: "700", flex: 1, textAlign: "right" },
  stepsWrap: { flexDirection: "row", justifyContent: "space-between", marginBottom: spacing.md, flexWrap: "wrap" },
  stepItem: { flex: 1, alignItems: "center", minWidth: 0 },
  stepDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#D6D2CA", marginBottom: 6 },
  stepDotActive: { backgroundColor: colors.primary },
  stepLabel: { ...typography.caption, color: colors.muted, textAlign: "center" },
  stepLabelActive: { color: colors.charcoal, fontWeight: "700" },
  galleryWrap: { gap: spacing.sm, paddingRight: spacing.md },
  galleryImage: { width: 260, height: 180, borderRadius: radii.card },
  mapPreview: { padding: spacing.md },
  mapPreviewHeader: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.md },
  mapPreviewTitle: { ...typography.subheading, color: colors.charcoal },
  mapPreviewSubtitle: { ...typography.caption, color: colors.muted, marginTop: 2 },
  mapMock: { height: 180, borderRadius: radii.card, backgroundColor: colors.primaryLight, alignItems: "center", justifyContent: "center" },
  mapMockText: { color: colors.primary, fontWeight: "800" },
  amenitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  amenityChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.pill, backgroundColor: colors.primaryLight },
  amenityText: { ...typography.caption, color: colors.charcoal, fontWeight: "600" },
  bottomStickyBar: { position: "absolute", left: 0, right: 0, bottom: 0, padding: spacing.md, backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.border, ...shadow }
});
