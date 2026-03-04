"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type LazyViewportSectionProps = {
  children: ReactNode;
  className?: string;
  rootMargin?: string;
  minHeight?: number;
  fallback?: ReactNode;
  eager?: boolean;
};

export default function LazyViewportSection({
  children,
  className,
  rootMargin = "400px 0px",
  minHeight = 0,
  fallback = null,
  eager = false,
}: LazyViewportSectionProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(eager);

  useEffect(() => {
    if (isVisible) return;

    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { root: null, rootMargin, threshold: 0.01 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible, rootMargin]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={!isVisible && minHeight > 0 ? { minHeight: `${minHeight}px` } : undefined}
    >
      {isVisible ? children : fallback}
    </div>
  );
}

