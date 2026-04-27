import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { MyBookingsScreen } from "@/screens/MyBookingsScreen";
import { BookingDetailScreen } from "@/screens/BookingDetailScreen";
import { WriteReviewScreen } from "@/screens/WriteReviewScreen";
import { CancelBookingScreen } from "@/screens/CancelBookingScreen";
import { colors } from "@/theme";

const Stack = createNativeStackNavigator();

export function BookingsStack() {
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
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
      <Stack.Screen name="CancelBooking" component={CancelBookingScreen} />
    </Stack.Navigator>
  );
}
