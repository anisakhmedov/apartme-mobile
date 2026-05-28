import { useColorScheme } from 'react-native';
import { createContext, useContext } from 'react';

// 1. Palettes
export interface Palette {
  background: string;
  backgroundSecondary?: string;
  backgroundTertiary?: string;
  surface: string;
  surfaceStrong: string;
  surfaceSecondary?: string;
  text: string;
  textPrimary?: string;
  textSecondary?: string;
  textMuted?: string;
  primary: string;
  primaryDark?: string;
  primaryLight?: string;
  primaryTint?: string;
  primarySoft?: string;
  primaryText?: string;
  primaryBorder?: string;
  accent?: string;
  accentDark?: string;
  accentLight?: string;
  accentTint?: string;
  accentSoft?: string;
  accentText?: string;
  accentBorder?: string;
  success?: string;
  warning?: string;
  error?: string;
  info?: string;
  border: string;
  borderSoft?: string;
glassBorder?: string;
glassBorderStrong?: string;
glassShell?: string;
glassAccent?: string;
  white: string;
  black: string;
  shadow?: string;
  backdrop?: string;
  ambientTop?: string;
  ambientBottom?: string;
  charcoal?: string;
  muted?: string;
}

export const lightPalette: Palette = {
  background: '#F5F7FB',
  backgroundSecondary: '#EBEFF5',
  backgroundTertiary: '#E0E5EC',
  surface: '#FFFFFF',
  surfaceStrong: '#FFFFFF',
  surfaceSecondary: '#F8FAFC',
  text: '#0F172A',
  textPrimary: '#0F172A',
  textSecondary: '#475569',
  textMuted: '#64748B',
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  primaryLight: '#3B82F6',
  primaryTint: '#DBEAFE',
  primarySoft: '#BFDBFE',
  primaryText: '#FFFFFF',
  primaryBorder: '#93C5FD',
  accent: '#F97316',
  accentDark: '#EA580C',
  accentLight: '#FB923C',
  accentTint: '#FFEDD5',
  accentSoft: '#FED7AA',
  accentText: '#FFFFFF',
  accentBorder: '#FDBA74',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#E2E8F0',
  borderSoft: '#E2E8F0',
  glassBorder: 'rgba(255,255,255,0.38)',
  glassBorderStrong: 'rgba(255,255,255,0.6)',
  glassShell: 'rgba(255,255,255,0.8)',
  glassAccent: 'rgba(255,255,255,0.7)',
  white: '#FFFFFF',
  black: '#000000',
  shadow: 'rgba(15,23,42,0.1)',
  backdrop: 'rgba(0,0,0,0.4)',
  ambientTop: 'rgba(255, 200, 0, 0.1)',
  ambientBottom: 'rgba(0, 150, 255, 0.1)',
  charcoal: '#0F172A',
  muted: '#64748B',
};

export const darkPalette: Palette = {
  background: '#0F172A',
  backgroundSecondary: '#1E293B',
  backgroundTertiary: '#334155',
  surface: '#1E293B',
  surfaceStrong: '#1E293B',
  surfaceSecondary: '#334155',
  text: '#F8FAFC',
  textPrimary: '#F8FAFC',
  textSecondary: '#E2E8F0',
  textMuted: '#94A3B8',
  primary: '#3B82F6',
  primaryDark: '#2563EB',
  primaryLight: '#60A5FA',
  primaryTint: '#1E3A8A',
  primarySoft: '#1D4ED8',
  primaryText: '#FFFFFF',
  primaryBorder: '#3B82F6',
  accent: '#F97316',
  accentDark: '#EA580C',
  accentLight: '#FB923C',
  accentTint: '#7C2D12',
  accentSoft: '#9A3412',
  accentText: '#FFFFFF',
  accentBorder: '#FDBA74',
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#334155',
  borderSoft: '#475569',
  glassBorder: 'rgba(255,255,255,0.18)',
  glassBorderStrong: 'rgba(255,255,255,0.28)',
  glassShell: 'rgba(255,255,255,0.08)',
  glassAccent: 'rgba(255,255,255,0.12)',
  white: '#FFFFFF',
  black: '#000000',
  shadow: 'rgba(0,0,0,0.4)',
  backdrop: 'rgba(0,0,0,0.6)',
  ambientTop: 'rgba(255, 200, 0, 0.1)',
  ambientBottom: 'rgba(0, 150, 255, 0.1)',
  charcoal: '#F8FAFC',
  muted: '#94A3B8',
};

// 2. Spacing
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// 3. Radii
export const radii = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
  card: 22,
  modal: 28,
  round: 999,
};

// 4. Typography
export const typography = {
  heroPrice: { fontSize: 28, fontWeight: '800' as '800' },
  title: { fontSize: 28, fontWeight: '800' as '800' },
  heading: { fontSize: 20, fontWeight: '800' as '800' },
  subheading: { fontSize: 16, fontWeight: '700' as '700' },
  body: { fontSize: 15, fontWeight: '400' as '400' },
  bodyStrong: { fontSize: 15, fontWeight: '600' as '600' },
  caption: { fontSize: 12, fontWeight: '400' as '400' },
  micro: { fontSize: 11, fontWeight: '400' as '400' },
};

// 5. Motion
export const motion = {
  standard: 300, // ms
  fast: 200, // ms
  slow: 400, // ms
};

// 6. ZIndex
export const zIndex = {
  base: 0,
  raised: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
};

// 7. Elevation
export const elevation = {
  none: { shadowOpacity: 0, elevation: 0 },
  soft: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  card: { shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
};

// 8. Alpha utility
export const alpha = (color: string, opacity: number): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};

// 9. Glass Tuning
export interface GlassProfile {
  blurIntensity: number;
  overlayOpacity: number;
  borderOpacity: number;
  tint: 'light' | 'dark';
}

export const glassTuning = {
  ios: {
    blurIntensity: 20,
    overlayOpacity: 0.08,
    borderOpacity: 0.12,
    tint: 'light' as const,
  },
  android: {
    blurIntensity: 8,
    overlayOpacity: 0.12,
    borderOpacity: 0.18,
    tint: 'light' as const,
  },
  default: {
    blurIntensity: 15,
    overlayOpacity: 0.1,
    borderOpacity: 0.15,
    tint: 'light' as const,
  },
};

// 10. AppTheme and useAppTheme
export type AppTheme = {
  colors: Palette;
  spacing: typeof spacing;
  radii: typeof radii;
  typography: typeof typography;
  motion: typeof motion;
  zIndex: typeof zIndex;
  elevation: typeof elevation;
  alpha: typeof alpha;
  glassTuning: typeof glassTuning;
  mode: 'light' | 'dark';
};

export const lightTheme: AppTheme = {
  colors: lightPalette,
  spacing,
  radii,
  typography,
  motion,
  zIndex,
  elevation,
  alpha,
  glassTuning,
  mode: 'light',
};

export const darkTheme: AppTheme = {
  colors: darkPalette,
  spacing,
  radii,
  typography,
motion,
  zIndex,
  elevation,
  alpha,
  glassTuning,
  mode: 'dark',
};

const ThemeContext = createContext<AppTheme | undefined>(undefined);

export const useAppTheme = (): AppTheme => {
  const theme = useContext(ThemeContext);
  if (theme === undefined) {
    const colorScheme = useColorScheme();
    return colorScheme === 'dark' ? darkTheme : lightTheme;
  }
  return theme;
};

// Export `colors` directly for convenience, as it's frequently used
export const colors = lightPalette; // Default to light palette colors