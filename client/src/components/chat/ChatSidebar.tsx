// src/components/chat/ChatSidebar.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { parseAsString, useQueryState } from "nuqs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { useGetAllUsersQuery } from "@/lib/store/api/userApi";
import { selectCurrentUser } from "@/lib/store/slices/authSlice";
import { selectOnlineUsers } from "@/lib/store/slices/socketSlice";
import { setSelectedConversation } from "@/lib/store/slices/conversationSlice";
import { useLazyGetMessagesQuery } from "@/lib/store/api/messageApi";
import ContactList from "./ContactList";
import { UserProfile } from "./UserProfile";
import { User } from "@/types/auth.types";

export function ChatSidebar() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectCurrentUser);
  const onlineUsers = useSelector(selectOnlineUsers);

  // Move all hooks to the top level
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
  console.log(usersData?.data?.users);

  useEffect(() => {
    if (isUsersError) {
      console.log("Error fetching users:", usersError);
    }
  }, [isUsersError, usersError]);

  const [getMessages] = useLazyGetMessagesQuery();

  // Early return after all hooks
  if (!currentUser) {
    return (
      <div className="w-80 bg-white border-r border-gray-200 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  const users = usersData?.data?.users || [];

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
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {filteredUsers.length} contacts
          </Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200"
          />
        </div>
      </div>

      {/* Contacts List */}
      <ScrollArea className="flex-1">
        <ContactList
          users={filteredUsers}
          onlineUsers={onlineUsers}
          onSelectUser={handleSelectUser}
          isLoading={usersLoading}
        />
      </ScrollArea>

      {/* User Profile */}
      <UserProfile />
    </div>
  );
}
