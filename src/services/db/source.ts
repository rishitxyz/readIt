import { eq, or, desc } from 'drizzle-orm'
import { db, SourceWithArticles } from '../../database/schema'
import { CreateSource, Source, SourceTable } from '../../database/schema/source'
import { ArticleTable } from '../../database/schema/article'

export const readById = (id: string): Source | null => {
  return db.select().from(SourceTable).where(eq(SourceTable.id, id)).get() ?? null
}

export const checkIfExists = (name: string, url: string): boolean => {
  return !!db
    .select()
    .from(SourceTable)
    .where(or(eq(SourceTable.name, name.toLowerCase()), eq(SourceTable.url, url)))
    .limit(1)
    .get()
}

export const insertNew = (createSource: CreateSource): undefined => {
  db.insert(SourceTable).values(createSource).run()
}

export const deleteById = (id: string): undefined => {
  db.delete(SourceTable).where(eq(SourceTable.id, id)).run()
}

export const getSourcesWithLatestArticles = async (
  limit: number = 3,
): Promise<SourceWithArticles[]> => {
  return await db.query.SourceTable.findMany({
    with: {
      articles: {
        orderBy: [desc(ArticleTable.publishedAt)],
        limit,
      },
    },
  })
}
