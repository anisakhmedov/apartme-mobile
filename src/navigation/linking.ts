export const linking = {
  prefixes: ["samarkandrent://"],
  config: {
    screens: {
      Splash: "splash",
      Auth: {
        screens: {
          Onboarding: "welcome",
          Login: "login",
          Register: "register",
          ForgotPassword: "forgot-password",
          OTPVerification: "verify",
        },
      },
      MainTabs: {
        screens: {
          HomeTab: {
            screens: {
              Home: "home",
              Listings: "home/listings",
              PropertyDetail: "property/:id",
              HostPublicProfile: "host/:id",
            },
          },
          SearchTab: {
            screens: {
              Search: "search",
              Listings: "search/listings",
              PropertyDetail: "search/property/:id",
              MapView: "search/map",
            },
          },
          BookingsTab: {
            screens: {
              MyBookings: "bookings",
              BookingDetail: "bookings/:id",
              WriteReview: "bookings/:id/review",
              CancelBooking: "bookings/:id/cancel",
            },
          },
          ChatTab: {
            screens: {
              Inbox: "messages",
              ChatThread: "messages/:id",
            },
          },
          ProfileTab: {
            screens: {
              Profile: "profile",
              EditProfile: "profile/edit",
              Wishlist: "profile/favorites",
              Settings: "profile/settings",
              Notifications: "profile/notifications",
              Verification: "profile/verification",
              HostDashboard: "profile/host-dashboard",
              MyListings: "profile/listings",
              AddEditListing: "profile/listings/edit",
              BookingRequests: "profile/booking-requests",
              MyReviews: "profile/reviews",
              Help: "profile/help",
            },
          },
        },
      },
      BookingModal: {
        screens: {
          Booking: "booking/new",
          Payment: "booking/payment",
          BookingSuccess: "booking/success",
        },
      },
    },
  },
};
