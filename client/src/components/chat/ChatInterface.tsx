"use client";

import { useSocket } from "@/hooks/useSocket";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";
import { useSelector } from "react-redux";
import { selectSelectedConversation } from "@/lib/store/slices/conversationSlice";

import React from "react";

export default function ChatInterface() {
  useSocket();

  const selectedConversation = useSelector(selectSelectedConversation);

  return (
    <div className="flex h-screen bg-gray-50">
      <ChatSidebar />
      {selectedConversation ? (
        <ChatArea />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white">
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Welcome to Chat
            </h2>
            <p className="text-gray-500">Select a contact to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
