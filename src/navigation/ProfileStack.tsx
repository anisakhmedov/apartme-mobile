import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { ProfileScreen } from "@/screens/ProfileScreen";
import { EditProfileScreen } from "@/screens/EditProfileScreen";
import { WishlistScreen } from "@/screens/WishlistScreen";
import { SettingsScreen } from "@/screens/SettingsScreen";
import { NotificationsScreen } from "@/screens/NotificationsScreen";
import { VerificationScreen } from "@/screens/VerificationScreen";
import { HostDashboardScreen } from "@/screens/HostDashboardScreen";
import { MyListingsScreen } from "@/screens/MyListingsScreen";
import { AddEditListingScreen } from "@/screens/AddEditListingScreen";
import { BookingRequestsScreen } from "@/screens/BookingRequestsScreen";
import { MyReviewsScreen } from "@/screens/MyReviewsScreen";
import { HelpScreen } from "@/screens/HelpScreen";
import { useAppTheme } from "@/theme";

const Stack = createNativeStackNavigator();

export function ProfileStack() {
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
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="Wishlist" component={WishlistScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="Verification" component={VerificationScreen} />
      <Stack.Screen name="HostDashboard" component={HostDashboardScreen} />
      <Stack.Screen name="MyListings" component={MyListingsScreen} />
      <Stack.Screen name="AddEditListing" component={AddEditListingScreen} />
      <Stack.Screen name="BookingRequests" component={BookingRequestsScreen} />
      <Stack.Screen name="MyReviews" component={MyReviewsScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
    </Stack.Navigator>
  );
}
