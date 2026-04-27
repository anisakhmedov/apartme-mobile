import React, { useEffect } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HomeStack } from "@/navigation/HomeStack";
import { SearchStack } from "@/navigation/SearchStack";
import { BookingsStack } from "@/navigation/BookingsStack";
import { ChatStack } from "@/navigation/ChatStack";
import { ProfileStack } from "@/navigation/ProfileStack";
import { colors } from "@/theme";
import * as Haptics from "expo-haptics";
import { useAppSelector } from "@/store";

const Tab = createBottomTabNavigator();

export function MainTabs() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const unreadCount = useAppSelector((state: any) => {
    // Mock: return 3 for demo
    return 3;
  });
  const bookingCount = useAppSelector((state: any) => {
    // Mock: return 2 for demo
    return 2;
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: colors.surface,
          borderTopWidth: 0.5,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: "#9E9E9E",
        tabBarLabelStyle: ({ focused }) => ({
          fontSize: 11,
          fontWeight: focused ? "600" : "400",
          marginBottom: 4,
        }),
        tabBarIcon: ({ color, size, focused }) => {
          const icons: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
            HomeTab: focused ? "home" : "home-outline",
            SearchTab: focused ? "map-search" : "map-search-outline",
            BookingsTab: focused ? "calendar-check" : "calendar-check-outline",
            ChatTab: focused ? "chat" : "chat-outline",
            ProfileTab: focused ? "account" : "account-outline",
          };
          return (
            <View style={styles.iconContainer}>
              {/* Notification badge */}
              {(route.name === "ChatTab" && unreadCount > 0) || 
               (route.name === "BookingsTab" && bookingCount > 0) ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {route.name === "ChatTab" ? unreadCount : bookingCount}
                  </Text>
                </View>
              ) : null}
              
              {/* Red dot for active tab */}
              {focused && <View style={styles.activeDot} />}
              
              <MaterialCommunityIcons 
                name={icons[route.name] ?? "circle-outline"} 
                size={size} 
                color={color} 
              />
            </View>
          );
        },
        // Fade animation between tabs (NO slide)
        tabBarHideOnKeyboard: true,
      })}
      sceneContainerStyle={{ backgroundColor: colors.background }}
      screenListeners={{
        tabPress: (e) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        },
      }}
    >
      <Tab.Screen 
        name="HomeTab" 
        component={HomeStack} 
        options={{ title: "Главная" }}
      />
      <Tab.Screen 
        name="SearchTab" 
        component={SearchStack} 
        options={{ title: "Поиск" }}
      />
      <Tab.Screen 
        name="BookingsTab" 
        component={BookingsStack} 
        options={{ title: "Бронирования" }}
      />
      <Tab.Screen 
        name="ChatTab" 
        component={ChatStack} 
        options={{ title: "Сообщения" }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack} 
        options={{ title: "Профиль" }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    width: 24,
    height: 24,
  },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    zIndex: 1,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "700",
  },
  activeDot: {
    position: "absolute",
    top: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
});
