import "react-native-gesture-handler";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { store } from "@/store";
import { AppNavigator } from "@/navigation";
import "@/i18n";

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <AppNavigator />
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}