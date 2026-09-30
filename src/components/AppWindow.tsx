"use client";

import { ReactNode, useEffect } from "react";
import { motion } from "motion/react";
import { useDesktop } from "@/context/DesktopContext";

export default function AppWindow({
  title,
  onClose,
  children,
  widthClass = "w-[640px] max-w-[92vw]",
  heightClass = "h-[440px] max-h-[80vh]",
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  widthClass?: string;
  heightClass?: string;
}) {
  const { launchOrigin } = useDesktop();

  // The window is centered, so translating by (origin - viewport centre) parks it
  // on the dock icon it was launched from — it then grows out of, and shrinks
  // back into, that icon.
  const hasWindow = typeof window !== "undefined";
  const dx = launchOrigin && hasWindow ? launchOrigin.x - window.innerWidth / 2 : 0;
  const dy = launchOrigin && hasWindow ? launchOrigin.y - window.innerHeight / 2 : 0;

  const collapsed = { opacity: 0, scale: 0.18, x: dx, y: dy };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Windows are not modal: the wrapper lets clicks through so the dock and menu
  // bar stay live behind them, exactly as on a real desktop.
  return (
    <div className="pointer-events-none fixed inset-0 z-60 flex items-center justify-center">
      <motion.div
        className={`pointer-events-auto relative z-61 ${widthClass} ${heightClass} overflow-hidden rounded-xl border border-black/10 bg-white/90 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-900/90`}
        initial={collapsed}
        animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        exit={collapsed}
        transition={{ type: "spring", stiffness: 320, damping: 30, mass: 0.9 }}
      >
        <div className="flex h-9 items-center gap-2 border-b border-black/10 bg-neutral-200/70 px-3 dark:border-white/10 dark:bg-neutral-800/70">
          <button
            onClick={onClose}
            className="h-3 w-3 rounded-full bg-[#ff5f57] ring-1 ring-black/10 transition-transform hover:scale-110"
            aria-label="Close window"
          />
          <span className="h-3 w-3 rounded-full bg-[#febc2e] ring-1 ring-black/10" />
          <span className="h-3 w-3 rounded-full bg-[#28c840] ring-1 ring-black/10" />
          <span className="flex-1 text-center text-[13px] font-medium text-black/70 dark:text-white/70">
            {title}
          </span>
          <span className="w-12" />
        </div>
        <div className="h-[calc(100%-2.25rem)] overflow-auto">{children}</div>
      </motion.div>
    </div>
  );
}
