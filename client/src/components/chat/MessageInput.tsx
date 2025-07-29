// src/components/chat/MessageInput.tsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
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
    <div className="bg-white border-t border-gray-200 p-4">
      <div className="flex space-x-2">
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyUp={handleKeyPress}
          disabled={sendingMessage}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || sendingMessage}
          className="px-4"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
