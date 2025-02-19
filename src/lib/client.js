import axios from "axios";
import { BACKEND_URL } from "./envrionments";
import store from "../store/store";

const client = axios.create({
  baseURL: BACKEND_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use((request) => {
  const state = store.getState();
  const userName = state?.auth?.userName;
  const token = userName ? state?.auth?.users?.[userName]?.accessToken : "";

  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  } else {
    console.warn("No token found in Redux store");
  }

  return request;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

export default client;
