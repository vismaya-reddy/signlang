'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import {
  ArrowLeft,
  Send,
  Zap,
  Video,
  Volume2,
  Copy,
  Smile,
} from 'lucide-react';

type Message = {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  hasAudio?: boolean;
  hasSign?: boolean;
};

const mockResponses = [
  "That's a great question! The letter A is formed by making a closed fist with your thumb on the side. Let me show you how.",
  "I'd be happy to help you practice! Let's work on your hand positioning. Try to keep your fingers relaxed.",
  "You're doing great! Your form is getting better. Keep practicing this movement to build muscle memory.",
  "Would you like to learn about similar signs? The letter A has some variations in different sign language dialects.",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your SignVerse AI guide. I'm here to help you master Indian Sign Language (ISL), answer questions about handshapes and contact points, and support your practice. How can I help you today?",
      timestamp: new Date(),
      hasAudio: true,
      hasSign: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: mockResponses[Math.floor(Math.random() * mockResponses.length)],
        timestamp: new Date(),
        hasAudio: true,
        hasSign: true,
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-background via-background to-background/95 flex flex-col">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-xl border-b border-border/50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="font-display font-bold">SignVerse AI Guide</h1>
              <p className="text-xs text-muted-foreground">Indian Sign Language Companion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-8 space-y-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="space-y-4"
        >
          {messages.map((message, idx) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-md space-y-2 ${
                  message.type === 'user'
                    ? 'bg-gradient-to-r from-primary to-accent text-white'
                    : 'bg-card border border-border/50'
                } rounded-2xl p-4`}
              >
                <p className={message.type === 'user' ? 'text-white' : ''}>{message.content}</p>

                {message.type === 'ai' && (
                  <div className="flex items-center gap-2 pt-3 border-t border-border/50">
                    {message.hasAudio && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Volume2 className="w-4 h-4 text-primary" />
                      </Button>
                    )}
                    {message.hasSign && (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Video className="w-4 h-4 text-secondary" />
                      </Button>
                    )}
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 ml-auto">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="bg-card border border-border/50 rounded-2xl p-4 space-y-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-muted-foreground"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </motion.div>
      </div>

      {/* Input */}
      <div className="border-t border-border/50 bg-background/80 backdrop-blur-xl px-6 py-4">
        <form onSubmit={handleSendMessage} className="flex gap-3">
          <div className="relative flex-1">
            <Input
              placeholder="Ask me anything about sign language..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              className="pr-12"
            />
            <Button
              type="submit"
              size="sm"
              variant="ghost"
              disabled={!input.trim() || isLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>

          <Button variant="outline" size="icon" title="Show emoji picker">
            <Smile className="w-4 h-4" />
          </Button>
        </form>

        <div className="flex gap-2 mt-4 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("How do I sign the letter A?")}
            className="text-xs"
          >
            Letter A help
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Can you guide me through practice?")}
            className="text-xs"
          >
            Start practice
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setInput("Show me the sign for 'hello'")}
            className="text-xs"
          >
            Common phrases
          </Button>
        </div>
      </div>
    </div>
  );
}
