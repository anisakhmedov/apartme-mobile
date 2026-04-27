import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, spacing } from "@/theme";
import { PropertyCard, Section, ScreenScroll } from "@/components/ui";
import { properties } from "@/data/mockData";
import { useItemLanguage } from "./index";

export function WishlistScreen() {
  const navigation = useNavigation<any>();
  const language = useItemLanguage();
  const wishlistItems = properties.slice(0, 3); // Mock wishlist

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        <Section title="Избранное" subtitle="Ваши сохранённые варианты">
          {wishlistItems.length > 0 ? (
            wishlistItems.map((property, index) => (
              <Animated.View
                key={property.id}
                entering={FadeInDown.delay(index * 100).duration(400)}
                style={styles.cardContainer}
              >
                <PropertyCard
                  item={property}
                  language={language}
                  onPress={() => navigation.navigate("PropertyDetail", { id: property.id })}
                />
              </Animated.View>
            ))
          ) : (
            <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
              <Animated.Text style={styles.emptyText}>
                Список избранного пуст
              </Animated.Text>
            </Animated.View>
          )}
        </Section>
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  cardContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 15,
    color: colors.textSecondary,
  },
});
