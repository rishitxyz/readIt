// src/database/schema/index.ts
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
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    showOnFeed: INTEGER DEFAULT 1 NOT NULL
    );
    CREATE TABLE IF NOT EXISTS article (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      author TEXT,
      summary TEXT,
      description TEXT NOT NULL,
      sourceId INTEGER REFERENCES source(id),
      link TEXT NOT NULL,
      published TEXT NOT NULL,
      imageUrl TEXT,
      isRead INTEGER DEFAULT 0 NOT NULL,
      isFavorite INTEGER DEFAULT 0 NOT NULL
    );
  `)
}

export interface SourceWithArticles {
  source: sourceSchema.Source
  articles: articleSchema.Article[]
}

export type ArticleWithSource = articleSchema.Article & { source: sourceSchema.Source }
