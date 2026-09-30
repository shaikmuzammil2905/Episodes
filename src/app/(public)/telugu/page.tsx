import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { isTelugu } from '@/lib/normalization';
import StoriesContent from '../stories/StoriesContent';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Telugu Stories Online | Read Telugu Episodes & Novels | StoryEpisodes',
  description: 'Read captivating original stories written in Telugu (తెలుగు కథలు). Discover epics, mysteries, dramas and short stories.',
};

export default async function TeluguStoriesPage() {
  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Strict requirement: Language = Telugu AND Published = true
    stories = (dbStories || []).filter(isTelugu);
  } catch (err) {
    console.error('Failed to fetch Telugu stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div className="loading-state">Loading Telugu stories...</div>}>
      <StoriesContent
        initialStories={stories}
        initialGenres={genres}
        forceDbData={true}
        title="Telugu Stories"
        description="Discover captivating stories written in Telugu (తెలుగు కథలు)."
        initialLanguage="Telugu"
      />
    </Suspense>
  );
}
