'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import StoryCard from '@/components/StoryCard';
import { Story, Genre } from '@/lib/types';
import { matchesLanguage, matchesSearch, isTelugu } from '@/lib/normalization';

interface StoriesContentProps {
  initialStories?: Story[];
  initialGenres?: Genre[];
  forceDbData?: boolean;
  title?: string;
  description?: string;
  initialLanguage?: string;
}

export default function StoriesContent({
  initialStories = [],
  initialGenres = [],
  title,
  description,
  initialLanguage = '',
}: StoriesContentProps) {
  const allStories: Story[] = initialStories || [];
  const genresList: Genre[] = initialGenres || [];

  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre') || '';
  const langQueryParam = searchParams.get('lang') || searchParams.get('language') || '';
  const qParam = searchParams.get('q') || searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(qParam);
  const [activeGenre, setActiveGenre] = useState(genreParam);
  const [selectedLanguage, setSelectedLanguage] = useState(langQueryParam || initialLanguage || 'All Languages');
  const [statusFilter, setStatusFilter] = useState('');

  // Sync state if URL query params change
  useEffect(() => {
    if (genreParam) setActiveGenre(genreParam);
    if (langQueryParam) setSelectedLanguage(langQueryParam);
    if (qParam) setSearchQuery(qParam);
  }, [genreParam, langQueryParam, qParam]);

  // Derive unique languages present in stories or default list
  const availableLanguages = useMemo(() => {
    const list = new Set<string>(['All Languages', 'English', 'Telugu']);
    allStories.forEach(s => {
      if (s.language) list.add(s.language);
    });
    return Array.from(list);
  }, [allStories]);

  const filteredStories = useMemo(() => {
    let result = allStories;

    // Filter by language
    if (selectedLanguage && selectedLanguage !== 'All Languages') {
      result = result.filter(
        (s: Story) =>
          matchesLanguage(s.language, selectedLanguage) ||
          (s.languageCode && matchesLanguage(s.languageCode, selectedLanguage))
      );
    }

    // Filter by genre
    if (activeGenre) {
      const gLower = activeGenre.toLowerCase();
      result = result.filter(
        (s: Story) =>
          s.genreId?.toLowerCase() === gLower ||
          s.genre?.toLowerCase() === gLower ||
          (gLower === 'telugu' && isTelugu(s)) ||
          s.language?.toLowerCase().replace(/\s+/g, '-') === gLower ||
          s.language?.toLowerCase() === gLower
      );
    }

    // Filter by access status (free / premium)
    if (statusFilter) {
      if (statusFilter === 'free') result = result.filter((s: Story) => !s.isPremium);
      if (statusFilter === 'premium') result = result.filter((s: Story) => s.isPremium);
    }

    // Filter by search query (intelligent multi-token search)
    if (searchQuery.trim()) {
      result = result.filter((s: Story) => matchesSearch(s, searchQuery));
    }

    return result;
  }, [allStories, selectedLanguage, activeGenre, statusFilter, searchQuery]);

  return (
    <div className="stories-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>{title || 'All Stories'}</h1>
          <p>{description || 'Browse our complete library of stories. Click any story to see details and start reading.'}</p>
        </div>

        {/* Search + Filters */}
        <div className="filters-bar">
          <div className="search-filter-box">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search stories, novels, authors, Telugu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-search-input"
              aria-label="Search stories"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="clear-search-btn"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          <div className="secondary-filters-row">
            {/* Language Dropdown */}
            <div className="filter-dropdown-wrapper">
              <label htmlFor="filter-lang-select" className="filter-dropdown-label">Language:</label>
              <select
                id="filter-lang-select"
                className="filter-select"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>

            {/* Access Status Pills */}
            <div className="status-pills">
              <button
                type="button"
                className={`status-pill ${!statusFilter ? 'active' : ''}`}
                onClick={() => setStatusFilter('')}
              >
                All
              </button>
              <button
                type="button"
                className={`status-pill ${statusFilter === 'free' ? 'active' : ''}`}
                onClick={() => setStatusFilter('free')}
              >
                Free
              </button>
              <button
                type="button"
                className={`status-pill ${statusFilter === 'premium' ? 'active' : ''}`}
                onClick={() => setStatusFilter('premium')}
              >
                Premium
              </button>
            </div>
          </div>

          {/* Genre Chips */}
          {genresList.length > 0 && (
            <div className="filter-chips-row">
              <button
                type="button"
                className={`filter-chip ${!activeGenre ? 'active' : ''}`}
                onClick={() => setActiveGenre('')}
              >
                All Genres
              </button>
              {genresList.slice(0, 8).map((g: Genre) => (
                <button
                  key={g.id}
                  type="button"
                  className={`filter-chip ${activeGenre === g.slug ? 'active' : ''}`}
                  onClick={() => setActiveGenre(activeGenre === g.slug ? '' : g.slug)}
                >
                  {g.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="results-info">
          <span>{filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found</span>
          {(searchQuery || activeGenre || (selectedLanguage && selectedLanguage !== 'All Languages') || statusFilter) && (
            <button
              type="button"
              className="reset-filters-btn"
              onClick={() => {
                setSearchQuery('');
                setActiveGenre('');
                setSelectedLanguage('All Languages');
                setStatusFilter('');
              }}
            >
              Reset Filters
            </button>
          )}
        </div>

        {filteredStories.length > 0 ? (
          <div className="stories-grid">
            {filteredStories.map((story: Story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>No stories found</h3>
            <p>Try adjusting your search query or selecting a different language or genre.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .stories-page {
          padding: 32px 0 60px;
        }

        .page-header {
          margin-bottom: 32px;
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

        .filters-bar {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .search-filter-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 10px 16px;
          transition: border-color var(--transition-fast);
        }

        .search-filter-box:focus-within {
          border-color: var(--royal-blue);
          box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.08);
        }

        .search-filter-box svg {
          color: var(--text-muted);
          flex-shrink: 0;
        }

        .filter-search-input {
          border: none;
          outline: none;
          background: transparent;
          font-size: 0.95rem;
          color: var(--text-primary);
          width: 100%;
        }

        .clear-search-btn {
          background: none;
          border: none;
          color: var(--text-muted);
          font-size: 0.85rem;
          cursor: pointer;
          padding: 4px;
        }

        .secondary-filters-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .filter-dropdown-wrapper {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .filter-dropdown-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .filter-select {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-sm);
          padding: 6px 12px;
          font-size: 0.88rem;
          color: var(--text-primary);
          outline: none;
          cursor: pointer;
          transition: border-color var(--transition-fast);
        }

        .filter-select:focus {
          border-color: var(--royal-blue);
        }

        .filter-chips-row {
          display: flex;
          gap: 8px;
          overflow-x: auto;
          padding-bottom: 4px;
          scrollbar-width: none;
        }

        .filter-chips-row::-webkit-scrollbar {
          display: none;
        }

        .filter-chip {
          padding: 6px 14px;
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          font-weight: 600;
          white-space: nowrap;
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .filter-chip:hover {
          border-color: var(--royal-blue);
          color: var(--royal-blue);
        }

        .filter-chip.active {
          background: var(--royal-blue);
          border-color: var(--royal-blue);
          color: #fff;
        }

        .status-pills {
          display: flex;
          gap: 6px;
        }

        .status-pill {
          padding: 5px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 600;
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .status-pill:hover {
          border-color: var(--text-secondary);
          color: var(--text-secondary);
        }

        .status-pill.active {
          background: var(--primary);
          border-color: var(--primary);
          color: #fff;
        }

        .results-info {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.88rem;
          color: var(--text-muted);
          margin-bottom: 20px;
        }

        .reset-filters-btn {
          background: none;
          border: none;
          color: var(--royal-blue);
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          text-decoration: underline;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
        }

        @media (min-width: 640px) {
          .stories-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .stories-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .empty-state {
          text-align: center;
          padding: 60px 20px;
          background: var(--bg-surface);
          border: 1px dashed var(--border-color);
          border-radius: var(--radius-lg);
          margin-top: 20px;
        }

        .empty-icon {
          font-size: 2.5rem;
          margin-bottom: 12px;
        }

        .empty-state h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .empty-state p {
          font-size: 0.95rem;
          color: var(--text-muted);
        }
      `}</style>
    </div>
  );
}
