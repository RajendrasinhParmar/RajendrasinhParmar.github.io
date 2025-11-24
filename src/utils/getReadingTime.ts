/**
 * Calculate reading time from markdown content
 * @param content - The markdown content string
 * @param wordsPerMinute - Average reading speed (default: 200 words per minute)
 * @returns Reading time in minutes
 */
export function getReadingTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  // Remove markdown syntax, HTML tags, and code blocks
  const text = content
    // Remove code blocks (```...```)
    .replace(/```[\s\S]*?```/g, "")
    // Remove inline code (`...`)
    .replace(/`[^`]*`/g, "")
    // Remove HTML tags
    .replace(/<[^>]*>/g, "")
    // Remove markdown links [text](url)
    .replace(/\[([^\]]*)\]\([^\)]*\)/g, "$1")
    // Remove markdown images ![alt](url)
    .replace(/!\[([^\]]*)\]\([^\)]*\)/g, "")
    // Remove markdown headers (# ## ###)
    .replace(/#{1,6}\s+/g, "")
    // Remove markdown bold/italic
    .replace(/\*\*([^\*]*)\*\*/g, "$1")
    .replace(/\*([^\*]*)\*/g, "$1")
    .replace(/__([^_]*)__/g, "$1")
    .replace(/_([^_]*)_/g, "$1")
    // Remove markdown lists (- * +)
    .replace(/^[\s]*[-*+]\s+/gm, "")
    // Remove markdown blockquotes (>)
    .replace(/^>\s+/gm, "")
    // Remove horizontal rules (---)
    .replace(/^---+$/gm, "")
    // Remove extra whitespace
    .replace(/\s+/g, " ")
    .trim();

  // Count words (split by whitespace)
  const wordCount = text.split(/\s+/).filter(word => word.length > 0).length;

  // Calculate reading time (always round up to at least 1 minute)
  const readingTime = Math.max(1, Math.ceil(wordCount / wordsPerMinute));

  return readingTime;
}
