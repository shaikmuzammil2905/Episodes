import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import StoriesContent from '../stories/StoriesContent';

export const revalidate = 60;

export default async function ShortStoriesPage() {
  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Filter for short stories
    stories = (dbStories || []).filter(s => s.categorySlug === 'short-story' || s.categorySlug === 'short-stories' || s.categorySlug === 'short');
  } catch (err) {
    console.error('Failed to fetch stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div>Loading stories...</div>}>
      <StoriesContent initialStories={stories} initialGenres={genres} forceDbData={true} title="Short Stories" description="Quick reads perfect for a coffee break or commute." />
    </Suspense>
  );
}
