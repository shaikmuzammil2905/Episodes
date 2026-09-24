'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import StoryCard from '@/components/StoryCard';
import { Story, Genre } from '@/lib/types';
import { STORIES, GENRES } from '@/lib/data';

interface StoriesContentProps {
  initialStories?: Story[];
  initialGenres?: Genre[];
}

export default function StoriesContent({ initialStories, initialGenres }: StoriesContentProps) {
  const allStories: Story[] = (initialStories && initialStories.length > 0) ? initialStories : STORIES;
  const genresList: Genre[] = (initialGenres && initialGenres.length > 0) ? initialGenres : GENRES;

  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre') || '';
  const [searchQuery, setSearchQuery] = useState('');
  const [activeGenre, setActiveGenre] = useState(genreParam);
  const [statusFilter, setStatusFilter] = useState('');

  const filteredStories = useMemo(() => {
    let result = allStories;
    if (activeGenre) {
      result = result.filter(
        (s: Story) =>
          s.genreId?.toLowerCase() === activeGenre.toLowerCase() ||
          s.language?.toLowerCase().replace(/\s+/g, '-') === activeGenre.toLowerCase() ||
          s.language?.toLowerCase() === activeGenre.toLowerCase()
      );
    }
    if (statusFilter) {
      if (statusFilter === 'free') result = result.filter((s: Story) => !s.isPremium);
      if (statusFilter === 'premium') result = result.filter((s: Story) => s.isPremium);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s: Story) =>
          s.title.toLowerCase().includes(q) ||
          s.author.toLowerCase().includes(q) ||
          s.genre.toLowerCase().includes(q) ||
          (s.tags || []).some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [allStories, activeGenre, statusFilter, searchQuery]);

  return (
    <div className="stories-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>All Stories</h1>
          <p>Browse our complete library of stories. Click any story to see details and start reading.</p>
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
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="filter-search-input"
              aria-label="Search stories"
            />
          </div>

          <div className="filter-chips-row">
            <button
              className={`filter-chip ${!activeGenre ? 'active' : ''}`}
              onClick={() => setActiveGenre('')}
            >
              All
            </button>
            {genresList.slice(0, 8).map((g: Genre) => (
              <button
                key={g.id}
                className={`filter-chip ${activeGenre === g.slug ? 'active' : ''}`}
                onClick={() => setActiveGenre(activeGenre === g.slug ? '' : g.slug)}
              >
                {g.name}
              </button>
            ))}
          </div>

          <div className="status-pills">
            <button className={`status-pill ${!statusFilter ? 'active' : ''}`} onClick={() => setStatusFilter('')}>All</button>
            <button className={`status-pill ${statusFilter === 'free' ? 'active' : ''}`} onClick={() => setStatusFilter('free')}>Free</button>
            <button className={`status-pill ${statusFilter === 'premium' ? 'active' : ''}`} onClick={() => setStatusFilter('premium')}>Premium</button>
          </div>
        </div>

        {/* Results */}
        <div className="results-info">
          <span>{filteredStories.length} {filteredStories.length === 1 ? 'story' : 'stories'} found</span>
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
            <p>Try adjusting your filters or search query.</p>
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
          padding: 10px 14px;
        }

        .search-filter-box:focus-within {
          border-color: var(--royal-blue);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .filter-search-input {
          border: none;
          outline: none;
          background: transparent;
          font-family: inherit;
          font-size: 0.95rem;
          color: var(--text-primary);
          width: 100%;
        }

        .filter-chips-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .filter-chip {
          font-size: 0.82rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-secondary);
          transition: var(--transition-fast);
          white-space: nowrap;
        }

        .filter-chip:hover, .filter-chip.active {
          background: var(--royal-blue);
          color: #fff;
          border-color: var(--royal-blue);
        }

        .status-pills {
          display: flex;
          gap: 8px;
        }

        .status-pill {
          font-size: 0.82rem;
          font-weight: 600;
          padding: 6px 14px;
          border-radius: var(--radius-full);
          border: 1px solid var(--border-color);
          background: var(--bg-surface);
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }

        .status-pill.active {
          background: var(--accent-gold);
          color: #fff;
          border-color: var(--accent-gold);
        }

        .results-info {
          font-size: 0.88rem;
          color: var(--text-muted);
          font-weight: 600;
          margin-bottom: 20px;
        }

        .stories-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
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
          padding: 60px 24px;
          background: var(--bg-cream);
          border-radius: var(--radius-lg);
          border: 2px dashed var(--border-color);
        }

        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
        }

        .empty-state h3 {
          font-size: 1.2rem;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .empty-state p {
          color: var(--text-secondary);
        }
      `}</style>
    </div>
  );
}
