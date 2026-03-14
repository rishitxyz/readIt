export const fetchPosts = async (subreddit: string, type: 'hot' | 'new' | 'top' = 'hot') => {
  const response = await fetch(`https://www.reddit.com/r/${subreddit}/${type}.json`)
  const json = await response.json()

  // Reddit's JSON wraps data inside kind="Listing" and data.children
  const posts = json.data.children.map((child: any) => ({
    id: child.data.id,
    title: child.data.title,
    author: child.data.author,
    description: child.data.selftext, // The post body
    url: child.data.url,
    permalink: child.data.permalink, // We need this to get comments later!
  }))

  return posts
}

// Example permalink: /r/androidapps/comments/1abcde/some_post_title/
export const fetchComments = async (permalink: string) => {
  const response = await fetch(`https://www.reddit.com${permalink}.json`)
  const json = await response.json()

  // Reddit returns an array of TWO listings for a post:
  // json[0] is the original post data
  // json[1] is the comments tree

  const commentsData = json[1].data.children

  const comments = commentsData.map((child: any) => ({
    id: child.data.id,
    author: child.data.author,
    body: child.data.body, // The actual comment text
    score: child.data.score, // Upvotes
  }))

  return comments
}
