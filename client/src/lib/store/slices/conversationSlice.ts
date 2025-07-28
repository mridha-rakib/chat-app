import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  Conversation,
  ConversationState,
  Message,
  SelectedConversation,
} from "@/types/conversation.type";

const initialState: ConversationState = {
  selectedConversation: null,
  messages: [],
  conversations: [],
  loading: false,
  error: null,
  messageLoading: false,
  sendingMessage: false,
};

const conversationSlice = createSlice({
  name: "conversation",
  initialState,
  reducers: {
    setSelectedConversation: (
      state,
      action: PayloadAction<SelectedConversation | null>
    ) => {
      state.selectedConversation = action.payload;
      if (action.payload === null) {
        state.messages = [];
      }
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = action.payload;
    },

    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },

    updateMessage: (state, action: PayloadAction<Message>) => {
      const index = state.messages.findIndex(
        (msg) => msg._id === action.payload._id
      );

      if (index !== -1) {
        state.messages[index] = action.payload;
      }
    },

    removeMessage: (state, action: PayloadAction<string>) => {
      state.messages = state.messages.filter(
        (msg) => msg._id !== action.payload
      );
    },

    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload;
    },
    addConversation: (state, action: PayloadAction<Conversation>) => {
      const exists = state.conversations.find(
        (conv) => conv._id === action.payload._id
      );
      if (!exists) {
        state.conversations.push(action.payload);
      }
    },

    updateConversation: (state, action: PayloadAction<Conversation>) => {
      const index = state.conversations.findIndex(
        (conv) => conv._id === action.payload._id
      );
      if (index !== -1) {
        state.conversations[index] = action.payload;
      }
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setMessageLoading: (state, action: PayloadAction<boolean>) => {
      state.messageLoading = action.payload;
    },

    setSendingMessage: (state, action: PayloadAction<boolean>) => {
      state.sendingMessage = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    clearConversation: (state) => {
      state.selectedConversation = null;
      state.messages = [];
      state.error = null;
    },

    clearAllConversations: (state) => {
      state.selectedConversation = null;
      state.messages = [];
      state.conversations = [];
      state.error = null;
    },
  },
});

export const {
  setSelectedConversation,
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  setConversations,
  addConversation,
  updateConversation,
  setLoading,
  setMessageLoading,
  setSendingMessage,
  setError,
  clearConversation,
  clearAllConversations,
} = conversationSlice.actions;

export default conversationSlice.reducer;

export const selectSelectedConversation = (state: {
  conversation: ConversationState;
}) => state.conversation.selectedConversation;
export const selectMessages = (state: { conversation: ConversationState }) =>
  state.conversation.messages;
export const selectConversations = (state: {
  conversation: ConversationState;
}) => state.conversation.conversations;
export const selectConversationLoading = (state: {
  conversation: ConversationState;
}) => state.conversation.loading;
export const selectMessageLoading = (state: {
  conversation: ConversationState;
}) => state.conversation.messageLoading;
export const selectSendingMessage = (state: {
  conversation: ConversationState;
}) => state.conversation.sendingMessage;
export const selectConversationError = (state: {
  conversation: ConversationState;
}) => state.conversation.error;
