'use client';

import React, { useEffect, useRef } from 'react';

interface ScrollObserverProps {
  children: React.ReactNode;
  animationClass?: string;
  threshold?: number;
}

export default function ScrollObserver({ 
  children, 
  animationClass = 'fade-up', 
  threshold = 0.1 
}: ScrollObserverProps) {
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = domRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(animationClass);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [animationClass, threshold]);

  return (
    <div ref={domRef} className="scroll-observer-wrapper">
      {children}
    </div>
  );
}
