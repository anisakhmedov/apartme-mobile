// ============================================================
//  theme.js — Complete Design System Token File
//  All aliases declared inline — no post-mutation, TS-safe.
// ============================================================

import { useColorScheme } from "react-native";
import { createContext, useContext } from "react";

// ─── COLORS ─────────────────────────────────────────────────

export const colors = {
  primary: {
    50:  "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b",
    DEFAULT: "#6366f1",
    light: "#a5b4fc",
    dark:  "#4338ca",
    foreground: "#ffffff",
  },
  secondary: {
    50:  "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16",
    DEFAULT: "#22c55e",
    light: "#86efac",
    dark:  "#15803d",
    foreground: "#ffffff",
  },
  accent: {
    50:  "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407",
    DEFAULT: "#f97316",
    light: "#fdba74",
    dark:  "#c2410c",
    foreground: "#ffffff",
  },
  neutral: {
    0:    "#ffffff",
    50:   "#fafafa",
    100:  "#f5f5f5",
    200:  "#e5e5e5",
    300:  "#d4d4d4",
    400:  "#a3a3a3",
    500:  "#737373",
    600:  "#525252",
    700:  "#404040",
    800:  "#262626",
    900:  "#171717",
    950:  "#0a0a0a",
    1000: "#000000",
    DEFAULT: "#737373",
  },
  success: {
    light:   "#bbf7d0",
    DEFAULT: "#22c55e",
    dark:    "#15803d",
    foreground: "#ffffff",
  },
  warning: {
    light:   "#fef08a",
    DEFAULT: "#eab308",
    dark:    "#a16207",
    foreground: "#ffffff",
  },
  error: {
    light:   "#fecaca",
    DEFAULT: "#ef4444",
    dark:    "#b91c1c",
    foreground: "#ffffff",
  },
  info: {
    light:   "#bae6fd",
    DEFAULT: "#0ea5e9",
    dark:    "#0369a1",
    foreground: "#ffffff",
  },
  background: {
    DEFAULT:   "#ffffff",
    secondary: "#f9fafb",
    tertiary:  "#f3f4f6",
    inverse:   "#111827",
    overlay:   "rgba(0, 0, 0, 0.5)",
    subtle:    "#f8fafc",
  },
  surface: {
    DEFAULT:  "#ffffff",
    raised:   "#ffffff",
    overlay:  "#ffffff",
    sunken:   "#f1f5f9",
    disabled: "#f8fafc",
  },
  text: {
    primary:     "#111827",
    secondary:   "#6b7280",
    tertiary:    "#9ca3af",
    disabled:    "#d1d5db",
    inverse:     "#ffffff",
    link:        "#6366f1",
    linkHover:   "#4338ca",
    error:       "#ef4444",
    success:     "#22c55e",
    warning:     "#eab308",
    placeholder: "#9ca3af",
  },
  border: {
    DEFAULT: "#e5e7eb",
    light:   "#f3f4f6",
    strong:  "#d1d5db",
    focus:   "#6366f1",
    error:   "#ef4444",
    success: "#22c55e",
    divider: "#f0f0f0",
  },
  dark: {
    background: {
      DEFAULT:   "#0f172a",
      secondary: "#1e293b",
      tertiary:  "#334155",
      inverse:   "#f8fafc",
      overlay:   "rgba(0, 0, 0, 0.7)",
    },
    surface: {
      DEFAULT: "#1e293b",
      raised:  "#334155",
      overlay: "#1e293b",
      sunken:  "#0f172a",
    },
    text: {
      primary:   "#f8fafc",
      secondary: "#94a3b8",
      tertiary:  "#64748b",
      disabled:  "#475569",
      inverse:   "#0f172a",
    },
    border: {
      DEFAULT: "#334155",
      light:   "#1e293b",
      strong:  "#475569",
    },
  },
  brand: {
    DEFAULT:  "#6366f1",
    gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  },
  social: {
    google:    "#ea4335",
    facebook:  "#1877f2",
    twitter:   "#1da1f2",
    github:    "#24292e",
    linkedin:  "#0a66c2",
    youtube:   "#ff0000",
    instagram: "#e1306c",
    discord:   "#5865f2",
    slack:     "#4a154b",
    apple:     "#000000",
  },

  // ── Flat aliases (TS-safe: declared here, not assigned after) ──
  primaryTint:   "#e0e7ff",  // primary[100]
  primaryShade:  "#4338ca",  // primary[700]
  textPrimary:   "#111827",
  textSecondary: "#6b7280",
  textTertiary:  "#9ca3af",
  textDisabled:  "#d1d5db",
  textInverse:   "#ffffff",
  textLink:      "#6366f1",
  borderDefault: "#e5e7eb",
  bgDefault:     "#ffffff",
  bgSecondary:   "#f9fafb",
  surfaceDefault:"#ffffff",
  errorColor:    "#ef4444",
  successColor:  "#22c55e",
  warningColor:  "#eab308",
  infoColor:     "#0ea5e9",
  charcoal:      "#0F172A",
  muted:         "#64748B",

  transparent: "transparent",
  current:     "currentColor",
  white:       "#ffffff",
  black:       "#000000",
  inherit:     "inherit",
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────

export const typography = {
  fontFamily: {
    sans:    ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "sans-serif"],
    serif:   ["Georgia", "Cambria", "Times New Roman", "Times", "serif"],
    mono:    ["JetBrains Mono", "Fira Code", "Cascadia Code", "Menlo", "monospace"],
    display: ["Cal Sans", "Sora", "Inter", "sans-serif"],
    body:    ["Inter", "sans-serif"],
    heading: ["Cal Sans", "Inter", "sans-serif"],
  },
  fontSize: {
    "2xs": [10,  { lineHeight: 12 }],
    xs:    [12,  { lineHeight: 16 }],
    sm:    [14,  { lineHeight: 20 }],
    base:  [16,  { lineHeight: 24 }],
    md:    [16,  { lineHeight: 24 }],
    lg:    [18,  { lineHeight: 28 }],
    xl:    [20,  { lineHeight: 28 }],
    "2xl": [24,  { lineHeight: 32 }],
    "3xl": [30,  { lineHeight: 36 }],
    "4xl": [36,  { lineHeight: 40 }],
    "5xl": [48,  { lineHeight: 52 }],
    "6xl": [60,  { lineHeight: 66 }],
    "7xl": [72,  { lineHeight: 76 }],
    "8xl": [96,  { lineHeight: 96 }],
    "9xl": [128, { lineHeight: 128 }],
    "10xl":[160, { lineHeight: 160 }],
  },
  fontWeight: {
    thin:       "100" as const,
    extralight: "200" as const,
    light:      "300" as const,
    normal:     "400" as const,
    medium:     "500" as const,
    semibold:   "600" as const,
    bold:       "700" as const,
    extrabold:  "800" as const,
    black:      "900" as const,
  },
  lineHeight: {
    none:    "1",
    tight:   "1.25",
    snug:    "1.375",
    normal:  "1.5",
    relaxed: "1.625",
    loose:   "2",
    3:  12,
    4:  16,
    5:  20,
    6:  24,
    7:  28,
    8:  32,
    9:  36,
    10: 40,
  },
  letterSpacing: {
    tighter: "-0.05em",
    tight:   "-0.025em",
    normal:  "0em",
    wide:    "0.025em",
    wider:   "0.05em",
    widest:  "0.1em",
    ultra:   "0.2em",
  },
  textDecoration: {
    none:      "none",
    underline: "underline",
    overline:  "overline",
    through:   "line-through",
  },
  textTransform: {
    none:       "none" as const,
    uppercase:  "uppercase" as const,
    lowercase:  "lowercase" as const,
    capitalize: "capitalize" as const,
  },

  // ── Text style presets — declared inline so TS sees them ──
  display:    { fontSize: 60, lineHeight: 66, fontWeight: "700" as const, letterSpacing: -0.4, fontFamily: "Cal Sans, Inter, sans-serif" },
  heading:    { fontSize: 36, lineHeight: 44, fontWeight: "700" as const, letterSpacing: -0.24, fontFamily: "Cal Sans, Inter, sans-serif" },
  h1:         { fontSize: 36, lineHeight: 40, fontWeight: "700" as const },
  h2:         { fontSize: 30, lineHeight: 36, fontWeight: "700" as const },
  h3:         { fontSize: 24, lineHeight: 32, fontWeight: "600" as const },
  h4:         { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
  h5:         { fontSize: 18, lineHeight: 28, fontWeight: "600" as const },
  h6:         { fontSize: 16, lineHeight: 24, fontWeight: "600" as const },
  body:       { fontSize: 16, lineHeight: 24, fontWeight: "400" as const },
  bodyLarge:  { fontSize: 18, lineHeight: 28, fontWeight: "400" as const },
  bodySmall:  { fontSize: 14, lineHeight: 20, fontWeight: "400" as const },
  label:      { fontSize: 14, lineHeight: 20, fontWeight: "500" as const },
  labelLarge: { fontSize: 16, lineHeight: 24, fontWeight: "500" as const },
  caption:    { fontSize: 12, lineHeight: 16, fontWeight: "400" as const },
  captionBold:{ fontSize: 12, lineHeight: 16, fontWeight: "600" as const },
  overline:   { fontSize: 10, lineHeight: 12, fontWeight: "600" as const, letterSpacing: 1.6, textTransform: "uppercase" as const },
  code:       { fontSize: 14, lineHeight: 24, fontWeight: "400", fontFamily: "JetBrains Mono, Fira Code, monospace" },
  numeric:    { fontSize: 16, lineHeight: 24, fontWeight: "600" as const },
  // Backwards-compatible aliases
  title:      { fontSize: 36, lineHeight: 44, fontWeight: "700" as const, letterSpacing: -0.24, fontFamily: "Cal Sans, Inter, sans-serif" },
  subheading: { fontSize: 20, lineHeight: 28, fontWeight: "600" as const },
  bodyStrong: { fontSize: 16, lineHeight: 24, fontWeight: "600" as const },
  micro:      { fontSize: 11, lineHeight: 16, fontWeight: "400" as const },
  heroPrice:  { fontSize: 28, lineHeight: 34, fontWeight: "800" as const },
};

// Named export alias for text styles
export const textStyles = {
  display:     typography.display,
  heading:     typography.heading,
  h1:          typography.h1,
  h2:          typography.h2,
  h3:          typography.h3,
  h4:          typography.h4,
  h5:          typography.h5,
  h6:          typography.h6,
  body:        typography.body,
  bodyLarge:   typography.bodyLarge,
  bodySmall:   typography.bodySmall,
  label:       typography.label,
  labelLarge:  typography.labelLarge,
  caption:     typography.caption,
  captionBold: typography.captionBold,
  overline:    typography.overline,
  code:        typography.code,
  numeric:     typography.numeric,
};

// ─── SPACING ─────────────────────────────────────────────────

export const spacing = {
  // Numeric scale
  px:   1,
  0:    0,
  0.5:  2,
  1:    4,
  1.5:  6,
  2:    8,
  2.5:  10,
  3:    12,
  3.5:  14,
  4:    16,
  5:    20,
  6:    24,
  7:    28,
  8:    32,
  9:    36,
  10:   40,
  11:   44,
  12:   48,
  14:   56,
  16:   64,
  18:   72,
  20:   80,
  24:   96,
  28:   112,
  32:   128,
  36:   144,
  40:   160,
  44:   176,
  48:   192,
  52:   208,
  56:   224,
  60:   240,
  64:   256,
  72:   288,
  80:   320,
  96:   384,
  128:  512,
  full: "100%",

  // ── Named aliases — inline for TS visibility ──
  "2xs": 2,
  xs:    4,
  sm:    8,
  md:    16,
  lg:    24,
  xl:    32,
  xxl:   48,
  xxxl:  64,
};

// ─── BREAKPOINTS ─────────────────────────────────────────────

export const breakpoints = {
  xs:    "480px",
  sm:    "640px",
  md:    "768px",
  lg:    "1024px",
  xl:    "1280px",
  "2xl": "1536px",
  "3xl": "1920px",
};

export const mediaQueries = {
  xs:     "@media (min-width: 480px)",
  sm:     "@media (min-width: 640px)",
  md:     "@media (min-width: 768px)",
  lg:     "@media (min-width: 1024px)",
  xl:     "@media (min-width: 1280px)",
  "2xl":  "@media (min-width: 1536px)",
  "3xl":  "@media (min-width: 1920px)",
  dark:   "@media (prefers-color-scheme: dark)",
  light:  "@media (prefers-color-scheme: light)",
  motion: "@media (prefers-reduced-motion: no-preference)",
  print:  "@media print",
  touch:  "@media (hover: none) and (pointer: coarse)",
  retina: "@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
};

// ─── BORDER RADIUS ───────────────────────────────────────────

export const borderRadius = {
  none:    0,
  xs:      2,
  sm:      4,
  DEFAULT: 6,
  md:      8,
  lg:      12,
  xl:      16,
  "2xl":   24,
  "3xl":   32,
  "4xl":   48,
  full:    9999,
  pill:    9999,
  card:    22,
  modal:   28,
  round:   9999,
  circle:  "50%",
};
export const radii = borderRadius;

// ─── BORDER WIDTH ────────────────────────────────────────────

export const borderWidth = {
  0:       0,
  DEFAULT: 1,
  2:       2,
  4:       4,
  8:       8,
};

// ─── SHADOWS ─────────────────────────────────────────────────

export const shadows = {
  none:         "none",
  xs:           "0 1px 2px 0 rgb(0 0 0 / 0.05)",
  sm:           "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
  DEFAULT:      "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  md:           "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
  lg:           "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)",
  xl:           "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
  "2xl":        "0 25px 50px -12px rgb(0 0 0 / 0.25)",
  "3xl":        "0 35px 60px -15px rgb(0 0 0 / 0.3)",
  inner:        "inset 0 2px 4px 0 rgb(0 0 0 / 0.05)",
  focus:        "0 0 0 3px rgba(99, 102, 241, 0.4)",
  focusError:   "0 0 0 3px rgba(239, 68, 68, 0.4)",
  focusSuccess: "0 0 0 3px rgba(34, 197, 94, 0.4)",
  card:         "0 2px 8px rgba(0,0,0,0.08), 0 0 1px rgba(0,0,0,0.06)",
  cardHover:    "0 8px 30px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.08)",
  button:       "0 1px 2px rgba(0,0,0,0.08)",
  dropdown:     "0 4px 20px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.06)",
  modal:        "0 20px 60px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.1)",
  tooltip:      "0 2px 8px rgba(0,0,0,0.15)",
  primary:      "0 8px 30px rgba(99, 102, 241, 0.3)",
  secondary:    "0 8px 30px rgba(34, 197, 94, 0.3)",
  accent:       "0 8px 30px rgba(249, 115, 22, 0.3)",
  error:        "0 8px 30px rgba(239, 68, 68, 0.3)",
};

// ─── ELEVATION ───────────────────────────────────────────────

export const elevation = {
  none:      shadows.none,
  0:         shadows.none,
  1:         shadows.xs,
  2:         shadows.sm,
  3:         shadows.DEFAULT,
  4:         shadows.md,
  soft:      { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  6:         shadows.lg,
  8:         shadows.xl,
  12:        shadows["2xl"],
  16:        shadows["3xl"],
  floating:  { shadowColor: "#000", shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.12, shadowRadius: 16, elevation: 8 },
  inset:     shadows.inner,
  focus:     shadows.focus,
  card:      { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 4 },
  cardHover: shadows.cardHover,
  dropdown:  shadows.dropdown,
  modal:     shadows.modal,
  tooltip:   shadows.tooltip,
  button:    shadows.button,
};

// ─── GRADIENTS ───────────────────────────────────────────────

export const gradients = {
  primary:   "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
  secondary: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
  accent:    "linear-gradient(135deg, #f97316 0%, #ef4444 100%)",
  sunrise:   "linear-gradient(135deg, #f9a825 0%, #f44336 100%)",
  ocean:     "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)",
  forest:    "linear-gradient(135deg, #22c55e 0%, #0ea5e9 100%)",
  sunset:    "linear-gradient(135deg, #f97316 0%, #ec4899 100%)",
  aurora:    "linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)",
  night:     "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  candy:     "linear-gradient(135deg, #f43f5e 0%, #a855f7 50%, #3b82f6 100%)",
  mesh:      "radial-gradient(at 40% 20%, #6366f1 0px, transparent 50%), radial-gradient(at 80% 0%, #8b5cf6 0px, transparent 50%)",
  glass:     "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
  none:      "none",
};

// ─── OPACITY ─────────────────────────────────────────────────

export const opacity = {
  0:   "0",    5:  "0.05", 10: "0.1",
  15: "0.15", 20: "0.2",  25: "0.25",
  30: "0.3",  40: "0.4",  50: "0.5",
  60: "0.6",  70: "0.7",  75: "0.75",
  80: "0.8",  85: "0.85", 90: "0.9",
  95: "0.95", 100: "1",
};

// ─── Z-INDEX ─────────────────────────────────────────────────

export const zIndex = {
  hide: -1, auto: "auto", base: 0, raised: 1,
  dropdown: 10, sticky: 20, overlay: 30, modal: 40,
  popover: 50, tooltip: 60, toast: 70, spotlight: 80, max: 9999,
};

// ─── TRANSITIONS ─────────────────────────────────────────────

export const transitions = {
  duration: {
    instant: "0ms",   fastest: "50ms",  faster: "100ms",
    fast:    "150ms", normal:  "200ms", slow:   "300ms",
    slower:  "400ms", slowest: "500ms", lazy:   "700ms", glacial: "1000ms",
  },
  easing: {
    linear: "linear", ease: "ease", easeIn: "ease-in",
    easeOut: "ease-out", easeInOut: "ease-in-out",
    spring:    "cubic-bezier(0.34, 1.56, 0.64, 1)",
    bounce:    "cubic-bezier(0.68, -0.55, 0.265, 1.55)",
    smooth:    "cubic-bezier(0.4, 0, 0.2, 1)",
    snappy:    "cubic-bezier(0.2, 0, 0, 1)",
    sharp:     "cubic-bezier(0.4, 0, 0.6, 1)",
    enter:     "cubic-bezier(0, 0, 0.2, 1)",
    exit:      "cubic-bezier(0.4, 0, 1, 1)",
    anticipate:"cubic-bezier(0.38, -0.4, 0.88, 0.65)",
  },
  all:       "all 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  colors:    "color 200ms ease, background-color 200ms ease, border-color 200ms ease",
  opacity:   "opacity 200ms ease",
  shadow:    "box-shadow 200ms ease",
  transform: "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  none:      "none",
};

// ─── MOTION ──────────────────────────────────────────────────

export const motion = {
  ...transitions,
  spring:  "all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  bounce:  "all 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55)",
  snappy:  "all 150ms cubic-bezier(0.2, 0, 0, 1)",
  enter:   "all 300ms cubic-bezier(0, 0, 0.2, 1)",
  exit:    "all 150ms cubic-bezier(0.4, 0, 1, 1)",
  fade:    "opacity 200ms ease",
  slide:   "transform 200ms cubic-bezier(0.4, 0, 0.2, 1)",
  scale:   "transform 150ms cubic-bezier(0.34, 1.56, 0.64, 1)",
  color:   "color 200ms ease, background-color 200ms ease, border-color 200ms ease",
  layout:  "all 300ms cubic-bezier(0.4, 0, 0.2, 1)",
  reduced: "none",
  // numeric shorthand used by components expecting milliseconds
  standard: 200,
};

// ─── ANIMATIONS ──────────────────────────────────────────────

export const animations = {
  keyframes: {
    fadeIn:      { from: { opacity: 0 }, to: { opacity: 1 } },
    fadeOut:     { from: { opacity: 1 }, to: { opacity: 0 } },
    fadeInUp:    { from: { opacity: 0, transform: "translateY(16px)" },  to: { opacity: 1, transform: "translateY(0)" } },
    fadeInDown:  { from: { opacity: 0, transform: "translateY(-16px)" }, to: { opacity: 1, transform: "translateY(0)" } },
    fadeInLeft:  { from: { opacity: 0, transform: "translateX(-16px)" }, to: { opacity: 1, transform: "translateX(0)" } },
    fadeInRight: { from: { opacity: 0, transform: "translateX(16px)" },  to: { opacity: 1, transform: "translateX(0)" } },
    scaleIn:     { from: { opacity: 0, transform: "scale(0.9)" }, to: { opacity: 1, transform: "scale(1)" } },
    scaleOut:    { from: { opacity: 1, transform: "scale(1)" },   to: { opacity: 0, transform: "scale(0.9)" } },
    slideInUp:   { from: { transform: "translateY(100%)" },  to: { transform: "translateY(0)" } },
    slideInDown: { from: { transform: "translateY(-100%)" }, to: { transform: "translateY(0)" } },
    slideInLeft: { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
    slideInRight:{ from: { transform: "translateX(100%)" },  to: { transform: "translateX(0)" } },
    spin:        { from: { transform: "rotate(0deg)" }, to: { transform: "rotate(360deg)" } },
    ping:        { "75%, 100%": { transform: "scale(2)", opacity: 0 } },
    pulse:       { "0%, 100%": { opacity: 1 }, "50%": { opacity: 0.5 } },
    bounce:      { "0%, 100%": { transform: "translateY(-25%)" }, "50%": { transform: "none" } },
    shimmer:     { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
    wiggle:      { "0%, 100%": { transform: "rotate(-3deg)" }, "50%": { transform: "rotate(3deg)" } },
    float:       { "0%, 100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
    shake:       { "0%, 100%": { transform: "translateX(0)" }, "10%, 50%, 90%": { transform: "translateX(-4px)" }, "30%, 70%": { transform: "translateX(4px)" } },
  },
  presets: {
    fadeIn:     "fadeIn 0.2s ease forwards",
    fadeOut:    "fadeOut 0.2s ease forwards",
    fadeInUp:   "fadeInUp 0.3s ease forwards",
    fadeInDown: "fadeInDown 0.3s ease forwards",
    scaleIn:    "scaleIn 0.2s ease forwards",
    spin:       "spin 1s linear infinite",
    pulse:      "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
    ping:       "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
    bounce:     "bounce 1s infinite",
    shimmer:    "shimmer 2s linear infinite",
    wiggle:     "wiggle 1s ease-in-out infinite",
    float:      "float 3s ease-in-out infinite",
    shake:      "shake 0.5s ease",
  },
};

// ─── SIZES ───────────────────────────────────────────────────

export const sizes = {
  icon:   { xs: 12, sm: 16, md: 20, lg: 24, xl: 32, "2xl": 40, "3xl": 48, "4xl": 64, "5xl": 96 },
  avatar: { xs: 24, sm: 32, md: 40, lg: 48, xl: 64, "2xl": 96, "3xl": 128 },
  container: { xs: 480, sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536, prose: 600, narrow: 400 },
  input:  { xs: 28, sm: 32, md: 40, lg: 48, xl: 56 },
  button: { xs: 24, sm: 32, md: 40, lg: 48, xl: 56 },
  sidebar:{ collapsed: 64, expanded: 256, wide: 320 },
  header: { sm: 48, md: 64, lg: 80 },
};

// ─── LAYOUT ──────────────────────────────────────────────────

export const layout = {
  grid: { columns: 12, gap: spacing[4], gapSm: spacing[6], gapLg: spacing[8] },
  flex: {
    center:    { display: "flex", alignItems: "center", justifyContent: "center" },
    between:   { display: "flex", alignItems: "center", justifyContent: "space-between" },
    start:     { display: "flex", alignItems: "center", justifyContent: "flex-start" },
    end:       { display: "flex", alignItems: "center", justifyContent: "flex-end" },
    col:       { display: "flex", flexDirection: "column" },
    colCenter: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" },
  },
  pageGutter:     { mobile: spacing[4], tablet: spacing[6], desktop: spacing[8] },
  sectionSpacing: { sm: spacing[12], md: spacing[20], lg: spacing[32] },
};

// ─── COMPONENT VARIANTS ──────────────────────────────────────

export const componentVariants = {
  button: {
    sizes: {
      xs: { height: sizes.button.xs, px: spacing[2], fontSize: "0.75rem" },
      sm: { height: sizes.button.sm, px: spacing[3], fontSize: "0.875rem" },
      md: { height: sizes.button.md, px: spacing[4], fontSize: "0.875rem" },
      lg: { height: sizes.button.lg, px: spacing[6], fontSize: "1rem" },
      xl: { height: sizes.button.xl, px: spacing[8], fontSize: "1.125rem" },
    },
    variants: ["solid", "outline", "ghost", "link", "soft", "glass"],
    states:   ["default", "hover", "active", "focus", "disabled", "loading"],
  },
  input: {
    sizes: {
      xs: { height: sizes.input.xs, px: spacing[2], fontSize: "0.75rem" },
      sm: { height: sizes.input.sm, px: spacing[3], fontSize: "0.875rem" },
      md: { height: sizes.input.md, px: spacing[3], fontSize: "1rem" },
      lg: { height: sizes.input.lg, px: spacing[4], fontSize: "1.125rem" },
      xl: { height: sizes.input.xl, px: spacing[5], fontSize: "1.25rem" },
    },
    variants: ["outline", "filled", "flushed", "unstyled"],
  },
  badge: {
    sizes: {
      sm: { px: "6px",  py: "2px", fontSize: "11px" },
      md: { px: "8px",  py: "2px", fontSize: "12px" },
      lg: { px: "10px", py: "3px", fontSize: "13px" },
    },
    variants: ["solid", "outline", "soft", "dot"],
  },
  card: {
    variants: ["default", "bordered", "flat", "glass", "elevated"],
    padding:  { sm: spacing[4], md: spacing[6], lg: spacing[8] },
  },
};

// ─── TOKENS ──────────────────────────────────────────────────

export const tokens = {
  "--color-primary":        colors.primary.DEFAULT,
  "--color-primary-light":  colors.primary.light,
  "--color-primary-dark":   colors.primary.dark,
  "--color-secondary":      colors.secondary.DEFAULT,
  "--color-accent":         colors.accent.DEFAULT,
  "--color-background":     colors.background.DEFAULT,
  "--color-surface":        colors.surface.DEFAULT,
  "--color-text-primary":   colors.text.primary,
  "--color-text-secondary": colors.text.secondary,
  "--color-border":         colors.border.DEFAULT,
  "--color-success":        colors.success.DEFAULT,
  "--color-warning":        colors.warning.DEFAULT,
  "--color-error":          colors.error.DEFAULT,
  "--color-info":           colors.info.DEFAULT,
  "--font-family-sans":     typography.fontFamily.sans.join(", "),
  "--font-family-mono":     typography.fontFamily.mono.join(", "),
  "--radius-sm":            borderRadius.sm,
  "--radius-md":            borderRadius.md,
  "--radius-lg":            borderRadius.lg,
  "--radius-full":          borderRadius.full,
  "--shadow-sm":            shadows.sm,
  "--shadow-md":            shadows.md,
  "--shadow-lg":            shadows.lg,
  "--transition-fast":      transitions.duration.fast,
  "--transition-normal":    transitions.duration.normal,
  "--transition-slow":      transitions.duration.slow,
};

// ─── THEME PRESETS ───────────────────────────────────────────

export const themePresets = {
  light: {
    name: "light",
    colors: { background: colors.background.DEFAULT, surface: colors.surface.DEFAULT, textPrimary: colors.text.primary, textSecondary: colors.text.secondary, border: colors.border.DEFAULT },
  },
  dark: {
    name: "dark",
    colors: { background: colors.dark.background.DEFAULT, surface: colors.dark.surface.DEFAULT, textPrimary: colors.dark.text.primary, textSecondary: colors.dark.text.secondary, border: colors.dark.border.DEFAULT },
  },
};

// ─── PALETTE ─────────────────────────────────────────────────

export const lightPalette = {
  primary: colors.primary.DEFAULT, primaryLight: colors.primary.light, primaryDark: colors.primary.dark,
  primaryTint: colors.primary[100], secondary: colors.secondary.DEFAULT, secondaryLight: colors.secondary.light,
  secondaryDark: colors.secondary.dark, accent: colors.accent.DEFAULT, accentLight: colors.accent.light,
  accentDark: colors.accent.dark, background: colors.background.DEFAULT,
  backgroundSecondary: colors.background.secondary, backgroundTertiary: colors.background.tertiary,
  surface: colors.surface.DEFAULT, surfaceRaised: colors.surface.raised, surfaceSunken: colors.surface.sunken,
  textPrimary: colors.text.primary, textSecondary: colors.text.secondary, textTertiary: colors.text.tertiary,
  textDisabled: colors.text.disabled, textInverse: colors.text.inverse, textLink: colors.text.link,
  border: colors.border.DEFAULT, borderLight: colors.border.light, borderStrong: colors.border.strong,
  borderFocus: colors.border.focus, divider: colors.border.divider,
  success: colors.success.DEFAULT, successLight: colors.success.light,
  warning: colors.warning.DEFAULT, warningLight: colors.warning.light,
  error: colors.error.DEFAULT, errorLight: colors.error.light,
  info: colors.info.DEFAULT, infoLight: colors.info.light,
  white: "#ffffff", black: "#000000", transparent: "transparent",
  // Compatibility aliases used across screens/components
  surfaceSecondary: colors.surface.raised,
  ambientTop: colors.primary[200],
  ambientBottom: colors.accent[200],
  glassBorderStrong: colors.border.strong,
  glassBorder: colors.border.DEFAULT,
  glassShell: "rgba(255,255,255,0.2)",
  glassAccent: "rgba(99,102,241,0.1)",
  primaryBorder: colors.primary.DEFAULT,
  // UI palette extras
  text: colors.text.primary,
  textMuted: colors.text.tertiary,
  surfaceStrong: colors.surface.raised,
  inputBackground: colors.surface.DEFAULT,
  borderSoft: colors.border.light,
  primaryText: colors.white,
  primarySoft: alpha(colors.primary.DEFAULT, 0.14),
  shadow: shadows.card,
  backdrop: colors.background.overlay,
  badgeNew: colors.accent.DEFAULT,
};

export const darkPalette = {
  primary: colors.primary.DEFAULT, primaryLight: colors.primary[300], primaryDark: colors.primary[700],
  primaryTint: colors.primary[900], secondary: colors.secondary.DEFAULT, secondaryLight: colors.secondary[300],
  secondaryDark: colors.secondary[700], accent: colors.accent[400], accentLight: colors.accent[300],
  accentDark: colors.accent[600], background: colors.dark.background.DEFAULT,
  backgroundSecondary: colors.dark.background.secondary, backgroundTertiary: colors.dark.background.tertiary,
  surface: colors.dark.surface.DEFAULT, surfaceRaised: colors.dark.surface.raised, surfaceSunken: colors.dark.surface.sunken,
  textPrimary: colors.dark.text.primary, textSecondary: colors.dark.text.secondary, textTertiary: colors.dark.text.tertiary,
  textDisabled: colors.dark.text.disabled, textInverse: colors.dark.text.inverse, textLink: colors.primary[400],
  border: colors.dark.border.DEFAULT, borderLight: colors.dark.border.light, borderStrong: colors.dark.border.strong,
  borderFocus: colors.primary[400], divider: colors.dark.border.DEFAULT,
  success: colors.success.DEFAULT, successLight: colors.success.dark,
  warning: colors.warning.DEFAULT, warningLight: colors.warning.dark,
  error: colors.error.DEFAULT, errorLight: colors.error.dark,
  info: colors.info.DEFAULT, infoLight: colors.info.dark,
  white: "#ffffff", black: "#000000", transparent: "transparent",
  // Compatibility aliases used across screens/components
  surfaceSecondary: colors.dark.surface.raised,
  ambientTop: colors.primary[700],
  ambientBottom: colors.accent[700],
  glassBorderStrong: colors.dark.border.strong,
  glassBorder: colors.dark.border.DEFAULT,
  glassShell: "rgba(0,0,0,0.2)",
  glassAccent: "rgba(99,102,241,0.1)",
  primaryBorder: colors.primary[700],
  // UI palette extras
  text: colors.dark.text.primary,
  textMuted: colors.dark.text.tertiary,
  surfaceStrong: colors.dark.surface.raised,
  inputBackground: colors.dark.surface.DEFAULT,
  borderSoft: colors.dark.border.light,
  primaryText: colors.white,
  primarySoft: alpha(colors.primary.DEFAULT, 0.12),
  shadow: shadows.card,
  backdrop: colors.dark.background.overlay,
  badgeNew: colors.accent[400] ?? colors.accent.DEFAULT,
};

export const Palette = lightPalette;

export type Palette = typeof lightPalette;

 export type GlassProfile = {
   blurIntensity: number;
   overlayOpacity: number;
   borderOpacity: number;
   tint: 'light' | 'dark';
 };

// ─── GLASS TUNING ────────────────────────────────────────────

export const glassTuning = {
  blur:       { xs: "4px", sm: "8px", md: "16px", lg: "24px", xl: "40px", "2xl": "64px" },
  opacity:    { ultra: 0.05, low: 0.1, medium: 0.15, high: 0.25, solid: 0.4 },
  border:     { light: "rgba(255,255,255,0.18)", medium: "rgba(255,255,255,0.25)", strong: "rgba(255,255,255,0.35)", dark: "rgba(0,0,0,0.1)" },
  saturation: { low: "saturate(1.1)", medium: "saturate(1.4)", high: "saturate(1.8)", ultra: "saturate(2.2)" },
  background: {
    white: "rgba(255,255,255,0.1)", whiteMedium: "rgba(255,255,255,0.2)", whiteStrong: "rgba(255,255,255,0.35)",
    dark: "rgba(0,0,0,0.1)", darkMedium: "rgba(0,0,0,0.2)", darkStrong: "rgba(0,0,0,0.35)",
    primary: "rgba(99,102,241,0.1)", primaryMd: "rgba(99,102,241,0.2)",
  },
  shadow: { sm: "0 2px 12px rgba(0,0,0,0.08)", md: "0 4px 24px rgba(0,0,0,0.12)", lg: "0 8px 40px rgba(0,0,0,0.18)", xl: "0 16px 64px rgba(0,0,0,0.25)" },
  // Platform defaults for GlassProfile
  ios: { blurIntensity: 16, overlayOpacity: 0.12, borderOpacity: 0.12, tint: "light" },
  android: { blurIntensity: 12, overlayOpacity: 0.1, borderOpacity: 0.1, tint: "dark" },
  default: { blurIntensity: 14, overlayOpacity: 0.11, borderOpacity: 0.11, tint: "light" },
};

export const GlassProfiles = {
  light:   { background: glassTuning.background.whiteMedium,  backdropFilter: "blur(16px) saturate(1.4)", WebkitBackdropFilter: "blur(16px) saturate(1.4)", border: "1px solid rgba(255,255,255,0.18)", boxShadow: glassTuning.shadow.md },
  dark:    { background: glassTuning.background.darkMedium,   backdropFilter: "blur(16px) saturate(1.4)", WebkitBackdropFilter: "blur(16px) saturate(1.4)", border: "1px solid rgba(0,0,0,0.1)",          boxShadow: glassTuning.shadow.md },
  frosted: { background: glassTuning.background.whiteStrong,  backdropFilter: "blur(40px) saturate(1.8)", WebkitBackdropFilter: "blur(40px) saturate(1.8)", border: "1px solid rgba(255,255,255,0.25)",   boxShadow: glassTuning.shadow.lg },
  primary: { background: glassTuning.background.primaryMd,    backdropFilter: "blur(24px) saturate(1.8)", WebkitBackdropFilter: "blur(24px) saturate(1.8)", border: "1px solid rgba(99,102,241,0.25)",    boxShadow: shadows.primary },
  minimal: { background: glassTuning.background.white,        backdropFilter: "blur(8px)",                WebkitBackdropFilter: "blur(8px)",                border: "1px solid rgba(255,255,255,0.18)",   boxShadow: glassTuning.shadow.sm },
  card:    { background: glassTuning.background.whiteMedium,  backdropFilter: "blur(16px) saturate(1.4)", WebkitBackdropFilter: "blur(16px) saturate(1.4)", borderRadius: borderRadius.xl, border: "1px solid rgba(255,255,255,0.18)", boxShadow: glassTuning.shadow.md, padding: spacing.md },
};

// ─── MISC ────────────────────────────────────────────────────

export const cursors = {
  auto: "auto", default: "default", pointer: "pointer", wait: "wait",
  text: "text", move: "move", notAllowed: "not-allowed", grab: "grab",
  grabbing: "grabbing", zoomIn: "zoom-in", zoomOut: "zoom-out", copy: "copy", crosshair: "crosshair",
};

export const blur = {
  none: "0", sm: "4px", DEFAULT: "8px", md: "12px",
  lg: "16px", xl: "24px", "2xl": "40px", "3xl": "64px",
};

export const backdropBlur = { ...blur };

export const overflow    = { auto: "auto", hidden: "hidden", visible: "visible", scroll: "scroll", clip: "clip" };
export const aspectRatios= { square: "1 / 1", video: "16 / 9", cinema: "21 / 9", portrait: "3 / 4", photo: "4 / 3", golden: "1.618 / 1" };
export const listStyleType={ none: "none", disc: "disc", decimal: "decimal", circle: "circle", square: "square", roman: "upper-roman" };

// ─── ALPHA ───────────────────────────────────────────────────

/**
 * alpha(color, opacityValue) — converts hex/rgb to rgba.
 * @param color        hex (#rrggbb / #rgb) or "rgb(r,g,b)" string
 * @param opacityValue 0–1
 */
export function alpha(color: string, opacityValue: number): string {
  if (color.startsWith("#")) {
    let hex = color.replace("#", "");
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
    if (hex.length === 6) {
      const r = parseInt(hex.slice(0, 2), 16);
      const g = parseInt(hex.slice(2, 4), 16);
      const b = parseInt(hex.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacityValue})`;
    }
  }
  if (color.startsWith("rgb")) {
    const nums = color.match(/[\d.]+/g);
    if (nums && nums.length >= 3) return `rgba(${nums[0]}, ${nums[1]}, ${nums[2]}, ${opacityValue})`;
  }
  return color;
}

// ─── APP THEME ───────────────────────────────────────────────

const BaseTheme = {
  typography, textStyles, spacing, breakpoints, mediaQueries,
  borderRadius, borderWidth, shadows, elevation, gradients, opacity, zIndex,
  transitions, motion, animations, sizes, layout, componentVariants, tokens,
  themePresets, Palette, radii,
  glassTuning, GlassProfiles, cursors, blur, backdropBlur,
  overflow, aspectRatios, listStyleType, alpha,
};

export const lightTheme = {
  ...BaseTheme,
  colors: lightPalette,
  navigation: {
    colors: {
      primary: lightPalette.primary,
      background: lightPalette.background,
      card: lightPalette.surface,
      text: lightPalette.text,
      border: lightPalette.border,
      notification: lightPalette.accent,
    },
  },
  mode: 'light' as const,
};

export const darkTheme = {
  ...BaseTheme,
  colors: darkPalette,
  navigation: {
    colors: {
      primary: darkPalette.primary,
      background: darkPalette.background,
      card: darkPalette.surface,
      text: darkPalette.text,
      border: darkPalette.border,
      notification: darkPalette.accent,
    },
  },
  mode: 'dark' as const,
};

export type AppTheme = typeof lightTheme | typeof darkTheme;

/** @deprecated Use useAppTheme hook instead for dynamic values */
export const AppTheme = lightTheme;

const ThemeContext = createContext<AppTheme | undefined>(undefined);

export function useAppTheme() {
  const theme = useContext(ThemeContext);
  if (theme) return theme;

  const scheme = useColorScheme();
  return scheme === "dark" ? darkTheme : lightTheme;
}

// ─── DEFAULT EXPORT ──────────────────────────────────────────

const theme = { ...AppTheme };
export default theme;