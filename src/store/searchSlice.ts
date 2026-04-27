import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { FilterState, Property } from "@/types/models";

export interface SearchState {
  filters: FilterState;
  recentViewed: Property[];
}

const initialState: SearchState = {
  filters: {
    query: "",
    minPrice: 0,
    maxPrice: 2000000,
    bedrooms: 0,
    bathrooms: 0,
    district: "",
    amenities: [],
    sortBy: "newest",
    viewMode: "list"
  },
  recentViewed: []
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    updateFilters(state, action: PayloadAction<Partial<FilterState>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setRecentViewed(state, action: PayloadAction<Property[]>) {
      state.recentViewed = action.payload.slice(0, 20);
    },
    addRecentViewed(state, action: PayloadAction<Property>) {
      state.recentViewed = [action.payload, ...state.recentViewed.filter((item) => item.id !== action.payload.id)].slice(0, 20);
    }
  }
});

export const { updateFilters, setRecentViewed, addRecentViewed } = searchSlice.actions;
export default searchSlice.reducer;
