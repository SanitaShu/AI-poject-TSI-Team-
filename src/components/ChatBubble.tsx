import { motion } from 'framer-motion';
import { BotIcon, UserIcon } from 'lucide-react';

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  timestamp?: Date;
}

export function ChatBubble({ message, isUser, timestamp }: ChatBubbleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex gap-3 mb-6 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div
        className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
          isUser ? 'bg-primary' : 'bg-accent'
        }`}
      >
        {isUser ? (
          <UserIcon className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
        ) : (
          <BotIcon className="w-5 h-5 text-accent-foreground" strokeWidth={2} />
        )}
      </div>

      <div className={`flex flex-col max-w-[70%] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-6 py-4 ${
            isUser
              ? 'bg-primary text-primary-foreground'
              : 'bg-card text-card-foreground border border-border'
          }`}
        >
          <p className="text-base leading-relaxed whitespace-pre-wrap">{message}</p>
        </div>
        {timestamp && (
          <span className="text-xs text-muted-foreground mt-2">
            {timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </motion.div>
  );
}
