import React from 'react';
import { getPublicAuthors, getPublicStories } from '@/lib/supabase/queries';
import AuthorsPageClient from './AuthorsPageClient';
import type { Metadata } from 'next';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Authors & Storytellers | StoryEpisodes',
  description: 'Meet the creative minds behind our stories and discover works by your favorite authors.',
};

export default async function AuthorsPage() {
  let authors: import('@/lib/types').Author[] = [];
  let stories: import('@/lib/types').Story[] = [];

  try {
    const [dbAuthors, dbStories] = await Promise.all([
      getPublicAuthors(),
      getPublicStories(),
    ]);
    authors = dbAuthors || [];
    stories = dbStories || [];
  } catch (err) {
    console.error('Failed to fetch authors from Supabase:', err);
  }

  return <AuthorsPageClient authors={authors} stories={stories} />;
}
