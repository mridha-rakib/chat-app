"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store";
import { logout as logoutAction } from "@/lib/store/slices/authSlice";
import { useGetProfileQuery, useLogoutMutation } from "@/lib/store/api/uerApi";
import { useEffect } from "react";

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );

  const {
    data: profileData,
    isLoading: isProfileLoading,
    error: profileError,
  } = useGetProfileQuery(undefined, {
    skip: !token || !!user,
    pollingInterval: 15 * 60 * 1000,
  });

  const [logoutMutation, { isLoading: isLoggingOut }] = useLogoutMutation();

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      dispatch(logoutAction());
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    loading: loading || isProfileLoading || isLoggingOut,
    profileError,
    logout,
  };
};
