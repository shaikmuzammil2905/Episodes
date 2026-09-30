import React from 'react';
import { getPublicGenres, getPublicStories } from '@/lib/supabase/queries';
import GenresPageClient from './GenresPageClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Browse Genres | Fantasy, Romance, Thriller & More | StoryEpisodes',
  description: 'Explore story categories, discover subgenres, and find your next favorite read on StoryEpisodes.',
};

export default async function GenresPage() {
  let genres: import('@/lib/types').Genre[] = [];
  let stories: import('@/lib/types').Story[] = [];

  try {
    const [dbGenres, dbStories] = await Promise.all([
      getPublicGenres(),
      getPublicStories(),
    ]);
    genres = dbGenres || [];
    stories = dbStories || [];
  } catch (err) {
    console.error('Failed to fetch genres from Supabase:', err);
  }

  return <GenresPageClient genres={genres} stories={stories} />;
}
