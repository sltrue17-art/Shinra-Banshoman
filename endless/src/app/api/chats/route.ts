import { NextRequest } from 'next/server';
import { getAllChats, getChat, deleteChat, updateChatTitle, linkStoryBibleToChat } from '@/lib/database';

export const runtime = 'nodejs';

// Get all chats
export async function GET() {
  try {
    const chats = getAllChats();
    return Response.json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    return Response.json({ error: 'Failed to fetch chats' }, { status: 500 });
  }
}

// Update or delete a chat
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, storyBibleId } = body;

    if (!id) {
      return Response.json({ error: 'Chat ID required' }, { status: 400 });
    }

    if (title !== undefined) {
      updateChatTitle(id, title);
    }

    if (storyBibleId !== undefined) {
      linkStoryBibleToChat(id, storyBibleId);
    }

    const chat = getChat(id);
    return Response.json({ chat });
  } catch (error) {
    console.error('Error updating chat:', error);
    return Response.json({ error: 'Failed to update chat' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Chat ID required' }, { status: 400 });
    }

    deleteChat(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error);
    return Response.json({ error: 'Failed to delete chat' }, { status: 500 });
  }
}
