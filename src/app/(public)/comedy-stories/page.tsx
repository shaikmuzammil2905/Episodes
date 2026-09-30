import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import StoriesContent from '../stories/StoriesContent';

export const revalidate = 60;

export default async function ComedyStoriesPage() {
  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Filter for comedy stories
    stories = (dbStories || []).filter(s => s.categorySlug === 'comedy-story' || s.categorySlug === 'comedy-stories' || s.categorySlug === 'comedy');
  } catch (err) {
    console.error('Failed to fetch stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div>Loading stories...</div>}>
      <StoriesContent initialStories={stories} initialGenres={genres} forceDbData={true} title="Comedy Stories" description="Laugh out loud with our collection of comedy stories." />
    </Suspense>
  );
}
