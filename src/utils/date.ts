export const getRelativeTime = (dateString: string): string => {
  // Parse the string into a valid Date object
  const date = new Date(dateString)

  // Guard against invalid date strings
  if (isNaN(date.getTime())) {
    return 'Unknown'
  }

  const now = Date.now()
  const diffInMs = now - date.getTime()

  // If the date is somehow in the future, fallback gracefully
  if (diffInMs < 0) {
    return 'Just now'
  }

  // Calculate time units
  const diffInMins = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24))

  // Using approximations for months and years which is standard for UI relative time
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  // Apply the formatting rules
  if (diffInMins < 60) {
    return diffInMins === 0 ? 'Just now' : `${diffInMins} min${diffInMins === 1 ? '' : 's'} ago`
  }

  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`
  }

  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`
  }

  if (diffInDays < 365) {
    return `${diffInMonths} month${diffInMonths === 1 ? '' : 's'} ago`
  }

  return `${diffInYears} year${diffInYears === 1 ? '' : 's'} ago`
}
