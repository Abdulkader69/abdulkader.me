'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { useDesktop, type Point } from '@/context/DesktopContext';
import DockIcon from './DockIcon';
import { VscTerminal } from 'react-icons/vsc';
import { FiBriefcase, FiLayers, FiCompass } from 'react-icons/fi';
import { IoMail } from 'react-icons/io5';

/** Glyph sizes are a fraction of the icon box so they scale with the Size setting. */
const apps: { id: string; label: string; render: (px: number) => ReactNode }[] =
  [
    {
      id: 'projects',
      label: 'Projects',
      render: (px) => (
        <div className="flex h-full w-full items-center justify-center rounded-[22%] bg-linear-to-br from-amber-400 via-pink-500 to-violet-600 text-white shadow-inner">
          <FiBriefcase size={px * 0.48} />
        </div>
      ),
    },
    {
      id: 'services',
      label: 'What Do I Do?',
      render: (px) => (
        <div className="flex h-full w-full items-center justify-center rounded-[22%] bg-linear-to-br from-sky-400 to-indigo-600 text-white shadow-inner">
          <FiLayers size={px * 0.48} />
        </div>
      ),
    },
    {
      id: 'process',
      label: 'How I Work',
      render: (px) => (
        <div className="flex h-full w-full items-center justify-center rounded-[22%] bg-linear-to-br from-emerald-400 to-teal-600 text-white shadow-inner">
          <FiCompass size={px * 0.5} />
        </div>
      ),
    },
    {
      id: 'mail',
      label: 'Contact',
      render: (px) => (
        <div className="flex h-full w-full items-center justify-center rounded-[22%] bg-linear-to-br from-sky-400 via-blue-500 to-indigo-600 text-white shadow-inner">
          <IoMail size={px * 0.52} />
        </div>
      ),
    },
    {
      id: 'terminal',
      label: 'Terminal',
      render: (px) => (
        <div className="flex h-full w-full items-center justify-center rounded-[22%] bg-black">
          <VscTerminal size={px * 0.5} className="text-white" />
        </div>
      ),
    },
  ];

export default function Dock() {
  const { openApp, launchApp, dockSize } = useDesktop();
  const bounceTimer = useRef<number | null>(null);
  const [bouncingId, setBouncingId] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (bounceTimer.current) window.clearTimeout(bounceTimer.current);
    };
  }, []);

  const handleLaunch = (id: string, origin: Point) => {
    launchApp(id, origin);
    setBouncingId(id);
    if (bounceTimer.current) window.clearTimeout(bounceTimer.current);
    bounceTimer.current = window.setTimeout(() => setBouncingId(null), 950);
  };

  return (
    <motion.div
      className="fixed inset-x-0 bottom-2 z-40 flex justify-center"
      initial={{ y: 130, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 130, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26, delay: 0.28 }}
    >
      <div className="flex items-end gap-3 rounded-2xl border border-white/30 bg-white/25 px-3 py-2 shadow-2xl backdrop-blur-2xl dark:border-white/10 dark:bg-white/10">
        {apps.map((app) => (
          <DockIcon
            key={app.id}
            label={app.label}
            onClick={(origin) => handleLaunch(app.id, origin)}
            size={dockSize}
            bouncing={bouncingId === app.id}
            running={openApp === app.id}
          >
            {app.render(dockSize)}
          </DockIcon>
        ))}
      </div>
    </motion.div>
  );
}
