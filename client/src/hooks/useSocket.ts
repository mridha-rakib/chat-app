import { useEffect } from "react";
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
  const socket = useSelector(selectSocket);
  const selectedConversation = useSelector(selectSelectedConversation);

  useEffect(() => {
    if (currentUser && !socket) {
      const newSocket: Socket = io(
        process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080/api/v1",
        {
          query: {
            userId: currentUser._id,
          },
          transports: ["websocket"],
        }
      );
      dispatch(setSocket(newSocket));

      newSocket.on("connect", () => {
        console.log("connected to server");
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

      // Listen for online users
      newSocket.on("getOnlineUsers", (users: string[]) => {
        dispatch(setOnlineUsers(users));
      });

      newSocket.on("newMessage", (message: Message) => {
        if (
          selectedConversation &&
          (message.senderId === selectedConversation._id ||
            message.receiverId === selectedConversation._id)
        ) {
          dispatch(addMessage(message));
        }
      });

      return () => {
        newSocket.close();
        dispatch(clearSocket());
      };
    } else if (!currentUser && socket) {
      // User logged out, close socket
      socket.close();
      dispatch(clearSocket());
    }
  }, [currentUser, dispatch, socket, selectedConversation]);

  return socket;
};
