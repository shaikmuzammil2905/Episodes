'use client';

import React from 'react';
import Link from 'next/link';
import HeroSection from '@/components/HeroSection';
import StoryCard from '@/components/StoryCard';
import { STORIES, GENRES } from '@/lib/data';

export default function HomePage() {
  const featuredStories = STORIES.filter((s) => s.featured);
  const recommendedStories = STORIES.filter((s) => s.recommended);
  const latestStories = [...STORIES].reverse().slice(0, 4);

  return (
    <>
      {/* ──── HERO ──── */}
      <HeroSection />

      {/* ──── BROWSE GENRES ──── */}
      <section id="genres" className="section genres-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse Genres</h2>
            <p className="section-sub">Explore stories across your favourite categories</p>
          </div>
          <div className="genre-grid">
            {GENRES.map((genre) => (
              <Link key={genre.id} href={`/stories?genre=${genre.slug}`} className="genre-card">
                <div className="genre-icon-area">
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
                <h3 className="genre-name">{genre.name}</h3>
                <p className="genre-desc">{genre.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──── FEATURED STORIES ──── */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Stories</h2>
            <p className="section-sub">Hand-picked stories you&apos;ll love</p>
          </div>
          <div className="stories-grid">
            {featuredStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── LATEST STORIES ──── */}
      <section className="section latest-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Stories</h2>
            <p className="section-sub">Fresh stories just added to the platform</p>
          </div>
          <div className="stories-grid">
            {latestStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── RECOMMENDED ──── */}
      <section className="section recommended-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Recommended for You</h2>
            <p className="section-sub">Stories our readers can&apos;t put down</p>
          </div>
          <div className="stories-grid">
            {recommendedStories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How StoryEpisodes Works</h2>
            <p className="section-sub">Your reading journey in five simple steps</p>
          </div>
          <div className="how-grid">
            {[
              { num: '01', icon: '🔍', title: 'Discover', desc: 'Find stories that match your interests.' },
              { num: '02', icon: '📚', title: 'Choose a Story', desc: 'Explore genres and story worlds.' },
              { num: '03', icon: '📖', title: 'Read an Episode', desc: 'Start reading one episode at a time.' },
              { num: '04', icon: '🔄', title: 'Continue the Journey', desc: 'Come back for the next episode.' },
              { num: '05', icon: '⭐', title: 'Follow & Stay Updated', desc: 'Keep track of stories you love.' },
            ].map((step) => (
              <div key={step.num} className="how-card">
                <div className="how-num">{step.num}</div>
                <div className="how-icon">{step.icon}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CONTINUE READING ──── */}
      <section className="section continue-section">
        <div className="container">
          <div className="continue-card-cta">
            <div className="continue-icon">📚</div>
            <h3>Your reading journey starts here.</h3>
            <p>Explore a story and your reading progress will appear here.</p>
            <Link href="/stories" className="btn-primary">Explore Stories</Link>
          </div>
        </div>
      </section>

      {/* ──── ABOUT ──── */}
      <section id="about" className="section about-section">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2 className="section-title">About StoryEpisodes</h2>
              <p>
                StoryEpisodes is built around episodic storytelling. We believe stories are best experienced one chapter at a time — giving you space to absorb, anticipate, and appreciate every twist and turn.
              </p>
              <p>
                Readers can discover stories across genres, explore worlds crafted by talented authors, read at their own pace, follow stories for updates, and return for new chapters as they are published.
              </p>
              <div className="about-features">
                {['Discover Stories', 'Explore Genres', 'Read Episodes', 'Follow Stories', 'Return for New Chapters', 'Discover Authors'].map((f) => (
                  <span key={f} className="about-chip">✓ {f}</span>
                ))}
              </div>
            </div>
            <div className="about-visual">
              <div className="about-visual-card">
                <div className="about-emoji">📖</div>
                <h3>Read • Explore • Keep Coming Back</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ──── FINAL CTA ──── */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-inner">
            <h2>Ready to Start Your Next Story?</h2>
            <p>Join thousands of readers discovering new worlds, one episode at a time.</p>
            <div className="cta-buttons">
              <Link href="/stories" className="btn-primary cta-btn">
                Start Reading Now
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .section {
          padding: 60px 0;
        }

        @media (min-width: 768px) {
          .section {
            padding: 80px 0;
          }
        }

        .section-header {
          text-align: center;
          margin-bottom: 40px;
        }

        .section-title {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 8px;
        }

        @media (min-width: 768px) {
          .section-title {
            font-size: 2.2rem;
          }
        }

        .section-sub {
          font-size: 1rem;
          color: var(--text-secondary);
        }

        /* ── Genres ── */
        .genres-section {
          background: var(--bg-cream);
        }

        .genre-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }

        @media (min-width: 640px) {
          .genre-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }

        @media (min-width: 1024px) {
          .genre-grid {
            grid-template-columns: repeat(4, 1fr);
            gap: 20px;
          }
        }

        .genre-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 20px 16px;
          text-align: center;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
          cursor: pointer;
        }

        .genre-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--royal-blue);
        }

        .genre-icon-area {
          margin-bottom: 10px;
        }

        .genre-emoji {
          font-size: 2rem;
        }

        .genre-name {
          font-size: 0.95rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 6px;
        }

        .genre-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* ── Stories Grid ── */
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

        /* ── How It Works ── */
        .how-section {
          background: var(--bg-light-blue);
        }

        .how-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
        }

        @media (min-width: 640px) {
          .how-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1024px) {
          .how-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .how-card {
          background: #fff;
          border-radius: var(--radius-md);
          padding: 28px 20px;
          text-align: center;
          border: 1px solid var(--border-color);
          transition: var(--transition-fast);
          position: relative;
        }

        .how-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .how-num {
          font-size: 0.75rem;
          font-weight: 800;
          color: var(--royal-blue);
          background: var(--bg-light-blue);
          display: inline-block;
          padding: 4px 10px;
          border-radius: var(--radius-full);
          margin-bottom: 12px;
        }

        .how-icon {
          font-size: 2rem;
          margin-bottom: 10px;
        }

        .how-title {
          font-size: 0.95rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .how-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
        }

        /* ── Continue Reading ── */
        .continue-section {
          background: var(--bg-cream);
        }

        .continue-card-cta {
          text-align: center;
          background: #fff;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-lg);
          padding: 48px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .continue-icon {
          font-size: 2.5rem;
        }

        .continue-card-cta h3 {
          font-size: 1.2rem;
          font-weight: 700;
        }

        .continue-card-cta p {
          color: var(--text-secondary);
          max-width: 400px;
        }

        /* ── About ── */
        .about-section {
          background: var(--bg-surface);
        }

        .about-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 40px;
          align-items: center;
        }

        @media (min-width: 768px) {
          .about-grid {
            grid-template-columns: 1.4fr 1fr;
          }
        }

        .about-text {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .about-text p {
          font-size: 0.95rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .about-features {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .about-chip {
          font-size: 0.82rem;
          font-weight: 600;
          background: var(--bg-light-blue);
          color: var(--royal-blue);
          padding: 6px 12px;
          border-radius: var(--radius-full);
        }

        .about-visual-card {
          background: linear-gradient(135deg, var(--primary) 0%, var(--primary-light) 100%);
          border-radius: var(--radius-lg);
          padding: 48px 32px;
          text-align: center;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .about-emoji {
          font-size: 4rem;
        }

        .about-visual-card h3 {
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        /* ── Final CTA ── */
        .cta-section {
          background: linear-gradient(135deg, var(--primary) 0%, #1E3A5F 100%);
          color: #fff;
        }

        .cta-inner {
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 16px;
          align-items: center;
        }

        .cta-inner h2 {
          font-family: var(--font-serif);
          font-size: 2rem;
          font-weight: 700;
        }

        .cta-inner p {
          font-size: 1.05rem;
          color: #CBD5E1;
        }

        .cta-buttons {
          display: flex;
          gap: 12px;
          margin-top: 8px;
        }

        .cta-btn {
          padding: 16px 32px;
          font-size: 1.05rem;
          background: var(--accent-gold);
          box-shadow: 0 4px 14px rgba(245, 158, 11, 0.35);
        }

        .cta-btn:hover {
          background: var(--accent-gold-dark);
        }
      `}</style>
    </>
  );
}
