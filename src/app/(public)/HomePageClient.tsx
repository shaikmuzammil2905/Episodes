'use client';

import React, { useState, useMemo } from 'react';
import HeroSection from '@/components/HeroSection';
import StoryCard from '@/components/StoryCard';
import { useModal } from '@/context/ModalContext';
import type { Story, Genre } from '@/lib/types';

interface HomePageClientProps {
  stories: Story[];
  genres: Genre[];
  languageNames: string[];
  categoryNames: string[];
}

export default function HomePageClient({ stories, genres, languageNames, categoryNames }: HomePageClientProps) {
  const { openGenreModal } = useModal();
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryNames[0] || 'Novels');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All Languages');

  // Simple translations for Telugu
  const t = (text: string) => {
    if (selectedLanguage.toLowerCase() === 'telugu') {
      switch (text) {
        case 'Language': return 'భాష';
        case 'Popular Novels': return 'ప్రసిద్ధ నవలలు';
        case 'Trending Stories': return 'ట్రెండింగ్ కథలు';
        case 'Latest Novel Chapters & Stories': return 'తాజా నవల అధ్యాయాలు & కథలు';
        case 'Discover by Genre': return 'కథా రకాలు';
        case 'No popular stories found for this filter.': return 'ఈ ఫిల్టర్ కోసం ప్రసిద్ధ కథలు కనుగొనబడలేదు.';
        case 'No trending stories found for this filter.': return 'ఈ ఫిల్టర్ కోసం ట్రెండింగ్ కథలు కనుగొనబడలేదు.';
        case 'No latest stories found for this filter.': return 'ఈ ఫిల్టర్ కోసం తాజా కథలు కనుగొనబడలేదు.';
        default: return text;
      }
    }
    return text;
  };

  // Filter logic
  const filteredStories = useMemo(() => {
    let result = stories;

    // Filter by language (case-insensitive)
    if (selectedLanguage && selectedLanguage !== 'All Languages') {
      result = result.filter(s => s.language?.toLowerCase() === selectedLanguage.toLowerCase());
    }

    // Filter by category
    if (selectedCategory) {
      const cat = selectedCategory.toLowerCase();
      
      // Keep hardcoded flexible logic for special UI tabs if they exist,
      // but also add exact matching for real database categories.
      if (cat === 'short stories') {
        result = result.filter(s => s.genre?.toLowerCase().includes('short') || s.tags?.includes('Short Read'));
      } else if (cat === 'long stories') {
        result = result.filter(s => parseInt(s.readingTime || '0') > 20 || s.episodes.length > 2);
      } else if (cat === 'fun stories') {
        result = result.filter(s => s.genre?.toLowerCase().includes('comedy') || s.tags?.includes('Fun'));
      } else {
        // For real database categories (e.g., "Novels", "Fantasy", etc)
        // Check if the story's genre/category matches the selected one.
        // Fallback: exclude 'short' if no specific match logic is found and it's just a general tab.
        result = result.filter(s => 
          s.genre?.toLowerCase() === cat || 
          s.genreId?.toLowerCase() === cat ||
          !s.genre?.toLowerCase().includes('short') // fallback for 'Novels' or other general categories
        );
      }
    }

    return result;
  }, [selectedLanguage, selectedCategory, stories]);

  const popularStories = filteredStories.filter(s => s.featured);
  const trendingStories = filteredStories.filter(s => s.recommended);
  const latestStories = [...filteredStories].reverse().slice(0, 4);

  return (
    <>
      {/* ──── COMPACT STORY NAVIGATION ──── */}
      <nav className="compact-story-nav">
        <div className="container">
          <ul className="story-nav-list">
            {categoryNames.map(cat => (
              <li key={cat}>
                <button
                  className={`story-nav-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>

      {/* ──── HERO & SEARCH ──── */}
      <HeroSection />

      {/* ──── LANGUAGE FILTER ──── */}
      <section className="language-filter-section">
        <div className="container">
          <div className="language-filter-wrapper">
            <label className="language-label" htmlFor="language-select">{t('Language')}</label>
            <div className="select-wrapper">
              <select 
                id="language-select" 
                className="language-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {languageNames.map(lang => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* ──── POPULAR NOVELS ──── */}
      <section className="section bg-main pt-0">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('Popular Novels')}</h2>
          </div>
          {popularStories.length > 0 ? (
            <div className="stories-grid">
              {popularStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="empty-state">{t('No popular stories found for this filter.')}</div>
          )}
        </div>
      </section>

      {/* ──── TRENDING STORIES ──── */}
      <section className="section bg-main">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('Trending Stories')}</h2>
          </div>
          {trendingStories.length > 0 ? (
            <div className="stories-grid">
              {trendingStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="empty-state">{t('No trending stories found for this filter.')}</div>
          )}
        </div>
      </section>

      {/* ──── LATEST NOVEL CHAPTERS & STORIES ──── */}
      <section className="section bg-main">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('Latest Novel Chapters & Stories')}</h2>
          </div>
          {latestStories.length > 0 ? (
            <div className="stories-grid">
              {latestStories.map((story) => (
                <StoryCard key={story.id} story={story} />
              ))}
            </div>
          ) : (
            <div className="empty-state">{t('No latest stories found for this filter.')}</div>
          )}
        </div>
      </section>

      {/* ──── COMPACT GENRES (ADDITIONAL DISCOVERY) ──── */}
      <section id="genres" className="section genres-section bg-cream">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">{t('Discover by Genre')}</h2>
          </div>
          <div className="genre-chips-container">
            {genres.map((genre) => (
              <button
                key={genre.id}
                className="genre-chip"
                onClick={() => openGenreModal(genre)}
              >
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
                {genre.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        .section {
          padding: 40px 0;
        }

        .pt-0 {
          padding-top: 20px;
        }

        @media (min-width: 768px) {
          .section {
            padding: 60px 0;
          }
          .pt-0 {
            padding-top: 30px;
          }
        }

        .section-header {
          margin-bottom: 24px;
        }

        .section-title {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 1.8rem;
          }
        }

        /* ── Compact Navigation ── */
        .compact-story-nav {
          background: #fff;
          border-bottom: 1px solid var(--border-light);
          padding: 12px 0;
          position: sticky;
          top: 64px; /* below header */
          z-index: 90;
        }

        .story-nav-list {
          display: flex;
          list-style: none;
          gap: 16px;
          margin: 0;
          padding: 0;
          overflow-x: auto;
          white-space: nowrap;
          scrollbar-width: none; /* Firefox */
        }

        .story-nav-list::-webkit-scrollbar {
          display: none; /* Safari and Chrome */
        }

        .story-nav-btn {
          background: none;
          border: none;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-secondary);
          padding: 6px 12px;
          border-radius: var(--radius-full);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .story-nav-btn.active {
          background: var(--royal-blue);
          color: #fff;
        }

        .story-nav-btn:hover:not(.active) {
          background: var(--bg-light-blue);
          color: var(--royal-blue);
        }

        /* ── Language Filter ── */
        .language-filter-section {
          padding: 24px 0 16px;
          background: var(--bg-main);
        }

        .language-filter-wrapper {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #fff;
          padding: 8px 16px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
        }

        .language-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .select-wrapper {
          position: relative;
        }

        .language-select {
          appearance: none;
          background: transparent;
          border: none;
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          padding-right: 24px;
          cursor: pointer;
          outline: none;
        }

        .select-wrapper::after {
          content: '▼';
          font-size: 0.6rem;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-primary);
          pointer-events: none;
        }

        /* ── Stories Grid ── */
        .stories-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .stories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stories-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }
        }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          background: #fff;
          border-radius: var(--radius-md);
          border: 1px dashed var(--border-color);
          color: var(--text-muted);
          font-size: 0.95rem;
        }

        /* ── Compact Genres (Chips) ── */
        .genres-section {
          background: var(--bg-cream);
        }

        .genre-chips-container {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .genre-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #fff;
          border: 1px solid var(--border-color);
          padding: 8px 16px;
          border-radius: var(--radius-full);
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--text-primary);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .genre-chip:hover {
          background: var(--bg-light-blue);
          border-color: var(--royal-blue);
          color: var(--royal-blue);
        }

        .genre-emoji {
          font-size: 1.1rem;
        }
      `}</style>
    </>
  );
}
