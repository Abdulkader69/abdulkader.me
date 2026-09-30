"use client";

import AppWindow from "../AppWindow";
import { FiFolder, FiDownload, FiFileText, FiImage, FiMusic, FiHardDrive } from "react-icons/fi";

const favoriteFolders = [
  { label: "Desktop", icon: FiFolder },
  { label: "Documents", icon: FiFileText },
  { label: "Downloads", icon: FiDownload },
  { label: "Pictures", icon: FiImage },
  { label: "Music", icon: FiMusic },
  { label: "Macintosh HD", icon: FiHardDrive },
];

export default function FinderWindow({ onClose }: { onClose: () => void }) {
  return (
    <AppWindow title="Finder" onClose={onClose}>
      <div className="flex h-full text-[13px]">
        <div className="hidden w-40 shrink-0 border-r border-black/10 bg-black/[0.03] p-3 sm:block dark:border-white/10 dark:bg-white/[0.03]">
          <p className="mb-1 px-1 text-[11px] font-semibold text-black/40 dark:text-white/40">Favorites</p>
          {favoriteFolders.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-2 rounded px-1 py-1 hover:bg-[var(--accent)] hover:text-white"
            >
              <f.icon size={14} />
              {f.label}
            </div>
          ))}
        </div>
        <div className="grid flex-1 auto-rows-min grid-cols-3 gap-4 p-5">
          {favoriteFolders.map((f) => (
            <div key={f.label} className="flex flex-col items-center gap-1 text-center">
              <f.icon size={36} className="text-[var(--accent)]" />
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </AppWindow>
  );
}
