export interface Episode {
  id: string; // e.g. "episode-1"
  storyId: string;
  episodeNumber: number;
  title: string;
  summary: string;
  content: string;
  readingTime: string;
  publishedAt: string;
  image?: string;
}

export interface Story {
  id: string; // stable slug-based unique id
  slug: string;
  title: string;
  author: string;
  authorId: string;
  authorAvatar?: string;
  genre: string;
  genreId: string;
  language: 'English' | 'Telugu' | 'Short Story' | string;
  coverImage: string;
  heroImage?: string;
  shortDescription: string;
  fullDescription: string;
  status: 'Ongoing' | 'Completed';
  isPremium: boolean;
  tags: string[];
  readingTime?: string;
  whyRead: string;
  featured?: boolean;
  recommended?: boolean;
  latest?: boolean;
  episodes: Episode[];
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  storyCount: number;
}

export interface Genre {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  count: number;
}
