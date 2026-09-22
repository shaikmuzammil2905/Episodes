'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import HeroSection from '@/components/HeroSection';
import StoryCard from '@/components/StoryCard';
import { STORIES, GENRES } from '@/lib/data';
import { useModal, HowItWorksStep } from '@/context/ModalContext';

export default function HomePage() {
  const { openGenreModal, openStepModal } = useModal();

  const featuredStories = STORIES.filter((s) => s.featured);
  const recommendedStories = STORIES.filter((s) => s.recommended);
  const latestStories = [...STORIES].reverse().slice(0, 4);

  const stepsData: HowItWorksStep[] = [
    {
      num: '01',
      icon: '🔍',
      title: 'Discover',
      desc: 'Find stories that match your interests.',
      longDesc: 'Browse through an ever-expanding catalog of stories filtered by language, genre, reading length, or popular tags. Our recommendation engine highlights trending epics and hidden gems.',
      features: [
        'Curated English & Telugu Stories',
        'Filter by Free or Premium access',
        'Real-time search across titles & authors'
      ],
      tip: 'Use the top search bar to instantly query genres, tags, or favorite authors.',
      actionText: 'Start Discovering Stories',
      actionLink: '/stories',
    },
    {
      num: '02',
      icon: '📚',
      title: 'Choose a Story',
      desc: 'Explore genres and story worlds.',
      longDesc: 'Click on any story card to open a full synopsis modal. Inspect reading time, episode count, tag list, author bio, and related story recommendations before diving in.',
      features: [
        'Detailed story synopsis & character context',
        'Total reading time estimates',
        'Direct links to all published episodes'
      ],
      tip: 'Clicking any story card on the homepage instantly opens its detail modal.',
      actionText: 'Explore Genre Catalog',
      actionLink: '/genres',
    },
    {
      num: '03',
      icon: '📖',
      title: 'Read an Episode',
      desc: 'Start reading one episode at a time.',
      longDesc: 'Experience crisp typography, customizable layout readability, and high-impact episode cliffhangers designed specifically for quick mobile or desktop sessions.',
      features: [
        'Distraction-free reading view',
        'Serif typography & line spacing optimized for eyes',
        'Episode publishing timestamp & read count'
      ],
      tip: 'You can bookmark your progress or jump back to the story summary anytime.',
      actionText: 'Read Latest Featured Episode',
      actionLink: '/reader/secret-old-house/episode-1',
    },
    {
      num: '04',
      icon: '🔄',
      title: 'Continue the Journey',
      desc: 'Come back for the next episode.',
      longDesc: 'Episodes are structured sequentially. Seamlessly jump between Episode 1, 2, and 3 using the Next/Previous episode footer controls.',
      features: [
        'One-click Next Episode navigation',
        'Episode progress tracker',
        'Related stories recommendations at the bottom'
      ],
      tip: 'Never lose your place with automatic episode sequence tracking.',
      actionText: 'View All Available Stories',
      actionLink: '/stories',
    },
    {
      num: '05',
      icon: '⭐',
      title: 'Follow & Stay Updated',
      desc: 'Keep track of stories you love.',
      longDesc: 'Never miss a new chapter release. Connect with us on WhatsApp or bookmark your favorite series for instant updates on upcoming release schedules.',
      features: [
        'Direct WhatsApp support & notifications',
        'Instant author updates',
        'Community discussion & feedback'
      ],
      tip: 'Click the green WhatsApp button anytime to receive direct release alerts on your phone.',
      actionText: 'Chat on WhatsApp',
      actionLink: 'https://wa.me/8790349941',
    },
  ];

  return (
    <>
      {/* ──── HERO ──── */}
      <HeroSection />

      {/* ──── BROWSE GENRES (IMAGE.PNG SECTION WITH POPUPS) ──── */}
      <section id="genres" className="section genres-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse Genres</h2>
            <p className="section-sub">Explore stories across your favourite categories • Click any genre for info & details</p>
          </div>
          <div className="genre-grid">
            {GENRES.map((genre) => (
              <div
                key={genre.id}
                className="genre-card"
                onClick={() => openGenreModal(genre)}
                role="button"
                tabIndex={0}
              >
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
                <span className="click-popup-badge">Click for Info ✨</span>
              </div>
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

      {/* ──── HOW IT WORKS (IMAGE COPY.PNG SECTION WITH POPUPS) ──── */}
      <section className="section how-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">How StoryEpisodes Works</h2>
            <p className="section-sub">Your reading journey in five simple steps • Click any step for detailed guide</p>
          </div>
          <div className="how-grid">
            {stepsData.map((step) => (
              <div
                key={step.num}
                className="how-card"
                onClick={() => openStepModal(step)}
                role="button"
                tabIndex={0}
              >
                <div className="how-num">{step.num}</div>
                <div className="how-icon">{step.icon}</div>
                <h3 className="how-title">{step.title}</h3>
                <p className="how-desc">{step.desc}</p>
                <span className="step-popup-badge">Explore Step 💡</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── GRAND PICTORIAL READING JOURNEY HUB (IMAGE COPY 2.PNG ENHANCED GRAND LOOK) ──── */}
      <section className="section grand-journey-section">
        <div className="container">
          <div className="grand-journey-card">
            <div className="grand-ambient-glow"></div>
            <div className="grand-journey-header">
              <div className="grand-pictorial-badge">
                <span className="pulsing-dot"></span>
                <span>Interactive Reading Journey</span>
              </div>
              <h2 className="grand-journey-title">Your Reading Journey Starts Here</h2>
              <p className="grand-journey-subtitle">
                Track your active story progress, unlock reading badges, and dive into fresh episodic chapters updated weekly.
              </p>
            </div>

            {/* Pictorial Representation Grid */}
            <div className="grand-pictorial-grid">
              <div className="pictorial-stat-card">
                <div className="stat-icon-wrapper gold-glow">
                  <Image
                    src="/assets/image copy 2.png"
                    alt="Reading Stack Illustration"
                    width={48}
                    height={48}
                    className="stat-img-icon"
                  />
                </div>
                <div className="stat-meta">
                  <span className="stat-value">3 Active Series</span>
                  <span className="stat-desc">In-Progress Reading</span>
                </div>
              </div>

              <div className="pictorial-stat-card">
                <div className="stat-icon-wrapper blue-glow">
                  <span className="stat-emoji">🔥</span>
                </div>
                <div className="stat-meta">
                  <span className="stat-value">5 Day Streak</span>
                  <span className="stat-desc">Daily Reader Level</span>
                </div>
              </div>

              <div className="pictorial-stat-card">
                <div className="stat-icon-wrapper green-glow">
                  <span className="stat-emoji">🏆</span>
                </div>
                <div className="stat-meta">
                  <span className="stat-value">12 Episodes</span>
                  <span className="stat-desc">Read This Month</span>
                </div>
              </div>
            </div>

            {/* Visual Progress Showcase */}
            <div className="grand-progress-showcase">
              <div className="progress-info-row">
                <span className="current-reading-label">📖 Currently Reading: <strong>The Secret of the Old House</strong></span>
                <span className="progress-percentage">Episode 2 of 3 (66% Complete)</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: '66%' }}></div>
              </div>
            </div>

            {/* CTAs */}
            <div className="grand-journey-actions">
              <Link
                href="/stories"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary grand-action-btn"
              >
                Explore All Stories in New Page ↗
              </Link>
              <Link
                href="/genres"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary grand-action-btn-secondary"
              >
                Browse Genres 🎨
              </Link>
            </div>
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
              <Link
                href="/stories"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary cta-btn"
              >
                Start Reading Now in New Page ↗
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

        /* ── Genres (image.png Section) ── */
        .genres-section {
          background: var(--bg-cream);
        }

        .genre-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
        }

        @media (min-width: 640px) {
          .genre-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 18px;
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
          padding: 22px 16px;
          text-align: center;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
          cursor: pointer;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .genre-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.12);
          border-color: var(--royal-blue);
        }

        .genre-icon-area {
          margin-bottom: 10px;
        }

        .genre-emoji {
          font-size: 2.2rem;
        }

        .genre-name {
          font-size: 0.98rem;
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
          margin-bottom: 10px;
        }

        .click-popup-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--royal-blue);
          background: var(--bg-light-blue);
          padding: 3px 8px;
          border-radius: var(--radius-full);
          margin-top: auto;
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

        /* ── How It Works (image copy.png Section) ── */
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
          transition: transform var(--transition-fast), box-shadow var(--transition-fast), border-color var(--transition-fast);
          cursor: pointer;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .how-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(37, 99, 235, 0.15);
          border-color: var(--royal-blue);
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
          font-size: 2.2rem;
          margin-bottom: 10px;
        }

        .how-title {
          font-size: 0.98rem;
          font-weight: 700;
          margin-bottom: 6px;
        }

        .how-desc {
          font-size: 0.82rem;
          color: var(--text-muted);
          line-height: 1.4;
          margin-bottom: 12px;
        }

        .step-popup-badge {
          font-size: 0.72rem;
          font-weight: 700;
          color: #D97706;
          background: #FEF3C7;
          padding: 3px 8px;
          border-radius: var(--radius-full);
          margin-top: auto;
        }

        /* ── Grand Reading Journey Hub (image copy 2.png Section) ── */
        .grand-journey-section {
          background: linear-gradient(180deg, #F8FAFC 0%, var(--bg-cream) 100%);
        }

        .grand-journey-card {
          background: #ffffff;
          border: 2px solid #E2E8F0;
          border-radius: 24px;
          padding: 48px 32px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 32px;
          text-align: center;
        }

        .grand-ambient-glow {
          position: absolute;
          top: -100px;
          left: 50%;
          transform: translateX(-50%);
          width: 500px;
          height: 300px;
          background: radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, rgba(245, 158, 11, 0.08) 50%, transparent 100%);
          pointer-events: none;
        }

        .grand-journey-header {
          max-width: 600px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
        }

        .grand-pictorial-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          font-weight: 800;
          color: var(--royal-blue);
          background: var(--bg-light-blue);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .pulsing-dot {
          width: 8px;
          height: 8px;
          background: #10B981;
          border-radius: 50%;
          box-shadow: 0 0 8px #10B981;
          animation: pulseGlow 2s infinite;
        }

        @keyframes pulseGlow {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }

        .grand-journey-title {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          font-weight: 700;
          color: var(--text-primary);
        }

        .grand-journey-subtitle {
          font-size: 1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Pictorial Stat Grid */
        .grand-pictorial-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
          width: 100%;
          max-width: 850px;
        }

        @media (min-width: 640px) {
          .grand-pictorial-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        .pictorial-stat-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 24px;
          display: flex;
          align-items: center;
          gap: 16px;
          transition: transform var(--transition-fast), box-shadow var(--transition-fast);
        }

        .pictorial-stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .stat-icon-wrapper {
          width: 54px;
          height: 54px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .gold-glow {
          background: #FEF3C7;
        }

        .blue-glow {
          background: #EFF6FF;
        }

        .green-glow {
          background: #ECFDF5;
        }

        .stat-img-icon {
          object-fit: contain;
        }

        .stat-emoji {
          font-size: 1.8rem;
        }

        .stat-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .stat-value {
          font-size: 1.05rem;
          font-weight: 800;
          color: var(--text-primary);
        }

        .stat-desc {
          font-size: 0.78rem;
          color: var(--text-muted);
          font-weight: 500;
        }

        /* Progress Showcase */
        .grand-progress-showcase {
          width: 100%;
          max-width: 850px;
          background: #F8FAFC;
          border: 1px solid #E2E8F0;
          border-radius: var(--radius-lg);
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .progress-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 0.88rem;
        }

        .current-reading-label {
          color: var(--text-primary);
        }

        .progress-percentage {
          font-weight: 700;
          color: var(--royal-blue);
        }

        .progress-bar-track {
          width: 100%;
          height: 10px;
          background: #E2E8F0;
          border-radius: var(--radius-full);
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--royal-blue) 0%, var(--accent-gold) 100%);
          border-radius: var(--radius-full);
          transition: width 0.6s ease;
        }

        /* Actions */
        .grand-journey-actions {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          justify-content: center;
        }

        .grand-action-btn {
          padding: 16px 32px;
          font-size: 1rem;
        }

        .grand-action-btn-secondary {
          padding: 16px 28px;
          font-size: 1rem;
          background: #F1F5F9;
          color: var(--text-primary);
          border-radius: var(--radius-md);
          font-weight: 600;
          transition: var(--transition-fast);
        }

        .grand-action-btn-secondary:hover {
          background: #E2E8F0;
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
