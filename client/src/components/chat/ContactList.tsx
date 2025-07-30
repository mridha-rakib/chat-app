// src/components/chat/ContactList.tsx
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { selectSelectedConversation } from "@/lib/store/slices/conversationSlice";
import { User } from "@/types/auth.types";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";

interface ContactListProps {
  users: User[];
  onlineUsers: string[];
  onSelectUser: (user: User) => void;
  isLoading: boolean;
}

export default function ContactList({
  users,
  onlineUsers,
  onSelectUser,
  isLoading,
}: ContactListProps) {
  const selectedConversation = useSelector(selectSelectedConversation);

  if (isLoading) {
    return (
      <div className="p-3 space-y-3">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-3 border-gray-100">
            <div className="flex items-center space-x-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="p-3 space-y-2">
      {users.map((user) => {
        const isOnline = onlineUsers.includes(user._id);
        const isSelected = selectedConversation?._id === user._id;

        return (
          <Card
            key={user._id}
            className={cn(
              "p-3 cursor-pointer transition-all duration-200 hover:shadow-sm border",
              isSelected
                ? "bg-blue-50 border-blue-200 shadow-sm"
                : "border-gray-100 hover:bg-gray-50"
            )}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10 ring-2 ring-white">
                  <AvatarImage src={user.profilePic} alt={user.fullName} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-medium">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className={cn(
                      "text-sm font-medium truncate",
                      isSelected ? "text-blue-900" : "text-gray-900"
                    )}
                  >
                    {user.fullName}
                  </p>
                  {isOnline && (
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800 text-xs px-2 py-0.5"
                    >
                      Online
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-gray-500 truncate">
                  @{user.username}
                </p>
              </div>
            </div>
          </Card>
        );
      })}

      {users.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-6 h-6 text-gray-400" />
          </div>
          <p className="text-gray-500 text-sm">No contacts found</p>
          <p className="text-gray-400 text-xs mt-1">
            Try adjusting your search
          </p>
        </div>
      )}
    </div>
  );
}
