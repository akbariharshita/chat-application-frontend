import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import storageSession from "redux-persist/lib/storage/session"; // ✅ Use sessionStorage instead of localStorage
import { thunk } from "redux-thunk"; // Make sure you imported redux-thunk correctly
import authReducer from "./authSlice";

const persistConfig = {
  key: "auth",
  storage: storageSession,
  whitelist: ["users", "userName"],
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);

const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(thunk),
  devTools: process.env.NODE_ENV === "development",
});

const persistor = persistStore(store);

export default store;
export { persistor };

window.addEventListener("storage", (event) => {
  if (event.key === "persist:auth") {
    sessionStorage.clear();
  }
});
