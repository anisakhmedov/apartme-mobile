import AsyncStorage from "@react-native-async-storage/async-storage";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";

import authEn from "@/locales/en/auth.json";
import bookingEn from "@/locales/en/booking.json";
import commonEn from "@/locales/en/common.json";
import homeEn from "@/locales/en/home.json";
import profileEn from "@/locales/en/profile.json";
import propertyEn from "@/locales/en/property.json";
import authRu from "@/locales/ru/auth.json";
import bookingRu from "@/locales/ru/booking.json";
import commonRu from "@/locales/ru/common.json";
import homeRu from "@/locales/ru/home.json";
import profileRu from "@/locales/ru/profile.json";
import propertyRu from "@/locales/ru/property.json";
import authUz from "@/locales/uz/auth.json";
import bookingUz from "@/locales/uz/booking.json";
import commonUz from "@/locales/uz/common.json";
import homeUz from "@/locales/uz/home.json";
import profileUz from "@/locales/uz/profile.json";
import propertyUz from "@/locales/uz/property.json";

const resources = {
  ru: { common: commonRu, auth: authRu, home: homeRu, booking: bookingRu, property: propertyRu, profile: profileRu },
  en: { common: commonEn, auth: authEn, home: homeEn, booking: bookingEn, property: propertyEn, profile: profileEn },
  uz: { common: commonUz, auth: authUz, home: homeUz, booking: bookingUz, property: propertyUz, profile: profileUz }
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v4",
  resources,
  lng: "ru",
  fallbackLng: "ru",
  defaultNS: "common",
  ns: ["common", "auth", "home", "booking", "property", "profile"],
  interpolation: { escapeValue: false }
});

AsyncStorage.getItem("samarkandrent.preferences").then((raw) => {
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as { language?: string };
      if (parsed.language) {
        i18next.changeLanguage(parsed.language);
      }
    } catch {
      // ignore malformed cache
    }
  }
});

export const supportedLanguages = ["ru", "en", "uz"] as const;

export default i18next;
