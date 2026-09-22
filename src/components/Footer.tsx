import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-grid">
          {/* Brand Column */}
          <div className="footer-brand">
            <Image src="/assets/logo.png" alt="StoryEpisodes" width={140} height={40} style={{ objectFit: 'contain' }} />
            <p className="brand-tagline">Read • Explore • Keep Coming Back</p>
            <p className="brand-description">
              Discover captivating stories told one episode at a time. Follow your favourite worlds and come back for the next chapter.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4>Quick Links</h4>
            <Link href="/">Home</Link>
            <Link href="/stories">Stories</Link>
            <Link href="/#genres">Genres</Link>
            <Link href="/authors">Authors</Link>
            <Link href="/#about">About</Link>
          </div>

          {/* Categories */}
          <div className="footer-col">
            <h4>Categories</h4>
            <Link href="/stories?genre=english">English Stories</Link>
            <Link href="/stories?genre=telugu">Telugu Stories</Link>
            <Link href="/stories?genre=short-stories">Short Stories</Link>
            <Link href="/stories?genre=fantasy">Fantasy</Link>
            <Link href="/stories?genre=mystery">Mystery</Link>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>Get in Touch</h4>
            <a href="tel:+918790349941" className="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
              8790349941
            </a>
            <a href="https://wa.me/918790349941" target="_blank" rel="noopener noreferrer" className="contact-link">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.299.434 2.503 1.185 3.477l-.775 2.83 2.9-.761c.939.633 2.062.984 3.256.984 3.18 0 5.767-2.587 5.767-5.766 0-3.18-2.587-5.766-5.765-5.766z" />
              </svg>
              WhatsApp
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
          color: #CBD5E1;
          padding: 60px 0 24px;
          margin-top: auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 36px;
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
          gap: 12px;
        }

        .brand-tagline {
          font-size: 0.85rem;
          color: var(--accent-gold);
          font-weight: 600;
          letter-spacing: 0.06em;
        }

        .brand-description {
          font-size: 0.88rem;
          line-height: 1.6;
          color: #94A3B8;
          max-width: 300px;
        }

        .footer-col {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .footer-col h4 {
          font-size: 0.95rem;
          font-weight: 700;
          color: #fff;
          margin-bottom: 4px;
        }

        .footer-col a {
          font-size: 0.88rem;
          color: #94A3B8;
          transition: var(--transition-fast);
        }

        .footer-col a:hover {
          color: var(--accent-gold);
          padding-left: 4px;
        }

        .contact-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
        }

        .footer-bottom {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          text-align: center;
          font-size: 0.82rem;
          color: #64748B;
        }
      `}</style>
    </footer>
  );
}
