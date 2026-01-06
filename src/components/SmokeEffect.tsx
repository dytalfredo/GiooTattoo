
import { useEffect, useRef, type FC } from 'react';

interface SmokeEffectProps {
  intensity?: 'normal' | 'high';
  theme?: 'dark' | 'light';
}

const SmokeEffect: FC<SmokeEffectProps> = ({ intensity = 'normal', theme = 'dark' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intensityRef = useRef(intensity);
  const themeRef = useRef(theme);

  // Keep ref in sync with prop for the animation loop
  useEffect(() => {
    intensityRef.current = intensity;
    themeRef.current = theme;
  }, [intensity, theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    const updateDimensions = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    const isMobile = width < 768;
    const particles: Particle[] = [];
    const particleCount = isMobile ? 15 : 30;

    // Pre-render a single smoke puff gradient to an offscreen canvas
    // This is the CRITICAL optimization: drawing an image is MUCH faster than createRadialGradient
    const puffSize = 200;
    const offscreenCanvas = document.createElement('canvas');
    offscreenCanvas.width = puffSize * 2;
    offscreenCanvas.height = puffSize * 2;
    const offCtx = offscreenCanvas.getContext('2d');

    if (offCtx) {
      const gradient = offCtx.createRadialGradient(puffSize, puffSize, 0, puffSize, puffSize, puffSize);
      // Use a neutral grey-white that can be tinted by globalCompositeOperation
      gradient.addColorStop(0, 'rgba(200, 210, 220, 1)');
      gradient.addColorStop(1, 'rgba(200, 210, 220, 0)');
      offCtx.fillStyle = gradient;
      offCtx.beginPath();
      offCtx.arc(puffSize, puffSize, puffSize, 0, Math.PI * 2);
      offCtx.fill();
    }

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      life: number;
      maxLife: number;
      opacity: number;
      growth: number;

      constructor() {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.size = 0;
        this.life = 0;
        this.maxLife = 0;
        this.opacity = 0;
        this.growth = 0;
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * width;
        this.y = height + (Math.random() * 200);
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = -Math.random() * 0.5 - 0.1;

        this.size = Math.random() * 100 + 80;
        this.growth = Math.random() * 0.1 + 0.02;
        this.maxLife = Math.random() * 400 + 300;
        this.life = this.maxLife;
        this.opacity = 0;

        if (initial) {
          this.y = height - (Math.random() * height);
          this.life = Math.random() * this.maxLife;
          this.opacity = Math.random() * 0.05;
        }
      }

      update() {
        // Dynamic physics based on intensity
        const isHighIntensity = intensityRef.current === 'high';

        // Slower movement in meditative state
        const speedMultiplier = isHighIntensity ? 0.5 : 1;

        this.x += this.vx * speedMultiplier;
        this.y += this.vy * speedMultiplier;

        // Particles grow larger in meditative state
        this.size += this.growth * (isHighIntensity ? 1.5 : 1);
        this.life--;

        // Determine target max opacity based on intensity
        const targetMaxOpacity = isHighIntensity ? 0.35 : 0.08;

        // Smoothly transition opacity
        if (this.life > this.maxLife * 0.8) {
          if (this.opacity < targetMaxOpacity) this.opacity += 0.002;
        } else if (this.life < this.maxLife * 0.4) {
          this.opacity -= 0.001;
        } else {
          if (this.opacity < targetMaxOpacity) {
            this.opacity += 0.001;
          } else if (this.opacity > targetMaxOpacity && !isHighIntensity) {
            this.opacity -= 0.005;
          }
        }

        if (this.opacity < 0) this.opacity = 0;

        if (this.life <= 0 || this.y < -200 || (this.opacity <= 0 && this.life < this.maxLife / 2)) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.opacity <= 0) return;

        ctx.save();
        ctx.globalAlpha = this.opacity;

        // Draw the pre-rendered puff instead of creating a gradient
        ctx.drawImage(
          offscreenCanvas,
          this.x - this.size,
          this.y - this.size,
          this.size * 2,
          this.size * 2
        );
        ctx.restore();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Switch Blend Mode based on theme
      ctx.globalCompositeOperation = themeRef.current === 'dark' ? 'screen' : 'multiply';

      particles.forEach(p => {
        p.update();
        p.draw(ctx);
      });

      ctx.globalCompositeOperation = 'source-over';

      animationFrameId = requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('resize', updateDimensions);
      cancelAnimationFrame(animationFrameId);
    };

  }, []); // Run once, refs handle updates

  return (
    <canvas
      ref={canvasRef}
      className={`fixed bottom-0 left-0 w-full h-full pointer-events-none z-30 transition-all duration-1000 ease-in-out ${theme === 'dark' ? 'mix-blend-screen' : 'mix-blend-multiply opacity-60'
        } ${intensity === 'high' ? 'blur-[8px]' : 'blur-[12px]'}`}
    />
  );
};

export default SmokeEffect;
