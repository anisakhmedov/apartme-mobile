import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import authReducer from "@/store/authSlice";
import preferencesReducer from "@/store/preferencesSlice";
import searchReducer from "@/store/searchSlice";
import { api } from "@/services/api";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    preferences: preferencesReducer,
    search: searchReducer,
    [api.reducerPath]: api.reducer
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(api.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
