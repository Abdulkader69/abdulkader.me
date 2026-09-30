"use client";

import { useEffect, useState } from "react";

export type Viewport = { vw: number; vh: number };

/** Live viewport size. Null until mounted, since the server has no window. */
export function useViewport(): Viewport | null {
  const [size, setSize] = useState<Viewport | null>(null);

  useEffect(() => {
    const read = () => setSize({ vw: window.innerWidth, vh: window.innerHeight });
    read();

    // Debounced: the cards remount on each change so drag state re-measures
    // cleanly, and we don't want that firing on every pixel of a resize.
    let t: number;
    const onResize = () => {
      window.clearTimeout(t);
      t = window.setTimeout(read, 150);
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return size;
}

export const clamp = (min: number, value: number, max: number) =>
  Math.round(Math.min(max, Math.max(min, value)));
