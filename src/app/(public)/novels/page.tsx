import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import StoriesContent from '../stories/StoriesContent';

export const revalidate = 60;

export default async function NovelsPage() {
  let stories: import('@/lib/types').Story[] = [];
  let genres: import('@/lib/types').Genre[] = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    
    genres = dbGenres || [];
    // Filter for novels
    stories = (dbStories || []).filter(s => 
      s.genre?.toLowerCase() === 'novels' || 
      s.genreId?.toLowerCase() === 'novels' ||
      s.genre?.toLowerCase() === 'novel'
    );
  } catch (err) {
    console.error('Failed to fetch stories from Supabase:', err);
  }

  return (
    <Suspense fallback={<div>Loading stories...</div>}>
      <StoriesContent initialStories={stories} initialGenres={genres} forceDbData={true} />
    </Suspense>
  );
}
