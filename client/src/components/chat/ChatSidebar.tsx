// src/components/chat/ChatSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseAsString, useQueryState } from "nuqs";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
} from "lucide-react";
import { useGetAllUsersQuery } from "@/lib/store/api/userApi";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { selectOnlineUsers } from "@/lib/store/slices/socketSlice";
import { setSelectedConversation } from "@/lib/store/slices/conversationSlice";
import { useLazyGetMessagesQuery } from "@/lib/store/api/messageApi";
import ContactList from "./ContactList";
import { UserProfile } from "./UserProfile";
import { User } from "@/types/auth.types";
import { cn } from "@/lib/utils";

export function ChatSidebar() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const onlineUsers = useSelector(selectOnlineUsers);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const [searchQuery, setSearchQuery] = useQueryState(
    "search",
    parseAsString.withDefault("")
  );

  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
    isError: isUsersError,
  } = useGetAllUsersQuery();

  useEffect(() => {
    if (isUsersError) {
      console.log("Error fetching users:", usersError);
    }
  }, [isUsersError, usersError]);

  const [getMessages] = useLazyGetMessagesQuery();

  if (!currentUser) {
    return (
      <div
        className={cn(
          "bg-white border-r border-gray-200 flex items-center justify-center transition-all duration-300",
          isCollapsed ? "w-16" : "w-80"
        )}
      >
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  const users = usersData?.data?.users || [];
  const onlineUsersCount = users.filter((user: User) =>
    onlineUsers.includes(user._id)
  ).length;

  const filteredUsers = users
    .filter((user: User) => user._id !== currentUser._id)
    .filter(
      (user: User) =>
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleSelectUser = async (user: User) => {
    const selectedConversation = {
      _id: user._id,
      fullName: user.fullName,
      username: user.username,
      profilePic: user.profilePic,
    };

    dispatch(setSelectedConversation(selectedConversation));
    await getMessages(user._id);
  };

  return (
    <div
      className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-80"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Messages</h1>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {!isCollapsed && (
          <>
            {/* Stats */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Badge
                  variant="secondary"
                  className="bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Users className="w-3 h-3 mr-1" />
                  {filteredUsers.length}
                </Badge>
                <Badge
                  variant="secondary"
                  className="bg-green-50 text-green-700 border-green-200"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {onlineUsersCount} online
                </Badge>
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search contacts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50/50 border-gray-200 focus:bg-white transition-colors"
              />
            </div>
          </>
        )}
      </div>

      {/* Contacts List */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          {isCollapsed ? (
            <div className="p-2 space-y-2">
              {filteredUsers.slice(0, 10).map((user) => {
                const isOnline = onlineUsers.includes(user._id);
                return (
                  <Button
                    key={user._id}
                    variant="ghost"
                    size="sm"
                    className="w-full h-12 p-2 relative"
                    onClick={() => handleSelectUser(user)}
                  >
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                      {user.fullName.charAt(0)}
                    </div>
                    {isOnline && (
                      <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </Button>
                );
              })}
            </div>
          ) : (
            <ContactList
              users={filteredUsers}
              onlineUsers={onlineUsers}
              onSelectUser={handleSelectUser}
              isLoading={usersLoading}
            />
          )}
        </ScrollArea>
      </div>

      {/* User Profile */}
      {!isCollapsed && (
        <>
          <Separator />
          <UserProfile />
        </>
      )}
    </div>
  );
}
