import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { AddEditListingScreen, BookingRequestsScreen, HostDashboardScreen, MyListingsScreen } from "../screens/index.tsx";

const Stack = createNativeStackNavigator();

export function HostStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HostDashboard" component={HostDashboardScreen} options={{ title: "Host Dashboard" }} />
      <Stack.Screen name="MyListings" component={MyListingsScreen} options={{ title: "My Listings" }} />
      <Stack.Screen name="AddEditListing" component={AddEditListingScreen} options={{ title: "Add / Edit Listing" }} />
      <Stack.Screen name="BookingRequests" component={BookingRequestsScreen} options={{ title: "Requests" }} />
    </Stack.Navigator>
  );
}
