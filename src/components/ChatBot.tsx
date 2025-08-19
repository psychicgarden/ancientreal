import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useWallet } from '@/contexts/WalletContext';
import { useLocation } from 'react-router-dom';
import { useErrorHandler } from '@/lib/error-handler';
import { useAsyncOperation } from '@/hooks/useAsyncOperation';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface QuickReply {
  text: string;
  message: string;
}

const ChatBot: React.FC = () => {
  // Local state for ChatBot functionality
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { account, isConnected } = useWallet();
  const location = useLocation();
  const { handleError } = useErrorHandler();
  const { execute } = useAsyncOperation();

  const quickReplies: QuickReply[] = [
    { text: "How to invest?", message: "How do I start investing in properties on the platform?" },
    { text: "Mortgage details", message: "Tell me about the mortgage terms and requirements" },
    { text: "Rental yields", message: "How are rental yields calculated and distributed?" },
    { text: "Secondary trading", message: "How does the secondary marketplace work?" },
    { text: "KYC process", message: "What is required for KYC verification?" },
    { text: "Platform fees", message: "What are all the fees involved in investing?" }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !hasGreeted) {
      const welcomeMessage = getContextualGreeting();
      setMessages([{
        id: '1',
        role: 'assistant',
        content: welcomeMessage,
        timestamp: new Date()
      }]);
      setHasGreeted(true);
    }
  }, [isOpen, hasGreeted, location.pathname, isConnected]);

  // Reset greeting when reopening chat to ensure fresh branding
  useEffect(() => {
    if (!isOpen) {
      setHasGreeted(false);
      setMessages([]);
    }
  }, [isOpen]);

  const getContextualGreeting = (): string => {
    const pageGreetings: Record<string, string> = {
      '/': "Welcome to Ancient — the world's first decentralized nation. I'm here to guide you through our pioneering approach to fractional real estate ownership, where community meets capital in the most sought-after destinations. How may I assist you today?",
      '/investor-portal': "Ready to join our investment community? I'll walk you through curated opportunities that blend financial returns with cultural immersion. Each property has been selected for both yield potential and connection to our global network.",
      '/portfolio': isConnected 
        ? "Let's review your position within our decentralized nation. I can detail your portfolio performance, yield distributions, and opportunities to expand your involvement in our community."
        : "To access your portfolio, please connect your wallet. Once connected, you'll see how your investments contribute to our shared vision of modern nomadic living.",
      '/banking': "Exploring our financial ecosystem? I can explain how to leverage your property equity, optimize yields, and participate in our innovative lending protocols that power the decentralized nation.",
      '/community': "Welcome to the heart of Ancient — our global community of digital nomads and conscious investors. I can share how property ownership grants you citizenship and access to our worldwide network.",
      '/legal-portal': "Our legal framework represents years of careful structuring to ensure compliance while pioneering new models of ownership. I can explain how we've created a legally sound foundation for the future of property investment."
    };

    return pageGreetings[location.pathname] || pageGreetings['/'];
  };

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('chatbot-assistant', {
        body: {
          message: messageText,
          context: {
            currentPage: location.pathname,
            walletAddress: account,
            userType: isConnected ? 'connected' : 'visitor'
          },
          conversationHistory: messages.slice(-6).map(m => ({
            role: m.role,
            content: m.content
          }))
        }
      });

      if (error) throw error;

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      
      // Show specific error message for API quota issues
      const errorMessage = error.message?.includes('429') || error.message?.includes('quota') 
        ? "Our AI assistant is currently at capacity. Please try again in a few moments."
        : "I'm temporarily unavailable. Please try again shortly.";
        
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (quickReply: QuickReply) => {
    sendMessage(quickReply.message);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg z-50 transition-all duration-200 hover:scale-105"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    );
  }

  // Simple markdown processor for bold text
  const processMarkdown = (text: string) => {
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  return (
    <Card className="fixed bottom-6 right-6 w-96 h-[600px] z-50 flex flex-col bg-background border shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">Ancient</span>
          <Badge variant="secondary" className="bg-primary-foreground/20 text-primary-foreground text-xs">
            AI
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen(false)}
          className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg text-sm ${
                message.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground border'
              }`}
            >
              <div 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ 
                  __html: processMarkdown(message.content)
                    .replace(/\n\n/g, '<br><br>')
                    .replace(/\n/g, '<br>')
                }}
              />
              <div className={`text-xs mt-1 opacity-70`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted border p-3 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Replies */}
      {messages.length <= 1 && (
        <div className="p-4 border-t bg-muted/50">
          <div className="text-xs text-muted-foreground mb-2">Quick questions:</div>
          <div className="flex flex-wrap gap-2">
            {quickReplies.slice(0, 4).map((reply, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="text-xs h-7"
                onClick={() => handleQuickReply(reply)}
                disabled={isLoading}
              >
                {reply.text}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about investments, mortgages, yields..."
            className="flex-1 px-3 py-2 text-sm border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            disabled={isLoading}
          />
          <Button
            onClick={() => sendMessage(inputValue)}
            disabled={!inputValue.trim() || isLoading}
            size="icon"
            className="h-10 w-10"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChatBot;