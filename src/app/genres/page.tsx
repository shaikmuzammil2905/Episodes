'use client';

import React from 'react';
import Link from 'next/link';
import { GENRES, STORIES } from '@/lib/data';
import { useModal } from '@/context/ModalContext';

export default function GenresPage() {
  const { openGenreModal } = useModal();

  return (
    <div className="genres-page">
      <div className="container">
        <div className="page-header">
          <h1>Browse All Genres</h1>
          <p>Explore story categories, discover subgenres, and find your next favorite read.</p>
        </div>

        <div className="genres-standalone-grid">
          {GENRES.map((genre) => {
            const count = STORIES.filter(
              (s) => s.genreId === genre.slug || s.language.toLowerCase() === genre.slug
            ).length;

            return (
              <div
                key={genre.id}
                className="genre-card-large"
                onClick={() => openGenreModal(genre)}
              >
                <div className="genre-icon-box">
                  <span className="genre-emoji">
                    {genre.iconName === 'Sparkles' && '✨'}
                    {genre.iconName === 'Heart' && '❤️'}
                    {genre.iconName === 'Compass' && '🧭'}
                    {genre.iconName === 'Zap' && '⚡'}
                    {genre.iconName === 'Cpu' && '🤖'}
                    {genre.iconName === 'Ghost' && '👻'}
                    {genre.iconName === 'Map' && '🗺️'}
                    {genre.iconName === 'BookOpen' && '📖'}
                    {genre.iconName === 'Globe' && '🌍'}
                    {genre.iconName === 'Feather' && '🪶'}
                    {genre.iconName === 'Clock' && '⏱️'}
                  </span>
                </div>
                <div className="genre-info">
                  <h2>{genre.name}</h2>
                  <p>{genre.description}</p>
                  <div className="genre-footer-row">
                    <span className="count-tag">{count} {count === 1 ? 'Story' : 'Stories'}</span>
                    <span className="click-popup-hint">Click for Info Popup ✨</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style jsx>{`
        .genres-page {
          padding: 40px 0 60px;
          background: var(--bg-cream);
          min-height: 80vh;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .page-header h1 {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        .page-header p {
          font-size: 1.05rem;
          color: var(--text-secondary);
        }

        .genres-standalone-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 640px) {
          .genres-standalone-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .genres-standalone-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .genre-card-large {
          background: #fff;
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          gap: 16px;
          align-items: flex-start;
          cursor: pointer;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
        }

        .genre-card-large:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--royal-blue);
        }

        .genre-icon-box {
          width: 52px;
          height: 52px;
          background: var(--bg-light-blue);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.8rem;
          flex-shrink: 0;
        }

        .genre-info h2 {
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .genre-info p {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.5;
          margin-bottom: 12px;
        }

        .genre-footer-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
        }

        .count-tag {
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--royal-blue);
          background: var(--bg-light-blue);
          padding: 4px 10px;
          border-radius: var(--radius-full);
        }

        .click-popup-hint {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--accent-gold);
        }
      `}</style>
    </div>
  );
}
