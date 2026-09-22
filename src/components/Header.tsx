'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useModal } from '@/context/ModalContext';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openWhatsAppModal } = useModal();

  return (
    <>
      <header className="header">
        <div className="container header-content">
          {/* Mobile Hamburger Left */}
          <button
            className="hamburger-btn mobile-only"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Logo Center (Mobile) / Left (Desktop) */}
          <Link href="/" className="brand-logo">
            <Image
              src="/assets/logo.png"
              alt="StoryEpisodes Logo"
              width={160}
              height={45}
              style={{ objectFit: 'contain' }}
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="desktop-nav desktop-only">
            <Link href="/" target="_blank" rel="noopener noreferrer" className="nav-link">Home</Link>
            <Link href="/stories" target="_blank" rel="noopener noreferrer" className="nav-link">Stories</Link>
            <Link href="/genres" target="_blank" rel="noopener noreferrer" className="nav-link">Genres</Link>
            <Link href="/authors" target="_blank" rel="noopener noreferrer" className="nav-link">Authors</Link>
            <Link href="/about" target="_blank" rel="noopener noreferrer" className="nav-link">About</Link>
          </nav>

          {/* Header Actions */}
          <div className="header-actions">
            <button className="whatsapp-nav-btn" onClick={openWhatsAppModal} title="Chat on WhatsApp">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.299.434 2.503 1.185 3.477l-.775 2.83 2.9-.761c.939.633 2.062.984 3.256.984 3.18 0 5.767-2.587 5.767-5.766 0-3.18-2.587-5.766-5.765-5.766zm3.385 8.165c-.143.402-.832.767-1.16.81-.322.043-.74.07-2.13-.483-1.666-.662-2.73-2.37-2.813-2.482-.083-.112-.676-.901-.676-1.718 0-.817.426-1.218.577-1.383.151-.165.33-.207.44-.207.11 0 .22 0 .316.005.103.005.241-.039.377.288.143.342.493 1.2.535 1.286.042.086.07.187.014.3-.056.113-.084.184-.168.282-.084.098-.178.22-.254.296-.084.084-.171.176-.073.344.098.168.437.72.937 1.166.643.573 1.185.751 1.353.835.168.084.267.07.366-.042.098-.113.422-.493.535-.662.113-.169.225-.141.38-.084.155.056.983.464 1.152.549.169.084.282.127.324.197.042.07.042.408-.101.81z" />
              </svg>
              <span>Contact</span>
            </button>
            <a href="tel:8790349941" className="call-btn" title="Call Us">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="mobile-menu-overlay">
            <div className="mobile-menu-content">
              <nav className="mobile-nav-links">
                <Link href="/" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Home</Link>
                <Link href="/stories" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Stories</Link>
                <Link href="/genres" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Genres</Link>
                <Link href="/authors" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>Authors</Link>
                <Link href="/about" target="_blank" rel="noopener noreferrer" onClick={() => setMobileMenuOpen(false)}>About</Link>
              </nav>
              <div className="mobile-menu-actions">
                <button className="btn-primary w-full" onClick={() => { setMobileMenuOpen(false); openWhatsAppModal(); }}>
                  Chat on WhatsApp
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      <style jsx>{`
        .header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--border-color);
          height: 64px;
          display: flex;
          align-items: center;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .brand-logo {
          display: flex;
          align-items: center;
        }

        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 28px;
        }

        .nav-link {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-secondary);
          transition: var(--transition-fast);
        }

        .nav-link:hover {
          color: var(--royal-blue);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .whatsapp-nav-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #25D366;
          color: #fff;
          font-weight: 600;
          font-size: 0.85rem;
          padding: 8px 14px;
          border-radius: var(--radius-full);
          transition: var(--transition-fast);
        }

        .whatsapp-nav-btn:hover {
          background: #1EBE57;
          transform: translateY(-1px);
        }

        .call-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--bg-light-blue);
          color: var(--royal-blue);
          transition: var(--transition-fast);
        }

        .call-btn:hover {
          background: var(--royal-blue);
          color: #fff;
        }

        .hamburger-btn {
          color: var(--text-primary);
          padding: 4px;
        }

        .mobile-only {
          display: block;
        }

        .desktop-only {
          display: none;
        }

        @media (min-width: 768px) {
          .mobile-only {
            display: none;
          }
          .desktop-only {
            display: flex;
          }
        }

        .mobile-menu-overlay {
          position: fixed;
          top: 64px;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(15, 23, 42, 0.5);
          backdrop-filter: blur(4px);
          z-index: 99;
          animation: fadeIn 0.2s ease;
        }

        .mobile-menu-content {
          background: #fff;
          padding: 24px;
          border-bottom-left-radius: 16px;
          border-bottom-right-radius: 16px;
          box-shadow: var(--shadow-lg);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .mobile-nav-links a {
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        .w-full {
          width: 100%;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </>
  );
}
