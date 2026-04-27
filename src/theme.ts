import { useMemo } from "react";
import { Platform } from "react-native";

import { useAppSelector } from "@/store";

export type ThemeMode = "light" | "dark";

type ShadowToken = Record<string, unknown>;

type ThemeColors = {
  background: string;
  backgroundSecondary: string;
  backgroundTertiary: string;
  surface: string;
  surfaceSecondary: string;
  surfaceMuted: string;
  card: string;
  textPrimary: string;
  textSecondary: string;
  textTertiary: string;
  muted: string;
  charcoal: string;
  primary: string;
  primaryDark: string;
  primaryDeeper: string;
  primaryTint: string;
  primaryLight: string;
  primaryBorder: string;
  accentWarm: string;
  success: string;
  warning: string;
  error: string;
  favorite: string;
  border: string;
  borderStrong: string;
  overlay: string;
  white: string;
  black: string;
  glassShell: string;
  glassPanel: string;
  glassAccent: string;
  glassOverlay: string;
  glassBorder: string;
  glassBorderStrong: string;
  glassHighlight: string;
  glassShadow: string;
  badgeVerified: string;
  badgeNew: string;
  badgeNeutral: string;
  ctaSurface: string;
  mapMarker: string;
  ambientTop: string;
  ambientBottom: string;
};

export const spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radii = {
  xs: 8,
  sm: 12,
  card: 16,
  modal: 20,
  xl: 24,
  pill: 999,
  round: 999,
};

export const typography = {
  heroPrice: { fontSize: 30, fontWeight: "700" as const, lineHeight: 36 },
  title: { fontSize: 28, fontWeight: "700" as const, lineHeight: 34 },
  heading: { fontSize: 22, fontWeight: "700" as const, lineHeight: 28 },
  subheading: { fontSize: 17, fontWeight: "600" as const, lineHeight: 23 },
  body: { fontSize: 14, fontWeight: "400" as const, lineHeight: 20 },
  bodyStrong: { fontSize: 14, fontWeight: "600" as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: "500" as const, lineHeight: 16 },
  micro: { fontSize: 11, fontWeight: "600" as const, lineHeight: 14 },
};

export const blurLevels = {
  none: 0,
  subtle: 8,
  medium: 12,
  strong: 16,
};

export const motion = {
  quick: 140,
  standard: 220,
  slow: 320,
};

export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 60,
  modal: 100,
};

export const alpha = (hex: string, opacity: number) => {
  const normalized = hex.replace("#", "");
  const safeHex = normalized.length === 3
    ? normalized.split("").map((char) => `${char}${char}`).join("")
    : normalized;

  const value = Number.parseInt(safeHex, 16);
  const r = (value >> 16) & 255;
  const g = (value >> 8) & 255;
  const b = value & 255;

  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const createShadow = (
  color: string,
  shadowOpacity: number,
  shadowRadius: number,
  height: number,
  elevation: number
): ShadowToken =>
  Platform.select({
    ios: {
      shadowColor: color,
      shadowOpacity,
      shadowRadius,
      shadowOffset: { width: 0, height },
    },
    android: {
      elevation,
      shadowColor: color,
    },
    default: {},
  }) ?? {};

const lightColors: ThemeColors = {
  background: "#EEF3F8",
  backgroundSecondary: "#F7F9FC",
  backgroundTertiary: "#E6EDF5",
  surface: "#FFFFFF",
  surfaceSecondary: "#F6F8FB",
  surfaceMuted: "#EDF2F7",
  card: "#FBFDFF",
  textPrimary: "#16212C",
  textSecondary: "#556474",
  textTertiary: "#8190A0",
  muted: "#556474",
  charcoal: "#16212C",
  primary: "#2E6AE6",
  primaryDark: "#1F57C7",
  primaryDeeper: "#173D8A",
  primaryTint: "#E8F0FF",
  primaryLight: "#F1F6FF",
  primaryBorder: "#B7CCF7",
  accentWarm: "#F6EBDD",
  success: "#12986E",
  warning: "#CE8A1B",
  error: "#D35B5B",
  favorite: "#E06F95",
  border: "rgba(88, 111, 134, 0.16)",
  borderStrong: "rgba(51, 73, 97, 0.16)",
  overlay: "rgba(13, 24, 37, 0.34)",
  white: "#FFFFFF",
  black: "#0D1520",
  glassShell: "rgba(255, 255, 255, 0.62)",
  glassPanel: "rgba(248, 251, 255, 0.76)",
  glassAccent: "rgba(227, 237, 255, 0.72)",
  glassOverlay: "rgba(16, 31, 46, 0.52)",
  glassBorder: "rgba(255, 255, 255, 0.65)",
  glassBorderStrong: "rgba(177, 199, 223, 0.48)",
  glassHighlight: "rgba(255, 255, 255, 0.82)",
  glassShadow: "rgba(17, 31, 46, 0.14)",
  badgeVerified: "#12986E",
  badgeNew: "#2E6AE6",
  badgeNeutral: "#E8EEF5",
  ctaSurface: "#FFFFFF",
  mapMarker: "#163E8E",
  ambientTop: "rgba(110, 154, 255, 0.14)",
  ambientBottom: "rgba(244, 214, 178, 0.16)",
};

const darkColors: ThemeColors = {
  background: "#111820",
  backgroundSecondary: "#16202B",
  backgroundTertiary: "#1D2936",
  surface: "#18222D",
  surfaceSecondary: "#1D2A37",
  surfaceMuted: "#223140",
  card: "#1A2632",
  textPrimary: "#F2F5F8",
  textSecondary: "#C1CBD5",
  textTertiary: "#93A0AE",
  muted: "#C1CBD5",
  charcoal: "#F2F5F8",
  primary: "#7CA7FF",
  primaryDark: "#5C8BEF",
  primaryDeeper: "#8DB3FF",
  primaryTint: "rgba(124, 167, 255, 0.16)",
  primaryLight: "rgba(124, 167, 255, 0.08)",
  primaryBorder: "rgba(124, 167, 255, 0.3)",
  accentWarm: "#3A322C",
  success: "#44C99B",
  warning: "#E9B34E",
  error: "#EE7C7C",
  favorite: "#F093B2",
  border: "rgba(220, 232, 244, 0.1)",
  borderStrong: "rgba(234, 244, 255, 0.16)",
  overlay: "rgba(3, 8, 13, 0.52)",
  white: "#FFFFFF",
  black: "#05080D",
  glassShell: "rgba(20, 30, 40, 0.62)",
  glassPanel: "rgba(23, 35, 47, 0.76)",
  glassAccent: "rgba(33, 53, 78, 0.68)",
  glassOverlay: "rgba(6, 11, 18, 0.58)",
  glassBorder: "rgba(255, 255, 255, 0.12)",
  glassBorderStrong: "rgba(150, 183, 225, 0.2)",
  glassHighlight: "rgba(255, 255, 255, 0.12)",
  glassShadow: "rgba(0, 0, 0, 0.24)",
  badgeVerified: "#2CB687",
  badgeNew: "#4E88FF",
  badgeNeutral: "#223243",
  ctaSurface: "#18222D",
  mapMarker: "#DCE8FF",
  ambientTop: "rgba(80, 124, 218, 0.2)",
  ambientBottom: "rgba(171, 130, 92, 0.12)",
};

const createTheme = (mode: ThemeMode, palette: ThemeColors) => {
  const shadowBase = mode === "dark" ? palette.black : palette.black;

  return {
    mode,
    colors: palette,
    spacing,
    radii,
    typography,
    blurLevels,
    motion,
    zIndex,
    elevation: {
      soft: createShadow(shadowBase, mode === "dark" ? 0.3 : 0.08, 14, 6, 4),
      card: createShadow(shadowBase, mode === "dark" ? 0.34 : 0.12, 20, 10, 8),
      floating: createShadow(shadowBase, mode === "dark" ? 0.4 : 0.16, 28, 14, 12),
      overlay: createShadow(shadowBase, mode === "dark" ? 0.46 : 0.18, 34, 18, 16),
    },
    navigation: {
      dark: mode === "dark",
      colors: {
        primary: palette.primary,
        background: palette.background,
        card: palette.surface,
        text: palette.textPrimary,
        border: palette.border,
        notification: palette.primary,
      },
    },
  };
};

export const lightTheme = createTheme("light", lightColors);
export const darkTheme = createTheme("dark", darkColors);

export const getAppTheme = (darkMode: boolean) => (darkMode ? darkTheme : lightTheme);

export type AppTheme = ReturnType<typeof getAppTheme>;

export const colors = lightTheme.colors;
export const shadow = lightTheme.elevation.card;

export function useAppTheme(): AppTheme {
  const darkMode = useAppSelector((state) => state.preferences.darkMode);
  return useMemo(() => getAppTheme(darkMode), [darkMode]);
}

export function useThemeMode(): ThemeMode {
  return useAppTheme().mode;
}
