import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { CurrencyCode, LanguageCode } from "@/types/models";

const PREF_KEY = "samarkandrent.preferences";

export interface PreferencesState {
  hydrated: boolean;
  language: LanguageCode;
  currency: CurrencyCode;
  darkMode: boolean;
  pushBookings: boolean;
  pushMessages: boolean;
  pushPromotions: boolean;
  biometric: boolean;
}

const initialState: PreferencesState = {
  hydrated: false,
  language: "ru",
  currency: "UZS",
  darkMode: false,
  pushBookings: true,
  pushMessages: true,
  pushPromotions: false,
  biometric: false
};

export const bootstrapPreferences = createAsyncThunk("preferences/bootstrap", async () => {
  const raw = await AsyncStorage.getItem(PREF_KEY);
  return raw ? (JSON.parse(raw) as PreferencesState) : initialState;
});

export const persistPreferences = createAsyncThunk("preferences/persist", async (state: PreferencesState) => {
  await AsyncStorage.setItem(PREF_KEY, JSON.stringify(state));
  return state;
});

const preferencesSlice = createSlice({
  name: "preferences",
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<LanguageCode>) {
      state.language = action.payload;
    },
    setCurrency(state, action: PayloadAction<CurrencyCode>) {
      state.currency = action.payload;
    },
    toggleDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    togglePush(state, action: PayloadAction<"pushBookings" | "pushMessages" | "pushPromotions">) {
      state[action.payload] = !state[action.payload];
    },
    setBiometric(state, action: PayloadAction<boolean>) {
      state.biometric = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrapPreferences.fulfilled, (state, action) => ({ ...state, ...action.payload, hydrated: true }));
    builder.addCase(bootstrapPreferences.rejected, (state) => {
      state.hydrated = true;
    });
    builder.addCase(persistPreferences.fulfilled, (state, action) => ({ ...state, ...action.payload }));
  }
});

export const { setLanguage, setCurrency, toggleDarkMode, togglePush, setBiometric } = preferencesSlice.actions;
export default preferencesSlice.reducer;
