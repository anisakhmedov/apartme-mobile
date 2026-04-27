import AsyncStorage from "@react-native-async-storage/async-storage";

import { Property } from "@/types/models";

const RECENT_PROPERTIES_KEY = "samarkandrent.recentProperties";

export async function loadRecentProperties(): Promise<Property[]> {
  const raw = await AsyncStorage.getItem(RECENT_PROPERTIES_KEY);
  return raw ? (JSON.parse(raw) as Property[]) : [];
}

export async function saveRecentProperty(property: Property): Promise<void> {
  const existing = await loadRecentProperties();
  const next = [property, ...existing.filter((item) => item.id !== property.id)].slice(0, 20);
  await AsyncStorage.setItem(RECENT_PROPERTIES_KEY, JSON.stringify(next));
}
