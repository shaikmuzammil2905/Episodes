import React from 'react';
import { getPublicGenres, getPublicStories } from '@/lib/supabase/queries';
import { GENRES, STORIES } from '@/lib/data';
import GenresPageClient from './GenresPageClient';

export const revalidate = 60;

export default async function GenresPage() {
  let genres = [];
  let stories = [];

  try {
    const [dbGenres, dbStories] = await Promise.all([
      getPublicGenres(),
      getPublicStories(),
    ]);
    genres = dbGenres && dbGenres.length > 0 ? dbGenres : GENRES;
    stories = dbStories && dbStories.length > 0 ? dbStories : STORIES;
  } catch (err) {
    console.error('Failed to fetch genres from Supabase:', err);
    genres = GENRES;
    stories = STORIES;
  }

  return <GenresPageClient genres={genres} stories={stories} />;
}
