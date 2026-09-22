import React, { Suspense } from 'react';
import StoriesContent from './StoriesContent';

export default function StoriesPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '40vh',
        fontSize: '1rem',
        color: 'var(--text-muted)',
      }}>
        Loading stories...
      </div>
    }>
      <StoriesContent />
    </Suspense>
  );
}
