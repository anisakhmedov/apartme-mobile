import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { InboxScreen } from "@/screens/InboxScreen";
import { ChatThreadScreen } from "@/screens/ChatThreadScreen";
import { useAppTheme } from "@/theme";

const Stack = createNativeStackNavigator();

export function ChatStack() {
  const theme = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "slide_from_right",
        animationDuration: 280,
      }}
    >
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
    </Stack.Navigator>
  );
}
