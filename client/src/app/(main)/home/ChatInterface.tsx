"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Search, Send, User, LogOut, MessageCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

// Mock data for demonstration
const mockContacts = [
  {
    id: 1,
    name: "John Doe",
    username: "john_doe",
    lastMessage: "Hey, how are you?",
    time: "2:30 PM",
    unreadCount: 2,
    isOnline: true,
    avatar: "/avatars/john.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    username: "jane_smith",
    lastMessage: "See you tomorrow!",
    time: "1:15 PM",
    unreadCount: 0,
    isOnline: false,
    avatar: "/avatars/jane.jpg",
  },
  {
    id: 3,
    name: "Mike Johnson",
    username: "mike_j",
    lastMessage: "Thanks for the help",
    time: "11:30 AM",
    unreadCount: 1,
    isOnline: true,
    avatar: "/avatars/mike.jpg",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    username: "sarah_w",
    lastMessage: "Good morning!",
    time: "9:45 AM",
    unreadCount: 0,
    isOnline: false,
    avatar: "/avatars/sarah.jpg",
  },
];

const mockMessages = [
  {
    id: 1,
    text: "Hey, how are you doing?",
    sender: "other",
    time: "2:25 PM",
  },
  {
    id: 2,
    text: "I'm doing great! Thanks for asking. How about you?",
    sender: "me",
    time: "2:26 PM",
  },
  {
    id: 3,
    text: "I'm good too. Just working on some projects.",
    sender: "other",
    time: "2:28 PM",
  },
  {
    id: 4,
    text: "That sounds interesting! What kind of projects?",
    sender: "me",
    time: "2:29 PM",
  },
  {
    id: 5,
    text: "Web development stuff, mainly React and Next.js",
    sender: "other",
    time: "2:30 PM",
  },
];

export default function ChatInterface() {
  const [selectedContact, setSelectedContact] = useState(mockContacts[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const { user, logout } = useAuth();

  const filteredContacts = mockContacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-800">Messages</h1>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              {filteredContacts.length} contacts
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
          <div className="p-2">
            {filteredContacts.map((contact) => (
              <Card
                key={contact.id}
                className={`p-3 mb-2 cursor-pointer transition-all hover:bg-gray-50 ${
                  selectedContact.id === contact.id
                    ? "bg-blue-50 border-blue-200"
                    : "border-gray-100"
                }`}
                onClick={() => setSelectedContact(contact)}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={contact.avatar} alt={contact.name} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {contact.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {contact.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {contact.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {contact.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {contact.lastMessage}
                    </p>
                  </div>

                  {contact.unreadCount > 0 && (
                    <Badge
                      variant="default"
                      className="bg-blue-600 text-white text-xs"
                    >
                      {contact.unreadCount}
                    </Badge>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </ScrollArea>

        {/* User Profile at Bottom */}
        <div className="p-4 border-t border-gray-200">
          <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <DialogTrigger asChild>
              <Card className="p-3 cursor-pointer hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.fullName} alt={user?.fullName} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user?.fullName
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.fullName}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      @{user?.username}
                    </p>
                  </div>
                  <User className="h-4 w-4 text-gray-400" />
                </div>
              </Card>
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center">User Profile</DialogTitle>
              </DialogHeader>

              <div className="flex flex-col items-center space-y-4 py-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.fullName} alt={user?.fullName} />
                  <AvatarFallback className="bg-blue-600 text-white text-lg">
                    {user?.fullName
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>

                <div className="text-center space-y-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {user?.fullName}
                  </h3>
                  <p className="text-sm text-gray-500">@{user?.username}</p>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>

                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={selectedContact.avatar}
                  alt={selectedContact.name}
                />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  {selectedContact.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              {selectedContact.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedContact.name}
              </h2>
              <p className="text-sm text-gray-500">
                {selectedContact.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {mockMessages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "me" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "me"
                      ? "bg-blue-600 text-white"
                      : "bg-white border border-gray-200 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "me"
                        ? "text-blue-100"
                        : "text-gray-500"
                    }`}
                  >
                    {message.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-4"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
