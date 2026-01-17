import Database from 'better-sqlite3';
import path from 'path';
import type { Chat, ChatSummary, Message, StoryBible } from '@/types';

const DB_PATH = path.join(process.cwd(), 'data', 'endless.db');

let db: Database.Database | null = null;

function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    initializeTables();
  }
  return db;
}

function initializeTables() {
  const database = db!;

  // Chats table
  database.exec(`
    CREATE TABLE IF NOT EXISTS chats (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      story_bible_id TEXT
    )
  `);

  // Messages table
  database.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      chat_id TEXT NOT NULL,
      role TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      thinking_content TEXT,
      search_results TEXT,
      FOREIGN KEY (chat_id) REFERENCES chats(id) ON DELETE CASCADE
    )
  `);

  // Story Bibles table
  database.exec(`
    CREATE TABLE IF NOT EXISTS story_bibles (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      description TEXT,
      created_at INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      characters TEXT DEFAULT '[]',
      world_building TEXT DEFAULT '[]',
      plot_points TEXT DEFAULT '[]',
      themes TEXT DEFAULT '[]',
      tone TEXT DEFAULT '',
      genre TEXT DEFAULT '',
      custom_notes TEXT DEFAULT ''
    )
  `);

  // Create indexes for better performance
  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
    CREATE INDEX IF NOT EXISTS idx_chats_updated_at ON chats(updated_at DESC);
  `);
}

// Chat operations
export function createChat(id: string, title: string): Chat {
  const database = getDb();
  const now = Date.now();

  database.prepare(`
    INSERT INTO chats (id, title, created_at, updated_at)
    VALUES (?, ?, ?, ?)
  `).run(id, title, now, now);

  return {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
}

export function getChat(id: string): Chat | null {
  const database = getDb();

  const chatRow = database.prepare(`
    SELECT * FROM chats WHERE id = ?
  `).get(id) as any;

  if (!chatRow) return null;

  const messageRows = database.prepare(`
    SELECT * FROM messages WHERE chat_id = ? ORDER BY timestamp ASC
  `).all(id) as any[];

  const messages: Message[] = messageRows.map(row => ({
    id: row.id,
    role: row.role,
    content: row.content,
    timestamp: row.timestamp,
    thinkingContent: row.thinking_content || undefined,
    searchResults: row.search_results ? JSON.parse(row.search_results) : undefined,
  }));

  return {
    id: chatRow.id,
    title: chatRow.title,
    createdAt: chatRow.created_at,
    updatedAt: chatRow.updated_at,
    messages,
    storyBibleId: chatRow.story_bible_id || undefined,
  };
}

export function getAllChats(): ChatSummary[] {
  const database = getDb();

  const rows = database.prepare(`
    SELECT
      c.id,
      c.title,
      c.created_at,
      c.updated_at,
      COUNT(m.id) as message_count,
      (SELECT content FROM messages WHERE chat_id = c.id ORDER BY timestamp DESC LIMIT 1) as last_message
    FROM chats c
    LEFT JOIN messages m ON c.id = m.chat_id
    GROUP BY c.id
    ORDER BY c.updated_at DESC
  `).all() as any[];

  return rows.map(row => ({
    id: row.id,
    title: row.title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    messageCount: row.message_count,
    preview: row.last_message ? row.last_message.substring(0, 100) : '',
  }));
}

export function updateChatTitle(id: string, title: string): void {
  const database = getDb();
  database.prepare(`
    UPDATE chats SET title = ?, updated_at = ? WHERE id = ?
  `).run(title, Date.now(), id);
}

export function deleteChat(id: string): void {
  const database = getDb();
  database.prepare(`DELETE FROM messages WHERE chat_id = ?`).run(id);
  database.prepare(`DELETE FROM chats WHERE id = ?`).run(id);
}

export function addMessage(chatId: string, message: Message): void {
  const database = getDb();

  database.prepare(`
    INSERT INTO messages (id, chat_id, role, content, timestamp, thinking_content, search_results)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(
    message.id,
    chatId,
    message.role,
    message.content,
    message.timestamp,
    message.thinkingContent || null,
    message.searchResults ? JSON.stringify(message.searchResults) : null
  );

  database.prepare(`
    UPDATE chats SET updated_at = ? WHERE id = ?
  `).run(Date.now(), chatId);
}

export function updateMessage(chatId: string, messageId: string, content: string, thinkingContent?: string): void {
  const database = getDb();

  database.prepare(`
    UPDATE messages SET content = ?, thinking_content = ? WHERE id = ? AND chat_id = ?
  `).run(content, thinkingContent || null, messageId, chatId);

  database.prepare(`
    UPDATE chats SET updated_at = ? WHERE id = ?
  `).run(Date.now(), chatId);
}

// Story Bible operations
export function createStoryBible(storyBible: StoryBible): void {
  const database = getDb();

  database.prepare(`
    INSERT INTO story_bibles (
      id, name, description, created_at, updated_at,
      characters, world_building, plot_points, themes, tone, genre, custom_notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    storyBible.id,
    storyBible.name,
    storyBible.description,
    storyBible.createdAt,
    storyBible.updatedAt,
    JSON.stringify(storyBible.characters),
    JSON.stringify(storyBible.worldBuilding),
    JSON.stringify(storyBible.plotPoints),
    JSON.stringify(storyBible.themes),
    storyBible.tone,
    storyBible.genre,
    storyBible.customNotes
  );
}

export function getStoryBible(id: string): StoryBible | null {
  const database = getDb();

  const row = database.prepare(`
    SELECT * FROM story_bibles WHERE id = ?
  `).get(id) as any;

  if (!row) return null;

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    characters: JSON.parse(row.characters),
    worldBuilding: JSON.parse(row.world_building),
    plotPoints: JSON.parse(row.plot_points),
    themes: JSON.parse(row.themes),
    tone: row.tone,
    genre: row.genre,
    customNotes: row.custom_notes,
  };
}

export function getAllStoryBibles(): StoryBible[] {
  const database = getDb();

  const rows = database.prepare(`
    SELECT * FROM story_bibles ORDER BY updated_at DESC
  `).all() as any[];

  return rows.map(row => ({
    id: row.id,
    name: row.name,
    description: row.description,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    characters: JSON.parse(row.characters),
    worldBuilding: JSON.parse(row.world_building),
    plotPoints: JSON.parse(row.plot_points),
    themes: JSON.parse(row.themes),
    tone: row.tone,
    genre: row.genre,
    customNotes: row.custom_notes,
  }));
}

export function updateStoryBible(storyBible: StoryBible): void {
  const database = getDb();

  database.prepare(`
    UPDATE story_bibles SET
      name = ?,
      description = ?,
      updated_at = ?,
      characters = ?,
      world_building = ?,
      plot_points = ?,
      themes = ?,
      tone = ?,
      genre = ?,
      custom_notes = ?
    WHERE id = ?
  `).run(
    storyBible.name,
    storyBible.description,
    Date.now(),
    JSON.stringify(storyBible.characters),
    JSON.stringify(storyBible.worldBuilding),
    JSON.stringify(storyBible.plotPoints),
    JSON.stringify(storyBible.themes),
    storyBible.tone,
    storyBible.genre,
    storyBible.customNotes,
    storyBible.id
  );
}

export function deleteStoryBible(id: string): void {
  const database = getDb();
  database.prepare(`DELETE FROM story_bibles WHERE id = ?`).run(id);
}

export function linkStoryBibleToChat(chatId: string, storyBibleId: string | null): void {
  const database = getDb();
  database.prepare(`
    UPDATE chats SET story_bible_id = ?, updated_at = ? WHERE id = ?
  `).run(storyBibleId, Date.now(), chatId);
}
