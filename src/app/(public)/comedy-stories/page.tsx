import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { isComedyStory } from '@/lib/normalization';
import StoriesContent from '../stories/StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Comedy Stories | Laugh Out Loud Reads | StoryEpisodes',
  description: 'Laugh out loud with our collection of comedy stories and humorous tales.',
};

export default async function ComedyStoriesPage({
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
    // Filter for comedy stories using canonical normalization
    stories = (dbStories || []).filter(isComedyStory);
  } catch (err) {
    console.error('Failed to fetch comedy stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div className="loading-state">Loading stories...</div>}>
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        title="Comedy Stories"
        description="Laugh out loud with our collection of comedy stories."
        initialLanguage={requestedLang}
      />
    </Suspense>
  );
}
