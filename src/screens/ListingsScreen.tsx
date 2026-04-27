import React, { useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";

import { colors, spacing } from "@/theme";
import { PropertyCard, ScreenScroll } from "@/components/ui";
import { useGetPropertiesQuery } from "@/services/api";
import { properties as mockProperties } from "@/data/mockData";
import { useItemLanguage } from "./index";

export function ListingsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const category = route.params?.category;
  const language = useItemLanguage();

  const { data = mockProperties } = useGetPropertiesQuery();
  
  const filteredProperties = useMemo(() => {
    if (!category) return data;
    return data.filter((p) => p.type === category);
  }, [data, category]);

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        {filteredProperties.map((property, index) => (
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
    paddingHorizontal: spacing.md,
  },
});
