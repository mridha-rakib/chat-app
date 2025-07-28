import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

interface SocketState {
  socket: Socket | null;
  onlineUsers: string[];
  isConnected: boolean;
  connectionError: string | null;
}

const initialState: SocketState = {
  socket: null,
  onlineUsers: [],
  isConnected: false,
  connectionError: null,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setSocket: (state, action: PayloadAction<Socket | null>) => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (state as any).socket = action.payload;
      state.isConnected = action.payload !== null;
      if (action.payload === null) {
        state.onlineUsers = [];
        state.connectionError = null;
      }
    },

    setOnlineUsers: (state, action: PayloadAction<string[]>) => {
      state.onlineUsers = action.payload;
    },

    setConnectionStatus: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },

    setConnectionError: (state, action: PayloadAction<string | null>) => {
      state.connectionError = action.payload;
    },

    addOnlineUser: (state, action: PayloadAction<string>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload);
      }
    },

    removeOnlineUser: (state, action: PayloadAction<string>) => {
      state.onlineUsers = state.onlineUsers.filter(
        (userId) => userId !== action.payload
      );
    },

    clearSocket: (state) => {
      state.socket = null;
      state.onlineUsers = [];
      state.isConnected = false;
      state.connectionError = null;
    },
  },
});

export const {
  setSocket,
  setOnlineUsers,
  setConnectionStatus,
  setConnectionError,
  addOnlineUser,
  removeOnlineUser,
  clearSocket,
} = socketSlice.actions;

export default socketSlice.reducer;

// Selectors
export const selectSocket = (state: { socket: SocketState }) =>
  state.socket.socket;
export const selectOnlineUsers = (state: { socket: SocketState }) =>
  state.socket.onlineUsers;
export const selectIsConnected = (state: { socket: SocketState }) =>
  state.socket.isConnected;
export const selectConnectionError = (state: { socket: SocketState }) =>
  state.socket.connectionError;
