import { useEffect, useRef } from 'react';

export default function AnatomyFigure({ className = '' }) {
  const imgRef = useRef(null);

  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={className}
      style={{ display: 'flex', justifyContent: 'center', width: '100%' }}
    >
      <style>{`
        @keyframes anatomyPulse {
          0%, 100% { filter: grayscale(1) brightness(0.4) sepia(1) saturate(4) hue-rotate(300deg) contrast(1.4); }
          50%       { filter: grayscale(1) brightness(0.65) sepia(1) saturate(4) hue-rotate(300deg) contrast(1.4); }
        }
        .anatomy-figure {
          animation: anatomyPulse 3s ease-in-out infinite;
        }
      `}</style>
      <img
        ref={imgRef}
        src="/nKF6OsoLLcuR8ReOpCeFKA_b.webp"
        alt="Posterior muscular anatomy diagram"
        className="anatomy-figure"
        style={{
          filter: 'grayscale(1) brightness(0.5) sepia(1) saturate(4) hue-rotate(300deg) contrast(1.4)',
          width: '400px',
          display: 'block',
          margin: '0 auto',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
