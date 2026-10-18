'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Story, Episode } from '@/lib/types';
import StoryCard from './StoryCard';

interface StoryIntroductionContentProps {
  story: Story;
  relatedStories?: Story[];
}

export default function StoryIntroductionContent({
  story,
  relatedStories = [],
}: StoryIntroductionContentProps) {
  const [copied, setCopied] = useState(false);
  const [navigatingEpisodeId, setNavigatingEpisodeId] = useState<string | null>(null);

  // Sort episodes numerically
  const episodes = [...(story.episodes || [])].sort(
    (a, b) => Number(a.episodeNumber) - Number(b.episodeNumber)
  );
  const firstEpisode = episodes[0];

  const handleShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : `https://www.thestorynovels.com/${story.slug || story.id}`;
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: story.title,
          text: story.shortDescription || `Read ${story.title} on StoryEpisodes`,
          url,
        });
        return;
      } catch {
        // User cancelled or share failed, fallback to clipboard
      }
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleEpisodeClick = (epTarget: string) => {
    setNavigatingEpisodeId(epTarget);
  };

  // Structured Data (JSON-LD) for Search Engines
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: story.title,
    headline: story.title,
    description: story.shortDescription || story.fullDescription,
    image: story.coverImage,
    author: {
      '@type': 'Person',
      name: story.author,
    },
    inLanguage: story.language || 'English',
    genre: story.genre,
    numberOfPages: episodes.length,
    url: typeof window !== 'undefined' ? window.location.href : `https://www.thestorynovels.com/${story.slug || story.id}`,
  };

  return (
    <div className="story-intro-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container intro-container">
        {/* Breadcrumb Navigation */}
        <nav className="breadcrumbs" aria-label="Breadcrumbs">
          <Link href="/" className="crumb-link">Home</Link>
          <span className="crumb-sep">/</span>
          <Link href="/stories" className="crumb-link">Stories</Link>
          {story.genre && (
            <>
              <span className="crumb-sep">/</span>
              <Link href={`/stories?genre=${encodeURIComponent(story.genreId || story.genre.toLowerCase())}`} className="crumb-link">
                {story.genre}
              </Link>
            </>
          )}
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{story.title}</span>
        </nav>

        {/* Hero Card */}
        <section className="hero-card">
          <div className="hero-banner-inner">
            {/* Cover Image Artwork */}
            <div className="cover-img-wrapper">
              <Image
                src={story.coverImage}
                alt={story.title}
                fill
                priority
                sizes="(max-width: 640px) 100vw, 240px"
                className="cover-img"
              />
              <div className="cover-badge-overlay">
                <span className={`badge ${story.isPremium ? 'badge-premium' : 'badge-free'}`}>
                  {story.isPremium ? '★ Premium' : 'Free Story'}
                </span>
              </div>
            </div>

            {/* Meta Information & Header */}
            <div className="story-header-meta">
              <div className="badges-row">
                <span className="badge badge-genre">{story.genre}</span>
                <span className="badge-pill lang-pill">{story.language}</span>
                {story.categoryName && (
                  <span className="badge-pill category-pill">{story.categoryName}</span>
                )}
                <span className="badge-pill status-pill">⚡ {story.status || 'Ongoing'}</span>
              </div>

              <h1 className="story-main-title">{story.title}</h1>

              <div className="author-container">
                <span className="by-label">Written by</span>
                <span className="author-title">{story.author}</span>
              </div>

              <div className="stats-row">
                <div className="stat-card">
                  <span className="stat-icon">📖</span>
                  <div className="stat-details">
                    <span className="stat-value">{episodes.length}</span>
                    <span className="stat-label">Episodes</span>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">⏱️</span>
                  <div className="stat-details">
                    <span className="stat-value">{story.readingTime || `${Math.max(1, episodes.length * 5)} min`}</span>
                    <span className="stat-label">Read Time</span>
                  </div>
                </div>

                <div className="stat-card">
                  <span className="stat-icon">🌟</span>
                  <div className="stat-details">
                    <span className="stat-value">{story.language}</span>
                    <span className="stat-label">Edition</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="cta-action-bar">
                {firstEpisode ? (
                  <Link
                    href={`/${firstEpisode.slug || firstEpisode.id}`}
                    className={`btn-primary start-reading-btn ${navigatingEpisodeId === (firstEpisode.slug || firstEpisode.id) ? 'is-navigating' : ''}`}
                    onClick={() => handleEpisodeClick(firstEpisode.slug || firstEpisode.id)}
                  >
                    {navigatingEpisodeId === (firstEpisode.slug || firstEpisode.id) ? (
                      <>
                        <span className="btn-spinner" />
                        <span>Opening Episode 1...</span>
                      </>
                    ) : (
                      <>
                        <span>Start Reading (Episode 1)</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                      </>
                    )}
                  </Link>
                ) : (
                  <button className="btn-primary start-reading-btn" disabled>
                    No Episodes Published Yet
                  </button>
                )}

                <button
                  type="button"
                  className="btn-share"
                  onClick={handleShare}
                  aria-label="Share Story Link"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                  </svg>
                  <span>{copied ? 'Link Copied!' : 'Share Story'}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Content Layout Grid */}
        <div className="story-content-grid">
          {/* Main Column */}
          <main className="story-main-column">
            {/* Story Introduction & Synopsis Section */}
            <section className="intro-card-section">
              <div className="section-title-bar">
                <h2>Story Introduction & Synopsis</h2>
              </div>
              <div className="synopsis-content">
                {(story.fullDescription || story.shortDescription || '')
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
              </div>
            </section>

            {/* Episode List Section */}
            <section className="intro-card-section episodes-list-section">
              <div className="section-title-bar flex-between">
                <div>
                  <h2>Episode List</h2>
                  <span className="sub-tag">{episodes.length} Chapters Published</span>
                </div>
                {firstEpisode && (
                  <Link
                    href={`/${firstEpisode.slug || firstEpisode.id}`}
                    className="read-first-link"
                  >
                    Start with Ep 1 →
                  </Link>
                )}
              </div>

              {episodes.length > 0 ? (
                <div className="episodes-chapter-list">
                  {episodes.map((ep: Episode) => {
                    const epTarget = ep.slug || ep.id;
                    const isOpening = navigatingEpisodeId === epTarget;
                    return (
                      <Link
                        key={ep.id}
                        href={`/${epTarget}`}
                        className={`chapter-card ${isOpening ? 'is-loading' : ''}`}
                        onClick={() => handleEpisodeClick(epTarget)}
                      >
                        <div className="chapter-badge">
                          <span className="badge-ep">Ep</span>
                          <span className="badge-number">{ep.episodeNumber}</span>
                        </div>

                        <div className="chapter-info">
                          <h3 className="chapter-title">{ep.title}</h3>
                          {ep.summary && <p className="chapter-summary">{ep.summary}</p>}
                          <div className="chapter-meta">
                            {ep.readingTime && <span className="meta-time">⏱️ {ep.readingTime}</span>}
                            {ep.publishedAt && (
                              <span className="meta-date">
                                📅 {new Date(ep.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="chapter-action">
                          {isOpening ? (
                            <span className="action-loading">
                              <span className="btn-spinner small" /> Opening...
                            </span>
                          ) : (
                            <span className="action-read-btn">
                              Read Chapter <span className="arrow">→</span>
                            </span>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="no-episodes-box">
                  <span className="empty-icon">📖</span>
                  <p>No episodes have been released for this story yet. Check back soon!</p>
                </div>
              )}
            </section>
          </main>

          {/* Sidebar Column */}
          <aside className="story-sidebar-column">
            {/* Story Details Card */}
            <div className="sidebar-card">
              <h3>Story Details</h3>
              <div className="detail-rows">
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value highlight">{story.status || 'Ongoing'}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Language</span>
                  <span className="detail-value">{story.language}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Genre</span>
                  <span className="detail-value">{story.genre}</span>
                </div>
                {story.categoryName && (
                  <div className="detail-item">
                    <span className="detail-label">Category</span>
                    <span className="detail-value">{story.categoryName}</span>
                  </div>
                )}
                <div className="detail-item">
                  <span className="detail-label">Episodes</span>
                  <span className="detail-value">{episodes.length} Chapters</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Access</span>
                  <span className="detail-value">{story.isPremium ? 'Premium Story' : 'Free to Read'}</span>
                </div>
              </div>
            </div>

            {/* Tags Card */}
            {story.tags && story.tags.length > 0 && (
              <div className="sidebar-card">
                <h3>Story Tags</h3>
                <div className="tags-cloud">
                  {story.tags.map((tag: string) => (
                    <span key={tag} className="tag-chip">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Profile Card */}
            <div className="sidebar-card author-card">
              <h3>About the Author</h3>
              <div className="author-card-content">
                <div className="author-avatar-badge">
                  {story.authorAvatar ? (
                    <Image
                      src={story.authorAvatar}
                      alt={story.author}
                      width={48}
                      height={48}
                      className="author-avatar-img"
                    />
                  ) : (
                    <span className="author-avatar-initial">
                      {story.author.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="author-card-info">
                  <div className="author-card-name">{story.author}</div>
                  <div className="author-card-sub">Contributing Author on StoryEpisodes</div>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* Related Stories Section */}
        {relatedStories.length > 0 && (
          <section className="related-stories-container">
            <div className="section-title-bar">
              <h2>You May Also Like</h2>
              <Link href="/stories" className="view-all-link">Browse All Stories →</Link>
            </div>
            <div className="related-stories-grid">
              {relatedStories.map((rel) => (
                <div key={rel.id} className="related-card-item">
                  <StoryCard story={rel} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating Toast Notification */}
      {copied && (
        <div className="toast-notification" role="status">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <span>Story link copied to clipboard!</span>
        </div>
      )}

      <style jsx>{`
        .story-intro-page {
          background-color: var(--bg-cream, #FDFBF7);
          min-height: 85vh;
          padding: 24px 0 64px;
        }

        .intro-container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 0 16px;
        }

        @media (min-width: 768px) {
          .intro-container {
            padding: 0 24px;
          }
        }

        /* Breadcrumbs */
        .breadcrumbs {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          color: var(--text-muted, #64748B);
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .crumb-link {
          color: var(--text-secondary, #475569);
          text-decoration: none;
          transition: color var(--transition-fast);
        }

        .crumb-link:hover {
          color: var(--royal-blue, #2563EB);
        }

        .crumb-sep {
          color: var(--border-color, #CBD5E1);
        }

        .crumb-current {
          color: var(--text-primary, #0F172A);
          font-weight: 600;
          max-width: 240px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Hero Card */
        .hero-card {
          background: var(--bg-surface, #FFFFFF);
          border: 1px solid var(--border-color, #E2E8F0);
          border-radius: var(--radius-lg, 16px);
          padding: 24px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
          margin-bottom: 32px;
        }

        @media (min-width: 768px) {
          .hero-card {
            padding: 32px;
          }
        }

        .hero-banner-inner {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (min-width: 768px) {
          .hero-banner-inner {
            flex-direction: row;
            align-items: flex-start;
            gap: 32px;
          }
        }

        .cover-img-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: var(--radius-md, 12px);
          overflow: hidden;
          background: #E2E8F0;
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
          flex-shrink: 0;
        }

        @media (min-width: 768px) {
          .cover-img-wrapper {
            width: 240px;
            aspect-ratio: 3 / 4;
          }
        }

        .cover-img {
          object-fit: cover;
        }

        .cover-badge-overlay {
          position: absolute;
          top: 12px;
          left: 12px;
          z-index: 2;
        }

        .story-header-meta {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .badges-row {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .badge-pill {
          font-size: 0.78rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: var(--radius-full, 9999px);
          background: var(--bg-cream, #F8FAFC);
          border: 1px solid var(--border-color, #E2E8F0);
          color: var(--text-secondary, #475569);
        }

        .lang-pill {
          background: #EEF2FF;
          color: #4F46E5;
          border-color: #C7D2FE;
        }

        .category-pill {
          background: #F0FDF4;
          color: #16A34A;
          border-color: #BBF7D0;
        }

        .status-pill {
          background: #FFFBEB;
          color: #D97706;
          border-color: #FDE68A;
        }

        .story-main-title {
          font-family: var(--font-serif);
          font-size: 1.85rem;
          font-weight: 800;
          color: var(--text-primary, #0F172A);
          line-height: 1.2;
          letter-spacing: -0.01em;
        }

        @media (min-width: 768px) {
          .story-main-title {
            font-size: 2.35rem;
          }
        }

        .author-container {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 1rem;
        }

        .by-label {
          color: var(--text-muted, #64748B);
        }

        .author-title {
          font-weight: 700;
          color: var(--royal-blue, #2563EB);
        }

        /* Stats Row */
        .stats-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 4px;
        }

        .stat-card {
          background: var(--bg-cream, #F8FAFC);
          border: 1px solid var(--border-color, #E2E8F0);
          border-radius: var(--radius-md, 10px);
          padding: 8px 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stat-icon {
          font-size: 1.2rem;
        }

        .stat-details {
          display: flex;
          flex-direction: column;
        }

        .stat-value {
          font-size: 0.95rem;
          font-weight: 800;
          color: var(--text-primary, #0F172A);
          line-height: 1.1;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 600;
          color: var(--text-muted, #64748B);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        /* CTA Row */
        .cta-action-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 8px;
        }

        .start-reading-btn {
          flex: 1;
          min-width: 220px;
          padding: 14px 24px;
          font-size: 1rem;
          font-weight: 700;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: var(--royal-blue, #2563EB);
          color: #FFFFFF;
          border-radius: var(--radius-md, 12px);
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.25);
          transition: var(--transition-fast);
        }

        .start-reading-btn:hover {
          background: var(--royal-blue-hover, #1D4ED8);
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
        }

        .start-reading-btn.is-navigating {
          opacity: 0.9;
          pointer-events: none;
        }

        .btn-share {
          padding: 14px 20px;
          font-size: 0.95rem;
          font-weight: 600;
          background: var(--bg-surface, #FFFFFF);
          color: var(--text-primary, #0F172A);
          border: 1px solid var(--border-color, #CBD5E1);
          border-radius: var(--radius-md, 12px);
          display: inline-flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .btn-share:hover {
          background: var(--bg-light-blue, #EFF6FF);
          border-color: var(--royal-blue, #2563EB);
          color: var(--royal-blue, #2563EB);
        }

        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.35);
          border-top-color: #FFFFFF;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        .btn-spinner.small {
          width: 14px;
          height: 14px;
          border-color: rgba(37, 99, 235, 0.2);
          border-top-color: var(--royal-blue, #2563EB);
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Content Grid */
        .story-content-grid {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        @media (min-width: 1024px) {
          .story-content-grid {
            display: grid;
            grid-template-columns: 1fr 320px;
            align-items: start;
          }
        }

        .story-main-column {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .intro-card-section {
          background: var(--bg-surface, #FFFFFF);
          border: 1px solid var(--border-color, #E2E8F0);
          border-radius: var(--radius-lg, 16px);
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
        }

        @media (min-width: 768px) {
          .intro-card-section {
            padding: 32px;
          }
        }

        .section-title-bar {
          margin-bottom: 20px;
          padding-bottom: 12px;
          border-bottom: 2px solid var(--border-light, #F1F5F9);
        }

        .section-title-bar.flex-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .section-title-bar h2 {
          font-size: 1.35rem;
          font-weight: 800;
          color: var(--text-primary, #0F172A);
          margin-bottom: 2px;
        }

        .sub-tag {
          font-size: 0.82rem;
          color: var(--text-muted, #64748B);
          font-weight: 600;
        }

        .read-first-link {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--royal-blue, #2563EB);
          text-decoration: none;
        }

        .read-first-link:hover {
          text-decoration: underline;
        }

        /* Synopsis Typography */
        .synopsis-content {
          font-size: 1.05rem;
          line-height: 1.85;
          color: var(--text-secondary, #334155);
        }

        .synopsis-content p {
          margin-bottom: 1.25em;
        }

        .synopsis-content p:last-child {
          margin-bottom: 0;
        }

        /* Episodes List */
        .episodes-chapter-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .chapter-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 16px 18px;
          background: var(--bg-cream, #F8FAFC);
          border: 1px solid var(--border-color, #E2E8F0);
          border-radius: var(--radius-md, 12px);
          text-decoration: none;
          color: inherit;
          transition: transform var(--transition-fast), border-color var(--transition-fast), background var(--transition-fast);
        }

        .chapter-card:hover {
          background: var(--bg-light-blue, #EFF6FF);
          border-color: var(--royal-blue, #2563EB);
          transform: translateY(-2px);
        }

        .chapter-card.is-loading {
          background: var(--bg-light-blue, #EFF6FF);
          border-color: var(--royal-blue, #2563EB);
          pointer-events: none;
        }

        .chapter-badge {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 52px;
          height: 52px;
          background: #FFFFFF;
          border: 1.5px solid var(--border-color, #E2E8F0);
          border-radius: var(--radius-md, 10px);
          flex-shrink: 0;
        }

        .badge-ep {
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-muted, #64748B);
          text-transform: uppercase;
          line-height: 1;
        }

        .badge-number {
          font-size: 1.15rem;
          font-weight: 900;
          color: var(--royal-blue, #2563EB);
          line-height: 1.1;
        }

        .chapter-info {
          flex: 1;
          min-width: 0;
        }

        .chapter-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--text-primary, #0F172A);
          line-height: 1.3;
          margin-bottom: 4px;
        }

        .chapter-summary {
          font-size: 0.85rem;
          color: var(--text-muted, #64748B);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 6px;
        }

        .chapter-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.78rem;
          color: var(--text-muted, #94A3B8);
        }

        .chapter-action {
          flex-shrink: 0;
        }

        .action-read-btn {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--royal-blue, #2563EB);
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .action-read-btn .arrow {
          transition: transform 0.2s ease;
        }

        .chapter-card:hover .action-read-btn .arrow {
          transform: translateX(4px);
        }

        .action-loading {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--royal-blue, #2563EB);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .no-episodes-box {
          text-align: center;
          padding: 40px 20px;
          color: var(--text-muted, #64748B);
        }

        .empty-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 12px;
        }

        /* Sidebar Column */
        .story-sidebar-column {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .sidebar-card {
          background: var(--bg-surface, #FFFFFF);
          border: 1px solid var(--border-color, #E2E8F0);
          border-radius: var(--radius-lg, 16px);
          padding: 20px 24px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
        }

        .sidebar-card h3 {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary, #0F172A);
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 1px solid var(--border-light, #F1F5F9);
        }

        .detail-rows {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.88rem;
        }

        .detail-label {
          color: var(--text-muted, #64748B);
          font-weight: 500;
        }

        .detail-value {
          color: var(--text-primary, #0F172A);
          font-weight: 700;
        }

        .detail-value.highlight {
          color: var(--royal-blue, #2563EB);
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .tag-chip {
          font-size: 0.8rem;
          font-weight: 600;
          background: var(--bg-cream, #F8FAFC);
          border: 1px solid var(--border-color, #E2E8F0);
          padding: 5px 12px;
          border-radius: var(--radius-full, 9999px);
          color: var(--text-secondary, #475569);
        }

        /* Author Card */
        .author-card-content {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .author-avatar-badge {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          overflow: hidden;
          background: var(--bg-light-blue, #EFF6FF);
          border: 1.5px solid var(--royal-blue, #2563EB);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .author-avatar-img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }

        .author-avatar-initial {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--royal-blue, #2563EB);
        }

        .author-card-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary, #0F172A);
        }

        .author-card-sub {
          font-size: 0.78rem;
          color: var(--text-muted, #64748B);
          margin-top: 2px;
        }

        /* Related Stories */
        .related-stories-container {
          margin-top: 48px;
        }

        .view-all-link {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--royal-blue, #2563EB);
          text-decoration: none;
        }

        .view-all-link:hover {
          text-decoration: underline;
        }

        .related-stories-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          margin-top: 16px;
        }

        @media (min-width: 640px) {
          .related-stories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .related-stories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        /* Toast */
        .toast-notification {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #0F172A;
          color: #FFFFFF;
          padding: 12px 20px;
          border-radius: var(--radius-md, 12px);
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          z-index: 9999;
          animation: toastSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes toastSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
