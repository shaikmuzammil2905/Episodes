'use client';

import React from 'react';
import Link from 'next/link';
import { Story, Episode } from '@/lib/types';
import { useModal } from '@/context/ModalContext';

interface ReaderContentProps {
  story: Story;
  episode: Episode;
  prevEpisode: Episode | null;
  nextEpisode: Episode | null;
  relatedStories: Story[];
}

export default function ReaderContent({
  story,
  episode,
  prevEpisode,
  nextEpisode,
  relatedStories,
}: ReaderContentProps) {
  const { openStoryModal } = useModal();

  return (
    <div className="reader-page">
      <div className="reader-container">
        {/* Reader Header */}
        <div className="reader-header">
          <button className="back-link" onClick={() => openStoryModal(story)}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Story
          </button>
        </div>

        {/* Reader Meta */}
        <div className="reader-meta">
          <span className="badge badge-genre">{story.genre}</span>
          <span className={`badge ${story.isPremium ? 'badge-premium' : 'badge-free'}`}>
            {story.isPremium ? 'Premium' : 'Free'}
          </span>
        </div>

        <h1 className="reader-story-title">{story.title}</h1>
        <div className="episode-header">
          <span className="episode-number">Episode {episode.episodeNumber}</span>
          <h2 className="episode-title">{episode.title}</h2>
        </div>
        <div className="reader-info-bar">
          <span className="info-item">✍️ {story.author}</span>
          <span className="info-item">⏱️ {episode.readingTime} read</span>
          <span className="info-item">📅 {new Date(episode.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {/* Divider */}
        <hr className="reader-divider" />

        {/* Content */}
        <article className="reader-article">
          {episode.content.split('\n\n').map((para, i) => {
            if (para.startsWith('*') && para.endsWith('*')) {
              return <p key={i} className="italic-block">{para.replace(/^\*|\*$/g, '')}</p>;
            }
            return <p key={i}>{para}</p>;
          })}
        </article>

        {/* Episode Navigation */}
        <div className="episode-nav">
          {prevEpisode ? (
            <Link href={`/reader/${story.id}/${prevEpisode.id}`} className="ep-nav-btn prev">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              <div className="ep-nav-text">
                <span className="ep-nav-label">Previous Episode</span>
                <span className="ep-nav-title">{prevEpisode.title}</span>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextEpisode ? (
            <Link href={`/reader/${story.id}/${nextEpisode.id}`} className="ep-nav-btn next">
              <div className="ep-nav-text right">
                <span className="ep-nav-label">Next Episode</span>
                <span className="ep-nav-title">{nextEpisode.title}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          ) : (
            <div className="series-end">
              <p>🎉 You&apos;ve reached the latest episode!</p>
              <button className="btn-primary" onClick={() => openStoryModal(story)}>Back to Story</button>
            </div>
          )}
        </div>

        {/* Related Stories */}
        {relatedStories.length > 0 && (
          <div className="related-section">
            <h3>Related Stories</h3>
            <div className="related-grid">
              {relatedStories.map((rel) => (
                <button
                  key={rel.id}
                  className="related-card-btn"
                  onClick={() => openStoryModal(rel)}
                >
                  <h4>{rel.title}</h4>
                  <p>{rel.genre} • By {rel.author}</p>
                  <span className="view-link">View Story →</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .reader-page {
          background: var(--bg-cream);
          min-height: 80vh;
          padding: 24px 0 60px;
        }

        .reader-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 16px;
        }

        @media (min-width: 768px) {
          .reader-container {
            padding: 0 32px;
          }
        }

        .reader-header {
          margin-bottom: 20px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--royal-blue);
          transition: var(--transition-fast);
        }

        .back-link:hover {
          color: var(--royal-blue-hover);
        }

        .reader-meta {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .reader-story-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          line-height: 1.3;
        }

        @media (min-width: 768px) {
          .reader-story-title {
            font-size: 2rem;
          }
        }

        .episode-header {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-bottom: 12px;
        }

        .episode-number {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--royal-blue);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .episode-title {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .reader-info-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          margin-bottom: 24px;
        }

        .info-item {
          font-size: 0.85rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        .reader-divider {
          border: none;
          border-top: 2px solid var(--border-color);
          margin-bottom: 32px;
        }

        /* Article Typography */
        .reader-article {
          font-family: var(--font-serif);
          font-size: 1.08rem;
          line-height: 1.85;
          color: var(--text-primary);
        }

        .reader-article p {
          margin-bottom: 1.4em;
        }

        .reader-article .italic-block {
          font-style: italic;
          color: var(--text-secondary);
          border-left: 3px solid var(--accent-gold);
          padding-left: 16px;
          margin: 1.5em 0;
        }

        @media (min-width: 768px) {
          .reader-article {
            font-size: 1.15rem;
          }
        }

        /* Episode Navigation */
        .episode-nav {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 2px solid var(--border-color);
          display: flex;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .ep-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          padding: 16px 20px;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
          max-width: 48%;
          flex: 1;
        }

        .ep-nav-btn:hover {
          border-color: var(--royal-blue);
          box-shadow: var(--shadow-md);
        }

        .ep-nav-text {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .ep-nav-text.right {
          text-align: right;
        }

        .ep-nav-label {
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--royal-blue);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .ep-nav-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .series-end {
          text-align: center;
          padding: 24px;
          background: var(--bg-light-blue);
          border-radius: var(--radius-md);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .series-end p {
          font-size: 1rem;
          font-weight: 600;
          color: var(--royal-blue);
        }

        /* Related Stories */
        .related-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 2px solid var(--border-color);
        }

        .related-section h3 {
          font-family: var(--font-serif);
          font-size: 1.3rem;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .related-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }

        @media (min-width: 640px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .related-card-btn {
          text-align: left;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          padding: 20px;
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
          width: 100%;
        }

        .related-card-btn:hover {
          border-color: var(--royal-blue);
          box-shadow: var(--shadow-md);
        }

        .related-card-btn h4 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 4px;
        }

        .related-card-btn p {
          font-size: 0.82rem;
          color: var(--text-muted);
          margin-bottom: 8px;
        }

        .view-link {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--royal-blue);
        }
      `}</style>
    </div>
  );
}
