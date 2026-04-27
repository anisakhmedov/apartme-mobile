import { Booking, DistrictOption, Message, NotificationItem, Property, Review, User } from "@/types/models";

export const districts: DistrictOption[] = [
  { id: "registan", label: { ru: "Регистанский район", en: "Registan District", uz: "Registon tumani" } },
  { id: "new-samarkand", label: { ru: "Новый Самарканд", en: "New Samarkand", uz: "Yangi Samarqand" } },
  { id: "old-city", label: { ru: "Старый город", en: "Old City", uz: "Eski shahar" } },
  { id: "university-boulevard", label: { ru: "Университетский бульвар", en: "University Boulevard", uz: "Universitet shoh ko'chasi" } }
];

const image = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=80`;

export const users: User[] = [
  {
    id: "host-1",
    name: "Azizbek Karimov",
    email: "aziz@example.com",
    phone: "+998901112233",
    avatar: image("photo-1500648767791-00dcc994a43e"),
    isHost: true,
    isVerified: true,
    language: "ru",
    createdAt: "2025-01-12T10:00:00Z",
    bio: "Local host near the Registan square."
  },
  {
    id: "user-1",
    name: "Madina Ismailova",
    email: "madina@example.com",
    phone: "+998937889900",
    avatar: image("photo-1494790108377-be9c29b29330"),
    isHost: false,
    isVerified: true,
    language: "ru",
    createdAt: "2025-02-01T11:00:00Z"
  }
];

export const properties: Property[] = [
  {
    id: "prop-1",
    title: { ru: "Уютные апартаменты у Регистана", en: "Cozy apartment near Registan", uz: "Registon yaqinidagi qulay kvartira" },
    description: {
      ru: "Светлые апартаменты с WiFi, кухней и видом на исторический центр.",
      en: "Bright apartment with WiFi, kitchen, and views of the historic center.",
      uz: "WiFi, oshxona va tarixiy markaz manzarasiga ega yorug' kvartira."
    },
    type: "apartment",
    price: 420000,
    currency: "UZS",
    district: "registan",
    address: "Registan area, Samarkand",
    coords: { latitude: 39.6547, longitude: 66.9758 },
    photos: [image("photo-1505693416388-ac5ce068fe85"), image("photo-1502672260266-1c1ef2d93688")],
    amenities: ["wifi", "ac", "kitchen", "parking"],
    hostId: "host-1",
    rating: 4.9,
    reviewCount: 126,
    isVerified: true,
    bedrooms: 2,
    bathrooms: 1,
    guestLimit: 4
  },
  {
    id: "prop-2",
    title: { ru: "Дом в Старом городе", en: "House in the Old City", uz: "Eski shahardagi uy" },
    description: {
      ru: "Тихий дом с двориком, подходящий для семьи или группы.",
      en: "Quiet house with a courtyard, ideal for families or groups.",
      uz: "Oila yoki guruh uchun mos sokin hovli uy."
    },
    type: "house",
    price: 680000,
    currency: "UZS",
    district: "old-city",
    address: "Old City, Samarkand",
    coords: { latitude: 39.6612, longitude: 66.9784 },
    photos: [image("photo-1560184897-ae75f418493e"), image("photo-1484154218962-a197022b5858")],
    amenities: ["wifi", "kitchen", "yard", "parking"],
    hostId: "host-1",
    rating: 4.8,
    reviewCount: 84,
    isVerified: true,
    bedrooms: 3,
    bathrooms: 2,
    guestLimit: 6
  },
  {
    id: "prop-3",
    title: { ru: "Комната рядом с Университетом", en: "Room near the University", uz: "Universitet yaqinidagi xona" },
    description: {
      ru: "Доступная комната для краткосрочной аренды в новом районе.",
      en: "Affordable room for short stays in the new district.",
      uz: "Yangi tumanda qisqa muddatli arenda uchun arzon xona."
    },
    type: "room",
    price: 180000,
    currency: "UZS",
    district: "university-boulevard",
    address: "University Boulevard, Samarkand",
    coords: { latitude: 39.6404, longitude: 66.9547 },
    photos: [image("photo-1522708323590-d24dbb6b0267"), image("photo-1554995207-c18c203602cb")],
    amenities: ["wifi", "ac", "desk"],
    hostId: "host-1",
    rating: 4.6,
    reviewCount: 47,
    isVerified: false,
    bedrooms: 1,
    bathrooms: 1,
    guestLimit: 2
  },
  {
    id: "prop-4",
    title: { ru: "Гостевой дом в Новом Самарканде", en: "Guesthouse in New Samarkand", uz: "Yangi Samarqanddagi mehmon uyi" },
    description: {
      ru: "Идеально для туристов: завтрак, трансфер и быстрый Wi‑Fi.",
      en: "Ideal for travelers: breakfast, transfer, and fast Wi‑Fi.",
      uz: "Sayohatchilar uchun juda qulay: nonushta, transfer va tez Wi-Fi."
    },
    type: "guesthouse",
    price: 520000,
    currency: "UZS",
    district: "new-samarkand",
    address: "New Samarkand, Samarkand",
    coords: { latitude: 39.6391, longitude: 66.9971 },
    photos: [image("photo-1494526585095-c41746248156"), image("photo-1502672023488-70e25813eb80")],
    amenities: ["wifi", "breakfast", "parking", "transfer"],
    hostId: "host-1",
    rating: 4.7,
    reviewCount: 61,
    isVerified: true,
    bedrooms: 2,
    bathrooms: 2,
    guestLimit: 5
  }
];

export const reviews: Review[] = [
  {
    id: "review-1",
    propertyId: "prop-1",
    bookingId: "booking-1",
    authorId: "user-1",
    rating: 5,
    text: {
      ru: "Очень чисто и удобно, до площади можно дойти пешком.",
      en: "Very clean and comfortable, walking distance to the square.",
      uz: "Juda toza va qulay, maydonga piyoda boriladi."
    },
    photos: [],
    createdAt: "2026-04-01T08:00:00Z"
  }
];

export const bookings: Booking[] = [
  {
    id: "booking-1",
    propertyId: "prop-1",
    userId: "user-1",
    checkIn: "2026-05-05",
    checkOut: "2026-05-08",
    guests: { adults: 2, children: 0, infants: 0 },
    totalPrice: 1260000,
    status: "upcoming",
    paymentMethod: "Click",
    createdAt: "2026-04-10T09:30:00Z"
  },
  {
    id: "booking-2",
    propertyId: "prop-2",
    userId: "user-1",
    checkIn: "2026-04-11",
    checkOut: "2026-04-14",
    guests: { adults: 3, children: 1, infants: 0 },
    totalPrice: 2040000,
    status: "completed",
    paymentMethod: "Card",
    createdAt: "2026-03-29T09:30:00Z"
  }
];

export const messages: Message[] = [
  { id: "msg-1", chatId: "chat-1", senderId: "host-1", text: "Welcome to Samarkand!", status: "read", createdAt: "2026-04-20T10:10:00Z" },
  { id: "msg-2", chatId: "chat-1", senderId: "user-1", text: "Is early check-in possible?", status: "delivered", createdAt: "2026-04-20T10:11:00Z" }
];

export const notifications: NotificationItem[] = [
  {
    id: "n-1",
    title: { ru: "Бронирование подтверждено", en: "Booking confirmed", uz: "Bron tasdiqlandi" },
    body: { ru: "Ваша бронь на 5 мая подтверждена.", en: "Your May 5 booking is confirmed.", uz: "5-may uchun broningiz tasdiqlandi." },
    type: "booking",
    createdAt: "2026-04-20T08:00:00Z",
    isRead: false
  },
  {
    id: "n-2",
    title: { ru: "Новое сообщение", en: "New message", uz: "Yangi xabar" },
    body: { ru: "Хост ответил на ваш вопрос.", en: "The host replied to your question.", uz: "Uy egasi savolingizga javob berdi." },
    type: "message",
    createdAt: "2026-04-19T12:00:00Z",
    isRead: true
  }
];

export const amenitiesMap: Record<string, { ru: string; en: string; uz: string }> = {
  wifi: { ru: "Wi‑Fi", en: "Wi‑Fi", uz: "Wi-Fi" },
  ac: { ru: "Кондиционер", en: "Air conditioning", uz: "Konditsioner" },
  kitchen: { ru: "Кухня", en: "Kitchen", uz: "Oshxona" },
  parking: { ru: "Парковка", en: "Parking", uz: "Avtoturargoh" },
  breakfast: { ru: "Завтрак", en: "Breakfast", uz: "Nonushta" },
  yard: { ru: "Двор", en: "Yard", uz: "Hovli" },
  desk: { ru: "Рабочий стол", en: "Desk", uz: "Ish stoli" },
  transfer: { ru: "Трансфер", en: "Transfer", uz: "Transfer" }
};
