import {
  AuthResponse,
  LoginRequest,
  ProfileResponse,
  RefreshResponse,
  SignupRequest,
} from "@/types/auth.types";
import { apiSlice } from "./apiSlice";
import { setCredentials, logout, updateToken } from "../slices/authSlice";
import { RootState } from "../index";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: "/signup",
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.data.user,
              token: data.data.accessToken,
            })
          );
        } catch (error) {
          console.error("Signup failed:", error);
          dispatch(logout());
        }
      },
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            setCredentials({
              user: data.data.user,
              token: data.data.accessToken,
            })
          );
        } catch (error) {
          // Error is handled by the component
        }
      },
    }),

    // Get profile query
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/profile",
      providesTags: ["User"],
      async onQueryStarted(arg, { dispatch, queryFulfilled, getState }) {
        try {
          const { data } = await queryFulfilled;
          const state = getState() as RootState;

          // Update user data if token exists
          if (state.auth.token) {
            dispatch(
              setCredentials({
                user: data.data.user,
                token: state.auth.token,
              })
            );
          }
        } catch (error) {
          // Error is handled by the component
        }
      },
    }),

    // Refresh token mutation
    refreshToken: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/refresh",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateToken(data.data.accessToken));
        } catch (error) {
          dispatch(logout());
        }
      },
    }),

    // Logout mutation
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // Even if logout fails on server, clear client state
        } finally {
          dispatch(logout());
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGetProfileQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = userApiSlice;
