import React from "react";
import { Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { BottomTabBarProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useTranslation } from "react-i18next";
import Animated, { useAnimatedStyle, withSpring, withTiming } from "react-native-reanimated";

import { BookingsStack } from "@/navigation/BookingsStack";
import { ChatStack } from "@/navigation/ChatStack";
import { HomeStack } from "@/navigation/HomeStack";
import { ProfileStack } from "@/navigation/ProfileStack";
import { SearchStack } from "@/navigation/SearchStack";
import { alpha, AppTheme, darkTheme, lightTheme, radii, spacing, typography, useAppTheme } from "@/theme";
import { useAppSelector } from "@/store";

const Tab = createBottomTabNavigator();

/**
 * Утилита для определения, нужно ли скрыть таббар на основе вложенной навигации
 */
const getFocusedRouteName = (route: any): string | undefined => {
  const state = route.state;
  if (state?.routes && typeof state.index === 'number') {
    const focusedRoute = state.routes[state.index];
    return focusedRoute.name;
  }
  return route.params?.screen;
};

const rootTabRoutes: Record<string, string> = {
  HomeTab: "Home",
  SearchTab: "Search",
  BookingsTab: "MyBookings",
  ChatTab: "Inbox",
  ProfileTab: "Profile",
};

function CustomTabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const { width } = useWindowDimensions();
  const unreadCount = useAppSelector(() => 3);
  const bookingCount = useAppSelector(() => 2);

  // Расчет позиции индикатора
  const tabWidth = (width - 32) / state.routes.length;
  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      { 
        translateX: withSpring(state.index * tabWidth + tabWidth / 2 - 2, { damping: 15 }) 
      }
    ],
  }));

  // Проверка: находимся ли мы на корневом экране стека
  const currentRoute = state.routes[state.index];
  const focusedChild = getFocusedRouteName(currentRoute);
  const isRoot = !focusedChild || focusedChild === rootTabRoutes[currentRoute.name];

  if (!isRoot) return null;

  // Получаем состояние видимости из опций текущего экрана
  const focusedOptions = descriptors[currentRoute.key].options;
  const isVisible = (focusedOptions as any).tabBarVisible !== false;

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: withSpring(isVisible ? 0 : 100, { damping: 20, stiffness: 90 }) }
    ],
    opacity: withTiming(isVisible ? 1 : 0, { duration: 200 }),
  }));

  return (
    <Animated.View style={[styles.tabBarContainer, { bottom: Math.max(insets.bottom, 16) }, animatedContainerStyle]}>
      <View style={styles.background} />
      <Animated.View style={[styles.activeDot, indicatorStyle]} />
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            navigation.navigate(route.name);
          }
        };

        return (
          <TabItem
            key={route.key}
            route={route}
            isFocused={isFocused}
            onPress={onPress}
            label={options.title ?? route.name}
            unreadCount={route.name === "ChatTab" ? unreadCount : route.name === "BookingsTab" ? bookingCount : 0}
          />
        );
      })}
    </Animated.View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    badge: {
      position: "absolute",
      top: -4,
      right: -6,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      backgroundColor: theme.colors.badgeNew,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 4,
      zIndex: 1,
      borderWidth: 1,
      borderColor: theme.colors.surface,
    },
    badgeText: {
      ...typography.micro,
      color: theme.colors.white,
    },
    activeDot: {
      position: "absolute",
      top: 10,
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.primary,
      zIndex: 10,
    },
    tabBarContainer: {
      flexDirection: "row",
      height: 64,
      position: "absolute",
      left: 16,
      right: 16,
      borderRadius: radii.card,
      zIndex: 100,
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.elevation.floating,
    },
    background: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: theme.colors.surface,
      borderRadius: radii.card,
    },
    tabItem: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingTop: 8,
    },
    tabLabel: {
      ...typography.micro,
      fontSize: 10,
      marginTop: 4,
      fontWeight: "600",
    },
    iconWrapper: {
      width: 40,
      height: 24,
      alignItems: "center",
      justifyContent: "center",
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

function TabItem({ route, isFocused, onPress, label, unreadCount }: any) {
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;

  const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
    HomeTab: isFocused ? "home-variant" : "home-variant-outline",
    SearchTab: isFocused ? "compass" : "compass-outline",
    BookingsTab: isFocused ? "calendar-star" : "calendar-blank-outline",
    ChatTab: isFocused ? "chat-processing" : "chat-processing-outline",
    ProfileTab: isFocused ? "account-circle" : "account-circle-outline",
  };

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <View style={styles.iconWrapper}>
        <MaterialCommunityIcons
          name={icons[route.name]}
          size={24}
          color={isFocused ? theme.colors.primary : theme.colors.textSecondary}
        />
        {unreadCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        )}
      </View>
      <Text style={[styles.tabLabel, { color: isFocused ? theme.colors.primary : theme.colors.textSecondary }]}>
        {label}
      </Text>
    </Pressable>
  );
}

export function MainTabs() {
  const { t } = useTranslation("home");

  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: t("tabHome") }} />
      <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: t("tabSearch") }} />
      <Tab.Screen name="BookingsTab" component={BookingsStack} options={{ title: t("tabBookings") }} />
      <Tab.Screen name="ChatTab" component={ChatStack} options={{ title: t("tabMessages") }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: t("tabProfile") }} />
    </Tab.Navigator>
  );
}
