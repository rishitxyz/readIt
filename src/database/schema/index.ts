import { openDatabaseSync } from 'expo-sqlite'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import * as articleSchema from './article'
import * as sourceSchema from './source'

export const schema = {
  ...articleSchema,
  ...sourceSchema,
}

const expoDb = openDatabaseSync('rss_reader.db')
export const db = drizzle(expoDb, { schema })

export function initializeDatabase() {
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS source (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE, -- Added UNIQUE
      url TEXT NOT NULL UNIQUE,  -- Added UNIQUE
      type TEXT CHECK(type IN ('rss', 'subreddit')) NOT NULL,
      showOnFeed INTEGER DEFAULT 1 NOT NULL
    );

    CREATE TABLE IF NOT EXISTS article (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT DEFAULT 'Unknown' NOT NULL, -- Added DEFAULT and NOT NULL
      summary TEXT,
      description TEXT NOT NULL,
      sourceId TEXT NOT NULL REFERENCES source(id) ON DELETE CASCADE, -- Matched to Drizzle
      link TEXT, -- Removed NOT NULL
      imageUrl TEXT,
      publishedAt TEXT NOT NULL, -- Changed from 'published'
      isRead INTEGER DEFAULT 0 NOT NULL,
      isFavourite INTEGER DEFAULT 0 NOT NULL -- Changed from 'isFavorite'
    );
  `)
}

export interface SourceWithArticles {
  source: sourceSchema.Source
  articles: articleSchema.Article[]
}

export type ArticleWithSource = articleSchema.Article & { source: sourceSchema.Source }
