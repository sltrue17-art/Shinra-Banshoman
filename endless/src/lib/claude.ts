import Anthropic from '@anthropic-ai/sdk';
import type { Message, StoryBible, SearchResult } from '@/types';
import { buildFullSystemPrompt } from './storytelling-prompts';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Claude Opus 4.5 model ID
const MODEL_ID = 'claude-opus-4-5-20250127';

interface GenerateOptions {
  messages: Message[];
  storyBible?: StoryBible | null;
  searchContext?: string;
  thinkLonger?: boolean;
  onTextChunk?: (text: string) => void;
  onThinkingChunk?: (text: string) => void;
  signal?: AbortSignal;
}

interface GenerateResult {
  content: string;
  thinkingContent?: string;
}

export async function generateStoryResponse(options: GenerateOptions): Promise<GenerateResult> {
  const {
    messages,
    storyBible,
    searchContext,
    thinkLonger = false,
    onTextChunk,
    onThinkingChunk,
    signal,
  } = options;

  const systemPrompt = buildFullSystemPrompt(storyBible, searchContext);

  // Convert our message format to Anthropic format
  const anthropicMessages = messages.map(msg => ({
    role: msg.role as 'user' | 'assistant',
    content: msg.content,
  }));

  // Build request parameters
  const requestParams: Anthropic.MessageCreateParams = {
    model: MODEL_ID,
    max_tokens: 64000, // Maximum for long-form generation
    system: systemPrompt,
    messages: anthropicMessages,
  };

  // Add extended thinking if enabled
  if (thinkLonger) {
    requestParams.thinking = {
      type: 'enabled',
      budget_tokens: 32000, // Allow substantial thinking for complex storytelling
    };
  }

  let fullContent = '';
  let fullThinking = '';

  // Use streaming for real-time feedback
  const stream = anthropic.messages.stream(requestParams);

  // Set up abort handler
  if (signal) {
    signal.addEventListener('abort', () => {
      stream.abort();
    });
  }

  // Process the stream
  for await (const event of stream) {
    if (event.type === 'content_block_delta') {
      const delta = event.delta;

      if ('text' in delta && delta.text) {
        fullContent += delta.text;
        onTextChunk?.(delta.text);
      }

      if ('thinking' in delta && delta.thinking) {
        fullThinking += delta.thinking;
        onThinkingChunk?.(delta.thinking);
      }
    }
  }

  return {
    content: fullContent,
    thinkingContent: fullThinking || undefined,
  };
}

// Simple non-streaming version for quick operations
export async function generateQuickResponse(
  prompt: string,
  context?: string
): Promise<string> {
  const systemPrompt = context
    ? `You are Endless, an advanced storytelling AI. ${context}`
    : 'You are Endless, an advanced storytelling AI. Respond helpfully and concisely.';

  const response = await anthropic.messages.create({
    model: MODEL_ID,
    max_tokens: 1024,
    system: systemPrompt,
    messages: [{ role: 'user', content: prompt }],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  return textBlock ? textBlock.text : '';
}

// Generate a title for a new chat based on initial message
export async function generateChatTitle(firstMessage: string): Promise<string> {
  const prompt = `Based on this message, generate a short, evocative title (3-6 words) for this creative writing conversation. Just respond with the title, nothing else.

Message: "${firstMessage.substring(0, 500)}"`;

  try {
    const title = await generateQuickResponse(prompt);
    return title.replace(/['"]/g, '').trim().substring(0, 50) || 'New Story';
  } catch {
    return 'New Story';
  }
}
