import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";

import { BookingsStack } from "@/navigation/BookingsStack";
import { ChatStack } from "@/navigation/ChatStack";
import { HomeStack } from "@/navigation/HomeStack";
import { ProfileStack } from "@/navigation/ProfileStack";
import { SearchStack } from "@/navigation/SearchStack";
import { alpha, AppTheme, darkTheme, lightTheme, typography, useAppTheme } from "@/theme";
import { useAppSelector } from "@/store";

const Tab = createBottomTabNavigator();

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    iconContainer: {
      alignItems: "center",
      justifyContent: "center",
      position: "relative",
      width: 28,
      height: 28,
    },
    badge: {
      position: "absolute",
      top: -6,
      right: -8,
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
      top: -4,
      width: 7,
      height: 7,
      borderRadius: 3.5,
      backgroundColor: theme.colors.primary,
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

const rootTabRoutes: Record<string, string> = {
  HomeTab: "Home",
  SearchTab: "Search",
  BookingsTab: "MyBookings",
  ChatTab: "Inbox",
  ProfileTab: "Profile",
};

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = theme.mode === "dark" ? darkStyles : lightStyles;
  const unreadCount = useAppSelector(() => 3);
  const bookingCount = useAppSelector(() => 2);

  const getFocusedChildRouteName = (route: any) => {
    const state = route.state as { index?: number; routes?: Array<{ name: string }> } | undefined;

    if (state?.routes?.length) {
      return state.routes[state.index ?? state.routes.length - 1]?.name;
    }

    const screenParam = route.params?.screen;
    if (typeof screenParam === "string") {
      return screenParam;
    }

    return rootTabRoutes[route.name];
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: (() => {
          const focusedRouteName = getFocusedChildRouteName(route);
          const shouldHideTabBar =
            Boolean(focusedRouteName) && focusedRouteName !== rootTabRoutes[route.name];

          if (shouldHideTabBar) {
            return { display: "none" };
          }

          return {
            height: 68 + insets.bottom,
            paddingBottom: insets.bottom + 8,
            paddingTop: 8,
            backgroundColor: alpha(theme.colors.surface, theme.mode === "dark" ? 0.9 : 0.82),
            borderTopWidth: 1,
            borderTopColor: theme.colors.glassBorderStrong,
            position: "absolute",
            left: 12,
            right: 12,
            bottom: 12,
            borderRadius: 26,
            zIndex: 30,
            shadowColor: theme.colors.black,
            shadowOpacity: theme.mode === "dark" ? 0.35 : 0.12,
            shadowRadius: 18,
            shadowOffset: { width: 0, height: 10 },
            elevation: 12,
          };
        })(),
        headerShown: false,
        sceneStyle: {
          paddingTop: insets.top,
          backgroundColor: theme.colors.background,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 2,
          fontWeight: "600",
        },
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
            HomeTab: focused ? "home-variant" : "home-variant-outline",
            SearchTab: focused ? "compass" : "compass-outline",
            BookingsTab: focused ? "calendar-star" : "calendar-blank-outline",
            ChatTab: focused ? "chat-processing" : "chat-processing-outline",
            ProfileTab: focused ? "account-circle" : "account-circle-outline",
          };

          return (
            <View style={styles.iconContainer}>
              {(route.name === "ChatTab" && unreadCount > 0) ||
              (route.name === "BookingsTab" && bookingCount > 0) ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {route.name === "ChatTab" ? unreadCount : bookingCount}
                  </Text>
                </View>
              ) : null}
              {focused ? <View style={styles.activeDot} /> : null}
              <MaterialCommunityIcons name={icons[route.name] ?? "circle-outline"} size={size} color={color} />
            </View>
          );
        },
        tabBarHideOnKeyboard: true,
      })}
      screenListeners={{
        tabPress: () => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: "Главная" }} />
      <Tab.Screen name="SearchTab" component={SearchStack} options={{ title: "Поиск" }} />
      <Tab.Screen name="BookingsTab" component={BookingsStack} options={{ title: "Брони" }} />
      <Tab.Screen name="ChatTab" component={ChatStack} options={{ title: "Сообщения" }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: "Профиль" }} />
    </Tab.Navigator>
  );
}
