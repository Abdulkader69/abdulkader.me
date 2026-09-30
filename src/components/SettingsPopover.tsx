"use client";

import { motion } from "motion/react";
import { useDesktop } from "@/context/DesktopContext";
import { accentColors } from "@/lib/accentColors";
import { wallpapers } from "@/lib/wallpapers";

export default function SettingsPopover() {
  const {
    darkMode,
    setDarkMode,
    accent,
    setAccent,
    wallpaperId,
    setWallpaperId,
    brightness,
    setBrightness,
    dockSize,
    setDockSize,
  } = useDesktop();

  return (
    <motion.div
      className="absolute top-6 right-0 z-50 max-h-[80vh] w-80 max-w-[calc(100vw-1rem)] overflow-y-auto rounded-2xl border border-black/10 bg-white/80 p-4 text-black shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-800/80 dark:text-white"
      style={{ transformOrigin: "top right" }}
      initial={{ opacity: 0, scale: 0.92, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.6 }}
    >
      <p className="mb-3 text-[15px] font-semibold">Settings</p>

      <div className="flex items-center justify-between rounded-lg bg-black/5 px-3 py-2 dark:bg-white/5">
        <span className="text-[13px]">Dark Mode</span>
        <button
          role="switch"
          aria-checked={darkMode}
          onClick={() => setDarkMode(!darkMode)}
          className={`h-[22px] w-[38px] rounded-full transition-colors ${
            darkMode ? "bg-[var(--accent)]" : "bg-black/20 dark:bg-white/20"
          }`}
        >
          <motion.span
            className="block h-[18px] w-[18px] rounded-full bg-white shadow"
            animate={{ x: darkMode ? 18 : 2 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          />
        </button>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[13px] text-black/60 dark:text-white/60">Accent Color</p>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((c) => (
            <motion.button
              key={c.id}
              aria-label={c.name}
              title={c.name}
              onClick={() => setAccent(c.id)}
              className="h-6 w-6 rounded-full"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              style={{
                backgroundColor: c.hex,
                outline: accent === c.id ? "2px solid currentColor" : "2px solid transparent",
                outlineOffset: "2px",
              }}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 text-[13px] text-black/60 dark:text-white/60">Wallpaper</p>
        <div className="grid grid-cols-3 gap-2">
          {wallpapers.map((w) => (
            <motion.button
              key={w.id}
              onClick={() => setWallpaperId(w.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
              className={`h-12 rounded-lg border-2 ${
                wallpaperId === w.id ? "border-[var(--accent)]" : "border-transparent"
              }`}
              style={{ background: darkMode ? w.dark : w.light }}
              aria-label={w.name}
              title={w.name}
            />
          ))}
        </div>
      </div>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-[13px] text-black/60 dark:text-white/60">
          <span>Brightness</span>
          <span>{brightness}%</span>
        </div>
        <input
          type="range"
          min={20}
          max={100}
          value={brightness}
          onChange={(e) => setBrightness(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
      </div>

      <div className="mt-4 border-t border-black/10 pt-3 dark:border-white/10">
        <p className="mb-2 text-[13px] font-semibold">Dock</p>

        <div className="mb-1 text-[13px] text-black/60 dark:text-white/60">Size</div>
        <input
          type="range"
          min={32}
          max={72}
          value={dockSize}
          onChange={(e) => setDockSize(Number(e.target.value))}
          className="w-full accent-[var(--accent)]"
        />
        <div className="flex justify-between text-[11px] text-black/45 dark:text-white/45">
          <span>Small</span>
          <span>Large</span>
        </div>
      </div>
    </motion.div>
  );
}
