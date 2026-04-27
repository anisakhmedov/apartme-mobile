import React, { useState, useMemo } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import Slider from "@react-native-community/slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors, spacing } from "@/theme";
import {
  SearchBar,
  PropertyCard,
  Pill,
  Card,
  Section,
  PrimaryButton,
  ScreenScroll,
} from "@/components/ui";
import { useGetPropertiesQuery } from "@/services/api";
import { properties as mockProperties } from "@/data/mockData";
import { categories } from "@/data/mockData";
import { useItemLanguage } from "./index";
import MapView, { Marker, PROVIDER_GOOGLE } from "@/components/map";
import { useResponsive } from "@/components/ui";

type ViewMode = "list" | "map";

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [price, setPrice] = useState(900000);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { data = mockProperties } = useGetPropertiesQuery();
  const language = useItemLanguage();
  const responsive = useResponsive();

  const filteredData = useMemo(() => {
    let result = data;
    if (selectedCategory) {
      result = result.filter((p) => p.type === selectedCategory);
    }
    result = result.filter((p) => p.price <= price);
    return result;
  }, [data, selectedCategory, price]);

  const handleReset = () => {
    setPrice(900000);
    setSelectedCategory(null);
  };

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.header}>
        <SearchBar
          placeholder="Поиск жилья в Самарканде"
          onPress={() => {
            // Already on search screen
          }}
          autoFocus
        />
        
        {/* View Mode Toggle */}
        <View style={styles.toggleContainer}>
          <Pill
            label="Список"
            active={viewMode === "list"}
            onPress={() => setViewMode("list")}
          />
          <Pill
            label="На карте"
            active={viewMode === "map"}
            onPress={() => setViewMode("map")}
          />
        </View>

        {/* Category Filters */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories as unknown as string[]}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Pill
              label={item}
              active={selectedCategory === item}
              onPress={() =>
                setSelectedCategory(selectedCategory === item ? null : item)
              }
            />
          )}
          contentContainerStyle={styles.categoriesList}
        />
      </Animated.View>

      {viewMode === "map" ? (
        <Animated.View entering={FadeIn.duration(300)} style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={[styles.map, { height: responsive.mapHeight }]}
            initialRegion={{
              latitude: 39.6547,
              longitude: 66.9758,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          >
            {filteredData.map((property) => (
              <Marker
                key={property.id}
                coordinate={property.coords}
                title={property.title[language]}
                description={`${property.price.toLocaleString()} ${property.currency}`}
                onPress={() =>
                  navigation.navigate("PropertyDetail", { id: property.id })
                }
              />
            ))}
          </MapView>
        </Animated.View>
      ) : (
        <Animated.View entering={FadeIn.duration(300)} style={styles.listContainer}>
          {/* Price Range */}
          <Card style={styles.priceCard}>
            <Text style={styles.priceTitle}>Цена за ночь</Text>
            <Slider
              minimumValue={0}
              maximumValue={2000000}
              minimumTrackTintColor={colors.primary}
              maximumTrackTintColor={colors.border}
              thumbTintColor={colors.primaryDark}
              value={price}
              onValueChange={setPrice}
            />
            <Text style={styles.priceValue}>
              до {price.toLocaleString()} UZS
            </Text>
          </Card>

          {/* Results Count */}
          <Text style={styles.resultsCount}>
            Найдено: {filteredData.length} вариантов
          </Text>

          {/* Property List */}
          {filteredData.map((property, index) => (
            <Animated.View
              key={property.id}
              entering={FadeIn.delay(index * 50).duration(400)}
              style={styles.cardContainer}
            >
              <PropertyCard
                item={property}
                language={language}
                onPress={() =>
                  navigation.navigate("PropertyDetail", { id: property.id })
                }
              />
            </Animated.View>
          ))}
        </Animated.View>
      )}

      {/* Reset Filters */}
      {(selectedCategory || price !== 900000) && (
        <Animated.View
          entering={FadeIn.duration(200)}
          style={styles.resetButton}
        >
          <PrimaryButton
            label="Сбросить фильтры"
            onPress={handleReset}
            style={styles.resetButtonInner}
          />
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    gap: spacing.md,
  },
  toggleContainer: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  categoriesList: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  listContainer: {
    flex: 1,
    padding: spacing.md,
  },
  priceCard: {
    marginBottom: spacing.md,
  },
  priceTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  priceValue: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
  },
  resultsCount: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
  resetButton: {
    position: "absolute",
    bottom: 24,
    left: 16,
    right: 16,
  },
  resetButtonInner: {
    // Override default styles
  },
});
