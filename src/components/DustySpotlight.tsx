
import React, { useEffect, useRef } from 'react';

interface DustySpotlightProps {
  theme: 'dark' | 'light';
}

const DustySpotlight: React.FC<DustySpotlightProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use parent container dimensions
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    
    const updateSize = () => {
        if(canvas.parentElement) {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
            width = canvas.width;
            height = canvas.height;
        }
    };
    
    updateSize();
    window.addEventListener('resize', updateSize);

    const particles: DustParticle[] = [];
    // Reduced particle count for a cleaner look
    const particleCount = 35;

    class DustParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
      phase: number;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.1; 
        this.vy = (Math.random() - 0.5) * 0.1;
        this.size = Math.random() * 1.2;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.phase = Math.random() * Math.PI * 2;
        
        // Concentrate particles slightly in the top-left area
        if (Math.random() > 0.5) {
            this.x = Math.random() * (width / 2);
            this.y = Math.random() * (height / 2);
        }
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.phase += 0.05;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        return Math.abs(Math.sin(this.phase)) * this.opacity; 
      }

      draw(ctx: CanvasRenderingContext2D, currentOpacity: number) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        
        const isDark = theme === 'dark';
        const r = isDark ? 255 : 0;
        const g = isDark ? 255 : 0;
        const b = isDark ? 255 : 0;

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${currentOpacity})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new DustParticle());
    }

    let animationFrameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        const op = p.update();
        p.draw(ctx, op);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const blendMode = theme === 'dark' ? 'mix-blend-overlay' : 'mix-blend-multiply';

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none z-0 select-none overflow-hidden`}>
      {/* 
        SINGLE CLEAN BEAM 
        Sharp cut, flickering intensity.
        Positioned to hit the center from top-left.
      */}
      <div 
        className={`absolute -top-[20%] -left-[20%] w-[150%] h-[150%] ${blendMode} animate-flicker origin-center`}
        style={{
            background: `linear-gradient(135deg, ${theme === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.05)'} 0%, ${theme === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)'} 40%, transparent 70%)`,
            // Sharp geometric triangle cut
            clipPath: 'polygon(0% 0%, 100% 0%, 50% 100%)',
            filter: 'blur(30px)' // Reduced blur for sharper definition
        }}
      />

      {/* Dust Particles Canvas */}
      <canvas 
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-40"
      />

      <style>{`
        @keyframes flicker {
          0% { opacity: 0.9; transform: scale(1); }
          5% { opacity: 0.7; transform: scale(1.01); }
          10% { opacity: 0.9; }
          15% { opacity: 0.95; }
          20% { opacity: 0.8; }
          30% { opacity: 0.6; transform: scale(0.99); }
          35% { opacity: 0.9; }
          50% { opacity: 0.95; }
          60% { opacity: 0.8; }
          70% { opacity: 0.75; transform: scale(1.02); }
          80% { opacity: 0.9; }
          90% { opacity: 0.85; }
          100% { opacity: 0.9; transform: scale(1); }
        }
        .animate-flicker {
          animation: flicker 6s infinite steps(12);
        }
      `}</style>
    </div>
  );
};

export default DustySpotlight;
