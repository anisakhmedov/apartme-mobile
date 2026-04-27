import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { HomeScreen } from "@/screens/HomeScreen";
import { ListingsScreen } from "@/screens/ListingsScreen";
import { PropertyDetailScreen } from "@/screens/PropertyDetailScreen";
import { HostPublicProfileScreen } from "@/screens/HostPublicProfileScreen";
import { useAppTheme } from "@/theme";

const Stack = createNativeStackNavigator();

export function HomeStack() {
  const theme = useAppTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: "fade",
        animationDuration: 150,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Listings" component={ListingsScreen} />
      <Stack.Screen 
        name="PropertyDetail" 
        component={PropertyDetailScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 280,
        }}
      />
      <Stack.Screen 
        name="HostPublicProfile" 
        component={HostPublicProfileScreen}
        options={{
          animation: "slide_from_right",
          animationDuration: 280,
        }}
      />
    </Stack.Navigator>
  );
}
