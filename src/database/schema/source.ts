import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const SourceTable = sqliteTable('source', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  url: text('url').notNull().unique(),
  showOnFeed: integer('showOnFeed', { mode: 'boolean' }).default(true).notNull(),
})

export type Source = typeof SourceTable.$inferSelect
export type CreateSource = typeof SourceTable.$inferInsert
