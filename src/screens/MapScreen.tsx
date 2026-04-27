import React from "react";
import { View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";

import { colors } from "@/theme";
import { MapView, Marker, PROVIDER_GOOGLE } from "@/components/map";
import { useGetPropertiesQuery } from "@/services/api";
import { properties as mockProperties } from "@/data/mockData";
import { useItemLanguage } from "./index";
import { useResponsive } from "@/components/ui";

export function MapScreen() {
  const navigation = useNavigation<any>();
  const language = useItemLanguage();
  const responsive = useResponsive();
  const { data = mockProperties } = useGetPropertiesQuery();

  return (
    <View style={styles.container}>
      <Animated.View entering={FadeIn.duration(400)} style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={[styles.map, { height: responsive.mapHeight }]}
          initialRegion={{
            latitude: 39.6547,
            longitude: 66.9758,
            latitudeDelta: 0.06,
            longitudeDelta: 0.06,
          }}
        >
          {data.map((property) => (
            <Marker
              key={property.id}
              coordinate={property.coords}
              title={property.title[language]}
              description={`${property.price.toLocaleString()} ${property.currency}`}
              onPress={(e) =>
                navigation.navigate("PropertyDetail", { id: property.id })
              }
            />
          ))}
        </MapView>
      </Animated.View>

      <Animated.View entering={FadeIn.duration(400).delay(300)} style={styles.mapOverlay}>
        <Animated.Text style={styles.overlayTitle}>Карта Самарканда</Animated.Text>
        <Animated.Text style={styles.overlaySubtitle}>
          Нажмите на маркер для просмотра
        </Animated.Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  mapOverlay: {
    position: "absolute",
    top: 64,
    left: 16,
    right: 16,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.08,
        shadowRadius: 14,
        shadowOffset: { width: 0, height: 6 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "500",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  overlaySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});
