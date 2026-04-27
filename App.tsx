import "react-native-gesture-handler";
import React, { useEffect, useMemo, useRef } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import i18next, { supportedLanguages } from "@/i18n";
import { persistPreferences } from "@/store/preferencesSlice";
import { store, useAppDispatch, useAppSelector } from "@/store";
import { AppNavigator } from "@/navigation";
import { useAppTheme } from "@/theme";

function AppRuntimeBridge() {
  const dispatch = useAppDispatch();
  const theme = useAppTheme();
  const preferences = useAppSelector((state) => state.preferences);
  const lastPersisted = useRef("");

  const persistedPreferences = useMemo(
    () => ({
      language: supportedLanguages.includes(preferences.language) ? preferences.language : "ru",
      currency: preferences.currency,
      darkMode: preferences.darkMode,
      pushBookings: preferences.pushBookings,
      pushMessages: preferences.pushMessages,
      pushPromotions: preferences.pushPromotions,
      biometric: preferences.biometric,
    }),
    [
      preferences.biometric,
      preferences.currency,
      preferences.darkMode,
      preferences.language,
      preferences.pushBookings,
      preferences.pushMessages,
      preferences.pushPromotions,
    ]
  );

  useEffect(() => {
    if (!preferences.hydrated) {
      return;
    }

    i18next.changeLanguage(persistedPreferences.language);
  }, [persistedPreferences.language, preferences.hydrated]);

  useEffect(() => {
    if (!preferences.hydrated) {
      return;
    }

    const next = JSON.stringify(persistedPreferences);
    if (next === lastPersisted.current) {
      return;
    }

    lastPersisted.current = next;
    dispatch(persistPreferences(persistedPreferences));
  }, [dispatch, persistedPreferences, preferences.hydrated]);

  return <StatusBar barStyle={theme.mode === "dark" ? "light-content" : "dark-content"} />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppRuntimeBridge />
          <AppNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
