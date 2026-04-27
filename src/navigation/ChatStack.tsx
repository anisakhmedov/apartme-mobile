import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { InboxScreen } from "@/screens/InboxScreen";
import { ChatThreadScreen } from "@/screens/ChatThreadScreen";
import { colors } from "@/theme";

const Stack = createNativeStackNavigator();

export function ChatStack() {
  const navigation = useNavigation();

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("tabPress", () => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: "slide_from_right",
        animationDuration: 280,
      }}
    >
      <Stack.Screen name="Inbox" component={InboxScreen} />
      <Stack.Screen name="ChatThread" component={ChatThreadScreen} />
    </Stack.Navigator>
  );
}
