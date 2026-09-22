'use client';

import React from 'react';
import Image from 'next/image';
import { Story } from '@/lib/types';
import { useModal } from '@/context/ModalContext';

interface StoryCardProps {
  story: Story;
}

export default function StoryCard({ story }: StoryCardProps) {
  const { openStoryModal } = useModal();

  return (
    <div className="story-card" onClick={() => openStoryModal(story)}>
      <div className="cover-wrapper">
        <Image
          src={story.coverImage}
          alt={story.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="cover-image"
        />
        <div className="badges-wrapper">
          <span className={`badge ${story.isPremium ? 'badge-premium' : 'badge-free'}`}>
            {story.isPremium ? 'Premium' : 'Free'}
          </span>
          <span className="badge badge-genre">{story.genre}</span>
        </div>
      </div>

      <div className="card-content">
        <div className="card-header">
          <h3 className="story-title">{story.title}</h3>
          <p className="author-name">By {story.author}</p>
        </div>

        <p className="story-description">{story.shortDescription}</p>

        <div className="card-footer">
          <span className="episode-tag">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
            </svg>
            {story.episodes.length} {story.episodes.length === 1 ? 'Episode' : 'Episodes'}
          </span>
          <span className="read-btn">
            Read Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </span>
        </div>
      </div>

      <style jsx>{`
        .story-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: transform var(--transition-fast), border-color var(--transition-fast);
        }

        .story-card:hover {
          transform: translateY(-4px);
          border-color: var(--royal-blue);
        }

        .cover-wrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9;
          overflow: hidden;
          background: #E2E8F0;
        }

        .cover-image {
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .story-card:hover .cover-image {
          transform: scale(1.05);
        }

        .badges-wrapper {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 6px;
          z-index: 2;
        }

        .card-content {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 10px;
        }

        .story-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--text-primary);
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .author-name {
          font-size: 0.82rem;
          color: var(--text-muted);
          font-weight: 500;
          margin-top: 2px;
        }

        .story-description {
          font-size: 0.86rem;
          color: var(--text-secondary);
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }

        .card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 10px;
          border-top: 1px solid var(--border-light);
          margin-top: 4px;
        }

        .episode-tag {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--text-muted);
        }

        .read-btn {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--royal-blue);
        }

        .story-card:hover .read-btn svg {
          transform: translateX(3px);
          transition: transform 0.2s ease;
        }
      `}</style>
    </div>
  );
}
