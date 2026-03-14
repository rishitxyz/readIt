import { eq } from 'drizzle-orm'
import { db } from '../../database/schema'
import { ArticleTable } from '../../database/schema/article'

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
