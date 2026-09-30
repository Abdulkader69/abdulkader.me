"use client";

import { useEffect, useState, type PointerEvent } from "react";
import { AnimatePresence, LayoutGroup, motion } from "motion/react";
import { SiWordpress, SiLaravel } from "react-icons/si";
import {
  FiSliders,
  FiLayout,
  FiShoppingCart,
  FiZap,
  FiPenTool,
  FiTrendingUp,
  FiX,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import AppWindow from "../AppWindow";

type Service = { title: string; description: string; Icon: IconType; color: string; tags: string[] };

// Copy is taken verbatim from the "What Do I Do?" section of abdulkader.me.
const services: Service[] = [
  {
    title: "WordPress Development",
    description: "Design a WordPress site from scratch and include functionality as you want.",
    Icon: SiWordpress,
    color: "#21759B",
    tags: ["WordPress", "PHP", "ACF"],
  },
  {
    title: "Theme Customization",
    description: "Customize any theme or template to match users desire.",
    Icon: FiSliders,
    color: "#8b5cf6",
    tags: ["Elementor", "Divi", "CSS"],
  },
  {
    title: "Theme Creation",
    description: "Create branding themes for companies and themes for marketplace as well.",
    Icon: FiLayout,
    color: "#ec4899",
    tags: ["Custom Themes", "Branding", "Marketplace"],
  },
  {
    title: "E-Commerce Development",
    description: "Ecommerce website with lots of feature and bug free, secure payment method.",
    Icon: FiShoppingCart,
    color: "#f59e0b",
    tags: ["WooCommerce", "Payments", "Security"],
  },
  {
    title: "Speed Optimization",
    description: "Optimize website speed and make loading speed A+ grade like any premium websites.",
    Icon: FiZap,
    color: "#10b981",
    tags: ["Core Web Vitals", "Caching", "Images"],
  },
  {
    title: "Web Template Design",
    description: "Create Web Template mockup for your website with Adobe Creative Cloud Apps.",
    Icon: FiPenTool,
    color: "#f43f5e",
    tags: ["Photoshop", "Illustrator", "Adobe XD"],
  },
  {
    title: "SEO Optimization",
    description: "Make your website more enrich with keyword base search, article writing and link building.",
    Icon: FiTrendingUp,
    color: "#0ea5e9",
    tags: ["Keywords", "Content", "Link Building"],
  },
  {
    title: "Custom Websites",
    description: "Create advanced website using custom php frameworks like (laravel) or basic php website.",
    Icon: SiLaravel,
    color: "#FF2D20",
    tags: ["Laravel", "PHP", "MySQL"],
  },
];

const num = (i: number) => String(i + 1).padStart(2, "0");

export default function ServicesWindow({ onClose }: { onClose: () => void }) {
  const [open, setOpen] = useState<number | null>(null);

  // Escape closes an expanded card before it closes the window: this
  // capture-phase listener runs ahead of AppWindow's and swallows the key.
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopImmediatePropagation();
        setOpen(null);
      } else if (e.key === "ArrowRight") setOpen((i) => ((i ?? 0) + 1) % services.length);
      else if (e.key === "ArrowLeft") setOpen((i) => ((i ?? 0) - 1 + services.length) % services.length);
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  return (
    <AppWindow
      title="What Do I Do?"
      onClose={onClose}
      widthClass="w-[920px] max-w-[94vw]"
      heightClass="h-[600px] max-h-[86vh]"
    >
      <LayoutGroup>
        <div className="relative h-full overflow-y-auto p-6 text-black/80 dark:text-white/85">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-5"
          >
            <h1 className="text-[26px] font-extrabold">
              What Do I{" "}
              <span className="bg-linear-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">Do?</span>
            </h1>
            <p className="text-[12px] text-black/45 dark:text-white/45">
              {services.length} services · click a card to learn more
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s, i) => (
              <ServiceCard key={s.title} service={s} index={i} onOpen={() => setOpen(i)} />
            ))}
          </div>

          <AnimatePresence>
            {open !== null && (
              <ServiceDetail
                key="detail"
                index={open}
                onClose={() => setOpen(null)}
                onStep={(d) => setOpen((i) => ((i ?? 0) + d + services.length) % services.length)}
              />
            )}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </AppWindow>
  );
}

function ServiceCard({ service: s, index, onOpen }: { service: Service; index: number; onOpen: () => void }) {
  // A spotlight follows the pointer across the card.
  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <motion.button
      layoutId={`service-${index}`}
      onClick={onOpen}
      onPointerMove={onMove}
      initial={{ opacity: 0, y: 20, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 28, delay: 0.05 + index * 0.045 }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group relative overflow-hidden rounded-2xl border border-black/10 bg-white p-4 text-left shadow-sm dark:border-white/10 dark:bg-neutral-800/80"
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), ${s.color}2e, transparent 70%)`,
        }}
      />
      <div className="relative flex items-start justify-between">
        <motion.span
          layoutId={`service-icon-${index}`}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-md transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
          style={{ background: s.color, boxShadow: `0 8px 20px -8px ${s.color}` }}
        >
          <s.Icon size={22} />
        </motion.span>
        <span className="font-mono text-[11px] text-black/25 dark:text-white/25">{num(index)}</span>
      </div>
      <motion.h3
        layoutId={`service-title-${index}`}
        className="relative mt-4 text-[14px] leading-snug font-bold text-black/85 dark:text-white/90"
      >
        {s.title}
      </motion.h3>
      <p className="relative mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-black/55 dark:text-white/55">
        {s.description}
      </p>
      <span
        className="relative mt-3 block h-0.5 w-8 rounded-full transition-all duration-300 group-hover:w-16"
        style={{ background: s.color }}
      />
    </motion.button>
  );
}

function ServiceDetail({
  index,
  onClose,
  onStep,
}: {
  index: number;
  onClose: () => void;
  onStep: (delta: number) => void;
}) {
  const s = services[index];
  return (
    <>
      <motion.div
        className="absolute inset-0 z-10 bg-white/60 backdrop-blur-sm dark:bg-neutral-900/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center p-6">
        <motion.div
          layoutId={`service-${index}`}
          className="pointer-events-auto relative w-full max-w-md overflow-hidden rounded-3xl border border-black/10 bg-white p-7 shadow-2xl dark:border-white/10 dark:bg-neutral-800"
          transition={{ type: "spring", stiffness: 340, damping: 32 }}
        >
          <span
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full opacity-30 blur-3xl"
            style={{ background: s.color }}
          />
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 flex h-7 w-7 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <FiX size={14} />
          </button>

          <motion.span
            layoutId={`service-icon-${index}`}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl text-white"
            style={{ background: s.color, boxShadow: `0 14px 30px -10px ${s.color}` }}
          >
            <s.Icon size={32} />
          </motion.span>
          <p className="relative mt-5 font-mono text-[12px]" style={{ color: s.color }}>
            Service {num(index)} / {num(services.length - 1)}
          </p>
          <motion.h3
            layoutId={`service-title-${index}`}
            className="relative mt-1 text-[24px] leading-tight font-extrabold text-black/90 dark:text-white"
          >
            {s.title}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="relative mt-3 text-[14px] leading-relaxed text-black/65 dark:text-white/70"
          >
            {s.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative mt-5 flex flex-wrap gap-1.5"
          >
            {s.tags.map((t) => (
              <span
                key={t}
                className="rounded-full px-2.5 py-1 text-[11px] font-medium"
                style={{ background: `${s.color}1f`, color: s.color }}
              >
                {t}
              </span>
            ))}
          </motion.div>

          <div className="relative mt-7 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/10">
            <button
              onClick={() => onStep(-1)}
              className="flex items-center gap-1 text-[12px] text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
            >
              <FiChevronLeft /> {services[(index - 1 + services.length) % services.length].title}
            </button>
            <button
              onClick={() => onStep(1)}
              className="flex items-center gap-1 text-[12px] text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white"
            >
              {services[(index + 1) % services.length].title} <FiChevronRight />
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
}
