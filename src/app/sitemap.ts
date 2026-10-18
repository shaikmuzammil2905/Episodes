import type { MetadataRoute } from 'next'
import { getPublicStories } from '@/lib/supabase/queries'

const SITE_URL = 'https://www.thestorynovels.com'

export const revalidate = 3600 // Revalidate every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static public pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${SITE_URL}/stories`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/novels`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/short-stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/long-stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/fun-stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/comedy-stories`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/telugu`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/telugu-novels`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/genres`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/authors`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]

  // Dynamic story introduction & episode pages
  let storyPages: MetadataRoute.Sitemap = []
  try {
    const stories = await getPublicStories()
    for (const story of stories) {
      // 1. Main story introduction page URL
      const storySlug = story.slug || story.id
      storyPages.push({
        url: `${SITE_URL}/${storySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      })

      // 2. Individual episode URLs
      if (story.episodes && story.episodes.length > 0) {
        for (const ep of story.episodes) {
          const slug = ep.slug || ep.id
          storyPages.push({
            url: `${SITE_URL}/${slug}`,
            lastModified: new Date(ep.publishedAt || Date.now()),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          })
        }
      }
    }
  } catch {
    // If DB is unreachable, just return static pages
  }

  return [...staticPages, ...storyPages]
}
