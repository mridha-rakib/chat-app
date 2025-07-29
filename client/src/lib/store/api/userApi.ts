import {
  AllUsers,
  AuthResponse,
  LoginRequest,
  ProfileResponse,
  RefreshResponse,
  SignupRequest,
} from "@/types/auth.types";
import { apiSlice } from "./apiSlice";
import { setCredentials, logout, updateToken } from "../slices/authSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<AuthResponse, SignupRequest>({
      query: (userData) => ({
        url: "/auth/signup",
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
        }
      },
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
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
          console.error("Login failed:", error);
        }
      },
    }),

    // Get profile query
    getProfile: builder.query<ProfileResponse, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    // get all users
    getAllUsers: builder.query<AllUsers, void>({
      query: () => "/auth/all-users",
      providesTags: ["User"],
      transformErrorResponse: (response) => {
        return response.data;
      },
    }),

    // Refresh token mutation
    refreshToken: builder.mutation<RefreshResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(updateToken(data.data.accessToken));
        } catch (error) {
          console.log(error);
          dispatch(logout());
        }
      },
    }),

    // Logout mutation
    logout: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          console.error("Logout failed:", error);
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
  useGetAllUsersQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = userApiSlice;
