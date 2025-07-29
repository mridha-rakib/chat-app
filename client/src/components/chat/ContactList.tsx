import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSelector } from "react-redux";
import { selectSelectedConversation } from "@/lib/store/slices/conversationSlice";
import { User } from "@/types/auth.types";

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
      <div className="p-2">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-3 mb-2">
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
    <div className="p-2">
      {users.map((user) => {
        const isOnline = onlineUsers.includes(user._id);
        const isSelected = selectedConversation?._id === user._id;

        return (
          <Card
            key={user._id}
            className={`p-3 mb-2 cursor-pointer transition-all hover:bg-gray-50 ${
              isSelected ? "bg-blue-50 border-blue-200" : "border-gray-100"
            }`}
            onClick={() => onSelectUser(user)}
          >
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.profilePic} alt={user.fullName} />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {user.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <span className="text-xs text-gray-500">
                    {isOnline ? "Online" : "Offline"}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  @{user.username}
                </p>
              </div>
            </div>
          </Card>
        );
      })}

      {users.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No contacts found</p>
        </div>
      )}
    </div>
  );
}
