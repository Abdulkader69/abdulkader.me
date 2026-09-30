"use client";

import type { ReactNode } from "react";
import { motion } from "motion/react";
import { FaChrome } from "react-icons/fa";
import { VscVscode, VscTerminal } from "react-icons/vsc";
import { useDesktop } from "@/context/DesktopContext";
import { FiBriefcase, FiLayers, FiCompass, FiMail, FiCalendar, FiMap, FiMusic, FiCamera, FiMessageCircle } from "react-icons/fi";
import FinderIcon from "../icons/FinderIcon";

const apps: { label: string; node: ReactNode; launch?: string }[] = [
  { label: "Finder", node: <FinderIcon className="h-14 w-14" /> },
  {
    label: "Projects",
    launch: "projects",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-br from-amber-400 via-pink-500 to-violet-600">
        <FiBriefcase size={28} className="text-white" />
      </div>
    ),
  },
  {
    label: "What Do I Do?",
    launch: "services",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-br from-sky-400 to-indigo-600">
        <FiLayers size={28} className="text-white" />
      </div>
    ),
  },
  {
    label: "How I Work",
    launch: "process",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-br from-emerald-400 to-teal-600">
        <FiCompass size={28} className="text-white" />
      </div>
    ),
  },
  {
    label: "Google Chrome",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white">
        <FaChrome size={34} className="text-[#4285F4]" />
      </div>
    ),
  },
  {
    label: "Visual Studio Code",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-[#1e1e1e]">
        <VscVscode size={30} className="text-[#3c99d4]" />
      </div>
    ),
  },
  {
    label: "Terminal",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-black">
        <VscTerminal size={28} className="text-white" />
      </div>
    ),
  },
  {
    label: "Mail",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-b from-sky-400 to-blue-600">
        <FiMail size={26} className="text-white" />
      </div>
    ),
  },
  {
    label: "Calendar",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-white">
        <FiCalendar size={26} className="text-red-500" />
      </div>
    ),
  },
  {
    label: "Maps",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-b from-green-300 to-emerald-500">
        <FiMap size={26} className="text-white" />
      </div>
    ),
  },
  {
    label: "Music",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-b from-pink-400 to-rose-600">
        <FiMusic size={26} className="text-white" />
      </div>
    ),
  },
  {
    label: "Photos",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-br from-yellow-300 via-pink-400 to-purple-500">
        <FiCamera size={26} className="text-white" />
      </div>
    ),
  },
  {
    label: "Messages",
    node: (
      <div className="flex h-14 w-14 items-center justify-center rounded-[22%] bg-linear-to-b from-green-400 to-green-500">
        <FiMessageCircle size={26} className="text-white" />
      </div>
    ),
  },
];

export default function LaunchpadWindow({ onClose }: { onClose: () => void }) {
  const { launchApp } = useDesktop();

  return (
    <motion.div
      className="fixed inset-0 z-60 flex items-center justify-center bg-black/30 backdrop-blur-3xl"
      onClick={onClose}
      initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
      animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
      exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div
        className="grid grid-cols-3 gap-x-6 gap-y-6 p-6 sm:grid-cols-4 sm:gap-x-8 sm:p-8 md:grid-cols-5"
        onClick={(e) => e.stopPropagation()}
      >
        {apps.map((a, i) => (
          <motion.button
            key={a.label}
            onClick={() => (a.launch ? launchApp(a.launch) : onClose())}
            className="flex flex-col items-center gap-2 text-[12px] text-white"
            initial={{ opacity: 0, scale: 0.55 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            transition={{
              type: "spring",
              stiffness: 420,
              damping: 26,
              delay: i * 0.022,
            }}
          >
            {a.node}
            {a.label}
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
