import React, { useEffect } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";

import { AuthStack } from "@/navigation/AuthStack";
import { MainTabs } from "@/navigation/MainTabs";
import { BookingModalStack } from "@/navigation/BookingModalStack";
import { linking } from "@/navigation/linking";
import { useAppDispatch, useAppSelector } from "@/store";
import { bootstrapAuth } from "@/store/authSlice";
import { bootstrapPreferences } from "@/store/preferencesSlice";
import { colors } from "@/theme";
import { SplashScreen } from "@/screens/SplashScreen";
import { OnboardingScreen } from "@/screens/OnboardingScreen";

const RootStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function AppDrawer() {
  return (
    <Drawer.Navigator screenOptions={{ headerShown: false }}>
      <Drawer.Screen name="Main" component={MainTabs} options={{ title: "Explore" }} />
      <Drawer.Screen name="BookingFlow" component={BookingStack} options={{ title: "Bookings" }} />
      <Drawer.Screen name="ProfileFlow" component={ProfileStack} options={{ title: "Profile" }} />
      <Drawer.Screen name="HostFlow" component={HostStack} options={{ title: "Host" }} />
    </Drawer.Navigator>
  );
}

export function AppNavigator() {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const hydrated = useAppSelector((state) => state.auth.hydrated && state.preferences.hydrated);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(bootstrapAuth());
    dispatch(bootstrapPreferences());
  }, [dispatch]);

  return (
    <NavigationContainer linking={linking as any} theme={{ ...DefaultTheme, colors: { ...DefaultTheme.colors, background: colors.background, card: colors.surface, primary: colors.primary, text: colors.textPrimary, border: colors.border, notification: colors.primary } }}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!hydrated ? (
          <RootStack.Screen name="Splash" component={SplashScreen} />
        ) : isLoggedIn ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen 
              name="BookingModal" 
              component={BookingModalStack}
              options={{ 
                presentation: "modal",
                animation: "slide_from_bottom"
              }} 
            />
            <RootStack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
