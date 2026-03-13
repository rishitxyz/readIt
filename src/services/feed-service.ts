import { ITEMS_PER_FEED } from '../config/feed-source'
import { SourceWithArticles } from '../database/schema'
import { Article } from '../database/schema/article'
import { Source } from '../database/schema/source'
import { parseXMLFeed } from '../parser/rss-parser'

export const fetchRSSFeed = async (source: Source): Promise<Article[]> => {
  const response = await fetch(source.url)
  const xmlString = await response.text()
  return parseXMLFeed(xmlString, source.name)
}

export const fetchAll = async (sources: Source[]): Promise<SourceWithArticles[]> => {
  const results = await Promise.allSettled(sources.map((source) => fetchRSSFeed(source)))

  const sourceWithArticles: SourceWithArticles[] = results.flatMap((result, index) => {
    const source = sources[index]

    if (result.status === 'fulfilled') {
      const articles = [...result.value].sort(
        (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
      )
      return [{ source: source, articles: articles.slice(0, ITEMS_PER_FEED) }]
    }

    console.log(`Failed to load RSS feeds from ${source.name}, reason: ${String(result.reason)}`)
    return []
  })

  // Sort groups by most recent item publishedAt (then by source name for stability)
  return [...sourceWithArticles].sort((a, b) => {
    const aTs = a.articles[0]?.publishedAt
    const bTs = b.articles[0]?.publishedAt
    const diff = new Date(bTs ?? 0).getTime() - new Date(aTs ?? 0).getTime()
    return diff !== 0 ? diff : a.source.name.localeCompare(b.source.name)
  })
}
