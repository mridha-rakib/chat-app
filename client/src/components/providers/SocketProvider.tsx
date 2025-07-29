"use client";

import { useEffect } from "react";
import { useSocket } from "@/hooks/useSocket";

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  useSocket();
  return <>{children}</>;
};
