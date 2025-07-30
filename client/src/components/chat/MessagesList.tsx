// src/components/chat/MessagesList.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { Message } from "@/types/conversation.type";
import { formatTime } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { MessageCircle } from "lucide-react";

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessagesList({ messages, isLoading }: MessagesListProps) {
  const currentUser = useSelector(selectCurrentUser);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <ScrollArea className="h-full">
        <div className="p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className={`flex ${
                index % 2 === 0 ? "justify-start" : "justify-end"
              }`}
            >
              <Skeleton className="h-16 w-64 rounded-2xl" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-blue-400" />
            </div>
            <p className="text-gray-500 text-lg font-medium mb-2">
              No messages yet
            </p>
            <p className="text-gray-400 text-sm">
              Start the conversation with a friendly message!
            </p>
          </div>
        ) : (
          <>
            {messages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUser?._id;
              const showAvatar =
                index === 0 ||
                messages[index - 1].senderId !== message.senderId;

              return (
                <div
                  key={message._id}
                  className={`flex ${
                    isOwnMessage ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                      isOwnMessage
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white border border-gray-200 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.message}</p>
                    <p
                      className={`text-xs mt-2 ${
                        isOwnMessage ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
    </ScrollArea>
  );
}
