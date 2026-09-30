import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { isNovel } from '@/lib/normalization';
import StoriesContent from '../stories/StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Read Novels Online | Full Length Stories | StoryEpisodes',
  description: 'Discover full-length novels across fantasy, drama, mystery, thriller and more on StoryEpisodes.',
};

export default async function NovelsPage({
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
    // Filter for novels using canonical normalization
    stories = (dbStories || []).filter(isNovel);
  } catch (err) {
    console.error('Failed to fetch novels from Supabase:', err);
  }

  return (
    <Suspense fallback={<div className="loading-state">Loading novels...</div>}>
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        title="Novels"
        description="Discover full-length novels across all genres."
        initialLanguage={requestedLang}
      />
    </Suspense>
  );
}
