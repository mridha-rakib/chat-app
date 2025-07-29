// src/components/chat/ChatHeader.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SelectedConversation } from "@/types/conversation.type";

interface ChatHeaderProps {
  conversation: SelectedConversation;
  isOnline: boolean;
}

export function ChatHeader({ conversation, isOnline }: ChatHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 p-4">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={conversation.profilePic}
              alt={conversation.fullName}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600">
              {conversation.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          {isOnline && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            {conversation.fullName}
          </h2>
          <p className="text-sm text-gray-500">
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>
    </div>
  );
}
