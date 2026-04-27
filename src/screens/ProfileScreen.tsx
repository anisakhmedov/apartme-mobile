import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { useNavigation, useNavigationParent } from "@react-navigation/native";
import Animated, { FadeIn, FadeInDown, FadeInUp } from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import { colors, spacing } from "@/theme";
import {
  Avatar,
  StatCard,
  Pill,
  PrimaryButton,
  Section,
  ScreenScroll,
} from "@/components/ui";
import { useAppSelector, useAppDispatch } from "@/store";
import { users } from "@/data/mockData";
import { logout } from "@/store/authSlice";

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const parentNavigation = useNavigationParent();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: any) => state.auth.user) || users[1];
  const isHost = useAppSelector((state: any) => state.auth.user?.isHost ?? true);

  const handleLogout = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    dispatch(logout());
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)} style={styles.header}>
        <Avatar uri={user.avatar} size={72} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>
        <Animated.View entering={FadeIn.duration(400).delay(200)}>
          <Pill
            label="Редактировать"
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              parentNavigation?.navigate("ProfileFlow", { screen: "EditProfile" });
            }}
            icon="pencil"
          />
        </Animated.View>
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(100)} style={styles.statsRow}>
        <StatCard label="Бронирований" value="12" />
        <StatCard label="Отзывов" value="8" />
        <StatCard label="Избранное" value="5" />
      </Animated.View>

      <Animated.View entering={FadeInUp.duration(400).delay(200)}>
        <Section title="Меню">
          <View style={styles.menuContainer}>
            <MenuItem
              icon="book-multiple"
              label="Мои бронирования"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                parentNavigation?.navigate("BookingFlow", { screen: "MyBookings" });
              }}
            />
            <MenuItem
              icon="heart-outline"
              label="Избранное"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                parentNavigation?.navigate("ProfileFlow", { screen: "Wishlist" });
              }}
            />
            <MenuItem
              icon="credit-card-outline"
              label="Способы оплаты"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            />
            <MenuItem
              icon="star-outline"
              label="Мои отзывы"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                parentNavigation?.navigate("ProfileFlow", { screen: "MyReviews" });
              }}
            />
            <MenuItem
              icon="cog-outline"
              label="Настройки"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                parentNavigation?.navigate("ProfileFlow", { screen: "Settings" });
              }}
            />
            <MenuItem
              icon="help-circle-outline"
              label="Помощь"
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                parentNavigation?.navigate("ProfileFlow", { screen: "Help" });
              }}
            />
          </View>
        </Section>
      </Animated.View>

      {isHost && (
        <Animated.View entering={FadeInUp.duration(400).delay(300)}>
          <Section title="Хостинг">
            <View style={styles.hostCard}>
              <Text style={styles.hostModeTitle}>Режим хоста</Text>
              <PrimaryButton
                label="Панель управления"
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                  parentNavigation?.navigate("HostFlow");
                }}
              />
            </View>
          </Section>
        </Animated.View>
      )}

      <Animated.View entering={FadeInUp.duration(400).delay(400)} style={styles.logoutContainer}>
        <MenuItem
          icon="logout"
          label="Выйти"
          onPress={handleLogout}
          danger
        />
      </Animated.View>
    </ScreenScroll>
  );
}

function MenuItem({
  icon,
  label,
  onPress,
  danger,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  danger?: boolean;
}) {
  return (
    <Pressable onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuItemLeft}>
        <MaterialCommunityIcons
          name={icon}
          size={20}
          color={danger ? colors.error : colors.textPrimary}
        />
        <Text style={[styles.menuItemLabel, danger && { color: colors.error }]}>
          {label}
        </Text>
      </View>
      <MaterialCommunityIcons
        name="chevron-right"
        size={20}
        color={colors.textSecondary}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    padding: spacing.lg,
    backgroundColor: colors.surface,
    marginBottom: spacing.lg,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 15,
    color: colors.textSecondary,
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  menuContainer: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    overflow: "hidden",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  menuItemLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: "400",
  },
  hostCard: {
    padding: spacing.md,
    gap: spacing.md,
  },
  hostModeTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textPrimary,
  },
  logoutContainer: {
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
});
