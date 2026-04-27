import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { MyBookingsScreen } from "@/screens/MyBookingsScreen";
import { BookingDetailScreen } from "@/screens/BookingDetailScreen";
import { WriteReviewScreen } from "@/screens/WriteReviewScreen";
import { CancelBookingScreen } from "@/screens/CancelBookingScreen";
import { useAppTheme } from "@/theme";

const Stack = createNativeStackNavigator();

export function BookingsStack() {
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
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
    </Stack.Navigator>
  );
}
