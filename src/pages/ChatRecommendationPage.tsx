import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SendIcon, ShoppingBagIcon, RotateCcwIcon, HelpCircleIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatBubble } from '../components/ChatBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { useAppStore } from '../stores/appStore';
import { medicineSystemPrompt } from '../utils/medicineSystemPrompt';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatRecommendationPage() {
  const navigate = useNavigate();
  const { addRecommendedMedicines } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Health Assistant with complete knowledge of 50 over-the-counter medicines. 💊\n\nI can help you:\n✓ Find the right medicine for your symptoms (headache, fever, cough, allergies, etc.)\n✓ Explain WHY each medicine works\n✓ Provide complete details: dosage, manufacturer, active ingredients, storage\n✓ Give safety warnings and usage instructions\n\nJust describe your symptoms, and I'll recommend the best options from our pharmacy! What are you experiencing today?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

      if (!apiKey) {
        throw new Error('OpenAI API key not configured');
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: medicineSystemPrompt,
            },
            ...messages.slice(-10).map(m => ({
              role: m.isUser ? 'user' : 'assistant',
              content: m.text,
            })),
            {
              role: 'user',
              content: inputValue,
            },
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponseText = data.choices[0]?.message?.content || 'Sorry, I could not process your request.';

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponseText,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleAddRecommended = () => {
    addRecommendedMedicines(['med-1', 'med-6', 'med-21']);
    navigate('/select-medicine');
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Hello! I'm your AI Health Assistant with complete knowledge of 50 over-the-counter medicines. 💊\n\nI can help you:\n✓ Find the right medicine for your symptoms (headache, fever, cough, allergies, etc.)\n✓ Explain WHY each medicine works\n✓ Provide complete details: dosage, manufacturer, active ingredients, storage\n✓ Give safety warnings and usage instructions\n\nJust describe your symptoms, and I'll recommend the best options from our pharmacy! What are you experiencing today?",
        isUser: false,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-[calc(100vh-180px)] px-8 py-12">
      <div className="container max-w-5xl mx-auto h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col h-[calc(100vh-280px)]"
        >
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-heading font-semibold text-foreground mb-3">
              AI Health Assistant
            </h1>
            <p className="text-lg text-muted-foreground">
              Get personalized medicine recommendations based on your symptoms
            </p>
          </div>

          <Card className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b border-border p-4 bg-muted/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                      💊
                    </motion.div>
                  </div>
                  <div>
                    <h3 className="font-heading font-medium text-foreground">AI Health Assistant</h3>
                    <p className="text-xs text-muted-foreground">Always here to help</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleClearChat}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    title="Clear Chat"
                  >
                    <RotateCcwIcon className="w-4 h-4" strokeWidth={2} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    title="Help"
                  >
                    <HelpCircleIcon className="w-4 h-4" strokeWidth={2} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-4">
              {messages.map((message) => (
                <ChatBubble
                  key={message.id}
                  message={message.text}
                  isUser={message.isUser}
                  timestamp={message.timestamp}
                />
              ))}

              {isTyping && <TypingIndicator />}

              <div ref={messagesEndRef} />
            </div>

            <div className="border-t border-border p-6 bg-background">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Describe your symptoms..."
                  className="flex-1 h-14 px-6 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />

                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <SendIcon className="w-5 h-5" strokeWidth={2} />
                </Button>
              </div>

              <div className="flex gap-4 mt-4">
                <Button
                  onClick={handleAddRecommended}
                  className="flex-1 h-14 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  <ShoppingBagIcon className="w-5 h-5 mr-3" strokeWidth={2} />
                  Add Suggested Items
                </Button>

                <Button
                  onClick={() => navigate('/select-medicine')}
                  className="flex-1 h-14 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  View All Medicines
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
