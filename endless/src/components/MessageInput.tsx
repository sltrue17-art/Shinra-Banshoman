'use client';

import { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import {
  Send,
  Sparkles,
  Globe,
  Brain,
  Book,
  X,
  ChevronDown,
} from 'lucide-react';
import type { StoryBible, GenerationSettings } from '@/types';

interface MessageInputProps {
  onSend: (message: string, settings: GenerationSettings) => void;
  isLoading: boolean;
  storyBibles: StoryBible[];
  currentStoryBibleId?: string;
}

export default function MessageInput({
  onSend,
  isLoading,
  storyBibles,
  currentStoryBibleId,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [thinkLonger, setThinkLonger] = useState(false);
  const [webSearch, setWebSearch] = useState(false);
  const [storyBibleId, setStoryBibleId] = useState<string | undefined>(currentStoryBibleId);
  const [showStoryBiblePicker, setShowStoryBiblePicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setStoryBibleId(currentStoryBibleId);
  }, [currentStoryBibleId]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`;
    }
  };

  const handleSubmit = () => {
    if (!message.trim() || isLoading) return;

    onSend(message.trim(), {
      thinkLonger,
      webSearch,
      storyBibleId,
    });

    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const selectedStoryBible = storyBibles.find((sb) => sb.id === storyBibleId);

  return (
    <div className="p-4 border-t border-purple-500/20 bg-endless-darker/50 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        {/* Options Bar */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {/* Think Longer Toggle */}
          <button
            onClick={() => setThinkLonger(!thinkLonger)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all',
              thinkLonger
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-endless-dark text-gray-400 border border-purple-500/20 hover:border-purple-500/40'
            )}
          >
            <Brain className="w-4 h-4" />
            <span>Think Longer</span>
          </button>

          {/* Web Search Toggle */}
          <button
            onClick={() => setWebSearch(!webSearch)}
            className={clsx(
              'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all',
              webSearch
                ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                : 'bg-endless-dark text-gray-400 border border-purple-500/20 hover:border-purple-500/40'
            )}
          >
            <Globe className="w-4 h-4" />
            <span>Web Search</span>
          </button>

          {/* Story Bible Picker */}
          <div className="relative">
            <button
              onClick={() => setShowStoryBiblePicker(!showStoryBiblePicker)}
              className={clsx(
                'flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-all',
                storyBibleId
                  ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                  : 'bg-endless-dark text-gray-400 border border-purple-500/20 hover:border-purple-500/40'
              )}
            >
              <Book className="w-4 h-4" />
              <span>{selectedStoryBible?.name || 'Story Bible'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            {showStoryBiblePicker && (
              <div className="absolute bottom-full left-0 mb-2 w-64 bg-endless-dark border border-purple-500/30 rounded-lg shadow-lg overflow-hidden z-50">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setStoryBibleId(undefined);
                      setShowStoryBiblePicker(false);
                    }}
                    className={clsx(
                      'w-full text-left px-3 py-2 rounded text-sm transition-colors',
                      !storyBibleId
                        ? 'bg-purple-500/20 text-purple-300'
                        : 'text-gray-400 hover:bg-purple-500/10'
                    )}
                  >
                    None
                  </button>
                  {storyBibles.map((sb) => (
                    <button
                      key={sb.id}
                      onClick={() => {
                        setStoryBibleId(sb.id);
                        setShowStoryBiblePicker(false);
                      }}
                      className={clsx(
                        'w-full text-left px-3 py-2 rounded text-sm transition-colors',
                        storyBibleId === sb.id
                          ? 'bg-purple-500/20 text-purple-300'
                          : 'text-gray-400 hover:bg-purple-500/10'
                      )}
                    >
                      {sb.name}
                    </button>
                  ))}
                </div>
                {storyBibles.length === 0 && (
                  <p className="p-3 text-gray-500 text-sm text-center">
                    No story bibles yet
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Clear selections */}
          {(thinkLonger || webSearch || storyBibleId) && (
            <button
              onClick={() => {
                setThinkLonger(false);
                setWebSearch(false);
                setStoryBibleId(undefined);
              }}
              className="flex items-center gap-1 px-2 py-1.5 text-gray-500 hover:text-gray-400 transition-colors"
            >
              <X className="w-3 h-3" />
              <span className="text-xs">Clear</span>
            </button>
          )}
        </div>

        {/* Input Area */}
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder="Describe your story, ask for a chapter, or discuss ideas..."
              className={clsx(
                'w-full input-dream resize-none min-h-[52px] pr-12',
                'focus:shadow-glow'
              )}
              rows={1}
              disabled={isLoading}
            />

            {/* Character count for long messages */}
            {message.length > 500 && (
              <span className="absolute bottom-2 right-14 text-xs text-gray-500">
                {message.length.toLocaleString()}
              </span>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={handleSubmit}
            disabled={!message.trim() || isLoading}
            className={clsx(
              'flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center',
              'transition-all duration-300',
              message.trim() && !isLoading
                ? 'bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-glow hover:shadow-glow-lg hover:scale-105'
                : 'bg-endless-dark text-gray-600 cursor-not-allowed'
            )}
          >
            {isLoading ? (
              <Sparkles className="w-5 h-5 animate-pulse" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Tips */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          Press <kbd className="px-1.5 py-0.5 bg-endless-dark rounded text-gray-400">Enter</kbd> to send,{' '}
          <kbd className="px-1.5 py-0.5 bg-endless-dark rounded text-gray-400">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}
