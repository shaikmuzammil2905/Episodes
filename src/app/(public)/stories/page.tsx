import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import StoriesContent from './StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'All Stories & Episodes | Read Original Fiction Online | StoryEpisodes',
  description: 'Browse our complete library of stories, novels, long stories, short stories and fun stories. Read original episodic fiction.',
};

export default async function StoriesPage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string; language?: string; genre?: string; q?: string; search?: string }>;
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
    stories = dbStories || [];
    genres = dbGenres || [];
  } catch (err) {
    console.error('Failed to fetch stories from Supabase:', err);
  }

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '40vh',
            fontSize: '1rem',
            color: 'var(--text-muted)',
          }}
        >
          Loading stories...
        </div>
      }
    >
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        initialLanguage={requestedLang}
      />
    </Suspense>
  );
}
