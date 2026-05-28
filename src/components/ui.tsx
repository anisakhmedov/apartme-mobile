import React, { PropsWithChildren, ReactNode, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Pressable,
  PressableProps,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TextInputProps,
  TextStyle,
  useColorScheme,
  useWindowDimensions,
  View,
  ViewProps,
  ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics'; // Removed unused import of `Palette`
import { Palette, lightPalette, darkPalette, glassTuning, GlassProfile, AppTheme, useAppTheme, colors, spacing, typography, alpha, motion, zIndex, elevation } from '@/theme';

import type { LocalizedText, Property } from '@/types/models'; // Removed unused import of `colors`

type Scheme = 'light' | 'dark';
type GlassTone = 'soft' | 'regular' | 'strong';
type GlassVariant = 'default' | 'navbar' | 'overlay' | 'sheet' | 'panel' | 'accent';
type ButtonVariant = 'primary' | 'secondary';
const dangerColor = '#EF4444';
type IconName = keyof typeof Ionicons.glyphMap;

function getPalette(scheme: Scheme): typeof Palette {
  const palette = scheme === 'dark' ? darkPalette : lightPalette;
  // Fallback to lightPalette if dark is missing, or a minimal safety object if both are undefined
  return (
    palette ??
    lightPalette ??
    ({
      background: '#F5F7FB',
      surface: '#FFFFFF',
      surfaceStrong: '#FFFFFF',
      text: '#0F172A',
      primary: '#2563EB',
    } as Palette)
  );
}

function getVariantDefaults(variant?: GlassVariant) {
  switch (variant) {
    case 'navbar':
      return {
        tone: 'strong' as const,
        radius: 28,
        extraBlur: 2,
        extraOverlay: 0.02,
      };
    case 'overlay':
      return {
        tone: 'regular' as const,
        radius: 24,
        extraBlur: -2,
        extraOverlay: 0.01,
      };
    case 'sheet':
      return {
        tone: 'strong' as const,
        radius: 32,
        extraBlur: 0,
        extraOverlay: 0.03,
      };
    case 'panel':
      return {
        tone: 'strong' as const,
        radius: 26,
        extraBlur: 1,
        extraOverlay: 0.025,
      };
    case 'accent':
      return {
        tone: 'strong' as const,
        radius: 28,
        extraBlur: 2,
        extraOverlay: 0.04,
      };
    default:
      return {
        tone: 'regular' as const,
        radius: 24,
        extraBlur: 0,
        extraOverlay: 0,
      };
  }
}

function getGlassProfile(
  scheme: Scheme,
  tone: GlassTone,
  intensity?: number,
  tint?: 'light' | 'dark',
  variant?: GlassVariant
): GlassProfile {
  const base = Platform.select<GlassProfile>({
    ios: glassTuning.ios, // Removed unused import of `Palette`
    android: glassTuning.android,
    default: glassTuning.default,
  }) ?? glassTuning.default;

  const defaults = getVariantDefaults(variant);

  const toneFactors: Record<GlassTone, number> = {
    soft: 0.88,
    regular: 1,
    strong: 1.14,
  };

  const schemeBias = scheme === 'dark' ? 0.92 : 1;
  const variantBias = variant === 'navbar' ? 1.08 : variant === 'overlay' ? 0.94 : variant === 'sheet' ? 1.05 : 1;

  return {
    blurIntensity:
      intensity ?? Math.max(0, Math.round((base.blurIntensity + defaults.extraBlur) * toneFactors[tone] * schemeBias * variantBias)),
    overlayOpacity: Math.min(
      0.34,
      (base.overlayOpacity + defaults.extraOverlay) * toneFactors[tone] * (scheme === 'dark' ? 1.08 : 1)
    ),
    borderOpacity: Math.min(0.34, base.borderOpacity * toneFactors[tone] * (scheme === 'dark' ? 1.06 : 1)),
    tint: tint ?? base.tint,
  };
}

export type GlassContainerProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radius?: number;
  tone?: GlassTone;
  variant?: GlassVariant;
  blurIntensity?: number;
  tint?: 'light' | 'dark';
  backgroundOpacity?: number;
  borderOpacity?: number;
  borderColor?: string;
  testID?: string;
}> & ViewProps;

export function GlassContainer({
  style,
  contentStyle,
  radius,
  tone: toneProp,
  variant,
  blurIntensity,
  tint,
  backgroundOpacity,
  borderOpacity,
  borderColor,
  children,
  ...viewProps
}: GlassContainerProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = getPalette(scheme);
  const defaults = getVariantDefaults(variant);
  const tone = toneProp ?? defaults.tone;
  const profile = useMemo(
    () => getGlassProfile(scheme, tone, blurIntensity, tint, variant),
    [blurIntensity, scheme, tint, tone, variant]
  );

  const resolvedRadius = radius ?? defaults.radius;
  const overlayOpacity = backgroundOpacity ?? profile.overlayOpacity;
  const resolvedBorderOpacity = borderOpacity ?? profile.borderOpacity;
  const resolvedBorderColor = borderColor ?? palette.border;

  return (
    <View
      {...viewProps}
      style={[
        styles.glassContainer,
        {
          borderRadius: resolvedRadius,
          backgroundColor: scheme === 'dark' ? palette.surface : palette.surfaceStrong,
          borderColor: resolvedBorderColor,
          shadowColor: palette.shadow,
        },
        style,
      ]}
    >
      <BlurView intensity={profile.blurIntensity} tint={profile.tint} style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[
          `rgba(255,255,255,${scheme === 'dark' ? 0.06 : 0.22})`,
          `rgba(255,255,255,${scheme === 'dark' ? 0.02 : 0.08})`,
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            borderRadius: resolvedRadius,
            backgroundColor: `rgba(255,255,255,${overlayOpacity})`,
            borderColor: `rgba(255,255,255,${resolvedBorderOpacity})`,
            borderWidth: StyleSheet.hairlineWidth,
          },
        ]}
      />
      <View style={[styles.glassContent, contentStyle]}>{children}</View>
    </View>
  );
}

export type CardProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radius?: number;
  tone?: GlassTone;
  variant?: GlassVariant;
  elevated?: boolean;
  testID?: string;
}> & ViewProps;

export function Card({
  style,
  contentStyle,
  radius = 22,
  tone = 'strong',
  variant,
  elevated = true,
  children,
  ...viewProps
}: CardProps) { // Removed unused import of `Palette`
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <GlassContainer
      {...viewProps}
      tone={tone}
      variant={variant}
      radius={radius}
      style={[
        elevated && styles.cardElevated,
        {
          shadowColor: palette.shadow,
        },
        style,
      ]}
      contentStyle={[styles.cardContent, contentStyle]}
    >
      {children}
    </GlassContainer>
  );
}

export type ScreenScrollProps = ScrollViewProps & {
  contentStyle?: StyleProp<ViewStyle>;
  contentPaddingHorizontal?: number;
  contentPaddingTop?: number;
  contentPaddingBottom?: number;
};

export function ScreenScroll({
  contentStyle,
  contentContainerStyle,
  contentPaddingHorizontal = 20,
  contentPaddingTop = 20,
  contentPaddingBottom = 28,
  style,
  keyboardShouldPersistTaps = 'handled',
  showsVerticalScrollIndicator = false,
  ...scrollProps
}: ScreenScrollProps) {
  return ( // Removed unused import of `Palette`
    <ScrollView
      {...scrollProps}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      style={[styles.screenScroll, style]}
      contentContainerStyle={[
        styles.screenScrollContent,
        {
          paddingHorizontal: contentPaddingHorizontal,
          paddingTop: contentPaddingTop,
          paddingBottom: contentPaddingBottom,
        },
        contentStyle,
        contentContainerStyle,
      ]}
    />
  );
}

export type AppButtonProps = PropsWithChildren<
  Omit<PressableProps, 'style'> & {
    title?: string;
    label?: string;
    loading?: boolean;
    danger?: boolean;
    iconName?: IconName;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    contentStyle?: StyleProp<ViewStyle>;
  }
>;

function AppButton({
  title,
  label,
  children,
  loading = false,
  danger = false,
  iconName,
  iconPosition = 'left',
  fullWidth = true,
  style,
  textStyle,
  contentStyle,
  disabled,
  onPress,
  variant,
  ...pressableProps
}: AppButtonProps & { variant: ButtonVariant }) { // Removed unused import of `Palette`
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const isPrimary = variant === 'primary';
  const resolvedDisabled = disabled || loading;
  const dangerTextColor = dangerColor;
  const dangerBackground = scheme === 'dark' ? 'rgba(239,68,68,0.18)' : 'rgba(239,68,68,0.1)';

  return (
    <Pressable
      {...pressableProps}
      disabled={resolvedDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.buttonBase,
        fullWidth && styles.buttonFullWidth,
        isPrimary
          ? {
              backgroundColor: resolvedDisabled ? palette.primarySoft : danger ? dangerColor : palette.primary,
              borderColor: 'transparent',
            }
          : {
              backgroundColor: danger ? dangerBackground : scheme === 'dark' ? palette.surfaceStrong : palette.inputBackground,
              borderColor: danger ? dangerColor : palette.borderSoft,
            },
        pressed && !resolvedDisabled && styles.buttonPressed,
        style,
      ]}
    >
      <View style={[styles.buttonContent, contentStyle]}>
        {loading ? (
          <ActivityIndicator color={isPrimary && !danger ? palette.primaryText : danger ? dangerTextColor : palette.text} />
        ) : (
          <>
            {iconName && iconPosition === 'left' ? (
              <Ionicons
                name={iconName}
                size={18}
                color={isPrimary && !danger ? palette.primaryText : danger ? dangerTextColor : palette.text}
                style={styles.buttonIconLeft}
              />
            ) : null}
            {children ?? (
              <Text
                style={[
                  styles.buttonText,
                  {
                    color: isPrimary && !danger ? palette.primaryText : danger ? dangerTextColor : palette.text,
                  },
                  textStyle,
                ]}
              >
                {title ?? label}
              </Text>
            )}
            {iconName && iconPosition === 'right' ? (
              <Ionicons
                name={iconName}
                size={18}
                color={isPrimary && !danger ? palette.primaryText : danger ? dangerTextColor : palette.text}
                style={styles.buttonIconRight}
              />
            ) : null}
          </>
        )}
      </View>
    </Pressable>
  );
}

export function PrimaryButton(props: AppButtonProps) {
  return <AppButton {...props} variant="primary" />;
}

export function SecondaryButton(props: AppButtonProps) {
  return <AppButton {...props} variant="secondary" />;
}

export type AvatarProps = {
  uri?: string;
  name?: string;
  size?: number;
  style?: StyleProp<ViewStyle>;
};

export function Avatar({ uri, name, size = 56, style }: AvatarProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const initials = (name ?? '').trim().split(/\s+/).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('');
  const fallbackLabel = initials || 'AR';

  return (
    <View
      style={[
        styles.avatarContainer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: scheme === 'dark' ? palette.surfaceStrong : palette.inputBackground,
          borderColor: palette.borderSoft,
        },
        style,
      ]}
    >
      {uri ? (
        <Image source={{ uri }} style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]} contentFit="cover" />
      ) : (
        <Text style={[styles.avatarFallbackText, { color: palette.text }]}>{fallbackLabel}</Text>
      )}
    </View>
  );
}

export type BadgeProps = {
  label: ReactNode;
  tone?: 'default' | 'success' | 'warning' | 'brand' | 'danger';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Badge({ label, tone = 'default', style, textStyle }: BadgeProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  const toneColors = {
    default: { backgroundColor: scheme === 'dark' ? palette.surfaceStrong : palette.inputBackground, color: palette.textMuted },
    success: { backgroundColor: 'rgba(34,197,94,0.14)', color: '#16A34A' },
    warning: { backgroundColor: 'rgba(245,158,11,0.16)', color: '#D97706' },
    brand: { backgroundColor: 'rgba(37,99,235,0.14)', color: palette.primary },
    danger: { backgroundColor: 'rgba(239,68,68,0.14)', color: dangerColor },
  } as const;

  const resolved = toneColors[tone];

  return (
    <View
      style={[
        styles.badgeContainer,
        {
          backgroundColor: resolved.backgroundColor,
          borderColor: 'transparent',
        },
        style,
      ]}
    >
      <Text style={[styles.badgeText, { color: resolved.color }, textStyle]}>{label}</Text>
    </View>
  );
}

export type SectionProps = PropsWithChildren<{
  title: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
}>;

export function Section({ title, subtitle, action, children, style, contentStyle }: SectionProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <View style={[styles.sectionWrap, style]}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionHeaderCopy}>
          <Text style={[styles.sectionTitleText, { color: palette.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.sectionSubtitleText, { color: palette.textMuted }]}>{subtitle}</Text> : null}
        </View>
        {action ? <View>{action}</View> : null}
      </View>
      <View style={contentStyle}>{children}</View>
    </View>
  );
}

export type InfoRowProps = PropsWithChildren<{
  label: ReactNode;
  value?: ReactNode;
  style?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  valueStyle?: StyleProp<TextStyle>;
}>;

export function InfoRow({ label, value, children, style, labelStyle, valueStyle }: InfoRowProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <View style={[styles.infoRow, style]}>
      <Text style={[styles.infoLabel, { color: palette.textMuted }, labelStyle]}>{label}</Text>
      {children ?? <Text style={[styles.infoValue, { color: palette.text }, valueStyle]}>{value}</Text>}
    </View>
  );
}

export type IconButtonProps = Omit<PressableProps, 'style'> & {
  icon: IconName;
  label?: string;
  tone?: string;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
};

export function IconButton({ icon, label, tone, style, contentStyle, ...pressableProps }: IconButtonProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const resolvedTone = tone ?? palette.text;

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole="button"
      style={({ pressed }) => [styles.iconButton, pressed && styles.pillPressed, style]}
    >
      <GlassContainer
        variant="overlay"
        tone="soft"
        radius={16}
        style={[styles.iconButtonGlass, { borderColor: palette.borderSoft }]}
        contentStyle={[styles.iconButtonContent, contentStyle]}
      >
        <Ionicons name={icon} size={18} color={resolvedTone} />
        {label ? <Text style={[styles.iconButtonLabel, { color: resolvedTone }]}>{label}</Text> : null}
      </GlassContainer>
    </Pressable>
  );
}

export type TextFieldProps = TextInputProps & {
  label?: ReactNode;
  helperText?: ReactNode;
  error?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  labelStyle?: StyleProp<TextStyle>;
  inputStyle?: StyleProp<TextStyle>;
  rightAccessory?: ReactNode;
};

export function TextField({
  label,
  helperText,
  error,
  containerStyle,
  labelStyle,
  inputStyle,
  rightAccessory,
  style,
  editable = true,
  secureTextEntry,
  ...textInputProps
}: TextFieldProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isPassword = secureTextEntry;
  const resolvedSecureEntry = isPassword && !isPasswordVisible;

  return (
    <View style={[styles.textFieldWrap, containerStyle]}>
      {label ? <Text style={[styles.textFieldLabel, { color: palette.textMuted }, labelStyle]}>{label}</Text> : null}
      <GlassContainer
        variant="overlay"
        tone="soft"
        radius={18}
        style={[
          styles.textFieldGlass,
          {
            borderColor: error ? dangerColor : palette.borderSoft,
          },
        ]}
      >
        <View style={styles.textFieldRow}>
          <TextInput
            {...textInputProps}
            editable={editable}
            placeholderTextColor={textInputProps.placeholderTextColor ?? palette.textMuted}
            style={[styles.textFieldInput, { color: palette.text }, inputStyle, style]}
          />
          {(rightAccessory || isPassword) ? (
            <View style={styles.textFieldAccessory}>
              {isPassword && (
                <Pressable onPress={() => setIsPasswordVisible(!isPasswordVisible)} hitSlop={10} style={{ paddingRight: 4 }}>
                  <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={20} color={palette.textMuted} />
                </Pressable>
              )}
              {rightAccessory}
            </View>
          ) : null}
        </View>
      </GlassContainer>
      {error ? <Text style={[styles.textFieldError, { color: dangerColor }]}>{error}</Text> : null}
      {!error && helperText ? <Text style={[styles.textFieldHelper, { color: palette.textMuted }]}>{helperText}</Text> : null}
    </View>
  );
}

export type EmptyStateProps = {
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  icon?: IconName;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({ title, description, action, icon = 'folder-open-outline', style }: EmptyStateProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Card radius={28} tone="strong" contentStyle={[styles.emptyState, style]}>
      <Ionicons name={icon} size={34} color={palette.textMuted} />
      <Text style={[styles.emptyStateTitle, { color: palette.text }]}>{title}</Text>
      {description ? <Text style={[styles.emptyStateDescription, { color: palette.textMuted }]}>{description}</Text> : null}
      {action ? <View style={styles.emptyStateAction}>{action}</View> : null}
    </Card>
  );
}

export type FilterChipProps = PillProps;

export function FilterChip(props: FilterChipProps) {
  return <Pill {...props} />;
}

export type GradientCardProps = PropsWithChildren<{
  colors: readonly [string, string, ...string[]];
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  radius?: number;
}>;

export function GradientCard({ colors, style, contentStyle, radius = 24, children }: GradientCardProps) {
  return (
    <View style={[styles.gradientCardShell, { borderRadius: radius }, style]}>
      <LinearGradient colors={colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={[styles.gradientCardContent, contentStyle]}>{children}</View>
    </View>
  );
}

export type StatCardProps = {
  label: ReactNode;
  value: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function StatCard({ label, value, style }: StatCardProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Card radius={22} tone="strong" contentStyle={[styles.statCardContent, style]}>
      <Text style={[styles.statCardLabel, { color: palette.textMuted }]}>{label}</Text>
      <Text style={[styles.statCardValue, { color: palette.text }]}>{value}</Text>
    </Card>
  );
}

export type StepIndicatorProps = {
  steps: string[];
  current: number;
  style?: StyleProp<ViewStyle>;
};

export function StepIndicator({ steps, current, style }: StepIndicatorProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <View style={[styles.stepIndicatorWrap, style]}>
      {steps.map((step, index) => {
        const active = index <= current - 1;
        return (
          <View key={`${step}-${index}`} style={styles.stepIndicatorItem}>
            <View
              style={[
                styles.stepIndicatorDot,
                {
                  backgroundColor: active ? palette.primary : palette.borderSoft,
                },
              ]}
            />
            <Text style={[styles.stepIndicatorText, { color: active ? palette.text : palette.textMuted }]}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
}

export type SkeletonBlockProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  style?: StyleProp<ViewStyle>;
};

export function SkeletonBlock({ width = '100%', height = 16, style }: SkeletonBlockProps) {
  return <View style={[styles.skeletonPlaceholder, { width, height }, style]} />;
}

export type ConversationRowProps = {
  title: ReactNode;
  preview?: ReactNode;
  time?: ReactNode;
  unread?: number;
  avatar?: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ConversationRow({ title, preview, time, unread = 0, avatar, onPress, style }: ConversationRowProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [pressed && styles.propertyCardPressed, style]}>
      <Card radius={24} tone="strong" contentStyle={styles.conversationRowContent}>
        <Avatar uri={avatar} size={46} />
        <View style={styles.conversationRowCopy}>
          <View style={styles.conversationRowHeader}>
            <Text style={[styles.conversationRowTitle, { color: palette.text }]} numberOfLines={1}>
              {title}
            </Text>
            {time ? <Text style={[styles.conversationRowTime, { color: palette.textMuted }]}>{time}</Text> : null}
          </View>
          {preview ? (
            <Text style={[styles.conversationRowPreview, { color: palette.textMuted }]} numberOfLines={2}>
              {preview}
            </Text>
          ) : null}
        </View>
        {unread > 0 ? <View style={[styles.conversationUnread, { backgroundColor: palette.primary }]} /> : null}
      </Card>
    </Pressable>
  );
}

export type NotificationRowProps = {
  title: ReactNode;
  body?: ReactNode;
  time?: ReactNode;
  unread?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function NotificationRow({ title, body, time, unread = false, onPress, style }: NotificationRowProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [pressed && styles.propertyCardPressed, style]}>
      <Card radius={24} tone="strong" contentStyle={styles.notificationRowContent}>
        <View style={[styles.notificationDot, { backgroundColor: unread ? palette.primary : 'transparent' }]} />
        <View style={styles.notificationCopy}>
          <Text style={[styles.notificationTitle, { color: palette.text }]}>{title}</Text>
          {body ? <Text style={[styles.notificationBody, { color: palette.textMuted }]}>{body}</Text> : null}
          {time ? <Text style={[styles.notificationTime, { color: palette.textMuted }]}>{time}</Text> : null}
        </View>
      </Card>
    </Pressable>
  );
}

export type MessageBubbleProps = {
  text: ReactNode;
  mine?: boolean;
  time?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function MessageBubble({ text, mine = false, time, style }: MessageBubbleProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <View style={[styles.messageBubbleWrap, mine && styles.messageBubbleMineWrap, style]}>
      <View
        style={[
          styles.messageBubble,
          {
            backgroundColor: mine ? palette.primary : scheme === 'dark' ? palette.surfaceStrong : palette.inputBackground,
            borderColor: palette.borderSoft,
          },
          mine && styles.messageBubbleMine,
        ]}
      >
        <Text style={[styles.messageBubbleText, { color: mine ? palette.primaryText : palette.text }]}>{text}</Text>
      </View>
      {time ? <Text style={[styles.messageBubbleTime, { color: palette.textMuted }]}>{time}</Text> : null}
    </View>
  );
}

export type BookingCardProps = {
  id: string;
  title: ReactNode;
  status?: string;
  subtitle?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BookingCard({ title, status, subtitle, onPress, style }: BookingCardProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [pressed && styles.propertyCardPressed, style]}>
      <Card radius={24} tone="strong" contentStyle={styles.bookingCardContent}>
        <View style={styles.bookingCardHeader}>
          <Text style={[styles.bookingCardTitle, { color: palette.text }]} numberOfLines={1}>
            {title}
          </Text>
          {status ? <Badge label={status} tone={status === 'upcoming' ? 'brand' : status === 'warning' ? 'warning' : 'default'} /> : null}
        </View>
        {subtitle ? <Text style={[styles.bookingCardSubtitle, { color: palette.textMuted }]}>{subtitle}</Text> : null}
      </Card>
    </Pressable>
  );
}

export type CheckboxRowProps = {
  label: ReactNode;
  checked: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function CheckboxRow({ label, checked, onPress, style }: CheckboxRowProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Pressable onPress={onPress} accessibilityRole="checkbox" accessibilityState={{ checked }} style={({ pressed }) => [styles.checkboxRow, pressed && styles.pillPressed, style]}>
      <Ionicons name={checked ? 'checkbox' : 'checkbox-outline'} size={20} color={checked ? palette.primary : palette.textMuted} />
      <Text style={[styles.checkboxLabel, { color: palette.text }]}>{label}</Text>
    </Pressable>
  );
}

export type ToggleRowProps = {
  label: ReactNode;
  value: boolean;
  onToggle: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ToggleRow({ label, value, onToggle, style }: ToggleRowProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  const handleToggle = () => {
    Haptics.selectionAsync();
    onToggle();
  };

  return (
    <View style={[styles.toggleRow, style]}>
      <Text style={[styles.toggleRowLabel, { color: palette.text }]}>{label}</Text>
      <Switch
        value={value}
        onValueChange={handleToggle}
        trackColor={{ false: palette.borderSoft, true: palette.primarySoft }}
        thumbColor={value ? palette.primary : scheme === 'dark' ? palette.textMuted : '#FFFFFF'}
      />
    </View>
  );
}

export type AmenitiesGridProps = {
  amenities: string[];
  language?: string;
  style?: StyleProp<ViewStyle>;
};

export function AmenitiesGrid({ amenities, style }: AmenitiesGridProps) {
  return (
    <View style={[styles.amenitiesGrid, style]}>
      {amenities.map((amenity) => (
        <Pill key={amenity} label={amenity} />
      ))}
    </View>
  );
}

export type MapPreviewProps = {
  title: ReactNode;
  subtitle?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function MapPreview({ title, subtitle, onPress, style }: MapPreviewProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Pressable onPress={onPress} accessibilityRole="button" style={({ pressed }) => [pressed && styles.propertyCardPressed, style]}>
      <Card radius={24} tone="strong" contentStyle={styles.mapPreviewContent}>
        <Ionicons name="map-outline" size={24} color={palette.primary} />
        <View style={styles.mapPreviewCopy}>
          <Text style={[styles.mapPreviewTitle, { color: palette.text }]}>{title}</Text>
          {subtitle ? <Text style={[styles.mapPreviewSubtitle, { color: palette.textMuted }]}>{subtitle}</Text> : null}
        </View>
      </Card>
    </Pressable>
  );
}

export type RatingStarsProps = {
  rating: number;
  count?: number;
  style?: StyleProp<ViewStyle>;
};

export function RatingStars({ rating, count, style }: RatingStarsProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const filled = Math.round(rating);

  return (
    <View style={[styles.ratingStarsRow, style]}>
      {Array.from({ length: 5 }).map((_, index) => (
        <Ionicons key={index} name={index < filled ? 'star' : 'star-outline'} size={14} color={palette.primary} />
      ))}
      <Text style={[styles.ratingStarsText, { color: palette.text }]}>{rating.toFixed(1)}</Text>
      {typeof count === 'number' ? <Text style={[styles.ratingStarsCount, { color: palette.textMuted }]}>{`(${count})`}</Text> : null}
    </View>
  );
}

export type GalleryStripProps = {
  photos: string[];
  style?: StyleProp<ViewStyle>;
};

export function GalleryStrip({ photos, style }: GalleryStripProps) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.galleryStripContent, style]}>
      {photos.map((photo, index) => (
        <Image
          key={`${photo}-${index}`}
          source={{ uri: photo }}
          style={styles.galleryImage}
          contentFit="cover"
          transition={200} // Плавное появление картинки
        />
      ))}
    </ScrollView>
  );
}

export type ContactCTAProps = {
  price: ReactNode;
  onBook?: () => void;
  onMessage?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function ContactCTA({ price, onBook, onMessage, style }: ContactCTAProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <GlassContainer variant="navbar" tone="strong" radius={28} style={[styles.contactCtaShell, style]}>
      <View style={styles.contactCtaTop}>
        <Text style={[styles.contactCtaLabel, { color: palette.textMuted }]}>Price</Text>
        <Text style={[styles.contactCtaPrice, { color: palette.text }]}>{price}</Text>
      </View>
      <View style={styles.contactCtaButtons}>
        <SecondaryButton label="Message" onPress={onMessage} style={styles.contactCtaButton} />
        <PrimaryButton label="Book now" onPress={onBook} style={styles.contactCtaButton} />
      </View>
    </GlassContainer>
  );
}

export type AppScreenProps = ViewProps;

export function AppScreen({ style, children, ...viewProps }: AppScreenProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  // Double safety: fallback to hardcoded color if palette object is missing at runtime
  return (
    <View {...viewProps} style={[{ flex: 1, backgroundColor: palette?.background ?? '#F5F7FB' }, style]}>
      {children}
    </View>
  );
}

export type SearchBarProps = TextInputProps & {
  containerStyle?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  leadingIcon?: IconName;
  onClear?: () => void;
};

export function SearchBar({
  containerStyle,
  inputStyle,
  leadingIcon = 'search-outline',
  onClear,
  value,
  placeholderTextColor,
  editable = true,
  ...textInputProps
}: SearchBarProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const hasValue = String(value ?? '').length > 0;

  return (
    <GlassContainer
      radius={22}
      tone="soft"
      variant="overlay"
      style={[styles.searchBarContainer, containerStyle]}
      contentStyle={styles.searchBarContent}
    >
      <Ionicons name={leadingIcon} size={18} color={palette.textMuted} style={styles.searchIcon} />
      <TextInput
        {...textInputProps}
        editable={editable}
        value={value}
        placeholderTextColor={placeholderTextColor ?? palette.textMuted}
        style={[styles.searchInput, { color: palette.text }, inputStyle]}
      />
      {hasValue && onClear ? (
        <Pressable hitSlop={10} onPress={onClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={18} color={palette.textMuted} />
        </Pressable>
      ) : null}
    </GlassContainer>
  );
}

export type BottomStickyBarProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  safeBottomOffset?: number;
}> & ViewProps;

export function BottomStickyBar({
  style,
  contentStyle,
  safeBottomOffset = 12,
  children,
  ...viewProps
}: BottomStickyBarProps) {
  const insets = useSafeAreaInsets();
  const { colors: palette, mode: scheme } = useAppTheme(); // Use useAppTheme here

  return (
    <View
      {...viewProps}
      style={[
        styles.stickyBarShell,
        {
          paddingBottom: Math.max(insets.bottom, safeBottomOffset),
        },
        style,
      ]}
    >
      <GlassContainer
        tone="strong"
        variant="navbar"
        radius={28}
        style={[
          styles.stickyBarGlass,
          {
            backgroundColor: scheme === 'dark' ? palette.surfaceStrong : palette.surface,
            shadowColor: palette.shadow,
          },
        ]}
        contentStyle={[styles.stickyBarContent, contentStyle]}
      >
        {children}
      </GlassContainer>
    </View>
  );
}

export type SheetHandleProps = {
  label?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SheetHandle({ label, style }: SheetHandleProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <View style={[styles.sheetHandleWrap, style]}>
      <View style={[styles.sheetHandleBar, { backgroundColor: palette.borderSoft }]} />
      {label ? <Text style={[styles.sheetHandleLabel, { color: palette.textMuted }]}>{label}</Text> : null}
    </View>
  );
}

export type BottomSheetProps = PropsWithChildren<{
  visible: boolean;
  onClose: () => void;
  title?: ReactNode;
  hint?: ReactNode;
  footer?: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  panelStyle?: StyleProp<ViewStyle>;
  maxHeightRatio?: number;
}>;

export function BottomSheet({
  visible,
  onClose,
  title,
  hint,
  footer,
  children,
  contentStyle,
  panelStyle,
  maxHeightRatio = 0.86,
}: BottomSheetProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();
  const [mounted, setMounted] = useState(visible);
  const [contentHeight, setContentHeight] = useState(windowHeight * 0.45);
  const progress = useSharedValue(visible ? 1 : 0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, {
        duration: 260,
        easing: Easing.out(Easing.cubic),
      });
      return;
    }

    if (!mounted) {
      return;
    }

    progress.value = withTiming(
      0,
      {
        duration: 220,
        easing: Easing.in(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          runOnJS(setMounted)(false);
        }
      }
    );
  }, [mounted, progress, visible]);

  const maxHeight = Math.min(windowHeight * maxHeightRatio, windowHeight - insets.top - 32);
  const targetHeight = Math.min(Math.max(contentHeight, 240), maxHeight);

  const animatedSheetStyle = useAnimatedStyle(() => {
    return {
      height: interpolate(progress.value, [0, 1], [0, targetHeight]),
      opacity: interpolate(progress.value, [0, 1], [0, 1]),
      transform: [
        {
          translateY: interpolate(progress.value, [0, 1], [28, 0]),
        },
      ],
    };
  }, [targetHeight]);

  if (!mounted) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={mounted}
      animationType="none"
      presentationStyle="overFullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.sheetRoot}>
        <Pressable style={[StyleSheet.absoluteFill, { backgroundColor: palette.backdrop }]} onPress={onClose} />
        <View style={[styles.sheetDock, { paddingBottom: Math.max(insets.bottom, 12) + 8 }]}>
          <Animated.View style={[styles.sheetAnimatedWrapper, animatedSheetStyle, panelStyle]}>
            <GlassContainer
              radius={32}
              variant="sheet"
              tone="strong"
              style={[
                styles.sheetGlass,
                {
                  borderColor: palette.borderSoft,
                  shadowColor: palette.shadow,
                },
              ]}
              contentStyle={styles.sheetGlassContent}
            >
              <View
                onLayout={(event) => {
                  const nextHeight = event.nativeEvent.layout.height;
                  if (nextHeight > 0) {
                    setContentHeight(nextHeight);
                  }
                }}
                style={styles.sheetMeasuredContent}
              >
                <SheetHandle label={hint} style={styles.sheetHandleTopSpacing} />
                {title ? <Text style={[styles.sheetTitle, { color: palette.text }]}>{title}</Text> : null}
                <View style={[styles.sheetBody, contentStyle]}>{children}</View>
                {footer ? <View style={styles.sheetFooter}>{footer}</View> : null}
              </View>
            </GlassContainer>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

export type PillProps = {
  label: string;
  active?: boolean;
  icon?: IconName;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
};

export function Pill({ label, active = false, icon, onPress, style, textStyle, testID }: PillProps) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [
        styles.pillPressable,
        active && styles.pillPressableActive,
        pressed && styles.pillPressed,
        style,
      ]}
    >
      <GlassContainer
        variant="overlay"
        tone={active ? 'strong' : 'soft'}
        radius={999}
        style={[
          styles.pillContainer,
          {
            borderColor: active ? palette.primary : palette.borderSoft,
          },
        ]}
        contentStyle={styles.pillContent}
      >
        {icon ? <Ionicons name={icon} size={16} color={active ? palette.primary : palette.textMuted} /> : null}
        <Text style={[styles.pillText, { color: active ? palette.primary : palette.text }, textStyle]}>{label}</Text>
      </GlassContainer>
    </Pressable>
  );
}

export type PropertyCardProps = {
  item: Property;
  language: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  testID?: string;
};

function resolvePropertyText(property: Property, key: 'title' | 'description', language: string) {
  const dictionary = property[key] as LocalizedText | undefined;
  if (!dictionary) {
    return '';
  }

  const localizedKey = language as keyof LocalizedText;
  return dictionary[localizedKey] ?? dictionary.en ?? Object.values(dictionary)[0] ?? '';
}

export const PropertyCard = React.memo(({ item, language, onPress, style, contentStyle, testID }: PropertyCardProps) => {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  const title = resolvePropertyText(item, 'title', language);
  const description = resolvePropertyText(item, 'description', language);

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [pressed && styles.propertyCardPressed, style]}
    >
      <Card
        radius={24}
        tone="strong"
        contentStyle={[styles.propertyCardContent, contentStyle]}
        style={[
          styles.propertyCardShell,
          {
            borderColor: palette.borderSoft,
          },
        ]}
      >
        <View style={styles.propertyCardHeader}>
          <View style={styles.propertyCardTitleWrap}>
            <Text style={[styles.propertyCardTitle, { color: palette.text }]} numberOfLines={1}>
              {title}
            </Text>
            <Text style={[styles.propertyCardAddress, { color: palette.textMuted }]} numberOfLines={2}>
              {item.address}
            </Text>
          </View>
          {item.isVerified ? <Ionicons name="checkmark-circle" size={20} color={palette.primary} /> : null}
        </View>

        <View style={styles.propertyCardMetaRow}>
          <View style={styles.propertyCardMetaItem}>
            <Ionicons name="star" size={14} color={palette.primary} />
            <Text style={[styles.propertyCardMetaText, { color: palette.text }]}>{item.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.propertyCardMetaItem}>
            <Ionicons name="chatbubble-ellipses-outline" size={14} color={palette.textMuted} />
            <Text style={[styles.propertyCardMetaText, { color: palette.textMuted }]}>{item.reviewCount}</Text>
          </View>
          <View style={styles.propertyCardMetaItem}>
            <Ionicons name="location-outline" size={14} color={palette.textMuted} />
            <Text style={[styles.propertyCardMetaText, { color: palette.textMuted }]} numberOfLines={1}>
              {item.district}
            </Text>
          </View>
        </View>

        <Text style={[styles.propertyCardDescription, { color: palette.textMuted }]} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.propertyCardFooter}>
          <Text style={[styles.propertyCardPrice, { color: palette.primary }]}>
            {formatCurrency(item.price, 'UZS')}
          </Text>
          <Text style={[styles.propertyCardType, { color: palette.textMuted }]}>{item.type}</Text>
        </View>
      </Card>
    </Pressable>
  );
});

export function FullScreenLoader({ visible, label }: { visible: boolean; label?: string }) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes
  if (!visible) return null;
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut} style={[StyleSheet.absoluteFill, styles.fullLoader, { backgroundColor: palette.backdrop }]}>
      <GlassContainer radius={24} tone="strong" contentStyle={styles.fullLoaderContent}>
        <ActivityIndicator size="large" color={palette.primary} />
        {label ? <Text style={[styles.fullLoaderLabel, { color: palette.text }]}>{label}</Text> : null}
      </GlassContainer>
    </Animated.View>
  );
}

export function Toast({ visible, message, type = 'success' }: { visible: boolean; message: string; type?: 'success' | 'error' }) {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = getPalette(scheme);
  const insets = useSafeAreaInsets();
  if (!visible) return null;
  return (
    <Animated.View entering={FadeIn.duration(300)} exiting={FadeOut} style={[styles.toastWrapper, { top: insets.top + 10 }]}>
      <GlassContainer radius={16} tone="strong" style={{ borderColor: type === 'error' ? dangerColor : palette.primary }}>
        <View style={styles.toastContent}>
          <Ionicons name={type === 'success' ? 'checkmark-circle' : 'alert-circle'} size={20} color={type === 'error' ? dangerColor : palette.primary} />
          <Text style={[styles.toastText, { color: palette.text }]}>{message}</Text>
        </View>
      </GlassContainer>
    </Animated.View>
  );
}

export function PropertyCardSkeleton() {
  const scheme = (useColorScheme() ?? 'light') as Scheme;
  const palette = scheme === 'dark' ? darkPalette : lightPalette; // Directly use imported palettes

  return (
    <Card
      radius={24}
      tone="strong"
      style={[
        styles.propertyCardShell,
        {
          borderColor: palette.borderSoft,
          opacity: 0.78,
        },
      ]}
      contentStyle={styles.propertyCardContent}
    >
      <View style={[styles.skeletonLine, { width: '64%' }]} />
      <View style={[styles.skeletonLine, { width: '88%' }]} />
      <View style={[styles.skeletonLine, { width: '52%' }]} />
      <View style={styles.skeletonRow}>
        <View style={[styles.skeletonBadge, { width: 74 }]} />
        <View style={[styles.skeletonBadge, { width: 54 }]} />
      </View>
    </Card>
  );
}

export function formatCurrency(value: number, currency: string, locale?: string) {
  try {
    return new Intl.NumberFormat(locale ?? 'en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${currency} ${Math.round(value).toLocaleString()}`;
  }
}

export function useResponsive() {
  const { width, height } = useWindowDimensions();

  return useMemo(
    () => ({
      isTablet: width >= 768,
      columns: width >= 900 ? 3 : width >= 600 ? 2 : 1,
      mapHeight: Math.max(360, Math.min(560, Math.round(height * 0.5))),
    }),
    [height, width]
  );
}

const styles = StyleSheet.create({
  glassContainer: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 0,
  },
  glassContent: {
    position: 'relative',
  },
  cardElevated: {
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  cardContent: {
    gap: 12,
  },
  screenScroll: {
    flex: 1,
  },
  screenScrollContent: {
    flexGrow: 1,
  },
  buttonBase: {
    minHeight: 48,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  buttonFullWidth: {
    width: '100%',
  },
  buttonPressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  buttonContent: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  buttonIconLeft: {
    marginRight: 2,
  },
  buttonIconRight: {
    marginLeft: 2,
  },
  searchBarContainer: {
    borderRadius: 22,
  },
  searchBarContent: {
    minHeight: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  searchIcon: {
    marginTop: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyBarShell: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  stickyBarGlass: {
    overflow: 'hidden',
  },
  stickyBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sheetRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetDock: {
    paddingHorizontal: 16,
  },
  sheetAnimatedWrapper: {
    overflow: 'hidden',
  },
  sheetGlass: {
    overflow: 'hidden',
  },
  sheetGlassContent: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  sheetMeasuredContent: {
    gap: 12,
  },
  sheetHandleTopSpacing: {
    marginBottom: 2,
  },
  sheetHandleWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingTop: 2,
  },
  sheetHandleBar: {
    width: 44,
    height: 5,
    borderRadius: 999,
    opacity: 0.7,
  },
  sheetHandleLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  sheetBody: {
    gap: 12,
  },
  sheetFooter: {
    paddingTop: 4,
  },
  pillPressable: {
    borderRadius: 999,
  },
  pillPressableActive: {
    zIndex: 1,
  },
  pillPressed: {
    opacity: 0.9,
  },
  pillContainer: {
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
  },
  pillContent: {
    minHeight: 38,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  propertyCardShell: {
    borderWidth: StyleSheet.hairlineWidth,
  },
  propertyCardPressed: {
    opacity: 0.98,
    transform: [{ scale: 0.995 }],
  },
  propertyCardContent: {
    gap: 10,
  },
  propertyCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  propertyCardTitleWrap: {
    flex: 1,
    gap: 4,
  },
  propertyCardTitle: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  propertyCardAddress: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '500',
  },
  propertyCardMetaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  propertyCardMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  propertyCardMetaText: {
    fontSize: 12,
    fontWeight: '700',
  },
  propertyCardDescription: {
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  propertyCardFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    gap: 12,
  },
  propertyCardPrice: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  propertyCardType: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.16)',
  },
  skeletonRow: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 4,
  },
  skeletonBadge: {
    height: 28,
    borderRadius: 999,
    backgroundColor: 'rgba(148,163,184,0.12)',
  },
  avatarContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  avatarFallbackText: {
    fontSize: 18,
    fontWeight: '700',
  },
  badgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  sectionWrap: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderCopy: {
    flex: 1,
  },
  sectionTitleText: {
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: -0.2,
  },
  sectionSubtitleText: {
    fontSize: 14,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  iconButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  iconButtonGlass: {
    borderRadius: 16,
  },
  iconButtonContent: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  iconButtonLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  textFieldWrap: {
    gap: 8,
  },
  textFieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 4,
  },
  textFieldGlass: {
    borderRadius: 18,
  },
  textFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    minHeight: 52,
  },
  textFieldInput: {
    flex: 1,
    fontSize: 15,
  },
  textFieldAccessory: {
    marginLeft: 8,
  },
  textFieldError: {
    fontSize: 12,
    marginLeft: 4,
  },
  textFieldHelper: {
    fontSize: 12,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  emptyStateAction: {
    marginTop: 8,
  },
  gradientCardShell: {
    overflow: 'hidden',
  },
  gradientCardContent: {
    padding: 16,
  },
  statCardContent: {
    padding: 16,
    gap: 4,
  },
  statCardLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  stepIndicatorWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
  stepIndicatorItem: {
    alignItems: 'center',
    gap: 6,
  },
  stepIndicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepIndicatorText: {
    fontSize: 11,
    fontWeight: '700',
  },
  skeletonPlaceholder: {
    backgroundColor: 'rgba(148,163,184,0.12)',
    borderRadius: 8,
  },
  conversationRowContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  conversationRowCopy: {
    flex: 1,
    gap: 2,
  },
  conversationRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationRowTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  conversationRowTime: {
    fontSize: 12,
  },
  conversationRowPreview: {
    fontSize: 13,
  },
  conversationUnread: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  notificationRowContent: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  notificationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
  },
  notificationCopy: {
    flex: 1,
    gap: 4,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  notificationBody: {
    fontSize: 13,
    lineHeight: 18,
  },
  notificationTime: {
    fontSize: 12,
  },
  messageBubbleWrap: {
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  messageBubbleMineWrap: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: StyleSheet.hairlineWidth,
    maxWidth: '80%',
  },
  messageBubbleMine: {
    borderBottomRightRadius: 4,
  },
  messageBubbleText: {
    fontSize: 15,
    lineHeight: 20,
  },
  messageBubbleTime: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 4,
  },
  bookingCardContent: {
    padding: 16,
    gap: 8,
  },
  bookingCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingCardTitle: {
    fontSize: 16,
    fontWeight: '800',
    flex: 1,
  },
  bookingCardSubtitle: {
    fontSize: 13,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
  },
  checkboxLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  toggleRowLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  mapPreviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  mapPreviewCopy: {
    flex: 1,
  },
  mapPreviewTitle: {
    fontSize: 15,
    fontWeight: '800',
  },
  mapPreviewSubtitle: {
    fontSize: 13,
  },
  ratingStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingStarsText: {
    fontSize: 12,
    fontWeight: '800',
    marginLeft: 2,
  },
  ratingStarsCount: {
    fontSize: 12,
  },
  galleryStripContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  galleryImage: {
    width: 280,
    height: 180,
    borderRadius: 20,
  },
  contactCtaShell: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  contactCtaTop: {
    gap: 2,
  },
  contactCtaLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  contactCtaPrice: {
    fontSize: 18,
    fontWeight: '800',
  },
  contactCtaButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  contactCtaButton: {
    width: undefined,
    paddingHorizontal: 20,
  },
  fullLoader: {
    zIndex: 9999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullLoaderContent: {
    padding: 32,
    gap: 16,
    alignItems: 'center',
  },
  fullLoaderLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  toastWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10000,
  },
  toastContent: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toastText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
