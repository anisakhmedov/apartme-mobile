import { Platform } from "react-native";

export const colors = {
  primary: "#E63939",
  primaryDark: "#CC2222",
  primaryDeeper: "#A81B1B",
  primaryTint: "#FFF1F1",
  background: "#FAF9F9",
  surface: "#FFFFFF",
  textPrimary: "#1A1A1A",
  textSecondary: "#5C5C5C",
  border: "#E8E8E8",
  success: "#22C55E",
  warning: "#F59E0B",
  error: "#EF4444",
  overlay: "rgba(0,0,0,0.45)",
  white: "#FFFFFF",
  black: "#111111"
};

export const spacing = { xxs: 4, xs: 8, sm: 12, md: 16, lg: 24, xl: 32, xxl: 48 };
export const radii = { card: 8, modal: 12, pill: 24, round: 999 };

export const typography = {
  title: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34 },
  heading: { fontSize: 20, fontWeight: "700" as const, lineHeight: 26 },
  subheading: { fontSize: 16, fontWeight: "600" as const, lineHeight: 22 },
  body: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "400" as const, lineHeight: 16 }
};

export const shadow = Platform.select({
  ios: {
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 }
  },
  android: { elevation: 3 },
  default: {}
});

export const appTheme = {
  colors,
  spacing,
  radii,
  typography,
  shadow
};
