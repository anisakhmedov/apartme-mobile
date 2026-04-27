import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { BookingScreen } from "@/screens/BookingScreen";
import { PaymentScreen } from "@/screens/PaymentScreen";
import { BookingSuccessScreen } from "@/screens/BookingSuccessScreen";
import { useAppTheme } from "@/theme";

const Stack = createNativeStackNavigator();

export function BookingModalStack() {
  const theme = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
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
