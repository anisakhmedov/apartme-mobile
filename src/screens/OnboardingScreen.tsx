import React, { useState } from "react";
import { FlatList, View, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
  FadeIn,
} from "react-native-reanimated";
import { useNavigation, type NavigationProp } from "@react-navigation/native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { colors } from "@/theme";
import { PrimaryButton, SecondaryButton } from "@/components/ui";
import { useResponsive } from "@/components/ui";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as typeof FlatList;

interface Slide {
  id: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  body: string;
  illustration: string;
}

// Define a type for your navigation stack if you have one
// For example: type RootStackParamList = { Login: undefined; Register: undefined; };
// Then use useNavigation<NavigationProp<RootStackParamList>>();

export function OnboardingScreen() {
  const { t } = useTranslation("auth");
  const navigation = useNavigation(); // Using `any` for simplicity, consider defining a proper type
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const responsive = useResponsive();
  const flatListRef = React.useRef<FlatList>(null);

  const slides: Slide[] = [
    {
      id: "1",
      icon: "map-marker-radius",
      title: t("slide1Title"),
      body: t("slide1Body"),
      illustration: "registan",
    },
    {
      id: "2",
      icon: "calendar-check",
      title: t("slide2Title"),
      body: t("slide2Body"),
      illustration: "calendar",
    },
    {
      id: "3",
      icon: "chat-processing",
      title: t("slide3Title"),
      body: t("slide3Body"),
      illustration: "host",
    },
  ];

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollX.value = event.contentOffset.x;
    },
  });

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    }
  };

  const handleSkip = () => {
    navigation.navigate("Login");
  };

  const handleGetStarted = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      {/* Skip button - hidden on last slide */}
      {currentIndex < slides.length - 1 && (
        <Animated.View entering={FadeIn} style={styles.skipContainer}>
          <SecondaryButton label={t("skip")} onPress={handleSkip} />
        </Animated.View>
      )}

      <AnimatedFlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH));
        }}
        renderItem={({ item, index }) => (
          <OnboardingSlide
            slide={item}
            index={index}
            scrollX={scrollX}
            responsive={responsive}
          />
        )}
      />

      {/* Dots indicator */}
      <View style={styles.dotsContainer}>
        {slides.map((slide, index) => (
          <DotIndicator
            key={slide.id}
            slide={slide}
            index={index}
            scrollX={scrollX}
          />
        ))}
      </View>

      {/* Action buttons */}
      <View style={styles.actionContainer}>
        {currentIndex < slides.length - 1 ? (
          <PrimaryButton label={t("onboardingNext")} onPress={handleNext} />
        ) : (
          <>
            <PrimaryButton label={t("login")} onPress={handleGetStarted} />
            <SecondaryButton
              label={t("register")}
              onPress={() => navigation.navigate("Register")}
            />
          </>
        )}
      </View>
    </View>
  );
}

function OnboardingSlide({ slide, index, scrollX, responsive }: any) {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const illustrationAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      scrollX.value,
      inputRange,
      [-SCREEN_WIDTH * 0.3, 0, SCREEN_WIDTH * 0.3],
      Extrapolate.CLAMP
    );

    return {
      transform: [{ translateX }],
    };
  });

  const textAnimatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.3, 1, 0.3],
      Extrapolate.CLAMP
    );

    return { opacity };
  });

  return (
    <View style={[styles.slide, { width: SCREEN_WIDTH }]}>
      {/* Illustration with parallax */}
      <Animated.View style={[styles.illustrationContainer, illustrationAnimatedStyle]}>
        <View style={styles.illustrationPlaceholder}>
          <MaterialCommunityIcons
            name={slide.icon}
            size={80}
            color={colors.primary}
          />
        </View>
      </Animated.View>

      {/* Text content */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Animated.Text style={styles.title}>{slide.title}</Animated.Text>
        <Animated.Text style={styles.body}>{slide.body}</Animated.Text>
      </Animated.View>
    </View>
  );
}

function DotIndicator({ slide, index, scrollX }: any) {
  const inputRange = [
    (index - 1) * SCREEN_WIDTH,
    index * SCREEN_WIDTH,
    (index + 1) * SCREEN_WIDTH,
  ];

  const dotAnimatedStyle = useAnimatedStyle(() => {
    const width = interpolate(
      scrollX.value,
      inputRange,
      [8, 24, 8],
      Extrapolate.CLAMP
    );

    const opacity = interpolate(
      scrollX.value,
      inputRange,
      [0.5, 1, 0.5],
      Extrapolate.CLAMP
    );

    return {
      width,
      opacity,
      backgroundColor: colors.primary,
    };
  });

  return <Animated.View style={[styles.dot, dotAnimatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  skipContainer: {
    position: "absolute",
    top: 60,
    right: 16,
    zIndex: 10,
  },
  slide: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  illustrationContainer: {
    height: "55%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  illustrationPlaceholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primaryTint,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    alignItems: "center",
    paddingHorizontal: 32,
    marginTop: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: "500",
    color: colors.textPrimary,
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 12,
  },
  body: {
    fontSize: 15,
    fontWeight: "400",
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  actionContainer: {
    paddingHorizontal: 24,
    paddingBottom: 48,
    gap: 12,
  },
});
