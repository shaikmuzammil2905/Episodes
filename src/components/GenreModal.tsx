'use client';

import React from 'react';
import Link from 'next/link';
import { useModal } from '@/context/ModalContext';
import { getStoriesByGenre } from '@/lib/data';
import { useLanguage } from '@/context/LanguageContext';

export default function GenreModal() {
  const { selectedGenre, isGenreModalOpen, closeGenreModal, openStoryModal } = useModal();
  const { t } = useLanguage();

  if (!isGenreModalOpen || !selectedGenre) return null;

  const genreStories = getStoriesByGenre(selectedGenre.slug);

  const getEmoji = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return '✨';
      case 'Heart': return '❤️';
      case 'Compass': return '🧭';
      case 'Zap': return '⚡';
      case 'Cpu': return '🤖';
      case 'Ghost': return '👻';
      case 'Map': return '🗺️';
      case 'BookOpen': return '📖';
      case 'Globe': return '🌍';
      case 'Feather': return '🪶';
      case 'Clock': return '⏱️';
      default: return '📚';
    }
  };

  return (
    <div className="modal-overlay" onClick={closeGenreModal}>
      <div className="modal-container genre-modal-box" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="modal-close-btn" onClick={closeGenreModal} aria-label="Close modal">
          ✕
        </button>

        <div className="genre-modal-header">
          <div className="genre-modal-icon-badge">
            <span>{getEmoji(selectedGenre.iconName)}</span>
          </div>
          <div>
            <span className="genre-pill-tag">Category Overview</span>
            <h2 className="genre-modal-title">{t(selectedGenre.name.toLowerCase().replace(' ', '')) || selectedGenre.name}</h2>
          </div>
        </div>

        <p className="genre-modal-description">{selectedGenre.description}</p>

        <div className="genre-stats-row">
          <div className="genre-stat-item">
            <span className="stat-number">{genreStories.length}</span>
            <span className="stat-label">Stories Available</span>
          </div>
          <div className="genre-stat-item">
            <span className="stat-number">
              {genreStories.reduce((acc, s) => acc + s.episodes.length, 0)}
            </span>
            <span className="stat-label">Total {t('episodes')}</span>
          </div>
          <div className="genre-stat-item">
            <span className="stat-number">Free & Premium</span>
            <span className="stat-label">Access Level</span>
          </div>
        </div>

        {/* Featured Stories in this Genre */}
        <div className="genre-modal-stories-section">
          <h3>Popular in {t(selectedGenre.name.toLowerCase().replace(' ', '')) || selectedGenre.name}</h3>
          {genreStories.length > 0 ? (
            <div className="genre-stories-mini-list">
              {genreStories.map((story) => (
                <div
                  key={story.id}
                  className="genre-mini-card"
                  onClick={() => {
                    closeGenreModal();
                    openStoryModal(story);
                  }}
                >
                  <div className="mini-card-text">
                    <h4>{story.title}</h4>
                    <p>{t('by')} {story.author} • {story.episodes.length} {t('episodes')}</p>
                  </div>
                  <span className="mini-read-btn">→</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-stories-text">{t('noStories')}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="genre-modal-actions">
          <Link
            href={`/stories?genre=${selectedGenre.slug}`}
            className="btn-primary full-width-btn"
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeGenreModal}
          >
            Browse All {t(selectedGenre.name.toLowerCase().replace(' ', '')) || selectedGenre.name} Stories in New Page ↗
          </Link>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.7);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
          animation: fadeIn 0.2s ease-out;
        }

        .genre-modal-box {
          background: #fff;
          border-radius: var(--radius-lg);
          max-width: 580px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
          padding: 28px;
          border: 1px solid var(--border-color);
          animation: modalSlideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .modal-close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: var(--bg-cream);
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          font-size: 1.1rem;
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .modal-close-btn:hover {
          background: var(--border-color);
          color: var(--text-primary);
        }

        .genre-modal-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 16px;
        }

        .genre-modal-icon-badge {
          width: 56px;
          height: 56px;
          background: var(--bg-light-blue);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          flex-shrink: 0;
        }

        .genre-pill-tag {
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          color: var(--royal-blue);
          letter-spacing: 0.05em;
        }

        .genre-modal-title {
          font-family: var(--font-serif);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .genre-modal-description {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.6;
          margin-bottom: 20px;
        }

        .genre-stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 12px;
          background: var(--bg-cream);
          border-radius: var(--radius-md);
          padding: 14px;
          text-align: center;
          margin-bottom: 24px;
        }

        .stat-number {
          display: block;
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--royal-blue);
        }

        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 600;
        }

        .genre-modal-stories-section {
          margin-bottom: 24px;
        }

        .genre-modal-stories-section h3 {
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 12px;
          color: var(--text-primary);
        }

        .genre-stories-mini-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .genre-mini-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .genre-mini-card:hover {
          border-color: var(--royal-blue);
          background: var(--bg-light-blue);
        }

        .mini-card-text h4 {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .mini-card-text p {
          font-size: 0.78rem;
          color: var(--text-muted);
        }

        .mini-read-btn {
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--royal-blue);
        }

        .full-width-btn {
          width: 100%;
          text-align: center;
          justify-content: center;
          padding: 14px;
          font-size: 0.95rem;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
