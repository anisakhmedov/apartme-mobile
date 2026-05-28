import React, { useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import Animated, { FadeIn } from "react-native-reanimated";

import { colors, spacing, typography } from "@/theme";
import { PropertyCard, PropertyCardSkeleton, ScreenScroll } from "@/components/ui";
import { useGetPropertiesQuery } from "@/services/api";
import { properties as mockProperties } from "@/data/mockData";
import { useItemLanguage } from "./index";

export function ListingsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const category = route.params?.category;
  const language = useItemLanguage();
  const tabBarHeight = useBottomTabBarHeight();

  const { data = [], isLoading } = useGetPropertiesQuery();
  
  const filteredProperties = useMemo(() => {
    if (!category) return data;
    return data.filter((p) => p.type === category);
  }, [data, category]);

  return (
    <ScreenScroll contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + spacing.xl }]}>
      <Animated.View entering={FadeIn.duration(400)}>
        {isLoading
          ? Array(5).fill(0).map((_, index) => <View key={`skeleton-list-${index}`} style={styles.cardContainer}><PropertyCardSkeleton /></View>)
          : filteredProperties.map((property, index) => (
              <Animated.View
                key={property.id}
                entering={FadeIn.delay(index * 100).duration(400)}
                style={styles.cardContainer}
              >
                <PropertyCard
                  item={property}
                  language={language}
                  onPress={() => navigation.navigate("PropertyDetail", { id: property.id })}
                />
              </Animated.View>
            ))}
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  cardContainer: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md, // Kept spacing.md
  }, // Kept spacing.md
});
