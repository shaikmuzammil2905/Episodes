import React from 'react';
import Link from 'next/link';
import { getPublicStoryById, getPublicStories } from '@/lib/supabase/queries';
import { getEpisodeById as getLocalEpisode, getRelatedStories as getLocalRelated, getStoryById as getLocalStoryById, STORIES } from '@/lib/data';
import ReaderContent from './ReaderContent';

export const revalidate = 60;

interface ReaderPageProps {
  params: Promise<{ storyId: string; episodeId: string }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { storyId, episodeId } = await params;

  // 1. Try database first
  let story: import('@/lib/types').Story | null = null;
  try {
    story = await getPublicStoryById(storyId);
  } catch (err) {
    console.error('Failed to fetch story from Supabase:', err);
  }
  
  // 2. If not found in DB, try local data
  if (!story) {
    const localResult = getLocalEpisode(storyId, episodeId);
    if (localResult) {
      const { story: localStory, episode: localEpisode } = localResult;
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

    const fallbackStory = getLocalStoryById(storyId);
    if (fallbackStory) {
      story = fallbackStory;
    }
  }

  // 3. Resolve the episode within the story
  let episode: import('@/lib/types').Episode | undefined;

  if (story && story.episodes && story.episodes.length > 0) {
    episode = story.episodes.find(
      (e: any) =>
        e.id === episodeId ||
        e.id?.toLowerCase() === episodeId.toLowerCase() ||
        (e.slug && e.slug.toLowerCase() === episodeId.toLowerCase()) ||
        String(e.episodeNumber) === String(episodeId) ||
        `ep-${e.episodeNumber}`.toLowerCase() === episodeId.toLowerCase() ||
        `episode-${e.episodeNumber}`.toLowerCase() === episodeId.toLowerCase()
    );
  }

  // Fallback: check local episodes if DB episode was not matched
  if (!episode) {
    const localFallback = getLocalEpisode(storyId, episodeId);
    if (localFallback) {
      episode = localFallback.episode;
      if (!story) story = localFallback.story;
    }
  }

  // 4. Genuine not-found state without redirecting to Home
  if (!story || !episode) {
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
            The episode you are looking for is currently unavailable, unpublished, or the link may be outdated.
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

  // 5. Get related stories
  let allStories: import('@/lib/types').Story[] = [];
  try {
    allStories = await getPublicStories();
  } catch {
    allStories = STORIES;
  }
  const relatedStories = allStories
    .filter(s => s.id !== story!.id && (s.genreId === story!.genreId || s.language === story!.language))
    .slice(0, 3);

  // 6. Find prev/next episodes — sort numerically first
  const sortedEpisodes = [...story.episodes].sort(
    (a: any, b: any) => Number(a.episodeNumber) - Number(b.episodeNumber)
  );
  const currentIndex = sortedEpisodes.findIndex((e: any) => e.id === episode!.id);
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
