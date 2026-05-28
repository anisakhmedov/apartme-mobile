import React from "react";
import { View, Text, StyleSheet } from "react-native";

export const PROVIDER_GOOGLE = undefined;

export const Marker = ({ children, title }: { children?: React.ReactNode; title?: string }) => (
  <View style={styles.marker}>
    {children || <View style={styles.defaultMarker} />}
    {title && <Text style={styles.markerTitle}>{title}</Text>}
  </View>
);

const MapView = ({ children, style }: { children?: React.ReactNode; style?: any }) => (
  <View style={[style, styles.webMapPlaceholder]}>
    <Text style={styles.webText}>Map functionality is optimized for mobile.</Text>
    {children}
  </View>
);

const styles = StyleSheet.create({
  webMapPlaceholder: { backgroundColor: '#e5e7eb', alignItems: 'center', justifyContent: 'center' },
  webText: { color: '#64748b', fontWeight: '600' },
  marker: { alignItems: 'center' },
  defaultMarker: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#2563eb' },
  markerTitle: { fontSize: 10, marginTop: 2 }
});

export default MapView;