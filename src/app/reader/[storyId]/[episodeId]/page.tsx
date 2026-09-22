import React from 'react';
import { notFound } from 'next/navigation';
import { getEpisodeById, getRelatedStories, STORIES } from '@/lib/data';
import ReaderContent from './ReaderContent';

// Generate static params for all valid story+episode combinations
export function generateStaticParams() {
  const params: { storyId: string; episodeId: string }[] = [];
  for (const story of STORIES) {
    for (const episode of story.episodes) {
      params.push({ storyId: story.id, episodeId: episode.id });
    }
  }
  return params;
}

interface ReaderPageProps {
  params: Promise<{ storyId: string; episodeId: string }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { storyId, episodeId } = await params;

  // Validate story + episode exist and episode belongs to story
  const result = getEpisodeById(storyId, episodeId);
  if (!result) {
    notFound();
  }

  const { story, episode } = result;
  const relatedStories = getRelatedStories(story.id, 3);

  // Find prev/next episodes
  const currentIndex = story.episodes.findIndex((e) => e.id === episode.id);
  const prevEpisode = currentIndex > 0 ? story.episodes[currentIndex - 1] : null;
  const nextEpisode = currentIndex < story.episodes.length - 1 ? story.episodes[currentIndex + 1] : null;

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
