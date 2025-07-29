import { Message } from "@/types/conversation.type";
import { apiSlice } from "./apiSlice";
import {
  addMessage,
  setError,
  setMessageLoading,
  setMessages,
  setSendingMessage,
} from "../slices/conversationSlice";

interface SendMessageRequest {
  receiverId: string;
  message: string;
}

interface MessageResponse {
  success: boolean;
  message: string;
  data: Message | Message[];
}

export const messageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendMessage: builder.mutation<MessageResponse, SendMessageRequest>({
      query: ({ receiverId: id, message }) => {
        console.log("🔥 API Query:", { id, message });
        return {
          url: `/messages/send/${id}`,
          method: "POST",
          body: { message },
        };
      },
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(setSendingMessage(true));
        try {
          const { data } = await queryFulfilled;
          console.log("✅ Message API Response:", data);
          if (data.success && !Array.isArray(data.data)) {
            dispatch(addMessage(data.data));
          }
        } catch (error) {
          console.error("Send message failed:", error);
          dispatch(setError("Failed to send message"));
        } finally {
          dispatch(setSendingMessage(false));
        }
      },
    }),

    getMessages: builder.query<MessageResponse, string>({
      query: (receiverId) => `/messages/${receiverId}`,
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        dispatch(setMessageLoading(true));
        try {
          const { data } = await queryFulfilled;
          if (data.success && Array.isArray(data.data)) {
            dispatch(setMessages(data.data));
          }
        } catch (error) {
          dispatch(setError("Failed to load messages"));
          console.error("Get messages failed:", error);
        } finally {
          dispatch(setMessageLoading(false));
        }
      },
    }),

    getConversations: builder.query<MessageResponse, void>({
      query: () => "/messages/conversations",
      providesTags: ["Conversations"],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useGetConversationsQuery,
} = messageApiSlice;
