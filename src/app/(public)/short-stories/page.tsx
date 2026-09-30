import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { isShortStory } from '@/lib/normalization';
import StoriesContent from '../stories/StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Short Stories | Quick Reads & Flash Fiction | StoryEpisodes',
  description: 'Quick reads perfect for a coffee break or commute. Discover engaging short stories online.',
};

export default async function ShortStoriesPage({
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
    // Filter for short stories using canonical normalization
    stories = (dbStories || []).filter(isShortStory);
  } catch (err) {
    console.error('Failed to fetch short stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div className="loading-state">Loading stories...</div>}>
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        title="Short Stories"
        description="Quick reads perfect for a coffee break or commute."
        initialLanguage={requestedLang}
      />
    </Suspense>
  );
}
