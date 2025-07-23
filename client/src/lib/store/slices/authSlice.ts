import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, AuthState } from "@/types/auth.types";

const getStoredUser = (): User | null => {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("chat-user");
    return stored ? JSON.parse(stored) : null;
  }
  return null;
};

const getStoredToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access-token");
  }
  return null;
};

const initialState: AuthState = {
  user: getStoredUser(),
  token: getStoredToken(),
  isAuthenticated: !!getStoredUser(),
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: User; token: string }>
    ) => {
      const { user, token } = action.payload;

      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;

      if (typeof window !== "undefined") {
        localStorage.setItem("chat-user", JSON.stringify(user));
        localStorage.setItem("access-token", token);
      }
    },

    updateUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("chat-user", JSON.stringify(action.payload));
      }
    },

    updateToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;

      if (typeof window !== "undefined") {
        localStorage.setItem("access-token", action.payload);
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("chat-user");
        localStorage.removeItem("access-token");
      }
    },
  },
});

export const { setCredentials, updateUser, updateToken, setLoading, logout } =
  authSlice.actions;

export default authSlice.reducer;

export const selectCurrentUser = (state: { auth: AuthState }) =>
  state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.isAuthenticated;
export const selectAuthLoading = (state: { auth: AuthState }) =>
  state.auth.loading;
export const selectAccessToken = (state: { auth: AuthState }) =>
  state.auth.token;
