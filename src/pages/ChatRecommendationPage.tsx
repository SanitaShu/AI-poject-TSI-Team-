import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { SendIcon, ShoppingBagIcon, RotateCcwIcon, HelpCircleIcon, MicIcon, MicOffIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChatBubble } from '../components/ChatBubble';
import { TypingIndicator } from '../components/TypingIndicator';
import { useAppStore } from '../stores/appStore';
import { medicineSystemPrompt } from '../utils/medicineSystemPrompt';
import { voiceRecognition, textToSpeech, isSpeechRecognitionSupported, isTextToSpeechSupported } from '../services/voice';
import { useTranslation } from '../hooks/useTranslation';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export function ChatRecommendationPage() {
  const navigate = useNavigate();
  const { addRecommendedMedicines } = useAppStore();
  const { t } = useTranslation();
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
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Log voice support on mount and set page title
  useEffect(() => {
    // Set page title
    document.title = 'AI Assistant – Smart Medicine Vending';

    console.log('🎤 Voice Features Status:');
    console.log('  Speech Recognition:', isSpeechRecognitionSupported() ? '✅ Supported' : '❌ Not Supported');
    console.log('  Text-to-Speech:', isTextToSpeechSupported() ? '✅ Supported' : '❌ Not Supported');
    console.log('  Browser:', navigator.userAgent);

    // Cleanup function to reset title when leaving page
    return () => {
      document.title = 'Smart Medicine Vending';
    };
  }, []);

  // Voice input handlers
  const startListening = async () => {
    console.log('🎤 Starting voice recognition...');

    if (!isSpeechRecognitionSupported()) {
      alert('❌ Speech recognition is not supported in your browser.\n\nPlease use:\n• Google Chrome\n• Microsoft Edge\n• Safari');
      console.error('Speech recognition not supported');
      return;
    }

    // Request microphone permission
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('✅ Microphone permission granted');
      stream.getTracks().forEach(track => track.stop()); // Stop the stream, we just needed permission
    } catch (error) {
      console.error('❌ Microphone permission denied:', error);
      alert('❌ Microphone access denied.\n\nPlease:\n1. Click the microphone icon in your browser address bar\n2. Allow microphone access\n3. Refresh the page and try again');
      return;
    }

    setIsListening(true);
    setInterimTranscript('');

    voiceRecognition.startListening(
      (transcript, isFinal) => {
        console.log(`🎙️ Transcript (${isFinal ? 'final' : 'interim'}):`, transcript);
        if (isFinal) {
          // Append to existing input (for continuous long speech)
          setInputValue(prev => {
            const newText = prev ? `${prev} ${transcript}` : transcript;
            console.log('✅ Added to transcript:', newText);
            return newText;
          });
          setInterimTranscript('');
        } else {
          setInterimTranscript(transcript);
        }
      },
      (error) => {
        console.error('❌ Voice recognition error:', error);

        let errorMessage = 'Voice recognition error occurred.';

        if (error === 'network') {
          errorMessage = '❌ Network Error\n\nSpeech recognition requires:\n• Internet connection\n• Access to Google servers\n\nPlease check:\n1. Your internet connection is working\n2. You\'re not behind a firewall blocking Google services\n3. Try refreshing the page\n\nAlternatively, type your message instead.';
        } else if (error === 'not-allowed') {
          errorMessage = '❌ Microphone Access Denied\n\nPlease:\n1. Click the lock/microphone icon in the address bar\n2. Allow microphone access\n3. Refresh and try again';
        } else if (error === 'no-speech') {
          errorMessage = '⚠️ No speech detected\n\nPlease speak clearly and try again.';
        } else {
          errorMessage = `❌ Error: ${error}\n\nPlease try again or type your message.`;
        }

        alert(errorMessage);
        setIsListening(false);
        setInterimTranscript('');
      },
      () => {
        console.log('🎤 Voice recognition ended');
        setIsListening(false);
        setInterimTranscript('');
      }
    );
  };

  const stopListening = () => {
    console.log('🛑 Stopping voice recognition');
    voiceRecognition.stopListening();
    setIsListening(false);
    setInterimTranscript('');
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Text-to-speech handlers
  const speakText = (text: string) => {
    console.log('🔊 Speaking text:', text.substring(0, 50) + '...');

    if (!isTextToSpeechSupported()) {
      console.error('❌ Text-to-speech is not supported in your browser');
      return;
    }

    setIsSpeaking(true);

    textToSpeech.speak(
      text,
      {
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      },
      () => {
        console.log('✅ Finished speaking');
        setIsSpeaking(false);
      },
      (error) => {
        console.error('❌ Text-to-speech error:', error);
        setIsSpeaking(false);
      }
    );
  };

  const stopSpeaking = () => {
    textToSpeech.stop();
    setIsSpeaking(false);
  };

  const toggleAutoSpeak = () => {
    const newAutoSpeak = !autoSpeak;
    setAutoSpeak(newAutoSpeak);

    if (!newAutoSpeak) {
      stopSpeaking();
    }
  };

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

      console.log('API Key status:', apiKey ? 'Present' : 'Missing');
      console.log('Environment check:', import.meta.env.MODE);

      // Validate API key before using it
      if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
        throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your environment variables.');
      }

      // Clean the API key - remove any whitespace or newlines
      const cleanApiKey = apiKey.replace(/\s+/g, '');

      // Validate API key format
      if (!cleanApiKey.startsWith('sk-')) {
        throw new Error('Invalid OpenAI API key format. Key should start with "sk-"');
      }

      const requestBody = {
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
      };

      console.log('Making OpenAI API request...');

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cleanApiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      console.log('OpenAI API response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.error?.message || response.statusText;
        throw new Error(`API request failed (${response.status}): ${errorMessage}`);
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

      // Auto-speak AI response if enabled
      if (autoSpeak) {
        speakText(aiResponseText);
      }
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I encountered an error processing your request. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);

      // Speak error message if auto-speak is enabled
      if (autoSpeak) {
        speakText(errorMessage.text);
      }
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
              {t.aiAssistant.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-4">
              {t.aiAssistant.subtitle}
            </p>
            <div className="bg-yellow-50 dark:bg-yellow-950/20 border-2 border-yellow-400 dark:border-yellow-600 rounded-lg p-4 max-w-3xl mx-auto">
              <p className="text-base font-semibold text-yellow-900 dark:text-yellow-100">
                {t.aiAssistant.safetyNotice}
              </p>
            </div>
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
                    <h3 className="font-heading font-medium text-foreground">{t.aiAssistant.title}</h3>
                    <p className="text-xs text-muted-foreground">{t.header.aiAssistant}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={toggleAutoSpeak}
                    variant={autoSpeak ? "default" : "ghost"}
                    size="icon"
                    className={`h-10 w-10 ${autoSpeak ? 'bg-green-500 hover:bg-green-600' : ''}`}
                    title={autoSpeak ? "Auto-speak enabled (click to disable)" : "Enable auto-speak"}
                  >
                    {autoSpeak ? (
                      <Volume2Icon className="w-4 h-4 text-white" strokeWidth={2} />
                    ) : (
                      <VolumeXIcon className="w-4 h-4" strokeWidth={2} />
                    )}
                  </Button>
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
              {/* Interim transcript indicator */}
              <AnimatePresence>
                {isListening && interimTranscript && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-3 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                  >
                    <p className="text-sm text-blue-700 dark:text-blue-300 italic">
                      Listening: {interimTranscript}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Speaking indicator */}
              <AnimatePresence>
                {isSpeaking && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="mb-3 px-4 py-2 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center gap-2"
                  >
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      <Volume2Icon className="w-4 h-4 text-green-600 dark:text-green-400" />
                    </motion.div>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Speaking...
                    </p>
                    <button
                      onClick={stopSpeaking}
                      className="ml-auto text-xs text-green-600 dark:text-green-400 hover:underline"
                    >
                      Stop
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex gap-4">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !isListening && handleSend()}
                  placeholder={isListening ? t.aiAssistant.thinking : t.aiAssistant.placeholder}
                  disabled={isListening}
                  className="flex-1 h-14 px-6 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                />

                {/* Microphone button */}
                <Button
                  onClick={toggleListening}
                  variant={isListening ? "default" : "outline"}
                  className={`h-14 px-6 rounded-xl ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white'
                      : 'border-2 hover:bg-accent'
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  <motion.div
                    animate={isListening ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    {isListening ? (
                      <MicOffIcon className="w-5 h-5" strokeWidth={2} />
                    ) : (
                      <MicIcon className="w-5 h-5" strokeWidth={2} />
                    )}
                  </motion.div>
                </Button>

                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isListening}
                  className="h-14 px-8 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
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
                  {t.aiAssistant.continue}
                </Button>

                <Button
                  onClick={() => navigate('/select-medicine')}
                  className="flex-1 h-14 rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  {t.aiAssistant.skip}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
