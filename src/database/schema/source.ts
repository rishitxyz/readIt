import { relations } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'
import { FeedType } from '../../config/feed-source'
import { ArticleTable } from './article'

export const SourceTable = sqliteTable('source', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull().unique(),
  type: text('type', { enum: [FeedType.RSS, FeedType.SUB_REDDIT] }).notNull(),
  showOnFeed: integer('showOnFeed', { mode: 'boolean' }).default(true).notNull(),
  // createdAt: text('createdAt').notNull(),
})

export type Source = typeof SourceTable.$inferSelect
export type CreateSource = typeof SourceTable.$inferInsert

export interface SourceValidationError {
  isValid: false
  error: string
}

export interface ValidSource {
  isValid: true
  type: FeedType
  finalUrl: string
}

export const sourceRelations = relations(SourceTable, ({ many }) => ({
  articles: many(ArticleTable),
}))
