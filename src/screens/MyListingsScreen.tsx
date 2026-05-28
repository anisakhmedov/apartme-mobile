import React from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeInDown } from "react-native-reanimated";

import { colors, spacing, typography } from "@/theme";
import { PropertyCard, PrimaryButton, ScreenScroll } from "@/components/ui";
import { properties } from "@/data/mockData";
import { useItemLanguage } from "./index";

export function MyListingsScreen() {
  const navigation = useNavigation<any>();
  const language = useItemLanguage();
  const hostProperties = properties; // Mock: all properties for demo

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeInDown.duration(400)}>
        <View style={styles.header}>
          <Animated.Text style={styles.title}>Мои обьекты</Animated.Text>
          <Animated.Text style={styles.subtitle}>
            Управляйте своими обьектами аренды
          </Animated.Text>
        </View>
      </Animated.View>

      {hostProperties.map((property, index) => (
        <Animated.View
          key={property.id}
          entering={FadeIn.delay(index * 100).duration(400)}
          style={styles.cardContainer}
        >
          <PropertyCard
            item={property}
            language={language}
            onPress={() => {
              // Navigate to edit listing
              navigation.navigate("AddEditListing", { id: property.id });
            }}
          />
        </Animated.View>
      ))}

      <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.buttonContainer}>
        <PrimaryButton
          label="Добавить обьект"
          onPress={() => {
            navigation.navigate("AddEditListing");
          }}
        />
      </Animated.View>
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.md,
    marginBottom: spacing.md, // Kept colors.textPrimary
  }, // Kept colors.textPrimary
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 8,
  }, // Kept colors.textSecondary
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  cardContainer: {
    marginBottom: spacing.md, // Kept spacing.md
    paddingHorizontal: spacing.md, // Kept spacing.md
  }, // Kept spacing.md
  buttonContainer: {
    padding: spacing.md,
  },
});
