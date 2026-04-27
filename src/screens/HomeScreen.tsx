import React, { useMemo, useState } from "react";
import { View, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, {
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import { MaterialIcons } from "@expo/vector-icons";

import { colors, spacing } from "@/theme";
import {
  PropertyCard,
  Section,
  ScreenScroll,
  Pill,
  IconButton,
  SearchBar,
  PrimaryButton,
  SkeletonBlock,
} from "@/components/ui";
import { useGetPropertiesQuery } from "@/services/api";
import { properties as mockProperties } from "@/data/mockData";
import { categories } from "@/data/mockData";

const languageOptions = ["ru", "en", "uz"] as const;
const categories = ["apartments", "houses", "rooms", "guesthouses", "daily"] as const;

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation("home");
  const [refreshing, setRefreshing] = useState(false);
  const { data = mockProperties, refetch } = useGetPropertiesQuery();
  const nearby = useMemo(() => data.slice(0, 3), [data]);
  const language = useItemLanguage();

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={nearby}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeInDown.delay(index * 100).duration(400)}
            style={styles.cardContainer}
          >
            <PropertyCard
              item={item}
              language={language}
              onPress={() =>
                navigation.navigate("PropertyDetail", { id: item.id })
              }
            />
          </Animated.View>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Top Bar */}
            <Animated.View
              entering={FadeInUp.duration(400)}
              style={styles.topBar}
            >
              <View>
                <Text style={styles.brandName}>SamarkandRent</Text>
                <Text style={styles.greeting}>{t("welcome")}</Text>
              </View>
              <IconButton
                icon="notifications-none"
                label={t("notifications")}
                onPress={() =>
                  navigation.getParent()?.navigate("ProfileFlow", {
                    screen: "Notifications",
                  })
                }
                badge={3} // Mock notification count
              />
            </Animated.View>

            {/* Search Bar */}
            <Animated.View
              entering={FadeInUp.duration(400).delay(100)}
              style={styles.searchContainer}
            >
              <SearchBar
                onPress={() => navigation.navigate("SearchTab")}
                placeholder={t("searchPlaceholder")}
              />
            </Animated.View>

            {/* Categories */}
            <Animated.View
              entering={SlideInRight.duration(400).delay(200)}
            >
              <Section title={t("categories")}>
                <FlatList
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  data={categories as unknown as string[]}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <Pill label={t(item)} onPress={() => {
                      navigation.navigate("Listings", { category: item });
                    }} />
                  )}
                  contentContainerStyle={styles.categoriesList}
                />
              </Section>
            </Animated.View>

            {/* Featured Listings */}
            <Animated.View entering={FadeInUp.duration(400).delay(300)}>
              <Section
                title={t("featuredListings")}
                action={
                  <Text
                    style={styles.seeAll}
                    onPress={() => navigation.navigate("Listings")}
                  >
                    {t("seeAll")}
                  </Text>
                }
              >
                {data.slice(0, 2).map((property, index) => (
                  <Animated.View
                    key={property.id}
                    entering={FadeInDown.delay(index * 150).duration(400)}
                  >
                    <PropertyCard
                      item={property}
                      language={language}
                      onPress={() =>
                        navigation.navigate("PropertyDetail", {
                          id: property.id,
                        })
                      }
                    />
                  </Animated.View>
                ))}
              </Section>
            </Animated.View>

            {/* Popular in Samarkand */}
            <Animated.View entering={FadeInUp.duration(400).delay(400)}>
              <Section title={t("popularInSamarkand")}>
                <View style={styles.bannerRow}>
                  <BannerCard
                    title={t("registanPromo")}
                    colors={[colors.primary, colors.primaryDark]}
                    icon="map-marker-radius"
                  />
                  <BannerCard
                    title={t("oldCityPromo")}
                    colors={["#2D2D2D", colors.primary]}
                    icon="city"
                  />
                  <BannerCard
                    title={t("newSamarkandPromo")}
                    colors={[colors.primaryDark, colors.background]}
                    icon="home-city"
                    darkText
                  />
                </View>
              </Section>
            </Animated.View>

            {/* Nearby Listings Skeleton */}
            <Animated.View entering={FadeInUp.duration(400).delay(500)}>
              <Section title={t("nearbyListings")}>
                <SkeletonBlock width="100%" height={120} />
              </Section>
            </Animated.View>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

function BannerCard({
  title,
  colors,
  icon,
  darkText,
}: {
  title: string;
  colors: string[];
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  darkText?: boolean;
}) {
  return (
    <Animated.View entering={FadeInDown.duration(400).delay(300)}>
      <GradientCard colors={colors as [string, string]} style={styles.bannerCard}>
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={darkText ? colors.textPrimary : colors.white}
        />
        <Text
          style={[
            styles.bannerTitle,
            darkText && { color: colors.textPrimary },
          ]}
        >
          {title}
        </Text>
      </GradientCard>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    padding: spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  brandName: {
    fontSize: 18,
    fontWeight: "800",
    color: colors.primary,
    letterSpacing: 0.5,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "500",
    color: colors.textPrimary,
    marginTop: 4,
  },
  searchContainer: {
    marginBottom: spacing.lg,
  },
  categoriesList: {
    gap: spacing.sm,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },
  bannerRow: {
    gap: spacing.md,
  },
  bannerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: spacing.sm,
  },
  bannerTitle: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 16,
    marginTop: 8,
  },
  cardContainer: {
    paddingHorizontal: spacing.md,
    marginBottom: spacing.md,
  },
});
