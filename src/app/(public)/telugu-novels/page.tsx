import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { isNovel, isTelugu } from '@/lib/normalization';
import StoriesContent from '../stories/StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Telugu Novels Online | Read Telugu Stories & Episodes | StoryEpisodes',
  description: 'Explore engaging Telugu novels and serialized stories. Read original novels written in Telugu (తెలుగు కథలు & నవలలు).',
};

export default async function TeluguNovelsPage() {
  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Strict requirement: Language = Telugu AND Story Type = Novel AND Published = true
    stories = (dbStories || []).filter(s => isTelugu(s) && isNovel(s));
  } catch (err) {
    console.error('Failed to fetch Telugu novels from Supabase:', err);
  }

  return (
    <Suspense fallback={<div className="loading-state">Loading Telugu novels...</div>}>
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        title="Telugu Novels"
        description="Explore original novels and gripping stories in Telugu (తెలుగు నవలలు)."
        initialLanguage="Telugu"
      />
    </Suspense>
  );
}
