
import { useEffect, useRef, useState, type FC, type ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  width?: 'fit-content' | '100%';
  delay?: number;
  className?: string;
}

const RevealOnScroll: FC<RevealProps> = ({
  children,
  width = 'fit-content',
  delay = 0,
  className = ""
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Once visible, we can stop observing to keep it visible (or remove this line to toggle on scroll up/down)
          if (ref.current) observer.unobserve(ref.current);
        }
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is fully in view
        threshold: 0.1,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const transitionDelay = `${delay}s`;

  return (
    <div
      ref={ref}
      className={`${className} transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0 filter blur-0' : 'opacity-0 translate-y-12 filter blur-sm'
        }`}
      style={{ width, transitionDelay }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
