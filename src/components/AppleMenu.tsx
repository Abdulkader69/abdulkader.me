"use client";

import { motion } from "motion/react";

type MenuEntry =
  | { divider: true }
  | { divider?: false; label: string; action?: "settings"; disabled?: boolean };

const menuItems: MenuEntry[] = [
  { label: "About This Mac" },
  { divider: true },
  { label: "System Settings...", action: "settings" },
  { label: "App Store...", disabled: true },
  { divider: true },
  { label: "Recent Items", disabled: true },
  { divider: true },
  { label: "Force Quit...", disabled: true },
  { divider: true },
  { label: "Sleep", disabled: true },
  { label: "Restart...", disabled: true },
  { label: "Shut Down...", disabled: true },
  { divider: true },
  { label: "Lock Screen", disabled: true },
  { label: "Log Out...", disabled: true },
];

export default function AppleMenu({ onOpenSettings }: { onOpenSettings: () => void }) {
  return (
    <motion.div
      className="absolute top-6 left-0 z-50 w-64 rounded-lg border border-black/10 bg-white/80 py-1 text-[13px] font-normal text-black shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-neutral-800/80 dark:text-white"
      style={{ transformOrigin: "top left" }}
      initial={{ opacity: 0, scale: 0.92, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -6 }}
      transition={{ type: "spring", stiffness: 500, damping: 32, mass: 0.6 }}
    >
      {menuItems.map((item, i) =>
        item.divider ? (
          <div key={i} className="my-1 h-px bg-black/10 dark:bg-white/10" />
        ) : (
          <button
            key={i}
            disabled={item.disabled}
            onClick={item.action === "settings" ? onOpenSettings : undefined}
            className="flex w-full items-center px-3 py-1 text-left disabled:text-black/30 enabled:hover:bg-[var(--accent)] enabled:hover:text-white dark:disabled:text-white/30"
          >
            {item.label}
          </button>
        )
      )}
    </motion.div>
  );
}
