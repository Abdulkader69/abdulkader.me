"use client";

import AppWindow from "../AppWindow";
import { FiArrowLeft, FiArrowRight, FiRotateCw, FiLock, FiPlus } from "react-icons/fi";

const shortcuts = [
  { label: "macOS Clone" },
  { label: "GitHub" },
  { label: "YouTube" },
  { label: "Gmail" },
];

export default function ChromeWindow({ onClose }: { onClose: () => void }) {
  return (
    <AppWindow
      title="Google Chrome"
      onClose={onClose}
      widthClass="w-[720px] max-w-[92vw]"
      heightClass="h-[480px] max-h-[85vh]"
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-black/10 px-3 py-2 dark:border-white/10">
          <FiArrowLeft className="text-black/40 dark:text-white/40" />
          <FiArrowRight className="text-black/40 dark:text-white/40" />
          <FiRotateCw className="text-black/60 dark:text-white/60" />
          <div className="flex flex-1 items-center gap-2 rounded-full bg-black/5 px-3 py-1 text-[12px] text-black/60 dark:bg-white/10 dark:text-white/60">
            <FiLock size={12} />
            macos.vercel.app
          </div>
          <FiPlus className="text-black/40 dark:text-white/40" />
        </div>
        <div className="flex flex-1 flex-col items-center justify-center gap-6">
          <p className="text-lg font-medium text-black/70 dark:text-white/70">New Tab</p>
          <div className="grid grid-cols-4 gap-4">
            {shortcuts.map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black/5 text-sm font-semibold dark:bg-white/10">
                  {s.label[0]}
                </div>
                <span className="text-[11px] text-black/60 dark:text-white/60">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppWindow>
  );
}
