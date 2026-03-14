import { eq } from 'drizzle-orm'
import { db } from '../../database/schema'
import { Article, ArticleTable, CreateArticle } from '../../database/schema/article'

export const markArticleAsRead = (id: string) => {
  db.update(ArticleTable)
    .set({
      isRead: true,
    })
    .where(eq(ArticleTable.id, id))
    .run()
}

export const toggleFavourite = (id: string, isFavourite: boolean) => {
  db.update(ArticleTable)
    .set({
      isFavourite,
    })
    .where(eq(ArticleTable.id, id))
    .run()
}

export const save = (createArticles: CreateArticle[]) => {
  db.insert(ArticleTable)
    .values(createArticles)
    .onConflictDoNothing({ target: ArticleTable.id })
    .run()
}
