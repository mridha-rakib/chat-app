"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import {
  logout as logoutAction,
  selectAuthLoading,
  selectCurrentUser,
  selectIsAuthenticated,
  setLoading,
} from "@/lib/store/slices/authSlice";
import {
  useGetProfileQuery,
  useLogoutMutation,
  useRefreshTokenMutation,
} from "@/lib/store/api/userApi";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectAuthLoading);
  const user = useSelector(selectCurrentUser);

  const [refreshToken] = useRefreshTokenMutation();

  // const { user, token, isAuthenticated, loading } = useSelector(
  //   (state: RootState) => state.auth
  // );

  // const {
  //   data: profileData,
  //   isLoading: isProfileLoading,
  //   error: profileError,
  // } = useGetProfileQuery(undefined, {
  //   skip: !token || !!user,
  //   pollingInterval: 15 * 60 * 1000,
  // });

  // const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  // const logout = async () => {
  //   try {
  //     await logoutMutation().unwrap();
  //   } catch (error) {
  //     console.log("User hook: ", error);
  //     dispatch(logoutAction());
  //   }
  // };

  useEffect(() => {
    const initializeAuth = async () => {
      if (!isAuthenticated && !loading) {
        dispatch(setLoading(true));

        try {
          await refreshToken().unwrap();
        } catch (error) {
          console.log(`"No valid refresh token", ${error}`);
        } finally {
          dispatch(setLoading(false));
        }
      }
    };

    initializeAuth();
  }, []);

  return {
    user,
    isAuthenticated,
    loading,
  };
};
