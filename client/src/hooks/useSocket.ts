import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import io, { Socket } from "socket.io-client";

import {
  setSocket,
  setOnlineUsers,
  setConnectionStatus,
  setConnectionError,
  clearSocket,
  selectSocket,
} from "@/lib/store/slices/socketSlice";

import {
  addMessage,
  selectSelectedConversation,
} from "@/lib/store/slices/conversationSlice";

import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { Message } from "@/types/conversation.type";

export const useSocket = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  // const selectedConversation = useSelector(selectSelectedConversation);
  // const socket = useSelector(selectSocket);

  const socketRef = useRef<Socket | null>(null);

  const handleNewMessage = useCallback(
    (message: Message) => {
      dispatch(addMessage(message));
    },
    [dispatch]
  );

  const handleOnlineUsers = useCallback(
    (users: string[]) => {
      dispatch(setOnlineUsers(users));
    },
    [dispatch]
  );

  useEffect(() => {
    // Don't create socket if one already exists
    if (currentUser && !socketRef.current) {
      const newSocket: Socket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080",
        {
          query: {
            userId: currentUser._id,
          },
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        }
      );

      socketRef.current = newSocket;
      dispatch(setSocket(newSocket));

      // Connection handlers
      newSocket.on("connect", () => {
        console.log("Connected to server");
        dispatch(setConnectionStatus(true));
        dispatch(setConnectionError(null));
      });

      newSocket.on("disconnect", () => {
        console.log("Disconnected from server");
        dispatch(setConnectionStatus(false));
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
        dispatch(setConnectionError(error.message));
        dispatch(setConnectionStatus(false));
      });

      // Event listeners
      newSocket.on("getOnlineUsers", handleOnlineUsers);
      newSocket.on("newMessage", handleNewMessage);

      return () => {
        if (socketRef.current) {
          socketRef.current.off("getOnlineUsers", handleOnlineUsers);
          socketRef.current.off("newMessage", handleNewMessage);
          socketRef.current.close();
          socketRef.current = null;
          dispatch(clearSocket());
        }
      };
    }

    // Clean up socket if user logs out
    if (!currentUser && socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
      dispatch(clearSocket());
    }
  }, [
    currentUser?._id,
    dispatch,
    currentUser,
    handleNewMessage,
    handleOnlineUsers,
  ]); // Only depend on stable values

  return socketRef.current;
};
