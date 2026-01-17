import { NextRequest } from 'next/server';
import { getChat } from '@/lib/database';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const chat = getChat(id);

    if (!chat) {
      return Response.json({ error: 'Chat not found' }, { status: 404 });
    }

    return Response.json({ chat });
  } catch (error) {
    console.error('Error fetching chat:', error);
    return Response.json({ error: 'Failed to fetch chat' }, { status: 500 });
  }
}
