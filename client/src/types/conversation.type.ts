export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  participants: string[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface SelectedConversation {
  _id: string;
  fullName: string;
  username: string;
  profilePic: string;
}

export interface ConversationState {
  selectedConversation: SelectedConversation | null;
  messages: Message[];
  conversations: Conversation[];
  loading: boolean;
  error: string | null;
  messageLoading: boolean;
  sendingMessage: boolean;
}
