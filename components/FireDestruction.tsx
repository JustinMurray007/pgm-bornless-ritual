'use client';

import { useEffect, useState, useRef } from 'react';

export default function FireDestruction() {
  const [isTriggered, setIsTriggered] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const scrollIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTriggered) {
            setIsTriggered(true);
            startFireAndScroll();
          }
        });
      },
      { threshold: 0.5 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      observer.disconnect();
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isTriggered]);

  const startFireAndScroll = () => {
    let scrollSpeed = 2; // Start slow
    const acceleration = 1.15; // Speed multiplier
    const maxSpeed = 100; // Maximum scroll speed

    scrollIntervalRef.current = window.setInterval(() => {
      // Scroll up
      window.scrollBy(0, -scrollSpeed);

      // Accelerate
      scrollSpeed = Math.min(scrollSpeed * acceleration, maxSpeed);

      // Check if we've reached the top
      if (window.scrollY <= 0) {
        if (scrollIntervalRef.current) {
          clearInterval(scrollIntervalRef.current);
        }
        // Show button after flames complete and fade to black
        setTimeout(() => {
          setShowButton(true);
        }, 2000);
      }
    }, 16); // ~60fps
  };

  const handleEscape = () => {
    // Reload the page to restore everything
    window.location.reload();
  };

  return (
    <>
      {/* Trigger element at the bottom */}
      <div ref={triggerRef} className="fire-trigger" />

      {/* Fire overlay - rises from bottom */}
      {isTriggered && (
        <div className="fire-overlay fire-overlay--active">
          <div className="fire-flames" />
          <div className="fire-embers" />
          <div className="fire-smoke" />
        </div>
      )}

      {/* Black void after destruction */}
      {isTriggered && (
        <div className={`void-overlay${showButton ? ' void-overlay--complete' : ''}`} />
      )}

      {/* "Escape the Darkness" button */}
      {showButton && (
        <div className="escape-container">
          <button onClick={handleEscape} className="escape-button">
            Escape the Darkness
          </button>
        </div>
      )}
    </>
  );
}
