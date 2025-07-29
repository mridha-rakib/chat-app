import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import authReducer from "./slices/authSlice";
import { apiSlice } from "./api/apiSlice";
import conversationReducer from "./slices/conversationSlice";
import socketReducer from "./slices/socketSlice";

export const makeStore = () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      socket: socketReducer,
      conversation: conversationReducer,
      [apiSlice.reducerPath]: apiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            "persist/PERSIST",
            "persist/REHYDRATE",
            "socket/setSocket",
          ],
          ignoredPaths: ["socket.socket"],
          ignoredActionsPaths: ["payload.socket"],
        },
      }).concat(apiSlice.middleware),
    devTools: process.env.NODE_ENV !== "production",
  });
  setupListeners(store.dispatch);
  return store;
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
