import { NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import {
  getAllStoryBibles,
  getStoryBible,
  createStoryBible,
  updateStoryBible,
  deleteStoryBible,
} from '@/lib/database';
import type { StoryBible } from '@/types';

export const runtime = 'nodejs';

// Get all story bibles
export async function GET() {
  try {
    const storyBibles = getAllStoryBibles();
    return Response.json({ storyBibles });
  } catch (error) {
    console.error('Error fetching story bibles:', error);
    return Response.json({ error: 'Failed to fetch story bibles' }, { status: 500 });
  }
}

// Create a new story bible
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const now = Date.now();

    const storyBible: StoryBible = {
      id: uuidv4(),
      name: body.name || 'Untitled Story Bible',
      description: body.description || '',
      createdAt: now,
      updatedAt: now,
      characters: body.characters || [],
      worldBuilding: body.worldBuilding || [],
      plotPoints: body.plotPoints || [],
      themes: body.themes || [],
      tone: body.tone || '',
      genre: body.genre || '',
      customNotes: body.customNotes || '',
    };

    createStoryBible(storyBible);
    return Response.json({ storyBible });
  } catch (error) {
    console.error('Error creating story bible:', error);
    return Response.json({ error: 'Failed to create story bible' }, { status: 500 });
  }
}

// Update a story bible
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.id) {
      return Response.json({ error: 'Story Bible ID required' }, { status: 400 });
    }

    const existing = getStoryBible(body.id);
    if (!existing) {
      return Response.json({ error: 'Story Bible not found' }, { status: 404 });
    }

    const storyBible: StoryBible = {
      ...existing,
      ...body,
      updatedAt: Date.now(),
    };

    updateStoryBible(storyBible);
    return Response.json({ storyBible });
  } catch (error) {
    console.error('Error updating story bible:', error);
    return Response.json({ error: 'Failed to update story bible' }, { status: 500 });
  }
}

// Delete a story bible
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return Response.json({ error: 'Story Bible ID required' }, { status: 400 });
    }

    deleteStoryBible(id);
    return Response.json({ success: true });
  } catch (error) {
    console.error('Error deleting story bible:', error);
    return Response.json({ error: 'Failed to delete story bible' }, { status: 500 });
  }
}
