'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function FireDestruction() {
  const [isTriggered, setIsTriggered] = useState(false);
  const [showEscape, setShowEscape] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTriggered) {
            setIsTriggered(true);
            // Show ESCAPE link after fire animation completes
            setTimeout(() => {
              setShowEscape(true);
            }, 3000);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => observer.disconnect();
  }, [isTriggered]);

  const handleEscape = () => {
    // Reset everything
    setIsTriggered(false);
    setShowEscape(false);
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // Reload the page to restore content
    setTimeout(() => {
      router.refresh();
    }, 500);
  };

  return (
    <>
      {/* Trigger element at the bottom */}
      <div ref={triggerRef} className="fire-trigger" />

      {/* Fire overlay */}
      {isTriggered && (
        <div className={`fire-overlay${isTriggered ? ' fire-overlay--active' : ''}`}>
          <div className="fire-flames" />
          <div className="fire-smoke" />
        </div>
      )}

      {/* Black void after destruction */}
      {isTriggered && (
        <div className={`void-overlay${showEscape ? ' void-overlay--complete' : ''}`} />
      )}

      {/* ESCAPE link */}
      {showEscape && (
        <div className="escape-container">
          <button onClick={handleEscape} className="escape-link">
            ESCAPE
          </button>
        </div>
      )}
    </>
  );
}
