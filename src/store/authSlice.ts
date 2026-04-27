import AsyncStorage from "@react-native-async-storage/async-storage";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

import { LanguageCode, User } from "@/types/models";

const AUTH_KEY = "samarkandrent.auth";

export interface AuthState {
  hydrated: boolean;
  isLoggedIn: boolean;
  user: User | null;
}

const initialState: AuthState = {
  hydrated: false,
  isLoggedIn: false,
  user: null
};

export const bootstrapAuth = createAsyncThunk("auth/bootstrap", async () => {
  const raw = await AsyncStorage.getItem(AUTH_KEY);
  return raw ? (JSON.parse(raw) as Pick<AuthState, "isLoggedIn" | "user">) : { isLoggedIn: false, user: null };
});

export const persistAuth = createAsyncThunk("auth/persist", async (next: Pick<AuthState, "isLoggedIn" | "user">) => {
  await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(next));
  return next;
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User | null>) {
      state.user = action.payload;
      state.isLoggedIn = Boolean(action.payload);
    },
    setLanguage(state, action: PayloadAction<LanguageCode>) {
      if (state.user) {
        state.user.language = action.payload;
      }
    },
    logout(state) {
      state.isLoggedIn = false;
      state.user = null;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(bootstrapAuth.fulfilled, (state, action) => {
      state.hydrated = true;
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
    });
    builder.addCase(bootstrapAuth.rejected, (state) => {
      state.hydrated = true;
    });
    builder.addCase(persistAuth.fulfilled, (state, action) => {
      state.isLoggedIn = action.payload.isLoggedIn;
      state.user = action.payload.user;
    });
  }
});

export const { setUser, setLanguage, logout } = authSlice.actions;
export default authSlice.reducer;
