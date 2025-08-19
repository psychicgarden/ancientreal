import { useEffect, useRef, useState } from 'react';

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export const useLazyLoad = (options: UseLazyLoadOptions = {}) => {
  const {
    threshold = 0.1,
    rootMargin = '50px',
    triggerOnce = true
  } = options;

  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element || !('IntersectionObserver' in window)) {
      setIsIntersecting(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting;
        
        if (isVisible && !hasTriggered) {
          setIsIntersecting(true);
          setHasTriggered(true);
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(isVisible);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return { ref, isIntersecting, hasTriggered };
};

export const useLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options?: UseLazyLoadOptions
) => {
  const [Component, setComponent] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { ref, isIntersecting } = useLazyLoad(options);

  useEffect(() => {
    if (isIntersecting && !Component && !loading) {
      setLoading(true);
      importFunc()
        .then(module => {
          setComponent(() => module.default);
          setError(null);
        })
        .catch(err => {
          setError(err);
          console.error('Failed to load component:', err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isIntersecting, Component, loading, importFunc]);

  return { ref, Component, loading, error, isIntersecting };
};