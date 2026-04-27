import React, { useMemo, useState } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { colors, spacing } from "@/theme";
import { BookingCard, Section, Pill, ScreenScroll } from "@/components/ui";
import { useGetBookingsQuery } from "@/services/api";
import { bookings as mockBookings } from "@/data/mockData";
import { useItemLanguage } from "./index";

const statusTabs = ["upcoming", "active", "completed", "cancelled"] as const;

export function MyBookingsScreen() {
  const navigation = useNavigation<any>();
  const [status, setStatus] = useState<(typeof statusTabs)[number]>("upcoming");
  const { data = mockBookings } = useGetBookingsQuery();
  const language = useItemLanguage();

  const filteredBookings = useMemo(() => {
    return data.filter((booking) => booking.status === status);
  }, [data, status]);

  const findPropertyTitle = (propertyId: string) => {
    // Mock function
    return "Property in Samarkand";
  };

  return (
    <ScreenScroll contentContainerStyle={styles.container}>
      <Animated.View entering={FadeIn.duration(400)}>
        <Section title="Мои бронирования" subtitle="Управляйте своими поездками">
          {/* Status Tabs */}
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={statusTabs as unknown as string[]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <Pill
                label={item}
                active={status === item}
                onPress={() => setStatus(item as any)}
              />
            )}
            contentContainerStyle={styles.statusTabs}
          />
        </Section>
      </Animated.View>

      {/* Booking List */}
      {filteredBookings.length > 0 ? (
        filteredBookings.map((booking, index) => (
          <Animated.View
            key={booking.id}
            entering={FadeIn.delay(index * 100).duration(400)}
            style={styles.cardContainer}
          >
            <BookingCard
              id={booking.id}
              title={findPropertyTitle(booking.propertyId)}
              status={booking.status}
              subtitle={`${booking.checkIn} → ${booking.checkOut}`}
              onPress={() =>
                navigation.getParent()?.navigate("BookingDetail", {
                  id: booking.id,
                })
              }
            />
          </Animated.View>
        ))
      ) : (
        <Animated.View entering={FadeIn.duration(400)} style={styles.empty}>
          <Text style={styles.emptyText}>Нет бронирований</Text>
        </Animated.View>
      )}
    </ScreenScroll>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: spacing.xl,
  },
  statusTabs: {
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  cardContainer: {
    marginBottom: spacing.md,
    paddingHorizontal: spacing.md,
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
