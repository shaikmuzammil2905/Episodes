'use client';

import React from 'react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="about-standalone-page">
      <div className="container">
        {/* Hero Banner */}
        <div className="about-hero-banner">
          <span className="about-badge">About StoryEpisodes</span>
          <h1>Read • Explore • Keep Coming Back</h1>
          <p>
            StoryEpisodes is a next-generation episodic story reading platform designed for curious minds, avid readers, and storytellers.
          </p>
        </div>

        {/* Story Features Grid */}
        <div className="about-sections-grid">
          <div className="about-card">
            <div className="about-card-icon">⚡</div>
            <h3>Episodic Publishing</h3>
            <p>
              Rather than overwhelming readers with hundreds of pages at once, stories are published in bite-sized, high-impact episodes. Each episode keeps you on the edge of your seat!
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon">🌍</div>
            <h3>Multi-Language & Genres</h3>
            <p>
              From English Sci-Fi thrillers to rich Telugu cultural epics and quick short stories, our library offers diverse voices and worlds to explore.
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon">📱</div>
            <h3>Mobile-First Experience</h3>
            <p>
              Enjoy flawless reading on your phone, tablet, or desktop. Optimized typography, dark overlays, and intuitive navigation make reading a pleasure anywhere.
            </p>
          </div>

          <div className="about-card">
            <div className="about-card-icon">💬</div>
            <h3>Direct Author & Support Access</h3>
            <p>
              Connect with us directly on WhatsApp for updates, new episode notifications, story submissions, and reader assistance.
            </p>
          </div>
        </div>

        {/* CTA Box */}
        <div className="about-cta-box">
          <h2>Ready to dive into a world of stories?</h2>
          <p>Explore our library and start reading your first episode today.</p>
          <div className="about-cta-buttons">
            <Link href="/stories" target="_blank" rel="noopener noreferrer" className="btn-primary">
              Explore Stories in New Page ↗
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .about-standalone-page {
          padding: 40px 0 60px;
        }

        .about-hero-banner {
          text-align: center;
          max-width: 750px;
          margin: 0 auto 48px;
        }

        .about-badge {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--royal-blue);
          background: var(--bg-light-blue);
          padding: 6px 16px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          display: inline-block;
          margin-bottom: 16px;
        }

        .about-hero-banner h1 {
          font-family: var(--font-serif);
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 16px;
          line-height: 1.2;
        }

        .about-hero-banner p {
          font-size: 1.1rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .about-sections-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 24px;
          margin-bottom: 48px;
        }

        @media (min-width: 640px) {
          .about-sections-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        .about-card {
          background: var(--bg-surface);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: 32px 24px;
          transition: var(--transition-fast);
        }

        .about-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
          border-color: var(--royal-blue);
        }

        .about-card-icon {
          font-size: 2.5rem;
          margin-bottom: 16px;
        }

        .about-card h3 {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 10px;
        }

        .about-card p {
          font-size: 0.92rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        .about-cta-box {
          background: linear-gradient(135deg, var(--primary) 0%, #1E3A5F 100%);
          color: #fff;
          border-radius: var(--radius-lg);
          padding: 48px 24px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .about-cta-box h2 {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          font-weight: 700;
        }

        .about-cta-box p {
          font-size: 1rem;
          color: #CBD5E1;
        }

        .about-cta-buttons {
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}
