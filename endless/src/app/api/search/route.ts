import { NextRequest } from 'next/server';
import { performWebSearch } from '@/lib/search';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query } = body;

    if (!query) {
      return Response.json({ error: 'Search query required' }, { status: 400 });
    }

    const results = await performWebSearch(query);
    return Response.json({ results });
  } catch (error) {
    console.error('Search API error:', error);
    return Response.json({ error: 'Failed to perform search' }, { status: 500 });
  }
}
