import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      textAlign: 'center',
      padding: '24px',
      fontFamily: 'var(--font-sans)',
    }}>
      <div style={{ fontSize: '5rem', marginBottom: '16px' }}>📖</div>
      <h1 style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '2rem',
        fontWeight: 700,
        marginBottom: '12px',
        color: 'var(--text-primary)',
      }}>
        Page Not Found
      </h1>
      <p style={{
        fontSize: '1rem',
        color: 'var(--text-secondary)',
        maxWidth: '400px',
        marginBottom: '24px',
        lineHeight: 1.6,
      }}>
        The story or episode you&apos;re looking for doesn&apos;t exist. It might have been moved or the URL is incorrect.
      </p>
      <Link
        href="/"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--royal-blue)',
          color: '#fff',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: 'var(--radius-md)',
          fontSize: '1rem',
        }}
      >
        ← Back to Home
      </Link>
    </div>
  );
}
