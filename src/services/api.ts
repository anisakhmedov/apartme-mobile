import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

import { bookings, messages, notifications, properties, reviews, users } from "@/data/mockData";
import { apiClient, hasRemoteApi } from "@/services/http";
import { Booking, Message, NotificationItem, Property, Review, User } from "@/types/models";

async function maybeGet<T>(path: string, fallback: T): Promise<T> {
  if (!hasRemoteApi) {
    return fallback;
  }

  const response = await apiClient.get<T>(path);
  return response.data;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Property", "Booking", "Message", "Notification", "Review", "User"],
  endpoints: (build) => ({
    getProperties: build.query<Property[], { query?: string; district?: string } | void>({
      async queryFn(args) {
        const data = await maybeGet<Property[]>("/properties", properties);
        const query = args && "query" in args ? args.query?.trim().toLowerCase() : "";
        const district = args && "district" in args ? args.district : undefined;
        const filtered = data.filter((property) => {
          const title = property.title.ru.toLowerCase() + property.title.en.toLowerCase() + property.title.uz.toLowerCase();
          const matchesQuery = !query || title.includes(query) || property.address.toLowerCase().includes(query);
          const matchesDistrict = !district || property.district === district;
          return matchesQuery && matchesDistrict;
        });
        return { data: filtered };
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Property" as const, id })), { type: "Property" as const, id: "LIST" }] : [{ type: "Property" as const, id: "LIST" }]
    }),
    getPropertyById: build.query<Property | undefined, string>({
      async queryFn(id) {
        const data = await maybeGet<Property[]>("/properties", properties);
        return { data: data.find((item) => item.id === id) };
      },
      providesTags: (_result, _error, id) => [{ type: "Property", id }]
    }),
    getBookings: build.query<Booking[], void>({
      async queryFn() {
        return { data: await maybeGet<Booking[]>("/bookings", bookings) };
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Booking" as const, id })), { type: "Booking" as const, id: "LIST" }] : [{ type: "Booking" as const, id: "LIST" }]
    }),
    getMessages: build.query<Message[], void>({
      async queryFn() {
        return { data: await maybeGet<Message[]>("/messages", messages) };
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Message" as const, id })), { type: "Message" as const, id: "LIST" }] : [{ type: "Message" as const, id: "LIST" }]
    }),
    getNotifications: build.query<NotificationItem[], void>({
      async queryFn() {
        return { data: await maybeGet<NotificationItem[]>("/notifications", notifications) };
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Notification" as const, id })), { type: "Notification" as const, id: "LIST" }] : [{ type: "Notification" as const, id: "LIST" }]
    }),
    getReviews: build.query<Review[], string | void>({
      async queryFn(propertyId) {
        const data = await maybeGet<Review[]>("/reviews", reviews);
        return { data: propertyId ? data.filter((item) => item.propertyId === propertyId) : data };
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "Review" as const, id })), { type: "Review" as const, id: "LIST" }] : [{ type: "Review" as const, id: "LIST" }]
    }),
    getUsers: build.query<User[], void>({
      async queryFn() {
        return { data: await maybeGet<User[]>("/users", users) };
      },
      providesTags: (result) =>
        result ? [...result.map(({ id }) => ({ type: "User" as const, id })), { type: "User" as const, id: "LIST" }] : [{ type: "User" as const, id: "LIST" }]
    })
  })
});

export const {
  useGetPropertiesQuery,
  useGetPropertyByIdQuery,
  useGetBookingsQuery,
  useGetMessagesQuery,
  useGetNotificationsQuery,
  useGetReviewsQuery,
  useGetUsersQuery
} = api;
