'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FaApple } from 'react-icons/fa';
import SettingsIcon from './icons/SettingsIcon';
import AppleMenu from './AppleMenu';
import SettingsPopover from './SettingsPopover';
import { useDesktop } from '@/context/DesktopContext';

const menuApps = [
  { id: 'projects', label: 'Projects' },
  { id: 'services', label: 'What I Do' },
  { id: 'process', label: 'How I Work' },
  { id: 'mail', label: 'Contact' },
];

function useClock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function MenuBar() {
  const [appleOpen, setAppleOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const now = useClock();
  const { openApp, launchApp } = useDesktop();

  const dateStr = now
    ? now.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      })
    : '';
  const timeStr = now ? now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) : '';

  const closeAll = () => {
    setAppleOpen(false);
    setSettingsOpen(false);
  };

  return (
    <>
      {(appleOpen || settingsOpen) && (
        <button
          aria-label="Close menu"
          className="fixed inset-0 z-40 cursor-default"
          onClick={closeAll}
        />
      )}
      <motion.div
        className="fixed inset-x-0 top-0 z-50 flex h-8 items-center justify-between bg-black/20 px-4 text-[13px] font-medium text-white backdrop-blur-xl [text-shadow:0_1px_1px_rgba(0,0,0,0.25)] dark:bg-black/30"
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -28, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 30,
          delay: 0.15,
        }}
      >
        <div className="-ml-2 flex items-center gap-0.5">
          <div className="relative flex">
            <button
              onClick={() => {
                setAppleOpen((v) => !v);
                setSettingsOpen(false);
              }}
              className={`flex h-6 items-center rounded px-2 transition-colors hover:bg-white/20 ${
                appleOpen ? 'bg-white/20' : ''
              }`}
              aria-label="Apple menu"
            >
              <FaApple size={15} />
            </button>
            <AnimatePresence>
              {appleOpen && (
                <AppleMenu
                  onOpenSettings={() => {
                    setSettingsOpen(true);
                    setAppleOpen(false);
                  }}
                />
              )}
            </AnimatePresence>
          </div>
          <span className="hidden px-2 font-semibold sm:inline">Finder</span>
          {menuApps.map((app) => (
            <button
              key={app.id}
              onClick={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                closeAll();
                launchApp(app.id, { x: r.left + r.width / 2, y: r.top + r.height / 2 });
              }}
              className={`hidden h-6 items-center rounded px-2 whitespace-nowrap transition-colors sm:flex hover:bg-white/20 ${
                openApp === app.id ? 'bg-white/20 text-white' : 'text-white/80'
              }`}
            >
              {app.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex">
            <button
              onClick={() => {
                setSettingsOpen((v) => !v);
                setAppleOpen(false);
              }}
              className="flex items-center hover:opacity-70"
              aria-label="Settings"
            >
              <SettingsIcon size={15} />
            </button>
            <AnimatePresence>
              {settingsOpen && <SettingsPopover />}
            </AnimatePresence>
          </div>
          <span className="whitespace-nowrap tabular-nums">
            <span className="hidden sm:inline">{dateStr}&nbsp;&nbsp;</span>
            {timeStr}
          </span>
        </div>
      </motion.div>
    </>
  );
}
