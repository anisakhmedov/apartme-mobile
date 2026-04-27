export const linking = {
  prefixes: ["samarkandrent://"],
  config: {
    screens: {
      Root: {
        screens: {
          Main: {
            screens: {
              HomeTab: "home",
              SearchTab: "search",
              BookingsTab: "bookings",
              MessagesTab: "messages",
              ProfileTab: "profile"
            }
          },
          PropertyDetail: "property/:id",
          BookingDetail: "booking/:id"
        }
      }
    }
  }
};
