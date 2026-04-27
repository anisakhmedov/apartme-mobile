import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { colors } from "@/theme";
import { useResponsive } from "@/components/ui";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  FadeIn,
  FadeOut,
  runOnJS
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(View);

export function SplashScreen() {
  const navigation = useNavigation<any>();
  const responsive = useResponsive();
  const logoScale = useSharedValue(0);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // Logo animation: scale(0) to scale(1) with spring
    logoScale.value = withSpring(1, {
      damping: 15,
      stiffness: 120,
      duration: 600,
    });

    // Check for auth token
    const checkAuth = async () => {
      try {
        const token = await SecureStore.getItemAsync("authToken");
        
        // Wait for logo animation to complete
        setTimeout(() => {
          screenOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
            if (finished) {
              runOnJS(navigateNext)(token);
            }
          });
        }, 800);
      } catch (error) {
        console.error("Error checking auth:", error);
        setTimeout(() => {
          screenOpacity.value = withTiming(0, { duration: 400 }, (finished) => {
            if (finished) {
              runOnJS(navigateNext)(null);
            }
          });
        }, 800);
      }
    };

    checkAuth();
  }, []);

  const navigateNext = (token: string | null) => {
    if (token) {
      navigation.replace("MainTabs");
    } else {
      navigation.replace("Onboarding");
    }
  };

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const screenAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, screenAnimatedStyle]}>
      <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="home-city-outline" size={46} color={colors.white} />
        </View>
        <Animated.Text entering={FadeIn.duration(400).delay(300)} style={styles.brandTitle}>
          SamarkandRent
        </Animated.Text>
      </Animated.View>

      {/* Language Selection */}
      <Animated.View 
        entering={FadeIn.duration(400).delay(500)}
        style={styles.languageRow}
      >
        <LanguageButton flag="🇷🇺" code="ru" label="RU" />
        <LanguageButton flag="🇺🇸" code="en" label="EN" />
        <LanguageButton flag="🇺🇿" code="uz" label="UZ" />
      </Animated.View>
    </Animated.View>
  );
}

function LanguageButton({ flag, code, label }: { flag: string; code: string; label: string }) {
  const { useAppDispatch } from "@/store";
  const { useTranslation } from "react-i18next";
  const { t } = useTranslation("auth");
  const currentLanguage = useAppSelector((state: any) => state.preferences.language);
  const dispatch = useAppDispatch();
  const isActive = currentLanguage === code;

  const handlePress = async () => {
    await dispatch({ type: "preferences/setLanguage", payload: code });
    await AsyncStorage.setItem("lang", code);
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.languageButton, isActive && styles.languageButtonActive]}
    >
      <Text style={styles.flagText}>{flag}</Text>
      <Text style={[styles.languageLabel, isActive && styles.languageLabelActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: 0.5,
  },
  languageRow: {
    flexDirection: "row",
    marginTop: 48,
    gap: 16,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  languageButton: {
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
    backgroundColor: "rgba(255,255,255,0.15)",
    minWidth: 80,
  },
  languageButtonActive: {
    borderColor: colors.white,
  },
  flagText: {
    fontSize: 32,
    marginBottom: 4,
  },
  languageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
  },
  languageLabelActive: {
    color: colors.white,
  },
});
