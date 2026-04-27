import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" }
});

export const hasRemoteApi = Boolean(baseURL);
