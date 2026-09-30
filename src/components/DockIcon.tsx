"use client";

import { ReactNode, useState } from "react";
import { motion } from "motion/react";
import type { Point } from "@/context/DesktopContext";

export default function DockIcon({
  label,
  onClick,
  children,
  size,
  bouncing,
  running,
}: {
  label: string;
  onClick: (origin: Point) => void;
  children: ReactNode;
  size: number;
  bouncing: boolean;
  running: boolean;
}) {
  const [hover, setHover] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    onClick({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
  };

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      {hover && (
        <span
          className="pointer-events-none absolute whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-xs text-white"
          style={{ bottom: size + 14 }}
        >
          {label}
        </span>
      )}

      <motion.button
        onClick={handleClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label={label}
        style={{ width: size, height: size, transformOrigin: "bottom center" }}
        whileHover={{ scale: 1.12 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <motion.div
          className="h-full w-full"
          animate={{ y: bouncing ? [0, -24, 0, -11, 0, -4, 0] : 0 }}
          transition={
            bouncing
              ? { duration: 0.9, times: [0, 0.2, 0.42, 0.58, 0.76, 0.88, 1], ease: "easeOut" }
              : { duration: 0.2 }
          }
        >
          {children}
        </motion.div>
      </motion.button>

      {running && (
        <motion.span
          className="absolute -bottom-1 h-1 w-1 rounded-full bg-black/50 dark:bg-white/70"
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  );
}
