'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Episode, Story } from '@/lib/types';
import { useModal } from '@/context/ModalContext';
import { getRelatedStories } from '@/lib/data';
import StoryCard from './StoryCard';

export default function StoryModal() {
  const { activeStory, closeStoryModal } = useModal();
  const [liveRelated, setLiveRelated] = useState<Story[]>([]);

  useEffect(() => {
    if (!activeStory) return;
    let isMounted = true;
    fetch('/api/public-stories')
      .then(res => res.json())
      .then((data: Story[]) => {
        if (isMounted && Array.isArray(data)) {
          const related = data
            .filter(s => s.id !== activeStory.id && (s.genreId === activeStory.genreId || s.language === activeStory.language || s.categorySlug === activeStory.categorySlug))
            .slice(0, 3);
          setLiveRelated(related);
        }
      })
      .catch(() => {});
    return () => { isMounted = false; };
  }, [activeStory]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeStoryModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeStoryModal]);

  if (!activeStory) return null;

  const episodes = activeStory.episodes || [];
  const relatedStories = liveRelated.length > 0 ? liveRelated : getRelatedStories(activeStory.id, 2);
  const firstEpisode = episodes[0];

  return (
    <div className="modal-backdrop" onClick={closeStoryModal}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button Header */}
        <button className="close-btn" onClick={closeStoryModal} aria-label="Close Story Popup">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-scroll-content">
          {/* Header Banner & Artwork */}
          <div className="story-hero-banner">
            <div className="cover-img-box">
              <Image
                src={activeStory.coverImage}
                alt={activeStory.title}
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div className="story-meta-header">
              <div className="meta-badges">
                <span className={`badge ${activeStory.isPremium ? 'badge-premium' : 'badge-free'}`}>
                  {activeStory.isPremium ? 'Premium' : 'Free Story'}
                </span>
                <span className="badge badge-genre">{activeStory.genre}</span>
                <span className="badge-lang">{activeStory.language}</span>
              </div>
              <h2 className="modal-title">{activeStory.title}</h2>
              <div className="author-row">
                <span className="by-txt">Written by</span>
                <span className="author-name">{activeStory.author}</span>
              </div>
              <div className="stats-pills">
                <span className="stat-pill">
                  📖 {episodes.length} Episodes
                </span>
                {activeStory.readingTime && (
                  <span className="stat-pill">⏱️ {activeStory.readingTime}</span>
                )}
                <span className="stat-pill">⚡ {activeStory.status}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="action-bar">
            {firstEpisode ? (
              <Link
                href={`/reader/${activeStory.id}/${firstEpisode.id}`}
                className="btn-primary start-reading-btn"
                onClick={closeStoryModal}
              >
                <span>Start Reading (Episode 1)</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            ) : (
              <button className="btn-primary start-reading-btn" disabled>
                No Episodes Available
              </button>
            )}
          </div>

          {/* Story Details Sections */}
          <div className="story-body-grid">
            <div className="main-info">
              <div className="story-details-row">
                <section className="info-block">
                  <h3>Synopsis</h3>
                  <div className="description-text">
                    {(activeStory.fullDescription || '').split(/\n+/).filter(Boolean).map((p, idx) => (
                      <p key={idx}>{p}</p>
                    ))}
                  </div>
                </section>

                {activeStory.whyRead && (
                  <section className="info-block why-read-box">
                    <h4>💡 Why Read This Story?</h4>
                    <div className="description-text">
                      {activeStory.whyRead.split(/\n+/).filter(Boolean).map((p, idx) => (
                        <p key={idx}>{p}</p>
                      ))}
                    </div>
                  </section>
                )}
              </div>

              {/* Episode List Section */}
              <section className="info-block episode-list-block">
                <div className="episodes-header">
                  <h3>Episode List</h3>
                  <span className="count-sub">{episodes.length} Chapters Published</span>
                </div>

                <div className="episodes-grid">
                  {episodes.map((ep: Episode) => (
                    <Link
                      key={ep.id}
                      href={`/reader/${activeStory.id}/${ep.id}`}
                      className="episode-item"
                      onClick={closeStoryModal}
                    >
                      <div className="ep-num">Ep {ep.episodeNumber}</div>
                      <div className="ep-info">
                        <div className="ep-title">{ep.title}</div>
                        <div className="ep-summary">{ep.summary}</div>
                      </div>
                      <div className="ep-action">
                        <span className="read-icon">Read →</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            </div>

            {/* Sidebar Details */}
            <div className="sidebar-info">
              <div className="tags-card">
                <h4>Story Tags</h4>
                <div className="tags-cloud">
                  {(activeStory.tags || []).map((tag: string) => (
                    <span key={tag} className="tag-chip">#{tag}</span>
                  ))}
                </div>
              </div>

              {/* related stories moved to bottom */}
            </div>
          </div>
          
          {/* Related Stories Horizontal Scroll */}
          {relatedStories.length > 0 && (
            <div className="related-stories-section">
              <h3>Related Stories</h3>
              <div className="related-scroll-container">
                {relatedStories.map((rel) => (
                  <div key={rel.id} className="related-card-wrapper">
                    <StoryCard story={rel} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .modal-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(6px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-container {
          position: relative;
          background: var(--bg-surface);
          width: 100%;
          max-width: 1100px;
          max-height: 90vh;
          border-radius: var(--radius-lg);
          border: 1px solid var(--border-color);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          z-index: 20;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(4px);
          border: 1px solid var(--border-color);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-primary);
          transition: var(--transition-fast);
        }

        .close-btn:hover {
          background: var(--primary);
          color: #fff;
          transform: rotate(90deg);
        }

        .modal-scroll-content {
          overflow-y: auto;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .story-hero-banner {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        @media (min-width: 640px) {
          .story-hero-banner {
            flex-direction: row;
            align-items: flex-start;
          }
        }

        .cover-img-box {
          position: relative;
          width: 100%;
          max-width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: var(--radius-md);
          overflow: hidden;
          flex-shrink: 0;
          margin: 0 auto;
        }

        @media (min-width: 640px) {
          .cover-img-box {
            max-width: 220px;
            aspect-ratio: 3 / 4;
            margin: 0;
            border: 1px solid var(--border-color);
          }
        }

        .story-meta-header {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
        }

        .meta-badges {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 8px;
        }

        .badge-lang {
          font-size: 0.75rem;
          font-weight: 700;
          background: var(--bg-main);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }

        .modal-title {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--text-primary);
          line-height: 1.15;
        }

        @media (min-width: 640px) {
          .modal-title {
            font-size: 2rem;
          }
        }

        .author-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.95rem;
        }

        .by-txt {
          color: var(--text-muted);
        }

        .author-name {
          font-weight: 700;
          color: var(--royal-blue);
        }

        .stats-pills {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 4px;
        }

        .stat-pill {
          font-size: 0.82rem;
          font-weight: 600;
          background: var(--bg-light-blue);
          color: var(--royal-blue);
          padding: 6px 12px;
          border-radius: var(--radius-md);
        }

        .action-bar {
          display: flex;
          gap: 12px;
        }

        .start-reading-btn {
          width: 100%;
          padding: 14px 28px;
          font-size: 1.05rem;
        }

        .story-body-grid {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        @media (min-width: 1024px) {
          .story-body-grid {
            display: grid;
            grid-template-columns: 1fr 300px;
          }
        }

        .info-block {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 20px;
        }

        .info-block h3 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .description-text {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-secondary);
        }
        .description-text p {
          margin-bottom: 1.25rem;
        }
        .description-text p:last-child {
          margin-bottom: 0;
        }
        
        .story-details-row {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        @media (min-width: 768px) {
          .story-details-row {
            flex-direction: row;
            align-items: stretch;
          }
          .story-details-row > .info-block {
            flex: 1;
            margin-bottom: 0;
            display: flex;
            flex-direction: column;
          }
        }

        .why-read-box {
          background: var(--bg-cream);
          border: 1px solid var(--accent-gold-light);
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .why-read-box h4 {
          color: var(--text-gold);
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .episodes-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 2px solid var(--border-light);
          padding-bottom: 8px;
        }

        .count-sub {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .episodes-grid {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .episode-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px;
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          transition: var(--transition-fast);
        }

        .episode-item:hover {
          background: var(--bg-light-blue);
          border-color: var(--royal-blue);
        }

        .ep-num {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--royal-blue);
          background: #fff;
          padding: 6px 10px;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-color);
          white-space: nowrap;
        }

        .ep-info {
          flex: 1;
        }

        .ep-title {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .ep-summary {
          font-size: 0.8rem;
          color: var(--text-muted);
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-top: 2px;
        }

        .ep-action {
          font-size: 0.85rem;
          font-weight: 700;
          color: var(--royal-blue);
        }

        .sidebar-info {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .tags-card, .related-card {
          background: var(--bg-main);
          border: 1px solid var(--border-color);
          padding: 16px;
          border-radius: var(--radius-md);
        }

        .tags-card h4, .related-card h4 {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 12px;
        }

        .tags-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .tag-chip {
          font-size: 0.78rem;
          font-weight: 600;
          background: #fff;
          border: 1px solid var(--border-color);
          padding: 4px 10px;
          border-radius: var(--radius-full);
          color: var(--text-secondary);
        }

        .related-mini-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .related-item {
          padding: 8px 10px;
          background: #fff;
          border-radius: var(--radius-sm);
          border: 1px solid var(--border-light);
          cursor: pointer;
        }

        .rel-title {
          font-size: 0.85rem;
          font-weight: 700;
        }

        .rel-meta {
          font-size: 0.75rem;
          color: var(--text-muted);
        }
        
        .related-stories-section {
          margin-top: 16px;
          border-top: 1px solid var(--border-light);
          padding-top: 24px;
        }
        
        .related-stories-section h3 {
          font-size: 1.25rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: var(--text-primary);
        }
        
        .related-scroll-container {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-snap-type: x proximity;
          padding-bottom: 16px;
          scrollbar-width: none;
        }
        
        .related-scroll-container::-webkit-scrollbar {
          display: none;
        }
        
        .related-card-wrapper {
          flex: 0 0 280px;
          scroll-snap-align: start;
        }
        
        .related-card-wrapper :global(.scroll-observer-wrapper) {
          height: 100%;
        }
        
        @media (max-width: 639px) {
          .related-card-wrapper {
            flex: 0 0 85%;
          }
        }

        /* Mobile full-screen reading style sheet */
        @media (max-width: 639px) {
          .modal-backdrop {
            padding: 0;
          }
          .modal-container {
            max-width: 100vw;
            max-height: 100vh;
            height: 100vh;
            border-radius: 0;
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
