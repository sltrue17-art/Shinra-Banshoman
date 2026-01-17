'use client';

import { useState } from 'react';
import { clsx } from 'clsx';
import {
  MessageSquare,
  Plus,
  Trash2,
  Book,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import type { ChatSummary } from '@/types';

interface SidebarProps {
  chats: ChatSummary[];
  currentChatId: string | null;
  onSelectChat: (id: string) => void;
  onNewChat: () => void;
  onDeleteChat: (id: string) => void;
  onOpenStoryBibles: () => void;
}

export default function Sidebar({
  chats,
  currentChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  onOpenStoryBibles,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={clsx(
        'h-screen bg-endless-darker/90 backdrop-blur-md border-r border-purple-500/20',
        'flex flex-col sidebar-transition',
        isCollapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-purple-500/20 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-200 bg-clip-text text-transparent">
              Endless
            </h1>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 rounded-lg hover:bg-purple-500/10 transition-colors"
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-purple-400" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-purple-400" />
          )}
        </button>
      </div>

      {/* Actions */}
      <div className="p-3 space-y-2">
        <button
          onClick={onNewChat}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'bg-gradient-to-r from-purple-600/20 to-purple-500/10',
            'border border-purple-500/30 hover:border-purple-500/50',
            'transition-all duration-300 group'
          )}
        >
          <Plus className="w-5 h-5 text-purple-400 group-hover:text-purple-300" />
          {!isCollapsed && (
            <span className="text-purple-200 text-sm">New Story</span>
          )}
        </button>

        <button
          onClick={onOpenStoryBibles}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
            'hover:bg-purple-500/10 border border-transparent',
            'hover:border-purple-500/20 transition-all duration-300 group'
          )}
        >
          <Book className="w-5 h-5 text-purple-400/70 group-hover:text-purple-400" />
          {!isCollapsed && (
            <span className="text-gray-400 group-hover:text-gray-300 text-sm">
              Story Bibles
            </span>
          )}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {!isCollapsed && chats.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-8">
            No stories yet. Start a new one!
          </p>
        )}

        {chats.map((chat) => (
          <div
            key={chat.id}
            className={clsx(
              'group relative rounded-lg transition-all duration-200',
              currentChatId === chat.id
                ? 'bg-purple-500/20 border border-purple-500/40'
                : 'hover:bg-purple-500/10 border border-transparent hover:border-purple-500/20'
            )}
            onMouseEnter={() => setHoveredChat(chat.id)}
            onMouseLeave={() => setHoveredChat(null)}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className="w-full text-left p-3 flex items-start gap-3"
            >
              <MessageSquare
                className={clsx(
                  'w-4 h-4 mt-1 flex-shrink-0',
                  currentChatId === chat.id ? 'text-purple-400' : 'text-gray-500'
                )}
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p
                    className={clsx(
                      'text-sm font-medium truncate',
                      currentChatId === chat.id ? 'text-purple-200' : 'text-gray-300'
                    )}
                  >
                    {chat.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(chat.updatedAt)} · {chat.messageCount} msgs
                  </p>
                </div>
              )}
            </button>

            {/* Delete button */}
            {!isCollapsed && hoveredChat === chat.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded
                           hover:bg-red-500/20 text-gray-500 hover:text-red-400
                           transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      {!isCollapsed && (
        <div className="p-4 border-t border-purple-500/20">
          <p className="text-xs text-gray-500 text-center">
            Powered by Claude Opus 4.5
          </p>
        </div>
      )}
    </div>
  );
}
