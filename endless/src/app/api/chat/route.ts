import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { generateStoryResponse, generateChatTitle } from '@/lib/claude';
import { performWebSearch, formatSearchResultsForContext } from '@/lib/search';
import { createChat, getChat, addMessage, getStoryBible, updateChatTitle } from '@/lib/database';
import type { Message, GenerationSettings } from '@/types';

export const runtime = 'nodejs';
export const maxDuration = 300; // 5 minutes for long generations

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      chatId,
      message,
      settings = { thinkLonger: false, webSearch: false },
    }: {
      chatId?: string;
      message: string;
      settings: GenerationSettings;
    } = body;

    // Get or create chat
    let chat = chatId ? getChat(chatId) : null;
    const isNewChat = !chat;

    if (!chat) {
      const newChatId = uuidv4();
      chat = createChat(newChatId, 'New Story');
    }

    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: message,
      timestamp: Date.now(),
    };

    addMessage(chat.id, userMessage);
    chat.messages.push(userMessage);

    // Perform web search if enabled
    let searchContext: string | undefined;
    let searchResults: Message['searchResults'];

    if (settings.webSearch) {
      const results = await performWebSearch(message);
      if (results.length > 0) {
        searchContext = formatSearchResultsForContext(results);
        searchResults = results;
      }
    }

    // Get story bible if linked
    const storyBible = settings.storyBibleId
      ? getStoryBible(settings.storyBibleId)
      : chat.storyBibleId
        ? getStoryBible(chat.storyBibleId)
        : null;

    // Create a placeholder for the assistant message
    const assistantMessageId = uuidv4();

    // Set up streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        let fullContent = '';
        let fullThinking = '';

        try {
          const result = await generateStoryResponse({
            messages: chat!.messages,
            storyBible,
            searchContext,
            thinkLonger: settings.thinkLonger,
            model: settings.model,
            onTextChunk: (text) => {
              fullContent += text;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'text', content: text })}\n\n`
                )
              );
            },
            onThinkingChunk: (text) => {
              fullThinking += text;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ type: 'thinking', content: text })}\n\n`
                )
              );
            },
          });

          // Save the complete assistant message
          const assistantMessage: Message = {
            id: assistantMessageId,
            role: 'assistant',
            content: result.content,
            timestamp: Date.now(),
            thinkingContent: result.thinkingContent,
            searchResults,
          };

          addMessage(chat!.id, assistantMessage);

          // Generate title for new chats
          if (isNewChat && message.length > 10) {
            const title = await generateChatTitle(message, settings.model);
            updateChatTitle(chat!.id, title);
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ type: 'title', content: title })}\n\n`
              )
            );
          }

          // Send completion
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: 'done',
                chatId: chat!.id,
                messageId: assistantMessageId,
              })}\n\n`
            )
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ type: 'error', content: errorMessage })}\n\n`
            )
          );
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
