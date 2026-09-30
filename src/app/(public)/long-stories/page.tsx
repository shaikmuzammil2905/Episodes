import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import StoriesContent from '../stories/StoriesContent';

export const revalidate = 60;

export default async function LongStoriesPage() {
  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Filter for long stories
    stories = (dbStories || []).filter(s => s.categorySlug === 'long-story' || s.categorySlug === 'long-stories' || s.categorySlug === 'long');
  } catch (err) {
    console.error('Failed to fetch stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div>Loading stories...</div>}>
      <StoriesContent initialStories={stories} initialGenres={genres} forceDbData={true} title="Long Stories" description="Dive into our extensive collection of long stories and epic novels." />
    </Suspense>
  );
}
