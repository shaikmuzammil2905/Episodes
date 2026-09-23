import React, { Suspense } from 'react';
import { getPublicStories, getPublicGenres } from '@/lib/supabase/queries';
import { STORIES, GENRES } from '@/lib/data';
import StoriesContent from './StoriesContent';

export const revalidate = 60;

export default async function StoriesPage() {
  let stories = [];
  let genres = [];

  try {
    const [dbStories, dbGenres] = await Promise.all([
      getPublicStories(),
      getPublicGenres(),
    ]);
    stories = dbStories && dbStories.length > 0 ? dbStories : STORIES;
    genres = dbGenres && dbGenres.length > 0 ? dbGenres : GENRES;
  } catch (err) {
    console.error('Failed to fetch stories from Supabase:', err);
    stories = STORIES;
    genres = GENRES;
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
      <StoriesContent initialStories={stories} initialGenres={genres} />
    </Suspense>
  );
}
