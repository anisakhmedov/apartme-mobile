import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Linking, Pressable, RefreshControl, StyleSheet, Text, View } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Calendar } from "react-native-calendars";
import QRCode from "react-native-qrcode-svg";
import Slider from "@react-native-community/slider";

import {
  amenitiesMap,
  bookings,
  districts,
  messages,
  notifications,
  properties,
  reviews,
  users
} from "@/data/mockData";
import { addRecentViewed } from "@/store/searchSlice";
import { useAppDispatch, useAppSelector } from "@/store";
import { analytics } from "@/services/analytics";
import { saveRecentProperty } from "@/services/cache";
import { colors, radii, spacing } from "@/theme";
import { Booking, LocalizedText, Property } from "@/types/models";
import MapView, { Marker, PROVIDER_GOOGLE } from "@/components/map";
import {
  AppScreen,
  Avatar,
  Badge,
  BottomStickyBar,
  BookingCard,
  Card,
  CheckboxRow,
  ConversationRow,
  EmptyState,
  FilterChip,
  GalleryStrip,
  GradientCard,
  IconButton,
  InfoRow,
  MapPreview,
  MessageBubble,
  NotificationRow,
  Pill,
  PrimaryButton,
  PropertyCard,
  RatingStars,
  ScreenScroll,
  SecondaryButton,
  Section,
  SkeletonBlock,
  StatCard,
  StepIndicator,
  TextField,
  ToggleRow,
  formatCurrency,
  useResponsive
} from "@/components/ui";
import { setLanguage, setCurrency, toggleDarkMode, togglePush, setBiometric } from "@/store/preferencesSlice";
import { logout, persistAuth, setUser } from "@/store/authSlice";
import { useGetBookingsQuery, useGetNotificationsQuery, useGetPropertiesQuery, useGetPropertyByIdQuery, useGetReviewsQuery, useGetUsersQuery } from "@/services/api";

const languageOptions = ["ru", "en", "uz"] as const;
const categories = ["apartments", "houses", "rooms", "guesthouses", "daily"] as const;
const statusTabs = ["upcoming", "active", "completed", "cancelled"] as const;

const formatTime = (dateString: string) => new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(dateString));

const ScreenTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <View style={{ marginBottom: spacing.md }}>
    <Text style={styles.screenTitle}>{title}</Text>
    {!!subtitle && <Text style={styles.screenSubtitle}>{subtitle}</Text>}
  </View>
);

function useItemLanguage() {
  return useAppSelector((state) => state.preferences.language) as keyof LocalizedText;
}

function useRoutePropertyId() {
  const route = useRoute<any>();
  return route.params?.id as string | undefined;
}

function findPropertyTitle(propertyId?: string, language: keyof LocalizedText = "ru") {
  return properties.find((item) => item.id === propertyId)?.title[language] ?? "SamarkandRent";
}

export function SplashScreen() {
  const navigation = useNavigation<any>();
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();
  const currentLanguage = useAppSelector((state) => state.preferences.language);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Auth", { screen: "Onboarding" });
    }, 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <AppScreen>
      <View style={styles.centerHero}>
        <View style={styles.logoBadge}>
          <MaterialCommunityIcons name="home-city-outline" size={46} color={colors.white} />
        </View>
        <Text style={styles.brandTitle}>SamarkandRent</Text>
        <Text style={styles.brandSubtitle}>{t("splashSubtitle")}</Text>
        <View style={styles.languageRow}>
          {languageOptions.map((code) => (
            <Pill key={code} label={code.toUpperCase()} active={currentLanguage === code} onPress={() => dispatch(setLanguage(code))} />
          ))}
        </View>
      </View>
    </AppScreen>
  );
}

export function OnboardingScreen({ navigation }: any) {
  const { t } = useTranslation("auth");
  const slides = [
    { icon: "map-marker-radius", title: t("slide1Title"), body: t("slide1Body") },
    { icon: "calendar-check", title: t("slide2Title"), body: t("slide2Body") },
    { icon: "chat-processing", title: t("slide3Title"), body: t("slide3Body") }
  ];
  const [index, setIndex] = useState(0);

  return (
    <AppScreen>
      <View style={styles.topRowSpaceBetween}>
        <Text style={styles.onboardingSkip} onPress={() => navigation.replace("Login")}>{t("skip")}</Text>
      </View>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.title}
        onMomentumScrollEnd={(event) => setIndex(Math.round(event.nativeEvent.contentOffset.x / event.nativeEvent.layoutMeasurement.width))}
        renderItem={({ item }) => (
          <View style={styles.onboardingSlide}>
            <GradientCard colors={[colors.primary, colors.primaryDark]}>
              <MaterialCommunityIcons name={item.icon as any} size={68} color={colors.white} />
            </GradientCard>
            <Text style={styles.onboardingTitle}>{item.title}</Text>
            <Text style={styles.onboardingBody}>{item.body}</Text>
          </View>
        )}
      />
      <View style={styles.dotsRow}>
        {slides.map((slide, slideIndex) => <View key={slide.title} style={[styles.dot, slideIndex === index && styles.dotActive]} />)}
      </View>
      <View style={styles.actionStack}>
        <PrimaryButton label={t("getStarted")} onPress={() => navigation.navigate("Login")} />
        <SecondaryButton label={t("alreadyHaveAccount")} onPress={() => navigation.navigate("Login")} />
      </View>
    </AppScreen>
  );
}

export function LoginScreen({ navigation }: any) {
  const { t } = useTranslation("auth");
  const dispatch = useAppDispatch();
  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("loginTitle")} subtitle={t("loginSubtitle")} />
        <TextField label={t("emailOrPhone")} placeholder={t("emailOrPhone")} keyboardType="email-address" />
        <TextField label={t("password")} placeholder={t("password")} secureTextEntry />
        <PrimaryButton label={t("login")} onPress={() => { analytics.logEvent("login"); const user = users[1]; dispatch(setUser(user)); dispatch(persistAuth({ isLoggedIn: true, user })); }} />
        <SecondaryButton label={t("loginWithGoogle")} onPress={() => Alert.alert(t("googleLogin"))} />
        <Pressable onPress={() => navigation.navigate("ForgotPassword")} style={styles.linkButton}><Text style={styles.linkText}>{t("forgotPassword")}</Text></Pressable>
        <Pressable onPress={() => navigation.navigate("Register")} style={styles.linkButton}><Text style={styles.linkText}>{t("createAccount")}</Text></Pressable>
      </ScreenScroll>
    </AppScreen>
  );
}

export function RegisterScreen({ navigation }: any) {
  const { t } = useTranslation("auth");
  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("registerTitle")} subtitle={t("registerSubtitle")} />
        <TextField label={t("name")} placeholder={t("name")} />
        <TextField label={t("phone")} placeholder={t("phone")} keyboardType="phone-pad" />
        <TextField label={t("email")} placeholder={t("email")} keyboardType="email-address" />
        <TextField label={t("password")} placeholder={t("password")} secureTextEntry />
        <TextField label={t("confirmPassword")} placeholder={t("confirmPassword")} secureTextEntry />
        <CheckboxRow label={t("acceptTerms")} checked />
        <PrimaryButton label={t("register")} onPress={() => { analytics.logEvent("register"); navigation.navigate("OtpVerification"); }} />
        <SecondaryButton label={t("login")} onPress={() => navigation.goBack()} />
      </ScreenScroll>
    </AppScreen>
  );
}

export function OtpVerificationScreen() {
  const { t } = useTranslation("auth");
  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("otpTitle")} subtitle={t("otpSubtitle")} />
        <View style={styles.otpRow}>{Array.from({ length: 6 }).map((_, index) => <View key={index} style={styles.otpCell}><Text style={styles.otpDigit}>{index === 0 ? "1" : ""}</Text></View>)}</View>
        <Text style={styles.countdownText}>{t("resendIn", { seconds: 45 })}</Text>
        <PrimaryButton label={t("verify")} />
        <SecondaryButton label={t("resendCode")} />
      </ScreenScroll>
    </AppScreen>
  );
}

export function ForgotPasswordScreen() {
  const { t } = useTranslation("auth");
  const [sent, setSent] = useState(false);
  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("forgotTitle")} subtitle={t("forgotSubtitle")} />
        <TextField label={t("email")} placeholder={t("email")} keyboardType="email-address" />
        <PrimaryButton label={t("sendResetLink")} onPress={() => setSent(true)} />
        {sent && <Text style={styles.successText}>{t("resetSent")}</Text>}
      </ScreenScroll>
    </AppScreen>
  );
}

export function PermissionScreen() {
  const { t } = useTranslation("common");
  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("permissionsTitle")} subtitle={t("permissionsSubtitle")} />
        <Card style={styles.permissionCard}><Text style={styles.permissionText}>{t("locationPermission")}</Text></Card>
        <Card style={styles.permissionCard}><Text style={styles.permissionText}>{t("cameraPermission")}</Text></Card>
        <Card style={styles.permissionCard}><Text style={styles.permissionText}>{t("notificationsPermission")}</Text></Card>
        <PrimaryButton label={t("allowPermissions")} />
      </ScreenScroll>
    </AppScreen>
  );
}

export function HomeScreen({ navigation }: any) {
  const language = useItemLanguage();
  const { t } = useTranslation("home");
  const { data = properties } = useGetPropertiesQuery();
  const nearby = useMemo(() => data.slice(0, 3), [data]);

  return (
    <AppScreen>
      <FlatList
        data={nearby}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <View style={{ paddingHorizontal: spacing.md }}><PropertyCard item={item} language={language} onPress={() => navigation.navigate("PropertyDetail", { id: item.id })} /></View>}
        ListHeaderComponent={
          <ScreenScroll>
            <View style={styles.homeTopBar}>
              <View><Text style={styles.brandSmall}>SamarkandRent</Text><Text style={styles.homeGreeting}>{t("welcome")}</Text></View>
              <IconButton icon="notifications-none" label={t("notifications")} onPress={() => navigation.getParent()?.navigate("ProfileFlow", { screen: "Notifications" })} />
            </View>
            <Pressable style={styles.searchHero} onPress={() => navigation.navigate("SearchTab")} accessibilityRole="button" accessibilityLabel={t("search")}> 
                <MaterialIcons name="search" size={22} color={colors.muted} />
              <Text style={styles.searchHeroText}>{t("searchPlaceholder")}</Text>
            </Pressable>
            <Section title={t("categories")}>
              <FlatList horizontal showsHorizontalScrollIndicator={false} data={categories as unknown as string[]} keyExtractor={(item) => item} renderItem={({ item }) => <Pill label={t(item)} />} />
            </Section>
            <Section title={t("featuredListings")} action={<Text style={styles.linkText}>{t("seeAll")}</Text>}>
                {data.slice(0, 2).map((property) => <PropertyCard key={property.id} item={property} language={language} onPress={() => navigation.navigate("PropertyDetail", { id: property.id })} />)}
            </Section>
            <Section title={t("popularInSamarkand")}>
              <View style={styles.bannerRow}>
                <GradientCard colors={[colors.primary, colors.primaryDark]}><Text style={styles.bannerTitle}>{t("registanPromo")}</Text></GradientCard>
                <GradientCard colors={["#2D2D2D", colors.primary]}><Text style={styles.bannerTitle}>{t("oldCityPromo")}</Text></GradientCard>
                <GradientCard colors={[colors.primaryDark, colors.background]}><Text style={[styles.bannerTitle, { color: colors.charcoal }]}>{t("newSamarkandPromo")}</Text></GradientCard>
              </View>
            </Section>
            <Section title={t("nearbyListings")}><SkeletonBlock width="100%" height={120} /></Section>
          </ScreenScroll>
        }
      />
    </AppScreen>
  );
}

export function SearchMapScreen({ navigation }: any) {
  const language = useItemLanguage();
  const { t } = useTranslation("home");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [price, setPrice] = useState(900000);
  const { data = properties } = useGetPropertiesQuery();
  const responsive = useResponsive();

  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("searchTitle")} subtitle={t("searchSubtitle")} />
        <TextField placeholder={t("searchPlaceholder")} />
        <View style={styles.togglePillsRow}><Pill label={t("listView")} active={viewMode === "list"} onPress={() => setViewMode("list")} /><Pill label={t("mapView")} active={viewMode === "map"} onPress={() => setViewMode("map")} /></View>
        <Card><Text style={styles.sliderTitle}>{t("priceRange")}</Text><Slider minimumValue={0} maximumValue={2000000} minimumTrackTintColor={colors.primary} maximumTrackTintColor="#D6D2CA" thumbTintColor={colors.primaryDark} value={price} onValueChange={setPrice} /></Card>
          {viewMode === "map" ? <MapView provider={PROVIDER_GOOGLE} style={[styles.mapView, { height: responsive.mapHeight }]} initialRegion={{ latitude: 39.6547, longitude: 66.9758, latitudeDelta: 0.05, longitudeDelta: 0.05 }}><Marker coordinate={{ latitude: 39.6547, longitude: 66.9758 }} title="Registan" /></MapView> : data.map((item) => <PropertyCard key={item.id} item={item} language={language} onPress={() => navigation.navigate("PropertyDetail", { id: item.id })} />)}
      </ScreenScroll>
    </AppScreen>
  );
}

export function BookingsTabScreen({ navigation }: any) {
  const { t } = useTranslation("booking");
  const { data = bookings } = useGetBookingsQuery();
  const [status, setStatus] = useState<(typeof statusTabs)[number]>("upcoming");
  const language = useItemLanguage();

  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("myBookings")} subtitle={t("myBookingsSubtitle")} />
        <FlatList horizontal showsHorizontalScrollIndicator={false} data={statusTabs as unknown as string[]} keyExtractor={(item) => item} renderItem={({ item }) => <Pill label={t(item)} active={status === item} onPress={() => setStatus(item as any)} />} />
          {data.filter((booking) => booking.status === status).map((booking) => <BookingCard key={booking.id} id={booking.id} title={findPropertyTitle(booking.propertyId, language)} status={booking.status} subtitle={`${booking.checkIn} → ${booking.checkOut}`} onPress={() => navigation.getParent()?.navigate("BookingFlow", { screen: "BookingDetail", params: { id: booking.id } })} />)}
      </ScreenScroll>
    </AppScreen>
  );
}

export function PropertyDetailScreen({ navigation }: any) {
  const language = useItemLanguage();
  const routeId = useRoutePropertyId();
  const { t } = useTranslation("property");
  const dispatch = useAppDispatch();
  const { data: property } = useGetPropertyByIdQuery(routeId ?? "prop-1");
  const { data: propertyReviews = [] } = useGetReviewsQuery(routeId ?? "prop-1");
  const { data: userList = users } = useGetUsersQuery();

  useEffect(() => {
    if (property) {
      dispatch(addRecentViewed(property));
      saveRecentProperty(property);
      analytics.logEvent("view_property", { propertyId: property.id });
    }
  }, [dispatch, property]);

  if (!property) {
    return <LoadingScreen />;
  }

  const host = userList.find((item) => item.id === property.hostId) ?? userList[0];

  return (
    <AppScreen>
      <BottomStickyBar>
        <View style={styles.stickyBarRow}>
          <View><Text style={styles.stickyPrice}>{formatCurrency(property.price, property.currency)}</Text><Text style={styles.stickyCaption}>{t("perNight")}</Text></View>
            <PrimaryButton label={t("bookNow")} onPress={() => navigation.navigate("BookingFlow", { screen: "Booking", params: { propertyId: property.id } })} />
        </View>
      </BottomStickyBar>
      <ScreenScroll>
        <GalleryStrip photos={property.photos} />
        <View style={styles.detailHeaderRow}>
          <View style={{ flex: 1 }}><Text style={styles.detailTitle}>{property.title[language]}</Text><Text style={styles.detailAddress}>{property.address}</Text></View>
          <RatingStars rating={property.rating} count={property.reviewCount} />
        </View>
        <Card style={styles.hostCard}><View style={styles.hostRow}><Avatar uri={host.avatar} size={60} /><View style={{ flex: 1 }}><Text style={styles.hostName}>{host.name}</Text><Text style={styles.hostMeta}>{t("verifiedHost")}</Text></View><Badge label={t("responseRate")} tone="success" /></View></Card>
        <Section title={t("amenities")}><View style={styles.amenitiesWrap}>{property.amenities.map((amenity) => <View key={amenity} style={styles.amenityTag}><Text>{amenitiesMap[amenity]?.[language] ?? amenity}</Text></View>)}</View></Section>
        <Section title={t("description")}><Text style={styles.detailBody}>{property.description[language]}</Text></Section>
        <Section title={t("location")}><MapPreview title={property.address} subtitle={property.district} /></Section>
        <Section title={t("reviews")}>{propertyReviews.map((review) => <Card key={review.id} style={styles.reviewCard}><RatingStars rating={review.rating} /><Text style={styles.reviewText}>{review.text[language]}</Text></Card>)}</Section>
      </ScreenScroll>
    </AppScreen>
  );
}

export function MapScreen() {
  const language = useItemLanguage();
  const { t } = useTranslation("home");
  const responsive = useResponsive();
  return (
    <AppScreen>
      <MapView provider={PROVIDER_GOOGLE} style={[styles.fullMap, { height: responsive.mapHeight }]} initialRegion={{ latitude: 39.6547, longitude: 66.9758, latitudeDelta: 0.06, longitudeDelta: 0.06 }}>
        {properties.map((property) => <Marker key={property.id} coordinate={property.coords} title={property.title[language]} description={formatCurrency(property.price, property.currency)} />)}
      </MapView>
      <View style={styles.mapOverlayTop}><Text style={styles.mapOverlayTitle}>{t("mapView")}</Text><Text style={styles.mapOverlaySubtitle}>{t("samarkandCenter")}</Text></View>
    </AppScreen>
  );
}

export function BookingScreen({ navigation }: any) {
  const { t } = useTranslation("booking");
  return (
    <AppScreen><ScreenScroll><ScreenTitle title={t("bookingTitle")} subtitle={t("bookingSubtitle")} /><Calendar markingType="period" /><Card><InfoRow label={t("guests")} value="2 adults, 1 child" /><InfoRow label={t("nightlyRate")} value={formatCurrency(420000, "UZS")} /><InfoRow label={t("total")} value={formatCurrency(1260000, "UZS")} /></Card><PrimaryButton label={t("confirmBooking")} onPress={() => navigation.navigate("Payment")} /></ScreenScroll></AppScreen>
  );
}

export function PaymentScreen({ navigation }: any) {
  const { t } = useTranslation("booking");
  const [loading, setLoading] = useState(false);
  return (
    <AppScreen><ScreenScroll><ScreenTitle title={t("paymentTitle")} subtitle={t("paymentSubtitle")} /><Card><Pill label={t("card")} active /><Pill label={t("click")} /><Pill label={t("payme")} /><Pill label={t("cashOnArrival")} /></Card><TextField label={t("coupon")} placeholder={t("promoCode")} /><Card><InfoRow label={t("orderSummary")} value={formatCurrency(1260000, "UZS")} /></Card><PrimaryButton label={t("payNow")} loading={loading} onPress={() => { setLoading(true); navigation.navigate("BookingConfirmation"); }} /></ScreenScroll></AppScreen>
  );
}

export function BookingConfirmationScreen({ navigation }: any) {
  const { t } = useTranslation("booking");
  return (
    <AppScreen><ScreenScroll><View style={styles.confirmationCenter}><View style={styles.successCircle}><MaterialCommunityIcons name="check" size={54} color={colors.white} /></View><Text style={styles.confirmationTitle}>{t("bookingConfirmed")}</Text><Text style={styles.confirmationSubtitle}>{t("bookingId")}: BK-1042</Text><QRCode value="samarkandrent://booking/booking-1" size={160} /></View><PrimaryButton label={t("viewBooking")} onPress={() => navigation.navigate("BookingDetail")} /><SecondaryButton label={t("backToHome")} onPress={() => navigation.navigate("Main", { screen: "HomeTab" })} /></ScreenScroll></AppScreen>
  );
}

export function MyBookingsScreen() {
  return <BookingsTabScreen navigation={{ navigate: () => undefined }} />;
}

export function BookingDetailScreen() {
  const language = useItemLanguage();
  const { t } = useTranslation("booking");
  const booking = bookings[0];
  const property = properties.find((item) => item.id === booking.propertyId) ?? properties[0];
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("bookingDetail")} subtitle={property.title[language]} /><Card><InfoRow label={t("checkIn")} value={booking.checkIn} /><InfoRow label={t("checkOut")} value={booking.checkOut} /><InfoRow label={t("guests")} value="2 adults" /><InfoRow label={t("paymentMethod")} value={booking.paymentMethod} /></Card><PrimaryButton label={t("cancelBooking")} /><SecondaryButton label={t("contactHost")} /></ScreenScroll></AppScreen>);
}

export function MessagesTabScreen() {
  const { t } = useTranslation("common");
  return (
    <AppScreen>
      <ScreenScroll>
        <ScreenTitle title={t("messages")} subtitle={t("inboxSubtitle")} />
        {messages.length ? (
          messages.map((message) => <ConversationRow key={message.id} title="Azizbek" preview={message.text} time={formatTime(message.createdAt)} unread={1} avatar={users[0].avatar} />)
        ) : (
          <EmptyState title={t("emptyMessages")} />
        )}
      </ScreenScroll>
    </AppScreen>
  );
}

export function ChatScreen() {
  const { t } = useTranslation("common");
  return (<AppScreen><ScreenScroll><Card><Text style={styles.chatContextTitle}>{t("propertyContext")}</Text><Text style={styles.chatContextBody}>{properties[0].title.ru}</Text></Card><MessageBubble text="Welcome to Samarkand!" /><MessageBubble text="Is early check-in possible?" mine /></ScreenScroll></AppScreen>);
}

export function ProfileTabScreen({ navigation }: any) {
  const language = useItemLanguage();
  const { t } = useTranslation("profile");
  const user = users[1];
  const isHost = useAppSelector((state) => state.auth.user?.isHost ?? true);
  const dispatch = useAppDispatch();

  return (
    <AppScreen><ScreenScroll><View style={styles.profileHeader}><Avatar uri={user.avatar} size={72} /><View style={{ flex: 1 }}><Text style={styles.profileName}>{user.name}</Text><Text style={styles.profileMeta}>{user.email}</Text></View><IconButton icon="edit" label={t("editProfile")} onPress={() => navigation.getParent()?.navigate("ProfileFlow", { screen: "EditProfile" })} /></View><View style={styles.statsRow}><StatCard label={t("bookingsCount")} value="12" /><StatCard label={t("reviewsGiven")} value="8" /></View><Card><Pill label={t("myBookings")} onPress={() => navigation.getParent()?.navigate("BookingFlow", { screen: "BookingDetail", params: { id: bookings[0].id } })} /><Pill label={t("wishlist")} onPress={() => navigation.getParent()?.navigate("ProfileFlow", { screen: "Wishlist" })} /><Pill label={t("paymentMethods")} /><Pill label={t("reviews")} onPress={() => navigation.getParent()?.navigate("ProfileFlow", { screen: "MyReviews" })} /><Pill label={t("settings")} onPress={() => navigation.getParent()?.navigate("ProfileFlow", { screen: "Settings" })} /><Pill label={t("help")} onPress={() => navigation.getParent()?.navigate("ProfileFlow", { screen: "Help" })} /><Pill label={t("logout")} onPress={() => { dispatch(logout()); }} /></Card>{isHost && <Card><Text style={styles.hostModeText}>{t("hostMode")}</Text><PrimaryButton label={t("hostDashboard")} onPress={() => navigation.getParent()?.navigate("HostFlow")} /></Card>}</ScreenScroll></AppScreen>
  );
}

export function ProfileScreen({ navigation }: any) {
  return <ProfileTabScreen navigation={navigation} />;
}

export function EditProfileScreen() {
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("editProfile")} subtitle={t("editProfileSubtitle")} /><TextField label={t("name")} /><TextField label={t("phone")} keyboardType="phone-pad" /><TextField label={t("bio")} multiline numberOfLines={4} /><PrimaryButton label={t("uploadAvatar")} /><SecondaryButton label={t("uploadPassport")} /></ScreenScroll></AppScreen>);
}

export function WishlistScreen() {
  const language = useItemLanguage();
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("wishlist")} subtitle={t("wishlistSubtitle")} />{properties.slice(0, 2).map((property) => <PropertyCard key={property.id} item={property} language={language} />)}</ScreenScroll></AppScreen>);
}

export function MyReviewsScreen() {
  const language = useItemLanguage();
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("reviews")} subtitle={t("reviewsSubtitle")} />{reviews.map((review) => <Card key={review.id} style={styles.reviewCard}><RatingStars rating={review.rating} /><Text style={styles.reviewText}>{review.text[language]}</Text></Card>)}</ScreenScroll></AppScreen>);
}

export function HostDashboardScreen() {
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("hostDashboard")} subtitle={t("hostDashboardSubtitle")} /><View style={styles.statsRow}><StatCard label={t("today")} value={formatCurrency(1200000, "UZS")} /><StatCard label={t("week")} value={formatCurrency(8400000, "UZS")} /></View><Section title={t("pendingRequests")}><BookingCard id="req-1" title="Guest request" status="upcoming" subtitle="2 nights" /></Section><Section title={t("occupancyCalendar")}><Calendar /></Section></ScreenScroll></AppScreen>);
}

export function MyListingsScreen() {
  const language = useItemLanguage();
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("myListings")} subtitle={t("myListingsSubtitle")} />{properties.map((property) => <PropertyCard key={property.id} item={property} language={language} />)}<PrimaryButton label={t("addListing")} /></ScreenScroll></AppScreen>);
}

export function AddEditListingScreen() {
  const { t } = useTranslation("profile");
  const steps = [t("step1"), t("step2"), t("step3"), t("step4")];
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("addEditListing")} subtitle={t("addEditListingSubtitle")} /><StepIndicator steps={steps} current={1} /><TextField label={t("titleRu")} /><TextField label={t("titleEn")} /><TextField label={t("titleUz")} /><TextField label={t("address")} /><PrimaryButton label={t("uploadPhotos")} /><TextField label={t("pricePerNight")} keyboardType="numeric" /><PrimaryButton label={t("saveListing")} /></ScreenScroll></AppScreen>);
}

export function BookingRequestsScreen() {
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("bookingRequests")} subtitle={t("bookingRequestsSubtitle")} /><BookingCard id="req-1" title="Madina Ismailova" status="upcoming" subtitle="Auto-decline in 02:14" /></ScreenScroll></AppScreen>);
}

export function NotificationsScreen() {
  const language = useItemLanguage();
  const { t } = useTranslation("common");
  const { data = notifications } = useGetNotificationsQuery();
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("notifications")} subtitle={t("notificationsSubtitle")} /><SecondaryButton label={t("markAllRead")} />{data.map((item) => <NotificationRow key={item.id} title={item.title[language]} body={item.body[language]} time={formatTime(item.createdAt)} unread={!item.isRead} />)}</ScreenScroll></AppScreen>);
}

export function SettingsScreen() {
  const { t } = useTranslation("profile");
  const preferences = useAppSelector((state) => state.preferences);
  const dispatch = useAppDispatch();
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("settings")} subtitle={t("settingsSubtitle")} /><Section title={t("language")}><View style={styles.inlineChoices}>{languageOptions.map((code) => <Pill key={code} label={code.toUpperCase()} active={preferences.language === code} onPress={() => dispatch(setLanguage(code))} />)}</View></Section><Section title={t("currency")}><View style={styles.inlineChoices}>{(["UZS", "USD", "EUR"] as const).map((code) => <Pill key={code} label={code} active={preferences.currency === code} onPress={() => dispatch(setCurrency(code))} />)}</View></Section><ToggleRow label={t("darkMode")} value={preferences.darkMode} onToggle={() => dispatch(toggleDarkMode())} /><ToggleRow label={t("pushBookings")} value={preferences.pushBookings} onToggle={() => dispatch(togglePush("pushBookings"))} /><ToggleRow label={t("pushMessages")} value={preferences.pushMessages} onToggle={() => dispatch(togglePush("pushMessages"))} /><ToggleRow label={t("biometricLogin")} value={preferences.biometric} onToggle={() => dispatch(setBiometric(!preferences.biometric))} /><PrimaryButton label={t("changePassword")} /></ScreenScroll></AppScreen>);
}

export function HelpScreen() {
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("help")} subtitle={t("helpSubtitle")} /><Card><Text style={styles.faqTitle}>{t("faqCategory1")}</Text><Text style={styles.faqBody}>{t("faqAnswer1")}</Text></Card><PrimaryButton label={t("whatsappSupport")} onPress={() => Linking.openURL("https://wa.me/998900000000")} /><SecondaryButton label={t("contactSupport")} /></ScreenScroll></AppScreen>);
}

export function AboutScreen() {
  const { t } = useTranslation("profile");
  return (<AppScreen><ScreenScroll><ScreenTitle title={t("about")} subtitle={t("aboutSubtitle")} /><Card><InfoRow label={t("version")} value="1.0.0" /><InfoRow label={t("terms")} value={t("open")} /><InfoRow label={t("privacy")} value={t("open")} /><InfoRow label={t("licenses")} value={t("open")} /></Card></ScreenScroll></AppScreen>);
}

export function LoadingScreen() {
  const { t } = useTranslation("common");
  return (<AppScreen><ScreenScroll><SkeletonBlock height={220} style={{ marginBottom: spacing.md }} /><SkeletonBlock width="70%" height={24} style={{ marginBottom: spacing.sm }} /><SkeletonBlock width="45%" height={18} style={{ marginBottom: spacing.xl }} />{Array.from({ length: 4 }).map((_, index) => <SkeletonBlock key={index} height={120} style={{ marginBottom: spacing.md }} />)}</ScreenScroll></AppScreen>);
}

export function ErrorScreen({ navigation }: any) {
  const { t } = useTranslation("common");
  return (<AppScreen><ScreenScroll><EmptyState title={t("networkError")} description={t("networkErrorSubtitle")} action={<PrimaryButton label={t("retry")} onPress={() => navigation?.goBack?.()} />} /></ScreenScroll></AppScreen>);
}

export function NotFoundScreen() {
  const { t } = useTranslation("common");
  return (<AppScreen><ScreenScroll><EmptyState title={t("notFound")} description={t("notFoundSubtitle")} /></ScreenScroll></AppScreen>);
}

const styles = StyleSheet.create({
  screenTitle: { fontSize: 28, fontWeight: "800", color: colors.charcoal },
  screenSubtitle: { marginTop: 6, color: colors.muted, lineHeight: 20 },
  centerHero: { flex: 1, alignItems: "center", justifyContent: "center", padding: spacing.xl },
  logoBadge: { width: 96, height: 96, borderRadius: 28, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  brandTitle: { fontSize: 34, fontWeight: "800", color: colors.charcoal },
  brandSubtitle: { color: colors.muted, marginTop: spacing.sm, textAlign: "center" },
  languageRow: { flexDirection: "row", marginTop: spacing.xl, flexWrap: "wrap", justifyContent: "center" },
  topRowSpaceBetween: { flexDirection: "row", justifyContent: "flex-end", marginBottom: spacing.md },
  onboardingSkip: { color: colors.primary, fontWeight: "700" },
  onboardingSlide: { width: 320, marginRight: spacing.lg, alignItems: "center", justifyContent: "center" },
  onboardingTitle: { marginTop: spacing.lg, fontSize: 24, fontWeight: "800", color: colors.charcoal, textAlign: "center" },
  onboardingBody: { marginTop: spacing.sm, color: colors.muted, textAlign: "center", lineHeight: 20 },
  dotsRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", marginVertical: spacing.md },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#D7D0C7", marginHorizontal: 4 },
  dotActive: { width: 22, backgroundColor: colors.primary },
  actionStack: { gap: spacing.sm, paddingBottom: spacing.md },
  linkButton: { alignSelf: "center", marginTop: spacing.sm },
  linkText: { color: colors.primary, fontWeight: "700" },
  otpRow: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginVertical: spacing.lg },
  otpCell: { width: 44, height: 56, borderRadius: radii.card, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  otpDigit: { fontSize: 20, fontWeight: "800", color: colors.charcoal },
  countdownText: { textAlign: "center", color: colors.muted, marginBottom: spacing.md },
  successText: { color: colors.success, fontWeight: "700", marginTop: spacing.md, textAlign: "center" },
  permissionCard: { marginBottom: spacing.md },
  permissionText: { color: colors.charcoal, fontWeight: "700" },
  homeTopBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: spacing.md },
  brandSmall: { color: colors.primary, fontWeight: "800", letterSpacing: 0.5 },
  homeGreeting: { fontSize: 24, fontWeight: "800", color: colors.charcoal, marginTop: 4 },
  searchHero: { height: 56, borderRadius: radii.pill, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: spacing.lg },
  searchHeroText: { color: colors.muted, fontWeight: "600" },
  bannerRow: { gap: spacing.md },
  bannerTitle: { color: colors.white, fontWeight: "800", fontSize: 16 },
  togglePillsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.md },
  sliderTitle: { fontWeight: "700", marginBottom: spacing.sm, color: colors.charcoal },
  mapView: { height: 280, borderRadius: radii.card, overflow: "hidden", marginTop: spacing.md },
  fullMap: { flex: 1 },
  mapOverlayTop: { position: "absolute", top: 64, left: spacing.md, right: spacing.md, backgroundColor: colors.white, borderRadius: radii.card, padding: spacing.md },
  mapOverlayTitle: { fontSize: 18, fontWeight: "800", color: colors.charcoal },
  mapOverlaySubtitle: { color: colors.muted, marginTop: 4 },
  stickyBarRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.md },
  stickyPrice: { fontSize: 18, fontWeight: "800", color: colors.charcoal },
  stickyCaption: { color: colors.muted, marginTop: 2 },
  detailHeaderRow: { flexDirection: "row", justifyContent: "space-between", gap: spacing.md, alignItems: "flex-start", marginTop: spacing.md },
  detailTitle: { fontSize: 24, fontWeight: "800", color: colors.charcoal },
  detailAddress: { color: colors.muted, marginTop: 6 },
  detailBody: { color: colors.charcoal, lineHeight: 22 },
  hostCard: { marginTop: spacing.sm },
  hostRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  hostName: { fontSize: 16, fontWeight: "800", color: colors.charcoal },
  hostMeta: { color: colors.muted, marginTop: 2 },
  amenitiesWrap: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  amenityTag: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: radii.pill, backgroundColor: colors.primaryLight },
  reviewCard: { marginBottom: spacing.md },
  reviewText: { marginTop: spacing.sm, color: colors.charcoal },
  confirmationCenter: { alignItems: "center", justifyContent: "center", paddingVertical: spacing.xl },
  successCircle: { width: 112, height: 112, borderRadius: 56, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginBottom: spacing.lg },
  confirmationTitle: { fontSize: 24, fontWeight: "800", color: colors.charcoal, textAlign: "center" },
  confirmationSubtitle: { color: colors.muted, marginVertical: spacing.md },
  profileHeader: { flexDirection: "row", alignItems: "center", gap: spacing.md, marginBottom: spacing.lg },
  profileName: { fontSize: 20, fontWeight: "800", color: colors.charcoal },
  profileMeta: { color: colors.muted, marginTop: 4 },
  statsRow: { flexDirection: "row", gap: spacing.sm, marginBottom: spacing.lg },
  hostModeText: { fontSize: 16, fontWeight: "800", color: colors.charcoal, marginBottom: spacing.md },
  inlineChoices: { flexDirection: "row", flexWrap: "wrap" },
  faqTitle: { fontSize: 16, fontWeight: "800", color: colors.charcoal },
  faqBody: { color: colors.muted, marginTop: 6 },
  chatContextTitle: { fontSize: 14, fontWeight: "800", color: colors.charcoal },
  chatContextBody: { color: colors.muted, marginTop: 4 }
});
