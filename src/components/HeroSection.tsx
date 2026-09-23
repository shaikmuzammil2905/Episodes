'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { searchStories } from '@/lib/data';
import { useModal } from '@/context/ModalContext';
import { useLanguage } from '@/context/LanguageContext';

export default function HeroSection() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const { openStoryModal } = useModal();
  const { t } = useLanguage();

  const results = searchQuery.trim() ? searchStories(searchQuery).slice(0, 5) : [];

  return (
    <section className="hero-section">
      {/* Desktop Hero BG */}
      <div className="hero-bg hero-desktop" />
      {/* Mobile Hero BG */}
      <div className="hero-bg hero-mobile" />

      <div className="hero-overlay" />

      <div className="container hero-content">
        <div className="hero-text-wrapper">
          <h1 className="hero-headline">
            {t('discoverAmazingStories')}
            <br />
            <span className="hero-highlight">{t('oneEpisodeAtATime')}</span>
          </h1>
          <p className="hero-sub">
            {t('heroSub')}
          </p>

          {/* Search Bar */}
          <div className="search-wrapper">
            <div className="search-box">
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowResults(true); }}
                onFocus={() => setShowResults(true)}
                onBlur={() => setTimeout(() => setShowResults(false), 200)}
                className="search-input"
                aria-label={t('search')}
              />
            </div>

            {showResults && results.length > 0 && (
              <div className="search-results">
                {results.map((s) => (
                  <button
                    key={s.id}
                    className="search-result-item"
                    onMouseDown={() => {
                      openStoryModal(s);
                      setSearchQuery('');
                      setShowResults(false);
                    }}
                  >
                    <div className="sr-title">{s.title}</div>
                    <div className="sr-meta">{s.genre} • {s.author}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="hero-cta-group">
            <Link href="/stories" className="btn-primary hero-cta">
              {t('explore')}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
            <Link href="/#genres" className="btn-secondary hero-cta">
              {t('browseGenres')}
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: 520px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }

        @media (min-width: 768px) {
          .hero-section {
            min-height: 600px;
          }
        }

        .hero-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(1.05);
        }

        .hero-desktop {
          background-image: url('/assets/hero-desktop.png');
          display: none;
        }

        .hero-mobile {
          background-image: url('/assets/hero-mobile.png');
          display: block;
        }

        @media (min-width: 768px) {
          .hero-desktop {
            display: block;
          }
          .hero-mobile {
            display: none;
          }
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(15, 23, 42, 0.82) 0%,
            rgba(15, 23, 42, 0.55) 60%,
            rgba(15, 23, 42, 0.35) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          padding-top: 40px;
          padding-bottom: 40px;
        }

        .hero-text-wrapper {
          max-width: 620px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .hero-headline {
          font-family: var(--font-serif);
          font-size: 2.1rem;
          font-weight: 700;
          color: #fff;
          line-height: 1.2;
          letter-spacing: -0.02em;
        }

        .hero-highlight {
          color: var(--accent-gold);
        }

        @media (min-width: 768px) {
          .hero-headline {
            font-size: 3rem;
          }
        }

        @media (min-width: 1024px) {
          .hero-headline {
            font-size: 3.5rem;
          }
        }

        .hero-sub {
          font-size: 1.05rem;
          color: #CBD5E1;
          line-height: 1.6;
          max-width: 480px;
        }

        .search-wrapper {
          position: relative;
          max-width: 480px;
        }

        .search-box {
          display: flex;
          align-items: center;
          background: rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: var(--radius-md);
          padding: 12px 16px;
          transition: var(--transition-fast);
        }

        .search-box:focus-within {
          background: rgba(255, 255, 255, 0.2);
          border-color: var(--accent-gold);
        }

        .search-icon {
          color: #94A3B8;
          flex-shrink: 0;
        }

        .search-input {
          background: transparent;
          border: none;
          outline: none;
          font-family: inherit;
          font-size: 0.95rem;
          color: #fff;
          width: 100%;
          padding-left: 10px;
        }

        .search-input::placeholder {
          color: #94A3B8;
        }

        .search-results {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: #fff;
          border-radius: var(--radius-md);
          border: 1px solid var(--border-color);
          z-index: 30;
          margin-top: 8px;
          overflow: hidden;
        }

        .search-result-item {
          width: 100%;
          text-align: left;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border-light);
          transition: var(--transition-fast);
          display: block;
        }

        .search-result-item:hover {
          background: var(--bg-light-blue);
        }

        .search-result-item:last-child {
          border-bottom: none;
        }

        .sr-title {
          font-size: 0.92rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .sr-meta {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .hero-cta-group {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .hero-cta {
          padding: 14px 28px;
          font-size: 1rem;
        }
      `}</style>
    </section>
  );
}
