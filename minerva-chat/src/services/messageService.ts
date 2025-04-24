import axios from 'axios';
import { Message } from '../types';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/messages';

class MessageService {
  // Store messages in memory (consider adding localStorage persistence if needed)
  private static messages: Message[] = [];

  static async sendMessage(text: string): Promise<Message[]> {
    try {
      // Create user message immediately (optimistic update)
      const userMessage: Message = {
        id: Date.now(),
        text,
        sender: 'user',
        timestamp: new Date().toISOString(),
      };

      // Add to local storage
      this.messages = [...this.messages, userMessage];

      // Send to API
      const response = await axios.post(API_URL, { text });

      if (response.status === 200) {
        // Create bot response
        const botMessage: Message = {
          id: Date.now() + 1, // Ensure unique ID
          text: response.data.reply || response.data.text,
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };

        // Add to local storage
        this.messages = [...this.messages, botMessage];
      }

      return this.messages;
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  static getMessages(): Message[] {
    return this.messages;
  }

  // Optional: Add persistence methods if needed
  static loadMessages(messages: Message[]): void {
    this.messages = messages;
  }
}

export default MessageService;
