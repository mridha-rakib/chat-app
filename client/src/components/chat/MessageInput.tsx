// src/components/chat/MessageInput.tsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Smile } from "lucide-react";
import { useSendMessageMutation } from "@/lib/store/api/messageApi";
import {
  selectSelectedConversation,
  selectSendingMessage,
} from "@/lib/store/slices/conversationSlice";

export function MessageInput() {
  const [message, setMessage] = useState("");
  const selectedConversation = useSelector(selectSelectedConversation);
  const sendingMessage = useSelector(selectSendingMessage);

  const [sendMessage] = useSendMessageMutation();

  const handleSendMessage = async () => {
    if (!message.trim() || !selectedConversation) return;

    try {
      console.log("🚀 Sending message to:", selectedConversation._id);
      const result = await sendMessage({
        receiverId: selectedConversation._id,
        message: message.trim(),
      }).unwrap();

      if (result.success) {
        setMessage("");
        console.log("✅ Message sent successfully");
      }
    } catch (error) {
      console.log("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
      <div className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyUp={handleKeyPress}
            disabled={sendingMessage}
            className="pr-12 py-3 resize-none rounded-2xl border-gray-200 focus:border-blue-300 focus:ring-blue-200"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 text-gray-400 hover:text-gray-600"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || sendingMessage}
          className="h-12 w-12 rounded-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
