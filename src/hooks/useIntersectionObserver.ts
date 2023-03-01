import { useEffect, useRef, useState } from "react";

/**
 * Hook to create an intersection observer.
 * @returns { observerRef, isIntersecting }
 */
const useIntersectionObserver = (rootMargin = "0px", threshold = 1) => {
  const observerRef = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const { current: node } = observerRef;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.intersectionRatio >= threshold);
        });
      },
      { rootMargin, threshold }
    );
    observer.observe(node);

    return () => {
      if (node) {
        observer.unobserve(node);
      }
    };
  }, [observerRef, rootMargin, threshold, setIsIntersecting]);

  return { observerRef, isIntersecting };
};

export default useIntersectionObserver;
