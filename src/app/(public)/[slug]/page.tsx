import React from 'react';
import Link from 'next/link';
import { notFound, redirect, RedirectType } from 'next/navigation';
import type { Metadata } from 'next';
import { getPublicEpisodeBySlug, getPublicStoryBySlug, getPublicStories } from '@/lib/supabase/queries';
import { getLocalEpisodeBySlug, getRelatedStories as getLocalRelated, getStoryBySlug, STORIES } from '@/lib/data';
import ReaderContent from '@/app/(public)/reader/[storyId]/[episodeId]/ReaderContent';
import StoryIntroductionContent from '@/components/StoryIntroductionContent';

export const revalidate = 60;

const RESERVED_SLUGS = new Set([
  'about', 'authors', 'comedy-stories', 'fun-stories', 'genres',
  'long-stories', 'novels', 'reader', 'short-stories', 'stories',
  'telugu', 'telugu-novels', 'admin', 'api', 'auth', 'favicon.ico',
  'robots.txt', 'sitemap.xml', 'icon.png'
]);

interface SlugPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!slug) return { title: 'Story Episodes' };

  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();
  if (RESERVED_SLUGS.has(cleanSlug)) return { title: 'Story Episodes' };

  try {
    // 1. Try finding as episode in DB
    const episodeResult = await getPublicEpisodeBySlug(cleanSlug);
    if (episodeResult) {
      const { story, episode } = episodeResult;
      const title = `${episode.title} - ${story.title} | StoryEpisodes`;
      const description = episode.summary || story.shortDescription || `Read ${episode.title} online on StoryEpisodes.`;
      const canonical = `https://www.thestorynovels.com/${episode.slug || episode.id}`;

      return {
        title,
        description,
        alternates: {
          canonical,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'article',
          publishedTime: episode.publishedAt,
          images: episode.image || story.coverImage ? [{ url: episode.image || story.coverImage }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: episode.image || story.coverImage ? [episode.image || story.coverImage] : [],
        },
      };
    }

    // 2. Try finding as story in DB (Main Story Introduction)
    const story = await getPublicStoryBySlug(cleanSlug);
    if (story) {
      const title = `${story.title} - Story Introduction & Episodes | StoryEpisodes`;
      const description = story.shortDescription || story.fullDescription || `Read ${story.title} by ${story.author} online on StoryEpisodes.`;
      const canonical = `https://www.thestorynovels.com/${story.slug || story.id}`;

      return {
        title,
        description,
        alternates: {
          canonical,
        },
        openGraph: {
          title,
          description,
          url: canonical,
          type: 'article',
          images: story.coverImage ? [{ url: story.coverImage }] : [],
        },
        twitter: {
          card: 'summary_large_image',
          title,
          description,
          images: story.coverImage ? [story.coverImage] : [],
        },
      };
    }
  } catch (e) {
    console.error('Error generating metadata for slug:', e);
  }

  // 3. Fallback to local mock data
  const localEpisodeResult = getLocalEpisodeBySlug(cleanSlug);
  if (localEpisodeResult) {
    const { story, episode } = localEpisodeResult;
    const title = `${episode.title} - ${story.title} | StoryEpisodes`;
    const description = episode.summary || story.shortDescription || `Read ${episode.title} online.`;
    const canonical = `https://www.thestorynovels.com/${episode.slug || episode.id}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, type: 'article', publishedTime: episode.publishedAt, images: episode.image || story.coverImage ? [{ url: episode.image || story.coverImage }] : [] },
      twitter: { card: 'summary_large_image', title, description, images: episode.image || story.coverImage ? [episode.image || story.coverImage] : [] },
    };
  }

  const localStory = getStoryBySlug(cleanSlug);
  if (localStory) {
    const title = `${localStory.title} - Story Introduction & Episodes | StoryEpisodes`;
    const description = localStory.shortDescription || localStory.fullDescription || `Read ${localStory.title} by ${localStory.author} online.`;
    const canonical = `https://www.thestorynovels.com/${localStory.slug || localStory.id}`;

    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical, type: 'article', images: localStory.coverImage ? [{ url: localStory.coverImage }] : [] },
      twitter: { card: 'summary_large_image', title, description, images: localStory.coverImage ? [localStory.coverImage] : [] },
    };
  }

  return {
    title: 'Story Not Found | StoryEpisodes',
    description: 'Read gripping episodic fiction and stories online.',
  };
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;

  if (!slug) notFound();

  const cleanSlug = decodeURIComponent(slug).trim().toLowerCase();

  // Guard against reserved routes
  if (RESERVED_SLUGS.has(cleanSlug)) {
    notFound();
  }

  // 1. Try finding an episode in the database by slug or id
  let dbResult: { story: import('@/lib/types').Story; episode: import('@/lib/types').Episode } | null = null;
  try {
    dbResult = await getPublicEpisodeBySlug(cleanSlug);
  } catch (err) {
    console.error('Failed to fetch episode by slug from Supabase:', err);
  }

  if (dbResult) {
    const { story, episode } = dbResult;

    // Get related stories
    let allStories: import('@/lib/types').Story[] = [];
    try {
      allStories = await getPublicStories();
    } catch {
      allStories = STORIES;
    }
    const relatedStories = allStories
      .filter((s) => s.id !== story.id && (s.genreId === story.genreId || s.language === story.language))
      .slice(0, 3);

    // Calculate prev / next episodes
    const sortedEpisodes = [...story.episodes].sort(
      (a: any, b: any) => Number(a.episodeNumber) - Number(b.episodeNumber)
    );
    const currentIndex = sortedEpisodes.findIndex((e: any) => e.id === episode.id);
    const prevEpisode = currentIndex > 0 ? sortedEpisodes[currentIndex - 1] : null;
    const nextEpisode = currentIndex < sortedEpisodes.length - 1 ? sortedEpisodes[currentIndex + 1] : null;

    return (
      <ReaderContent
        story={story}
        episode={episode}
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
        relatedStories={relatedStories}
      />
    );
  }

  // 2. If not found as episode, check if the slug is a STORY slug in the database
  try {
    const story = await getPublicStoryBySlug(cleanSlug);
    if (story) {
      let allStories: import('@/lib/types').Story[] = [];
      try {
        allStories = await getPublicStories();
      } catch {
        allStories = STORIES;
      }
      const relatedStories = allStories
        .filter((s) => s.id !== story.id && (s.genreId === story.genreId || s.language === story.language || s.categorySlug === story.categorySlug))
        .slice(0, 3);

      return (
        <StoryIntroductionContent
          story={story}
          relatedStories={relatedStories}
        />
      );
    }
  } catch (err: any) {
    console.error('Failed checking story slug in DB:', err);
  }

  // 3. Fallback to local mock data (Episode check)
  const localEpisodeResult = getLocalEpisodeBySlug(cleanSlug);
  if (localEpisodeResult) {
    const { story: localStory, episode: localEpisode } = localEpisodeResult;

    const relatedStories = getLocalRelated(localStory.id, 3);
    const currentIndex = localStory.episodes.findIndex((e) => e.id === localEpisode.id);
    const prevEpisode = currentIndex > 0 ? localStory.episodes[currentIndex - 1] : null;
    const nextEpisode = currentIndex < localStory.episodes.length - 1 ? localStory.episodes[currentIndex + 1] : null;

    return (
      <ReaderContent
        story={localStory}
        episode={localEpisode}
        prevEpisode={prevEpisode}
        nextEpisode={nextEpisode}
        relatedStories={relatedStories}
      />
    );
  }

  // 4. Fallback to local mock data (Story check)
  const localStory = getStoryBySlug(cleanSlug);
  if (localStory) {
    const relatedStories = getLocalRelated(localStory.id, 3);
    return (
      <StoryIntroductionContent
        story={localStory}
        relatedStories={relatedStories}
      />
    );
  }

  // 4. Genuine not found state
  return (
    <div style={{
      minHeight: '70vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '32px 16px',
      backgroundColor: 'var(--bg-cream, #FDFBF7)',
    }}>
      <div style={{
        backgroundColor: 'var(--bg-surface, #fff)',
        border: '1px solid var(--border-color, #E2E8F0)',
        borderRadius: 'var(--radius-lg, 18px)',
        padding: '48px 32px',
        maxWidth: '520px',
        width: '100%',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '16px' }}>📖</div>
        <h1 style={{
          fontSize: '1.75rem',
          fontWeight: 800,
          color: 'var(--text-primary, #0F172A)',
          marginBottom: '12px',
        }}>Episode Not Found</h1>
        <p style={{
          fontSize: '0.95rem',
          color: 'var(--text-secondary, #475569)',
          lineHeight: 1.6,
          marginBottom: '28px',
        }}>
          The episode or story you are looking for is currently unavailable, unpublished, or the link may be outdated.
        </p>
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
          <Link
            href="/stories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: 'var(--royal-blue, #2563EB)',
              color: '#fff',
              fontWeight: 700,
              borderRadius: 'var(--radius-md, 12px)',
            }}
          >
            Browse All Stories
          </Link>
          <Link
            href="/novels"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '12px 24px',
              backgroundColor: 'var(--bg-surface, #fff)',
              color: 'var(--text-primary, #0F172A)',
              border: '1px solid var(--border-color, #E2E8F0)',
              fontWeight: 600,
              borderRadius: 'var(--radius-md, 12px)',
            }}
          >
            Explore Novels
          </Link>
        </div>
      </div>
    </div>
  );
}
