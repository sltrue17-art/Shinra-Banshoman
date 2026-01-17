'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { clsx } from 'clsx';
import { User, Sparkles, ChevronDown, ChevronUp, Globe } from 'lucide-react';
import type { Message } from '@/types';

interface MessageDisplayProps {
  message: Message;
  isStreaming?: boolean;
}

export default function MessageDisplay({ message, isStreaming }: MessageDisplayProps) {
  const [showThinking, setShowThinking] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const isUser = message.role === 'user';

  return (
    <div
      className={clsx(
        'flex gap-4 py-6 animate-fade-in',
        isUser ? 'flex-row-reverse' : 'flex-row'
      )}
    >
      {/* Avatar */}
      <div
        className={clsx(
          'flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center',
          isUser
            ? 'bg-purple-500/20 border border-purple-500/40'
            : 'bg-gradient-to-br from-purple-600 to-purple-800 shadow-glow'
        )}
      >
        {isUser ? (
          <User className="w-5 h-5 text-purple-300" />
        ) : (
          <Sparkles className="w-5 h-5 text-white" />
        )}
      </div>

      {/* Content */}
      <div className={clsx('flex-1 max-w-3xl', isUser && 'text-right')}>
        {/* Search Results */}
        {message.searchResults && message.searchResults.length > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 mb-2"
            >
              <Globe className="w-4 h-4" />
              <span>Web Search Results ({message.searchResults.length})</span>
              {showSearch ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showSearch && (
              <div className="space-y-2 p-3 bg-purple-500/5 rounded-lg border border-purple-500/20">
                {message.searchResults.map((result, idx) => (
                  <a
                    key={idx}
                    href={result.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-2 hover:bg-purple-500/10 rounded transition-colors"
                  >
                    <p className="text-purple-300 text-sm font-medium">{result.title}</p>
                    <p className="text-gray-400 text-xs mt-1 line-clamp-2">{result.snippet}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Thinking Block */}
        {message.thinkingContent && (
          <div className="mb-4">
            <button
              onClick={() => setShowThinking(!showThinking)}
              className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 mb-2"
            >
              <span>💭 Extended Thinking</span>
              {showThinking ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {showThinking && (
              <div className="thinking-block text-sm text-gray-400 whitespace-pre-wrap">
                {message.thinkingContent}
              </div>
            )}
          </div>
        )}

        {/* Message Content */}
        <div
          className={clsx(
            'rounded-2xl px-5 py-4',
            isUser
              ? 'bg-purple-600/20 border border-purple-500/30 inline-block text-left'
              : 'bg-endless-dark/50 border border-purple-500/10'
          )}
        >
          {isUser ? (
            <p className="text-gray-200 whitespace-pre-wrap">{message.content}</p>
          ) : (
            <div className="prose-endless">
              <ReactMarkdown
                components={{
                  p: ({ children }) => <p className="text-gray-200 leading-relaxed mb-4 last:mb-0">{children}</p>,
                  h1: ({ children }) => <h1 className="text-2xl font-bold text-purple-200 mb-4 mt-6 first:mt-0">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-semibold text-purple-200 mb-3 mt-5 first:mt-0">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-lg font-semibold text-purple-300 mb-2 mt-4 first:mt-0">{children}</h3>,
                  strong: ({ children }) => <strong className="text-purple-300 font-semibold">{children}</strong>,
                  em: ({ children }) => <em className="text-purple-200/80 italic">{children}</em>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-purple-500/50 pl-4 my-4 italic text-gray-300">
                      {children}
                    </blockquote>
                  ),
                  ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mb-4 text-gray-200">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mb-4 text-gray-200">{children}</ol>,
                  li: ({ children }) => <li className="text-gray-200">{children}</li>,
                  code: ({ className, children }) => {
                    const isInline = !className;
                    if (isInline) {
                      return <code className="bg-purple-500/10 text-purple-300 px-1.5 py-0.5 rounded text-sm">{children}</code>;
                    }
                    return (
                      <code className="block bg-endless-darker border border-purple-500/20 rounded-lg p-4 text-sm text-gray-300 overflow-x-auto">
                        {children}
                      </code>
                    );
                  },
                  hr: () => <hr className="border-purple-500/20 my-8" />,
                }}
              >
                {message.content}
              </ReactMarkdown>
            </div>
          )}

          {/* Streaming indicator */}
          {isStreaming && !isUser && (
            <div className="typing-indicator mt-2">
              <span />
              <span />
              <span />
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className={clsx('text-xs text-gray-500 mt-2', isUser && 'text-right')}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
