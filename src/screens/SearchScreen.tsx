import React, { startTransition, useDeferredValue, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import Slider from '@react-native-community/slider';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';

import { properties as mockProperties } from '@/data/mockData';
import { useGetPropertiesQuery } from '@/services/api'; // Removed unused import of `colors`
import { alpha, AppTheme, darkTheme, lightTheme, spacing, typography, useAppTheme } from '@/theme';
import {
  BottomSheet,
  GlassContainer,
  Pill,
  PropertyCard,
  PropertyCardSkeleton,
  ScreenScroll,
  SearchBar,
  formatCurrency,
  useResponsive,
} from '@/components/ui';
import MapView, { Marker, PROVIDER_GOOGLE } from '@/components/map';
import { Property } from '@/types/models';
import { useItemLanguage } from './index.tsx';

type ViewMode = 'list' | 'map';
type PriceSort = 'none' | 'asc' | 'desc';
type RankingSort = 'rating' | 'reviews';
type SelectSheetMode = 'price' | 'ranking' | null;

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background, // Kept theme.colors.background
    },
    background: {
      ...StyleSheet.absoluteFillObject,
    },
    ambientTop: {
      position: 'absolute',
      top: -130,
      right: -90, // Kept theme.colors.ambientTop
      width: 260,
      height: 260,
      borderRadius: 130,
      backgroundColor: theme.colors.ambientTop,
    },
    ambientBottom: {
      position: 'absolute',
      bottom: -140,
      left: -90, // Kept theme.colors.ambientBottom
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: theme.colors.ambientBottom,
    },
    scrollContent: {
      paddingTop: spacing.md,
      paddingBottom: spacing.xxxl, // Kept spacing.xxxl
    },
    floatingFilter: {
      borderRadius: 24,
      marginBottom: spacing.md, // Kept spacing.md
    },
    floatingContent: {
      padding: spacing.sm, // Kept spacing.sm
      gap: spacing.sm, // Kept spacing.sm
    },
    toggleRow: { // Kept spacing.sm
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
    },
    toggleFill: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.sm, // Kept spacing.sm
    },
    filterToggle: {
      minHeight: 44,
      paddingHorizontal: spacing.md,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      backgroundColor: alpha(theme.colors.surface, theme.mode === 'dark' ? 0.06 : 0.42), // Kept theme.colors.glassBorderStrong
    },
    filterToggleText: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    chipRow: {
      flexDirection: 'row',
      gap: spacing.sm, // Kept spacing.sm
    },
    chipCarousel: { // Kept spacing.xs
      marginHorizontal: -spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    filterPanel: {
      marginTop: spacing.xs,
      gap: spacing.md,
      paddingTop: spacing.xs,
    }, // Kept typography.caption
    filterSectionTitle: {
      ...typography.caption,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    sliderCard: { // Kept spacing.md
      padding: spacing.md, // Kept 18
      borderRadius: 18,
      backgroundColor: alpha(theme.colors.glassShell, theme.mode === 'dark' ? 0.74 : 0.52), // Kept theme.colors.glassBorderStrong
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong,
    },
    sliderHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.sm,
    },
    sliderLabel: { // Kept theme.colors.textPrimary
      ...typography.subheading,
      color: theme.colors.textPrimary,
    },
    sliderValue: {
      ...typography.bodyStrong,
      color: theme.colors.primary, // Kept theme.colors.primary
    },
    filterSelectCarousel: { // Kept spacing.xs
      marginHorizontal: -spacing.xs,
      paddingHorizontal: spacing.xs,
    },
    filterSelectCard: {
      minWidth: 210,
      maxWidth: 250,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderRadius: 16,
      borderWidth: 1, // Kept theme.colors.glassBorderStrong
      borderColor: theme.colors.glassBorderStrong,
      backgroundColor: alpha(theme.colors.glassShell, theme.mode === 'dark' ? 0.72 : 0.52),
      gap: spacing.xs, // Kept spacing.xs
    },
    filterSelectLabel: {
      ...typography.caption,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
    },
    filterSelectValue: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    resultRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.md, // Kept spacing.md
      gap: spacing.md, // Kept spacing.md
    },
    resultTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    resultSubtitle: {
      ...typography.body,
      color: theme.colors.textSecondary, // Kept theme.colors.textSecondary
      marginTop: 4,
    },
    resultLink: {
      ...typography.bodyStrong,
      color: theme.colors.primary, // Kept theme.colors.primary
    },
    cardStack: {
      gap: spacing.md,
    },
    mapWrap: {
      height: 560,
      borderRadius: 28,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.colors.border, // Kept theme.colors.border
    },
    map: {
      flex: 1,
    },
    marker: {
      minWidth: 54,
      height: 34,
      borderRadius: 17,
      paddingHorizontal: 12,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: alpha(theme.colors.white, 0.8), // Kept theme.colors.surface
      backgroundColor: theme.colors.surface,
      ...theme.elevation.soft,
    },
    markerActive: {
      backgroundColor: theme.colors.primary, // Kept theme.colors.primary
      borderColor: alpha(theme.colors.white, 0.18),
    },
    markerText: {
      ...typography.caption,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
    },
    markerTextActive: {
      color: theme.colors.white,
    },
    mapListing: {
      position: 'absolute',
      left: spacing.md,
      right: spacing.md,
      bottom: spacing.md, // Kept spacing.md
      borderRadius: 24,
    },
    mapListingContent: {
      padding: spacing.sm, // Kept spacing.sm
    },
    sheetContent: {
      padding: spacing.md, // Kept spacing.md
      gap: spacing.sm, // Kept spacing.sm
    },
    sheetTitle: {
      ...typography.heading,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      marginBottom: spacing.xs, // Kept spacing.xs
    },
    sheetOption: {
      minHeight: 52,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: theme.colors.glassBorderStrong, // Kept theme.colors.glassBorderStrong
      backgroundColor: alpha(theme.colors.glassShell, theme.mode === 'dark' ? 0.72 : 0.48),
      paddingHorizontal: spacing.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    sheetOptionText: {
      ...typography.bodyStrong,
      color: theme.colors.textPrimary, // Kept theme.colors.textPrimary
      flexShrink: 1,
      paddingRight: spacing.sm,
    },
    sheetOptionActive: {
      borderColor: theme.colors.primaryBorder, // Kept theme.colors.primaryBorder
      backgroundColor: theme.colors.glassAccent, // Kept theme.colors.glassAccent
    },
  });

const lightStyles = createStyles(lightTheme);
const darkStyles = createStyles(darkTheme);

export function SearchScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation('home');
  const theme = useAppTheme();
  const styles = theme.mode === 'dark' ? darkStyles : lightStyles;
  const responsive = useResponsive();
  const language = useItemLanguage();
  const tabBarHeight = useBottomTabBarHeight();
  const { data = [], isLoading } = useGetPropertiesQuery();

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [query, setQuery] = useState('');
  const [price, setPrice] = useState(900000);
  const [selectedCategory, setSelectedCategory] = useState<Property['type'] | null>(null);
  const [priceSort, setPriceSort] = useState<PriceSort>('none');
  const [rankingSort, setRankingSort] = useState<RankingSort>('rating');
  const [activeSheet, setActiveSheet] = useState<SelectSheetMode>(null);
  const [filtersExpanded, setFiltersExpanded] = useState(true);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(data[0]?.id ?? null);
  const deferredQuery = useDeferredValue(query);

  const categoryOptions = useMemo(
    () => [
      { id: null as Property['type'] | null, label: t('filterCategoryAll') },
      { id: 'apartment' as const, label: t('filterCategoryApartment') },
      { id: 'house' as const, label: t('filterCategoryHouse') },
      { id: 'room' as const, label: t('filterCategoryRoom') },
      { id: 'guesthouse' as const, label: t('filterCategoryGuesthouse') },
    ],
    [t]
  );

  const priceSortLabels: Record<PriceSort, string> = useMemo(
    () => ({
      none: t('sortPriceDefault'),
      asc: t('sortPriceAsc'),
      desc: t('sortPriceDesc'),
    }),
    [t]
  );

  const rankingSortLabels: Record<RankingSort, string> = useMemo(
    () => ({
      rating: t('sortRankingRating'),
      reviews: t('sortRankingReviews'),
    }),
    [t]
  );

  const priceOptions: Array<{ key: PriceSort; label: string }> = useMemo(
    () => [
      { key: 'none', label: priceSortLabels.none },
      { key: 'asc', label: priceSortLabels.asc },
      { key: 'desc', label: priceSortLabels.desc },
    ],
    [priceSortLabels]
  );

  const rankingOptions: Array<{ key: RankingSort; label: string }> = useMemo(
    () => [
      { key: 'rating', label: rankingSortLabels.rating },
      { key: 'reviews', label: rankingSortLabels.reviews },
    ],
    [rankingSortLabels]
  );

  const filteredData = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();

    const result = data
      .filter((property) => !selectedCategory || property.type === selectedCategory)
      .filter((property) => property.price <= price)
      .filter((property) => {
        if (!normalizedQuery) {
          return true;
        }

        return [property.title[language], property.address, property.district, property.description[language]]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((left, right) => {
        const verifiedDelta = Number(right.isVerified) - Number(left.isVerified);

        if (verifiedDelta !== 0) {
          return verifiedDelta;
        }

        switch (priceSort) {
          case 'asc':
            return left.price - right.price;
          case 'desc':
            return right.price - left.price;
          default:
            if (rankingSort === 'reviews') {
              return right.reviewCount - left.reviewCount || right.rating - left.rating;
            }
            return right.rating - left.rating || right.reviewCount - left.reviewCount;
        }
      });

    return result;
  }, [data, deferredQuery, language, price, selectedCategory, priceSort, rankingSort]);

  const selectedProperty = filteredData.find((item) => item.id === selectedPropertyId) ?? filteredData[0];

  useEffect(() => {
    if (!filteredData.length) {
      setSelectedPropertyId(null);
      return;
    }

    if (!filteredData.some((item) => item.id === selectedPropertyId)) {
      setSelectedPropertyId(filteredData[0].id);
    }
  }, [filteredData, selectedPropertyId]);

  const toggleCategory = (nextCategory: Property['type'] | null) => {
    startTransition(() => {
      setSelectedCategory((current) => (current === nextCategory ? null : nextCategory));
    });
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[theme.colors.background, theme.colors.backgroundSecondary, theme.colors.backgroundTertiary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.background}
      />
      <View pointerEvents='none' style={styles.ambientTop} />
      <View pointerEvents='none' style={styles.ambientBottom} />
      <ScreenScroll contentContainerStyle={[styles.scrollContent, { paddingBottom: tabBarHeight + spacing.xxxl }]}>
        <Animated.View entering={FadeIn.duration(theme.motion.standard)}>
          <GlassContainer variant='navbar' style={styles.floatingFilter}>
            <View style={styles.floatingContent}>
              <SearchBar
                placeholder={t('searchPlaceholder')}
                value={query}
                onChangeText={setQuery}
                editable
                autoFocus
              />
              <View style={styles.toggleRow}>
                <View style={styles.toggleFill}>
                  <Pill
                    label={t('listView')}
                    active={viewMode === 'list'}
                    onPress={() => startTransition(() => setViewMode('list'))}
                    icon='view-grid-outline'
                  />
                  <Pill
                    label={t('mapView')}
                    active={viewMode === 'map'}
                    onPress={() => startTransition(() => setViewMode('map'))}
                    icon='map-outline'
                  />
                </View>
                <Pressable
                  onPress={() => setFiltersExpanded((current) => !current)}
                  style={styles.filterToggle}
                  accessibilityRole='button'
                  accessibilityLabel={t('filterToggle')}
                >
                  <MaterialCommunityIcons
                    name={filtersExpanded ? 'tune-vertical-variant' : 'tune'}
                    size={18}
                    color={theme.colors.textPrimary}
                  />
                  <Text style={styles.filterToggleText}>{t('filterToggle')}</Text>
                </Pressable>
              </View>
              <View style={styles.chipRow}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={[styles.chipRow, styles.chipCarousel]}
                >
                  {categoryOptions.map((option) => (
                    <Pill
                      key={option.label}
                      label={option.label}
                      active={selectedCategory === option.id}
                      onPress={() => toggleCategory(option.id)}
                    />
                  ))}
                </ScrollView>
              </View>
              {filtersExpanded ? (
                <Animated.View entering={FadeInDown.duration(theme.motion.standard)} layout={LinearTransition.springify()}>
                  <View style={styles.filterPanel}>
                    <Text style={styles.filterSectionTitle}>{t('filterPriceCap')}</Text>
                    <View style={styles.sliderCard}>
                      <View style={styles.sliderHeader}>
                        <Text style={styles.sliderLabel}>{t('priceRange')}</Text>
                        <Text style={styles.sliderValue}>{formatCurrency(price, 'UZS')}</Text>
                      </View>
                      <Slider
                        minimumValue={120000}
                        maximumValue={2000000}
                        step={20000}
                        minimumTrackTintColor={theme.colors.primary}
                        maximumTrackTintColor={alpha(theme.colors.textSecondary, 0.2)}
                        thumbTintColor={theme.colors.primary}
                        value={price}
                        onValueChange={setPrice}
                      />
                    </View>
                    <Text style={styles.filterSectionTitle}>{t('filterSortTitle')}</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={[styles.chipRow, styles.filterSelectCarousel]}
                    >
                      <Pressable
                        onPress={() => setActiveSheet('price')}
                        style={styles.filterSelectCard}
                        accessibilityRole='button'
                        accessibilityLabel={t('sortByPrice')}
                      >
                        <Text style={styles.filterSelectLabel}>{t('sortByPrice')}</Text>
                        <Text style={styles.filterSelectValue}>{priceSortLabels[priceSort]}</Text>
                      </Pressable>

                      <Pressable
                        onPress={() => setActiveSheet('ranking')}
                        style={styles.filterSelectCard}
                        accessibilityRole='button'
                        accessibilityLabel={t('sortByRanking')}
                      >
                        <Text style={styles.filterSelectLabel}>{t('sortByRanking')}</Text>
                        <Text style={styles.filterSelectValue}>{rankingSortLabels[rankingSort]}</Text>
                      </Pressable>
                    </ScrollView>
                  </View>
                </Animated.View>
              ) : null}
            </View>
          </GlassContainer>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(theme.motion.standard)} style={styles.resultRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.resultTitle}>{t('searchMatches', { count: filteredData.length })}</Text>
            <Text style={styles.resultSubtitle}>{t('searchHint')}</Text>
          </View>
          <Pressable onPress={() => navigation.navigate('MapView')} accessibilityRole='button'>
            <Text style={styles.resultLink}>{t('openMap')}</Text>
          </Pressable>
        </Animated.View>

        {viewMode === 'map' ? (
          <Animated.View entering={FadeInDown.delay(120).duration(theme.motion.standard)}>
            <View style={[styles.mapWrap, { height: responsive.mapHeight }]}>
              <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                initialRegion={{
                  latitude: 39.6547,
                  longitude: 66.9758,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
              >
                {filteredData.map((property) => {
                  const active = property.id === selectedProperty?.id;
                  return (
                    <Marker
                      key={property.id}
                      coordinate={property.coords}
                      onPress={() => setSelectedPropertyId(property.id)}
                    >
                      <View style={[styles.marker, active && styles.markerActive]}>
                        <Text style={[styles.markerText, active && styles.markerTextActive]}>
                          {Math.round(property.price / 1000)}k
                        </Text>
                      </View>
                    </Marker>
                  );
                })}
              </MapView>
              {selectedProperty ? (
                <GlassContainer variant='overlay' style={styles.mapListing}>
                  <View style={styles.mapListingContent}>
                    <PropertyCard
                      item={selectedProperty}
                      language={language}
                      onPress={() => navigation.navigate('PropertyDetail', { id: selectedProperty.id })}
                    />
                  </View>
                </GlassContainer>
              ) : null}
            </View>
          </Animated.View>
        ) : (
          <View style={styles.cardStack}>
            {isLoading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => <PropertyCardSkeleton key={`skeleton-search-${index}`} />)
              : filteredData.map((property, index) => (
                  <Animated.View
                    key={property.id}
                    entering={FadeInDown.delay(120 + index * 40).duration(theme.motion.standard)}
                  >
                    <PropertyCard
                      item={property}
                      language={language}
                      onPress={() => navigation.navigate('PropertyDetail', { id: property.id })}
                    />
                  </Animated.View>
                ))}
          </View>
        )}
      </ScreenScroll>

      <BottomSheet
        visible={activeSheet !== null}
        onClose={() => setActiveSheet(null)}
        title={activeSheet === 'price' ? t('sortByPrice') : t('sortByRanking')}
        footer={null}
      >
        <View style={styles.sheetContent}>
          {(activeSheet === 'price' ? priceOptions : rankingOptions).map((option) => {
            const isActive =
              activeSheet === 'price'
                ? priceSort === (option.key as PriceSort)
                : rankingSort === (option.key as RankingSort);

            return (
              <Pressable
                key={option.key}
                onPress={() => {
                  if (activeSheet === 'price') {
                    setPriceSort(option.key as PriceSort);
                  } else {
                    setRankingSort(option.key as RankingSort);
                  }
                  setActiveSheet(null);
                }}
                style={[styles.sheetOption, isActive && styles.sheetOptionActive]}
                accessibilityRole='button'
                accessibilityLabel={option.label}
              >
                <Text style={styles.sheetOptionText}>{option.label}</Text>
                {isActive ? <MaterialCommunityIcons name='check' size={18} color={theme.colors.primary} /> : null}
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>
    </View>
  );
}