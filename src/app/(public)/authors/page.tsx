import React from 'react';
import { getPublicAuthors, getPublicStories } from '@/lib/supabase/queries';
import { AUTHORS, STORIES } from '@/lib/data';
import AuthorsPageClient from './AuthorsPageClient';

export const revalidate = 60;

export default async function AuthorsPage() {
  let authors = [];
  let stories = [];

  try {
    const [dbAuthors, dbStories] = await Promise.all([
      getPublicAuthors(),
      getPublicStories(),
    ]);
    authors = dbAuthors && dbAuthors.length > 0 ? dbAuthors : AUTHORS;
    stories = dbStories && dbStories.length > 0 ? dbStories : STORIES;
  } catch (err) {
    console.error('Failed to fetch authors from Supabase:', err);
    authors = AUTHORS;
    stories = STORIES;
  }

  return <AuthorsPageClient authors={authors} stories={stories} />;
}
