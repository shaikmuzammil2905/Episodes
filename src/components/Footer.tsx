import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Image src="/assets/logo.png" alt="StoryEpisodes" width={140} height={40} style={{ objectFit: 'contain' }} />
            <p className="brand-description">
              {t('heroSub')}
            </p>
          </div>

          {/* Explore */}
          <div className="footer-col">
            <h4>{t('explore')}</h4>
            <Link href="/stories">{t('stories')}</Link>
            <Link href="/genres">{t('genres')}</Link>
            <Link href="/authors">{t('authors')}</Link>
            <Link href="/stories?latest=true">{t('latestStories')}</Link>
          </div>

          {/* Platform */}
          <div className="footer-col">
            <h4>Platform</h4>
            <Link href="/about">{t('about')}</Link>
            <Link href="/about#how-it-works">{t('howItWorks')}</Link>
            <Link href="/about#contact">{t('contact')}</Link>
            <span className="text-muted">{t('futurePremium')}</span>
          </div>

          {/* Connect */}
          <div className="footer-col">
            <h4>{t('contact')}</h4>
            <a href="https://wa.me/918790349941?text=Hello%20StoryEpisodes%2C%20I%20would%20like%20to%20know%20more%20about%20the%20platform." target="_blank" rel="noopener noreferrer" className="contact-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.299.434 2.503 1.185 3.477l-.775 2.83 2.9-.761c.939.633 2.062.984 3.256.984 3.18 0 5.767-2.587 5.767-5.766 0-3.18-2.587-5.766-5.765-5.766z" />
              </svg>
              WhatsApp
            </a>
            <a href="tel:+918790349941" className="contact-link">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              {t('callUs')}
            </a>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} StoryEpisodes. All rights reserved.</p>
        </div>
      </div>

      <style jsx>{`
        .footer {
          background: var(--primary);
          color: var(--bg-cream);
          padding: 48px 0 24px;
          margin-top: auto;
          border-top: 1px solid var(--border-color);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 32px;
        }

        @media (min-width: 640px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr;
          }
        }

        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .brand-description {
          font-size: 0.95rem;
          line-height: 1.6;
          color: #94A3B8;
          max-width: 320px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-col h4 {
          font-size: 1.05rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 8px;
        }

        .footer-col a, .text-muted {
          font-size: 0.95rem;
          color: #94A3B8;
          transition: var(--transition-fast);
          display: inline-block;
        }

        .footer-col a:hover {
          color: var(--accent-gold);
          transform: translateX(4px);
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: var(--accent-gold-light);
          font-weight: 600;
        }
        
        .contact-link:hover {
          color: var(--accent-gold);
        }

        .footer-bottom {
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          font-size: 0.85rem;
          color: #64748B;
        }
      `}</style>
    </footer>
  );
}
