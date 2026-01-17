'use client';

import { useRef, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import MessageDisplay from './MessageDisplay';
import type { Message } from '@/types';

interface ChatAreaProps {
  messages: Message[];
  isStreaming: boolean;
  streamingContent: string;
  streamingThinking: string;
}

export default function ChatArea({
  messages,
  isStreaming,
  streamingContent,
  streamingThinking,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

  // Show welcome screen if no messages
  if (messages.length === 0 && !isStreaming) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-2xl">
          {/* Animated logo */}
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-purple-600 to-purple-800 flex items-center justify-center shadow-glow-lg animate-pulse-slow">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto rounded-full bg-purple-500/20 animate-ping" style={{ animationDuration: '3s' }} />
          </div>

          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-300 via-purple-200 to-purple-400 bg-clip-text text-transparent glow-text">
            Welcome to Endless
          </h2>

          <p className="text-gray-400 text-lg mb-8 leading-relaxed">
            I'm your advanced storytelling companion, powered by Claude Opus 4.5.
            Together, we can craft extraordinary narratives—from epic original stories
            to faithful fan fiction that honors beloved characters.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
            <div className="card-dream p-4">
              <h3 className="text-purple-300 font-semibold mb-2">📖 Original Stories</h3>
              <p className="text-gray-400 text-sm">
                Create rich, complex narratives with depth and emotional resonance.
              </p>
            </div>
            <div className="card-dream p-4">
              <h3 className="text-purple-300 font-semibold mb-2">✨ Fan Fiction</h3>
              <p className="text-gray-400 text-sm">
                Explore beloved worlds with authentic character voices and lore.
              </p>
            </div>
            <div className="card-dream p-4">
              <h3 className="text-purple-300 font-semibold mb-2">💬 Discussion</h3>
              <p className="text-gray-400 text-sm">
                Analyze craft, explore themes, and dive into meta-commentary.
              </p>
            </div>
          </div>

          <p className="text-gray-500 text-sm mt-8">
            Start by typing your story idea, a fan fiction prompt, or a question about storytelling...
          </p>
        </div>
      </div>
    );
  }

  // Create streaming message for display
  const streamingMessage: Message | null = isStreaming ? {
    id: 'streaming',
    role: 'assistant',
    content: streamingContent,
    timestamp: Date.now(),
    thinkingContent: streamingThinking || undefined,
  } : null;

  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => (
          <MessageDisplay key={message.id} message={message} />
        ))}

        {streamingMessage && (
          <MessageDisplay message={streamingMessage} isStreaming={true} />
        )}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
