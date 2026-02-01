'use client';

import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatArea from '@/components/ChatArea';
import MessageInput from '@/components/MessageInput';
import StoryBiblesList from '@/components/StoryBiblesList';
import StoryBibleEditor from '@/components/StoryBibleEditor';
import type { Chat, ChatSummary, Message, StoryBible, GenerationSettings, ClaudeModelId } from '@/types';
import { CLAUDE_MODELS } from '@/types';

export default function Home() {
  // State
  const [chats, setChats] = useState<ChatSummary[]>([]);
  const [currentChat, setCurrentChat] = useState<Chat | null>(null);
  const [storyBibles, setStoryBibles] = useState<StoryBible[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingThinking, setStreamingThinking] = useState('');
  const [selectedModel, setSelectedModel] = useState<ClaudeModelId>('claude-opus-4-5-20250127');

  // Modals
  const [showStoryBibles, setShowStoryBibles] = useState(false);
  const [editingStoryBible, setEditingStoryBible] = useState<StoryBible | null | 'new'>(null);

  // Fetch initial data
  useEffect(() => {
    fetchChats();
    fetchStoryBibles();
  }, []);

  const fetchChats = async () => {
    try {
      const res = await fetch('/api/chats');
      const data = await res.json();
      setChats(data.chats || []);
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    }
  };

  const fetchStoryBibles = async () => {
    try {
      const res = await fetch('/api/story-bible');
      const data = await res.json();
      setStoryBibles(data.storyBibles || []);
    } catch (error) {
      console.error('Failed to fetch story bibles:', error);
    }
  };

  const loadChat = async (id: string) => {
    try {
      const res = await fetch(`/api/chats/${id}`);
      const data = await res.json();
      if (data.chat) {
        setCurrentChat(data.chat);
      }
    } catch (error) {
      console.error('Failed to load chat:', error);
    }
  };

  const handleNewChat = () => {
    setCurrentChat(null);
    setStreamingContent('');
    setStreamingThinking('');
  };

  const handleSelectChat = (id: string) => {
    loadChat(id);
    setStreamingContent('');
    setStreamingThinking('');
  };

  const handleDeleteChat = async (id: string) => {
    if (!confirm('Delete this conversation?')) return;

    try {
      await fetch(`/api/chats?id=${id}`, { method: 'DELETE' });
      setChats(chats.filter((c) => c.id !== id));
      if (currentChat?.id === id) {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleSendMessage = useCallback(async (message: string, settings: GenerationSettings) => {
    setIsLoading(true);
    setStreamingContent('');
    setStreamingThinking('');

    // Add user message to UI immediately
    const tempUserMessage: Message = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    if (currentChat) {
      setCurrentChat({
        ...currentChat,
        messages: [...currentChat.messages, tempUserMessage],
      });
    }

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: currentChat?.id,
          message,
          settings,
        }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let newChatId: string | null = null;
      let newTitle: string | null = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));

              if (data.type === 'text') {
                setStreamingContent((prev) => prev + data.content);
              } else if (data.type === 'thinking') {
                setStreamingThinking((prev) => prev + data.content);
              } else if (data.type === 'title') {
                newTitle = data.content;
              } else if (data.type === 'done') {
                newChatId = data.chatId;
              } else if (data.type === 'error') {
                console.error('Stream error:', data.content);
              }
            } catch {
              // Ignore parse errors for incomplete chunks
            }
          }
        }
      }

      // Refresh data after completion
      if (newChatId) {
        await loadChat(newChatId);
        await fetchChats();
      }

    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
      setStreamingContent('');
      setStreamingThinking('');
    }
  }, [currentChat]);

  // Story Bible handlers
  const handleSaveStoryBible = async (storyBible: StoryBible) => {
    try {
      const isNew = editingStoryBible === 'new';
      const res = await fetch('/api/story-bible', {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyBible),
      });

      if (res.ok) {
        await fetchStoryBibles();
        setEditingStoryBible(null);
      }
    } catch (error) {
      console.error('Failed to save story bible:', error);
    }
  };

  const handleDeleteStoryBible = async (id: string) => {
    if (!confirm('Delete this Story Bible?')) return;

    try {
      await fetch(`/api/story-bible?id=${id}`, { method: 'DELETE' });
      await fetchStoryBibles();
    } catch (error) {
      console.error('Failed to delete story bible:', error);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        chats={chats}
        currentChatId={currentChat?.id || null}
        onSelectChat={handleSelectChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        onOpenStoryBibles={() => setShowStoryBibles(true)}
        selectedModel={selectedModel}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <ChatArea
          messages={currentChat?.messages || []}
          isStreaming={isLoading}
          streamingContent={streamingContent}
          streamingThinking={streamingThinking}
          selectedModel={selectedModel}
        />

        <MessageInput
          onSend={handleSendMessage}
          isLoading={isLoading}
          storyBibles={storyBibles}
          currentStoryBibleId={currentChat?.storyBibleId}
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>

      {/* Story Bibles Modal */}
      {showStoryBibles && (
        <StoryBiblesList
          storyBibles={storyBibles}
          onClose={() => setShowStoryBibles(false)}
          onNew={() => {
            setShowStoryBibles(false);
            setEditingStoryBible('new');
          }}
          onEdit={(id) => {
            const sb = storyBibles.find((s) => s.id === id);
            if (sb) {
              setShowStoryBibles(false);
              setEditingStoryBible(sb);
            }
          }}
          onDelete={handleDeleteStoryBible}
        />
      )}

      {/* Story Bible Editor */}
      {editingStoryBible && (
        <StoryBibleEditor
          storyBible={editingStoryBible === 'new' ? null : editingStoryBible}
          onSave={handleSaveStoryBible}
          onClose={() => setEditingStoryBible(null)}
        />
      )}
    </div>
  );
}
