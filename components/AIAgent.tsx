import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, User } from '../types';
import { chatWithAI } from '../services/geminiService';

interface AIAgentProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  gameContext?: string;
}

export const AIAgent: React.FC<AIAgentProps> = ({ isOpen, onClose, user, gameContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'model', text: "Hi! I'm Codey. I'm here to help you train your brain! Ask me anything about the games or for a hint.", timestamp: Date.now() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isOpen]);

  // Initial greeting based on context
  useEffect(() => {
    if (isOpen && gameContext) {
      // Don't spam, but if context changed drastically, maybe add a message (skipped for simplicity)
    }
  }, [isOpen, gameContext]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', text: input, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    const userStats = `Level: ${user.level}, XP: ${user.xp}, Current Game: ${gameContext || 'None'}`;
    const responseText = await chatWithAI(messages, input, userStats);

    const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
    setMessages(prev => [...prev, aiMsg]);
    setIsLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-dark-surface shadow-2xl z-50 flex flex-col border-l border-gray-200 dark:border-dark-border transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-border flex justify-between items-center bg-gray-50 dark:bg-dark-bg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-100 dark:bg-brand-900 flex items-center justify-center text-2xl">🤖</div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Codey AI</h3>
            <span className="text-xs text-brand-600 dark:text-brand-400">Online & Ready</span>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full text-gray-500">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-dark-surface" ref={scrollRef}>
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
              msg.role === 'user' 
                ? 'bg-brand-600 text-white rounded-tr-none' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-tl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-2 rounded-tl-none flex gap-1 items-center">
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-bg">
        <div className="flex gap-2">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Codey..."
            className="flex-1 px-4 py-2 rounded-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface text-gray-900 dark:text-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
          <button 
            onClick={handleSend} 
            disabled={!input.trim() || isLoading}
            className="p-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 disabled:opacity-50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
      </div>
    </div>
  );
};