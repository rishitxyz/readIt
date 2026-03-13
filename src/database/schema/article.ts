import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const ArticleTable = sqliteTable('article', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  author: text('author').notNull().default('Unknown'),
  summary: text('summary'),
  description: text('description').notNull(),
  link: text('link'),
  imageUrl: text('imageUrl'),
  publishedAt: text('publishedAt').notNull(),
  isRead: integer('isRead', { mode: 'boolean' }).default(false).notNull(),
  isFavourite: integer('isFavourite', { mode: 'boolean' }).default(false).notNull(),
})

export type Article = typeof ArticleTable.$inferSelect
export type CreateArticle = typeof ArticleTable.$inferInsert
