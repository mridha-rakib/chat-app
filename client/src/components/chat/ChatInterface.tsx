// src/components/chat/ChatInterface.tsx
"use client";

import { useSocket } from "@/hooks/useSocket";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { useSelector } from "react-redux";
import { selectSelectedConversation } from "@/lib/store/slices/conversationSlice";
import { MessageSquare } from "lucide-react";
import React from "react";

export default function ChatInterface() {
  useSocket();

  const selectedConversation = useSelector(selectSelectedConversation);

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <ChatSidebar />
      {selectedConversation ? (
        <ChatArea />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white border-l">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Welcome to Chat
              </h2>
              <p className="text-gray-500 max-w-sm">
                Select a contact from the sidebar to start messaging
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
