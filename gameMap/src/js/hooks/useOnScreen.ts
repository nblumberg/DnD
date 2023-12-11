import { MutableRefObject, useEffect, useState } from "react";

export function useOnScreen(ref: MutableRefObject<HTMLElement>): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        const entry = entries.find((entry) => entry.target === ref.current);
        if (!entry) {
          return;
        }
        if (entry.isIntersecting) {
          setVisible(true);
        } else {
          setVisible(false);
        }
      },
      {
        root: null, // viewport
        threshold: 0, // as soon as 1px is visible
      }
    );

    observer.observe(ref.current);
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref.current]);

  return visible;
}
