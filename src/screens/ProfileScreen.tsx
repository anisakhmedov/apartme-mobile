import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { useTranslation } from "react-i18next";

import { users } from "@/data/mockData";
import { logout } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store"; // Removed unused import of `colors`
import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from "@/theme";
import { Avatar, Badge, GlassContainer, IconButton, ScreenScroll, StatCard } from "@/components/ui";

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // Kept theme.colors.background
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    ambientTop: {
      position: "absolute",
      top: -110,
      right: -70, // Kept theme.colors.ambientTop
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: "absolute",
      left: -100,
      bottom: -140, // Kept theme.colors.ambientBottom
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: theme.colors.ambientBottom,
    },
    scrollContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl, // Kept spacing.xxxl
    },
    profilePanel: {
      borderRadius: 28,
      marginBottom: spacing.xl, // Kept spacing.xl
    },
    profileContent: {
      padding: spacing.lg, // Kept spacing.lg
      gap: spacing.md, // Kept spacing.md
    },
    profileTopRow: { // Kept spacing.md
      flexDirection: "row",
      alignItems: "flex-start",
      gap: spacing.md,
    },
    profileCopy: {
      flex: 1,
      minWidth: 0,
    },
    name: { // Kept theme.colors.textPrimary
      ...typography.heading,
      color: theme.colors.textPrimary,
    },
    email: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 4,
    },
    bio: {
      ...typography.body,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      marginTop: 10,
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.sm, // Kept spacing.sm
      marginBottom: spacing.xl, // Kept spacing.xl
    },
    sectionTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary,
      marginBottom: spacing.md,
    }, // Kept theme.colors.surface
    menuCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: 24,
      borderWidth: 1,
      borderColor: theme.colors.border, // Kept theme.colors.border
      overflow: "hidden",
      marginBottom: spacing.lg,
      ...theme.elevation.card,
    },
    menuItem: {
      minHeight: 58,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md, // Kept spacing.md
      flexDirection: "row", // Kept spacing.md
      alignItems: "center",
      justifyContent: "space-between",
      gap: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border, // Kept theme.colors.border
    },
    menuItemLeft: {
      flexDirection: "row",
      alignItems: "center", // Kept spacing.md
      gap: spacing.md,
      flex: 1,
    },
    menuIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.colors.surfaceSecondary,
    },
    menuLabel: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary,
    },
    menuHint: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    hostPanel: {
      borderRadius: 24,
      marginBottom: spacing.lg,
    },
    hostContent: {
      padding: spacing.lg,
      gap: spacing.md,
    },
    hostHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: spacing.md,
    },
    hostTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary,
    },
    hostSubtitle: {
      ...typography.body,
      color: theme.colors.textSecondary,
      marginTop: 6,
    },
    hostActions: {
      flexDirection: "row",
      gap: spacing.sm,
    },
    hostAction: {
      flex: 1,
      minHeight: 48,
      borderRadius: 16,
      alignItems: "center",
      justifyContent: "center",
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
      backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.08 : 0.54),
    },
    hostActionPrimary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    hostActionText: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary,
    },
    hostActionTextPrimary: {
      color: theme.colors.white,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

function MenuItem({
  icon,
  label,
  hint,
  onPress,
  danger,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  hint: string;
  onPress: () => void;
  danger?: boolean;
}) {
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.menuItem, pressed && { opacity: 0.94 }]}>
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconWrap}>
          <MaterialCommunityIcons name={icon} size={20} color={danger ? theme.colors.error : theme.colors.textPrimary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.menuLabel, danger && { color: theme.colors.error }]}>{label}</Text>
          <Text style={styles.menuHint}>{hint}</Text>
        </View>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={20} color={theme.colors.textSecondary} />
    </Pressable>
  );
}

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const { t } = useTranslation("profile");
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const tabBarHeight = useBottomTabBarHeight();
  const user = useAppSelector((state: any) => state.auth.user) || users[1];
  const isHost = useAppSelector((state: any) => state.auth.user?.isHost ?? true);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    dispatch(logout());
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
        <Animated.View entering={FadeInDown.duration(theme.motion.standard)}>
          <GlassContainer variant="panel" style={styles.profilePanel}>
            <View style={styles.profileContent}>
              <View style={styles.profileTopRow}>
                <Avatar uri={user.avatar} size={74} />
                <View style={styles.profileCopy}>
                  <Text style={styles.name}>{user.name}</Text>
                  <Text style={styles.email}>{user.email}</Text>
                  <Text style={styles.bio}>{user.bio ?? "Traveler account with saved searches, favorites, and verified contact details."}</Text>
                </View>
                <IconButton
                  icon="edit"
                  label={t("editProfile")}
                  onPress={() => navigation.navigate("EditProfile")}
                />
              </View>
              <Badge label="Verified account" tone="success" />
            </View>
          </GlassContainer>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(70).duration(theme.motion.standard)} style={styles.statsRow}>
          <StatCard label={t("bookingsCount")} value="12" />
          <StatCard label={t("reviewsGiven")} value="8" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(120).duration(theme.motion.standard)}>
          <Text style={styles.sectionTitle}>Account</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="book-multiple-outline"
              label={t("myBookings")}
              hint="Upcoming stays, confirmations, and receipts"
              onPress={() => navigation.getParent()?.navigate("BookingsTab", { screen: "MyBookings" })}
            />
            <MenuItem
              icon="heart-outline"
              label={t("wishlist")}
              hint="Saved homes for later comparison"
              onPress={() => navigation.navigate("Wishlist")}
            />
            <MenuItem
              icon="credit-card-outline"
              label={t("paymentMethods")}
              hint="Cards and one-tap payment preferences"
              onPress={() => navigation.navigate("Settings")}
            />
            <MenuItem
              icon="star-outline"
              label={t("reviews")}
              hint="Given and received reviews"
              onPress={() => navigation.navigate("MyReviews")}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(180).duration(theme.motion.standard)}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.menuCard}>
            <MenuItem
              icon="cog-outline"
              label={t("settings")}
              hint="Theme, notifications, language, and security"
              onPress={() => navigation.navigate("Settings")}
            />
            <MenuItem
              icon="help-circle-outline"
              label={t("help")}
              hint="Support, booking questions, and app guidance"
              onPress={() => navigation.navigate("Help")}
            />
            <MenuItem
              icon="logout"
              label={t("logout")}
              hint="Sign out of this device"
              onPress={handleLogout}
              danger
            />
          </View>
        </Animated.View>

        {isHost ? (
          <Animated.View entering={FadeInUp.delay(240).duration(theme.motion.standard)}>
            <Text style={styles.sectionTitle}>{t("hostMode")}</Text>
            <GlassContainer variant="accent" style={styles.hostPanel}>
              <View style={styles.hostContent}>
                <View style={styles.hostHeader}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.hostTitle}>{t("hostDashboard")}</Text>
                    <Text style={styles.hostSubtitle}>
                      Revenue, requests, occupancy, and listings stay one tap away.
                    </Text>
                  </View>
                  <Badge label="Host" tone="brand" />
                </View>
                <View style={styles.hostActions}>
                  <Pressable
                    onPress={() => navigation.navigate("HostDashboard")}
                    style={({ pressed }) => [styles.hostAction, styles.hostActionPrimary, pressed && { opacity: 0.94 }]}
                  >
                    <Text style={[styles.hostActionText, styles.hostActionTextPrimary]}>{t("hostDashboard")}</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => navigation.navigate("MyListings")}
                    style={({ pressed }) => [styles.hostAction, pressed && { opacity: 0.94 }]}
                  >
                    <Text style={styles.hostActionText}>{t("myListings")}</Text>
                  </Pressable>
                </View>
              </View>
            </GlassContainer>
          </Animated.View>
        ) : null}
      </ScreenScroll>
    </View>
  );
}
