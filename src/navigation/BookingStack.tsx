import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { BookingConfirmationScreen, BookingDetailScreen, BookingScreen, PaymentScreen } from "@/screens";

const Stack = createNativeStackNavigator();

export function BookingStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Booking" component={BookingScreen} options={{ title: "Booking" }} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: "Payment" }} />
      <Stack.Screen name="BookingConfirmation" component={BookingConfirmationScreen} options={{ title: "Confirmed" }} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} options={{ title: "Booking Details" }} />
    </Stack.Navigator>
  );
}
