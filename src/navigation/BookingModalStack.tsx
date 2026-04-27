import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { BookingScreen } from "@/screens/BookingScreen";
import { PaymentScreen } from "@/screens/PaymentScreen";
import { BookingSuccessScreen } from "@/screens/BookingSuccessScreen";
import { colors } from "@/theme";

const Stack = createNativeStackNavigator();

export function BookingModalStack() {
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
        presentation: "modal",
        animation: "slide_from_bottom",
        animationDuration: 320,
      }}
    >
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen 
        name="BookingSuccess" 
        component={BookingSuccessScreen}
        options={{
          presentation: "fullScreenModal",
          animation: "fade",
          animationDuration: 400,
        }}
      />
    </Stack.Navigator>
  );
}
