'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Show splash screen while initial styles & page content settle, then fade out smoothly
    const timer1 = setTimeout(() => {
      setIsFadingOut(true);
    }, 900);

    const timer2 = setTimeout(() => {
      setIsVisible(false);
    }, 1300);

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
        <div className="splash-loader" />
      </div>
    </div>
  );
}
