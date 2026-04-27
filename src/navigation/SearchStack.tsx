import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { SearchScreen } from "@/screens/SearchScreen";
import { ListingsScreen } from "@/screens/ListingsScreen";
import { PropertyDetailScreen } from "@/screens/PropertyDetailScreen";
import { MapScreen } from "@/screens/MapScreen";
import { colors } from "@/theme";

const Stack = createNativeStackNavigator();

export function SearchStack() {
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
      <Stack.Screen name="Search" component={SearchScreen} />
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
        name="MapView" 
        component={MapScreen}
        options={{
          presentation: "fullScreenModal",
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}
