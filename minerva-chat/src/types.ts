// src/types.ts
export interface Message {
  id?: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

export type MessageCallback = (message: { text: string }) => void;
export type StatusCallback = (status: string) => void;

export interface SidebarProps {
  isConnected?: boolean;
}

export interface ChatContainerProps {
  messages: Message[];
  onSendMessage: (text: string) => Promise<void>;
  isLoading?: boolean;
}

export interface MessageProps {
  message: Message;
}

export interface MessageInputProps {
  onSend: (text: string) => void;
  disabled?: boolean;
}

export interface DirectLineAdapterConfig {
  secret: string;
}
