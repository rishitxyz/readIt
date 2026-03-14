import { eq, or } from 'drizzle-orm'
import { db } from '../../database/schema'
import { CreateSource, Source, SourceTable } from '../../database/schema/source'

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
