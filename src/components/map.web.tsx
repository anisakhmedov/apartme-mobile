import React from "react";
import { View } from "react-native";

export const PROVIDER_GOOGLE = undefined;

export const Marker = ({ children }: { children?: React.ReactNode }) => <View>{children}</View>;

const MapView = ({ children, style }: { children?: React.ReactNode; style?: any }) => <View style={style}>{children}</View>;

export default MapView;