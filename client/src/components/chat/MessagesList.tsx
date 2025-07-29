// src/components/chat/MessagesList.tsx
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { Message } from "@/types/conversation.type";
import { formatTime } from "@/lib/utils";

interface MessagesListProps {
  messages: Message[];
  isLoading: boolean;
}

export function MessagesList({ messages, isLoading }: MessagesListProps) {
  const currentUser = useSelector(selectCurrentUser);

  if (isLoading) {
    return (
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="flex justify-start">
              <Skeleton className="h-16 w-64 rounded-lg" />
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No messages yet. Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === currentUser?._id;

            return (
              <div
                key={message._id}
                className={`flex ${
                  isOwnMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
