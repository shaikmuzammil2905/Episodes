'use client';

import React from 'react';
import Image from 'next/image';
import StoryCard from '@/components/StoryCard';
import { Author, Story } from '@/lib/types';

interface AuthorsPageClientProps {
  authors: Author[];
  stories: Story[];
}

export default function AuthorsPageClient({ authors, stories }: AuthorsPageClientProps) {
  return (
    <div className="authors-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Authors</h1>
          <p>Meet the talented storytellers behind StoryEpisodes.</p>
        </div>

        <div className="authors-list">
          {authors.map((author) => {
            const authorStories = stories.filter(
              (s) => s.authorId === author.id || s.author.toLowerCase() === author.name.toLowerCase()
            );
            return (
              <section key={author.id} className="author-block">
                <div className="author-profile">
                  <div className="author-avatar-wrap">
                    <Image
                      src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                      alt={author.name}
                      width={80}
                      height={80}
                      className="author-avatar"
                    />
                  </div>
                  <div className="author-info">
                    <h2>{author.name}</h2>
                    <p className="author-bio">{author.bio}</p>
                    <span className="author-story-count">
                      {authorStories.length || author.storyCount} Stories Published
                    </span>
                  </div>
                </div>

                {authorStories.length > 0 && (
                  <div className="author-stories-grid">
                    {authorStories.map((story) => (
                      <StoryCard key={story.id} story={story} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .authors-page {
          padding: 32px 0 60px;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .page-header p {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        .authors-list {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .author-block {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .author-profile {
          display: flex;
          align-items: center;
          gap: 20px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
        }

        .author-avatar-wrap {
          flex-shrink: 0;
        }

        .author-avatar {
          border-radius: 50%;
          object-fit: cover;
          width: 80px;
          height: 80px;
        }

        .author-info h2 {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .author-bio {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 8px;
        }

        .author-story-count {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--royal-blue);
          background: var(--bg-light-blue);
          padding: 4px 12px;
          border-radius: var(--radius-full);
        }

        .author-stories-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 640px) {
          .author-stories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .author-stories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
}
