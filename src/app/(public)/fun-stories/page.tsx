import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import StoriesContent from '../stories/StoriesContent';

export const revalidate = 60;

export default async function FunStoriesPage() {
  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Filter for fun stories
    stories = (dbStories || []).filter(s => s.categorySlug === 'fun-story' || s.categorySlug === 'fun-stories' || s.categorySlug === 'fun');
  } catch (err) {
    console.error('Failed to fetch stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div>Loading stories...</div>}>
      <StoriesContent initialStories={stories} initialGenres={genres} forceDbData={true} title="Fun Stories" description="Lighthearted, entertaining, and fun stories to brighten your day." />
    </Suspense>
  );
}
