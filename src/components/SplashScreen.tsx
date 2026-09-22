'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash screen for 1.2s, then fade out for 0.4s
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 1200);

    const timer2 = setTimeout(() => {
      setIsVisible(false);
    }, 1600);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`splash-screen ${isFadingOut ? 'fade-out' : ''}`}>
      <div className="splash-logo">
        <Image 
          src="/assets/logo.png" 
          alt="StoryEpisodes Logo" 
          width={220} 
          height={65} 
          style={{ objectFit: 'contain' }}
          priority
        />
        <div className="splash-loader"></div>
      </div>

      <style jsx>{`
        .splash-screen {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: var(--bg-main);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }

        .fade-out {
          opacity: 0;
          visibility: hidden;
        }

        .splash-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 24px;
          animation: pulseLogo 2s infinite ease-in-out;
        }

        .splash-loader {
          width: 48px;
          height: 4px;
          background: rgba(15, 23, 42, 0.1);
          border-radius: 4px;
          overflow: hidden;
          position: relative;
        }

        .splash-loader::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 50%;
          background: var(--royal-blue);
          border-radius: 4px;
          animation: loadingBar 1.2s infinite ease-in-out;
        }

        @keyframes pulseLogo {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }

        @keyframes loadingBar {
          0% { left: -50%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  );
}
