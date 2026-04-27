export type LanguageCode = "ru" | "en" | "uz";
export type CurrencyCode = "UZS" | "USD" | "EUR";

export interface LocalizedText {
  ru: string;
  en: string;
  uz: string;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface Property {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  type: "apartment" | "house" | "room" | "guesthouse" | "daily";
  price: number;
  currency: CurrencyCode;
  district: string;
  address: string;
  coords: Coordinate;
  photos: string[];
  amenities: string[];
  hostId: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  bedrooms?: number;
  bathrooms?: number;
  guestLimit?: number;
}

export interface Booking {
  id: string;
  propertyId: string;
  userId: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number; infants: number };
  totalPrice: number;
  status: "upcoming" | "active" | "completed" | "cancelled";
  paymentMethod: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  isHost: boolean;
  isVerified: boolean;
  language: LanguageCode;
  createdAt: string;
  bio?: string;
}

export interface Review {
  id: string;
  propertyId: string;
  bookingId: string;
  authorId: string;
  rating: number;
  text: LocalizedText;
  photos: string[];
  createdAt: string;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  imageUrl?: string;
  status: "sent" | "delivered" | "read";
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  type: "booking" | "message" | "review" | "payment" | "promotion";
  createdAt: string;
  isRead: boolean;
}

export interface DistrictOption {
  id: string;
  label: LocalizedText;
}

export interface FilterState {
  query: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  bathrooms: number;
  district: string;
  amenities: string[];
  sortBy: "priceAsc" | "priceDesc" | "rating" | "newest";
  viewMode: "list" | "map";
}
