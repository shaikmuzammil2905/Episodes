import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { isLongStory } from '@/lib/normalization';
import StoriesContent from '../stories/StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Long Stories | Read Epic Serialized Fiction | StoryEpisodes',
  description: 'Dive into our extensive collection of long stories and epic episodic fiction.',
};

export default async function LongStoriesPage({
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
    // Filter for long stories using canonical normalization
    stories = (dbStories || []).filter(isLongStory);
  } catch (err) {
    console.error('Failed to fetch long stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div className="loading-state">Loading stories...</div>}>
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        title="Long Stories"
        description="Dive into our extensive collection of long stories and epic sagas."
        initialLanguage={requestedLang}
      />
    </Suspense>
  );
}
