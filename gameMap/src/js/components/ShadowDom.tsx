import { ReactNode, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

export function ShadowDom({ children }: { children?: ReactNode }) {
  const ref = useRef<HTMLDivElement>();
  useEffect(() => {
    if (!ref.current) {
      return;
    }

    const shadow = ref.current.attachShadow({ mode: "closed" });
    const root = createRoot(shadow);
    root.render(children);
  }, [ref.current]);
  return <div data-shadow-host ref={ref}></div>;
}
