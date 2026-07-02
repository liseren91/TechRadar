import { describe, it, expect } from 'vitest'
import { parseFeed } from '../sources'

const ATOM = `<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>Hello Agents</title><link href="https://ex.com/a"/>
<updated>2026-06-01T00:00:00Z</updated><summary>About context windows.</summary></entry>
</feed>`

const RSS = `<?xml version="1.0"?><rss><channel>
<item><title>RSS Post</title><link>https://ex.com/b</link>
<pubDate>Tue, 02 Jun 2026 10:00:00 GMT</pubDate><description>Body text here.</description></item>
</channel></rss>`

describe('parseFeed', () => {
  it('parses Atom entries', () => {
    const posts = parseFeed(ATOM, 'anthropic')
    expect(posts).toHaveLength(1)
    expect(posts[0].title).toBe('Hello Agents')
    expect(posts[0].url).toBe('https://ex.com/a')
    expect(posts[0].source).toBe('anthropic')
    expect(posts[0].contentText).toContain('context windows')
  })
  it('parses RSS items', () => {
    const posts = parseFeed(RSS, 'openai')
    expect(posts[0].url).toBe('https://ex.com/b')
    expect(new Date(posts[0].publishedAt).getUTCFullYear()).toBe(2026)
  })
})
