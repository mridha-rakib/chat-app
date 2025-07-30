// src/components/chat/ChatArea.tsx
import { useSelector } from "react-redux";
import {
  selectSelectedConversation,
  selectMessages,
  selectMessageLoading,
} from "@/lib/store/slices/conversationSlice";
import { selectOnlineUsers } from "@/lib/store/slices/socketSlice";
import { ChatHeader } from "./ChatHeader";
import { MessagesList } from "./MessagesList";
import { MessageInput } from "./MessageInput";

export function ChatArea() {
  const selectedConversation = useSelector(selectSelectedConversation);
  const messages = useSelector(selectMessages);
  const messageLoading = useSelector(selectMessageLoading);
  const onlineUsers = useSelector(selectOnlineUsers);

  if (!selectedConversation) return null;

  const isOnline = onlineUsers.includes(selectedConversation._id);

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      <ChatHeader conversation={selectedConversation} isOnline={isOnline} />
      <div className="flex-1 overflow-hidden">
        <MessagesList messages={messages} isLoading={messageLoading} />
      </div>
      <MessageInput />
    </div>
  );
}
