'use client';

import React from 'react';

export default function ReaderLoading() {
  return (
    <div className="reader-loading-page">
      <div className="reader-loading-container">
        {/* Back Link Skeleton */}
        <div className="skeleton-bar skeleton-back" />

        {/* Badges Skeleton */}
        <div className="skeleton-badges">
          <div className="skeleton-badge" />
          <div className="skeleton-badge short" />
        </div>

        {/* Story Title Skeleton */}
        <div className="skeleton-bar skeleton-title" />

        {/* Episode Header Skeleton */}
        <div className="skeleton-bar skeleton-ep-num" />
        <div className="skeleton-bar skeleton-ep-title" />

        {/* Info Bar Skeleton */}
        <div className="skeleton-bar skeleton-meta" />

        <hr className="skeleton-divider" />

        {/* Content Paragraph Skeletons */}
        <div className="skeleton-paragraphs">
          <div className="skeleton-bar line-full" />
          <div className="skeleton-bar line-full" />
          <div className="skeleton-bar line-medium" />
          
          <div className="skeleton-bar line-full" style={{ marginTop: '20px' }} />
          <div className="skeleton-bar line-full" />
          <div className="skeleton-bar line-short" />

          <div className="skeleton-bar line-full" style={{ marginTop: '20px' }} />
          <div className="skeleton-bar line-full" />
          <div className="skeleton-bar line-medium" />
        </div>
      </div>

      <style jsx>{`
        .reader-loading-page {
          background: var(--bg-cream, #FDFBF7);
          min-height: 80vh;
          padding: 24px 0 60px;
        }

        .reader-loading-container {
          max-width: 720px;
          margin: 0 auto;
          padding: 0 16px;
        }

        .skeleton-bar {
          background: linear-gradient(
            90deg,
            rgba(226, 232, 240, 0.7) 25%,
            rgba(241, 245, 249, 0.9) 50%,
            rgba(226, 232, 240, 0.7) 75%
          );
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite;
          border-radius: 6px;
        }

        .skeleton-back {
          width: 120px;
          height: 24px;
          margin-bottom: 24px;
        }

        .skeleton-badges {
          display: flex;
          gap: 8px;
          margin-bottom: 12px;
        }

        .skeleton-badge {
          width: 70px;
          height: 22px;
          border-radius: 9999px;
          background: linear-gradient(
            90deg,
            rgba(226, 232, 240, 0.7) 25%,
            rgba(241, 245, 249, 0.9) 50%,
            rgba(226, 232, 240, 0.7) 75%
          );
          background-size: 200% 100%;
          animation: skeletonShimmer 1.5s infinite;
        }

        .skeleton-badge.short {
          width: 50px;
        }

        .skeleton-title {
          width: 75%;
          height: 36px;
          margin-bottom: 16px;
        }

        .skeleton-ep-num {
          width: 90px;
          height: 18px;
          margin-bottom: 8px;
        }

        .skeleton-ep-title {
          width: 55%;
          height: 28px;
          margin-bottom: 16px;
        }

        .skeleton-meta {
          width: 60%;
          height: 20px;
          margin-bottom: 24px;
        }

        .skeleton-divider {
          border: none;
          border-top: 1px solid var(--border-color, #E2E8F0);
          margin-bottom: 28px;
        }

        .skeleton-paragraphs {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .line-full {
          width: 100%;
          height: 18px;
        }

        .line-medium {
          width: 70%;
          height: 18px;
        }

        .line-short {
          width: 45%;
          height: 18px;
        }

        @keyframes skeletonShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  );
}
