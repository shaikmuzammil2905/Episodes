import React from 'react';
import { notFound } from 'next/navigation';
import { getPublicStoryById, getPublicStories } from '@/lib/supabase/queries';
import { getEpisodeById as getLocalEpisode, getRelatedStories as getLocalRelated, STORIES } from '@/lib/data';
import ReaderContent from './ReaderContent';

export const revalidate = 60;

interface ReaderPageProps {
  params: Promise<{ storyId: string; episodeId: string }>;
}

export default async function ReaderPage({ params }: ReaderPageProps) {
  const { storyId, episodeId } = await params;

  // Try database first
  let story = await getPublicStoryById(storyId);
  
  // Fall back to local data
  if (!story) {
    const localResult = getLocalEpisode(storyId, episodeId);
    if (!localResult) {
      notFound();
    }
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

  // Find the episode in the DB story
  const episode = story.episodes.find(
    (e: any) => e.id === episodeId || e.id.toLowerCase() === episodeId.toLowerCase()
  );

  if (!episode) {
    notFound();
  }

  // Get related stories
  let allStories;
  try {
    allStories = await getPublicStories();
  } catch {
    allStories = STORIES;
  }
  const relatedStories = allStories
    .filter(s => s.id !== story!.id && (s.genreId === story!.genreId || s.language === story!.language))
    .slice(0, 3);

  // Find prev/next episodes
  const currentIndex = story.episodes.findIndex((e: any) => e.id === episode.id);
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
