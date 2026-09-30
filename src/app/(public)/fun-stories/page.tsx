import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { isFunStory } from '@/lib/normalization';
import StoriesContent from '../stories/StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Fun Stories | Lighthearted & Entertaining Reads | StoryEpisodes',
  description: 'Lighthearted, entertaining, and fun stories to brighten your day.',
};

export default async function FunStoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string; language?: string; q?: string; search?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const requestedLang = params.lang || params.language;

  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Filter for fun stories using canonical normalization
    stories = (dbStories || []).filter(isFunStory);
  } catch (err) {
    console.error('Failed to fetch fun stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div className="loading-state">Loading stories...</div>}>
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        title="Fun Stories"
        description="Lighthearted, entertaining, and fun stories to brighten your day."
        initialLanguage={requestedLang}
      />
    </Suspense>
  );
}
