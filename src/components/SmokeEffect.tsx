
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

    const particles: Particle[] = [];
    const particleCount = 30;

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
        // Normal: 0.08 (Subtle)
        // High: 0.35 (Dense fog)
        const targetMaxOpacity = isHighIntensity ? 0.35 : 0.08;

        // Smoothly transition opacity
        if (this.life > this.maxLife * 0.8) {
          if (this.opacity < targetMaxOpacity) this.opacity += 0.002; // Fade in faster
        } else if (this.life < this.maxLife * 0.4) {
          this.opacity -= 0.001;
        } else {
          // Adjust existing opacity towards target if state changed mid-life
          if (this.opacity < targetMaxOpacity) {
            this.opacity += 0.001;
          } else if (this.opacity > targetMaxOpacity && !isHighIntensity) {
            this.opacity -= 0.005; // Fade out quickly if switching back to normal
          }
        }

        if (this.opacity < 0) this.opacity = 0;

        if (this.life <= 0 || this.y < -200 || (this.opacity <= 0 && this.life < this.maxLife / 2)) {
          this.reset();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.opacity <= 0) return;

        ctx.beginPath();
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);

        // Dark theme: White smoke (Screen blend)
        // Light theme: Dark Grey ink (Multiply blend)
        const isDark = themeRef.current === 'dark';

        const r = isDark ? 180 : 30;
        const g = isDark ? 190 : 30;
        const b = isDark ? 200 : 35;

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let animationFrameId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Switch Blend Mode based on theme
      // Dark mode = Screen (Lights up background)
      // Light mode = Multiply (Darkens background like ink)
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
