import React, { useEffect } from "react";
import { DarkTheme, DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AuthStack } from "@/navigation/AuthStack";
import { BookingModalStack } from "@/navigation/BookingModalStack";
import { MainTabs } from "@/navigation/MainTabs";
import { linking } from "@/navigation/linking";
import { SplashScreen } from "@/screens/SplashScreen";
import { bootstrapAuth } from "@/store/authSlice";
import { bootstrapPreferences } from "@/store/preferencesSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { useAppTheme } from "@/theme";

const RootStack = createNativeStackNavigator();

export function AppNavigator() {
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const hydrated = useAppSelector((state) => state.auth.hydrated && state.preferences.hydrated);
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    dispatch(bootstrapAuth());
    dispatch(bootstrapPreferences());
  }, [dispatch]);

  return (
    <NavigationContainer
      linking={linking as any}
      theme={{
        ...(theme.mode === "dark" ? DarkTheme : DefaultTheme),
        colors: theme.navigation.colors,
      }}
    >
      <RootStack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        {!hydrated ? (
          <RootStack.Screen name="Splash" component={SplashScreen} />
        ) : isLoggedIn ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen
              name="BookingModal"
              component={BookingModalStack}
              options={{ presentation: "modal", animation: "slide_from_bottom" }}
            />
          </>
        ) : (
          <RootStack.Screen name="Auth" component={AuthStack} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
