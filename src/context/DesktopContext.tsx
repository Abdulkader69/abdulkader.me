"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { wallpapers } from "@/lib/wallpapers";
import { accentColors } from "@/lib/accentColors";

type DesktopSettings = {
  darkMode: boolean;
  accent: string;
  wallpaperId: string;
  brightness: number;
  /** Dock icon size in px (the "Size" slider). */
  dockSize: number;
};

const DEFAULT_SETTINGS: DesktopSettings = {
  darkMode: true,
  accent: "blue",
  wallpaperId: wallpapers[0].id,
  brightness: 100,
  dockSize: 48,
};

const STORAGE_KEY = "mac-os-settings";

export type Point = { x: number; y: number };

type DesktopContextValue = DesktopSettings & {
  setDarkMode: (v: boolean) => void;
  setAccent: (id: string) => void;
  setWallpaperId: (id: string) => void;
  setBrightness: (v: number) => void;
  setDockSize: (v: number) => void;
  openApp: string | null;
  /** Screen point the open window should grow out of / shrink back into. */
  launchOrigin: Point | null;
  launchApp: (id: string, origin?: Point | null) => void;
  closeApp: () => void;
};

const DesktopContext = createContext<DesktopContextValue | null>(null);

export function DesktopProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<DesktopSettings>(DEFAULT_SETTINGS);
  const [openApp, setOpenApp] = useState<string | null>(null);
  const [launchOrigin, setLaunchOrigin] = useState<Point | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setSettings((s) => ({ ...s, ...JSON.parse(raw) }));
    } catch {
      // ignore malformed storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings, hydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", settings.darkMode);
  }, [settings.darkMode]);

  useEffect(() => {
    const accent = accentColors.find((a) => a.id === settings.accent) ?? accentColors[0];
    document.documentElement.style.setProperty("--accent", accent.hex);
    document.documentElement.style.setProperty("--accent-soft", accent.soft);
  }, [settings.accent]);

  const value: DesktopContextValue = {
    ...settings,
    setDarkMode: (v) => setSettings((s) => ({ ...s, darkMode: v })),
    setAccent: (id) => setSettings((s) => ({ ...s, accent: id })),
    setWallpaperId: (id) => setSettings((s) => ({ ...s, wallpaperId: id })),
    setBrightness: (v) => setSettings((s) => ({ ...s, brightness: v })),
    setDockSize: (v) => setSettings((s) => ({ ...s, dockSize: v })),
    openApp,
    launchOrigin,
    launchApp: (id, origin = null) => {
      setLaunchOrigin(origin);
      setOpenApp(id);
    },
    closeApp: () => setOpenApp(null),
  };

  return <DesktopContext.Provider value={value}>{children}</DesktopContext.Provider>;
}

export function useDesktop() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktop must be used within DesktopProvider");
  return ctx;
}
