import { FC, useEffect, useRef } from 'react';
import Message from './Message';
import MessageInput from './MessageInput';
import { ChatContainerProps } from '../types';

const ChatContainer: FC<ChatContainerProps> = ({ messages, onSendMessage, isLoading = false }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message) => (
          <Message key={`${message.id}-${message.timestamp}`} message={message} />
        ))}
        {isLoading && <div className="typing-indicator">Bot is typing...</div>}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatContainer;
