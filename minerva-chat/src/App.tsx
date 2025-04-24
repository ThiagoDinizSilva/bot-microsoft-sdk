import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatContainer from './components/ChatContainer';
import messageService from './services/messageService';
import { Message } from './types';
import './App.css';

function App() {
  const [messages, setMessages] = useState<Message[]>(messageService.getMessages());
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  // Load messages on initial render
  useEffect(() => {
    const storedMessages = messageService.getMessages();
    if (storedMessages.length > 0) {
      setMessages(storedMessages);
    }
  }, []);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    try {
      const updatedMessages = await messageService.sendMessage(text);
      setMessages(updatedMessages);
      setIsConnected(true);
    } catch (error) {
      console.error('Failed to send message:', error);
      setIsConnected(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app">
      <Sidebar isConnected={isConnected} />
      <ChatContainer messages={messages} onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
}

export default App;
