// Endless - Type Definitions

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  thinkingContent?: string; // Extended thinking content
  searchResults?: SearchResult[]; // Web search results if used
}

export interface Chat {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messages: Message[];
  storyBibleId?: string; // Reference to story bible for context
}

export interface ChatSummary {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount: number;
  preview: string;
}

export interface StoryBible {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  characters: Character[];
  worldBuilding: WorldElement[];
  plotPoints: PlotPoint[];
  themes: string[];
  tone: string;
  genre: string;
  customNotes: string;
}

export interface Character {
  id: string;
  name: string;
  aliases: string[];
  description: string;
  personality: string;
  backstory: string;
  relationships: CharacterRelationship[];
  traits: string[];
  speechPatterns: string;
  goals: string;
  arc: string;
  imageUrl?: string;
}

export interface CharacterRelationship {
  characterId: string;
  characterName: string;
  relationshipType: string;
  description: string;
}

export interface WorldElement {
  id: string;
  name: string;
  type: 'location' | 'organization' | 'item' | 'concept' | 'event' | 'other';
  description: string;
  significance: string;
  relatedElements: string[];
}

export interface PlotPoint {
  id: string;
  title: string;
  description: string;
  chapter?: string;
  status: 'planned' | 'in_progress' | 'completed';
  order: number;
}

export interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

// Available Claude models
export type ClaudeModelId =
  | 'claude-opus-4-5-20250127'
  | 'claude-sonnet-5-20250601'
  | 'claude-opus-5-20250801';

export interface ClaudeModel {
  id: ClaudeModelId;
  name: string;
  description: string;
  supportsThinking: boolean;
}

export const CLAUDE_MODELS: ClaudeModel[] = [
  {
    id: 'claude-opus-4-5-20250127',
    name: 'Claude Opus 4.5',
    description: 'Advanced model with extended thinking',
    supportsThinking: true,
  },
  {
    id: 'claude-sonnet-5-20250601',
    name: 'Claude Sonnet 5',
    description: 'Fast and intelligent, great for most tasks',
    supportsThinking: true,
  },
  {
    id: 'claude-opus-5-20250801',
    name: 'Claude Opus 5',
    description: 'Most powerful model for complex storytelling',
    supportsThinking: true,
  },
];

export interface GenerationSettings {
  thinkLonger: boolean;
  webSearch: boolean;
  storyBibleId?: string;
  maxTokens?: number;
  model?: ClaudeModelId;
}

export interface StreamChunk {
  type: 'text' | 'thinking' | 'done' | 'error';
  content: string;
}
