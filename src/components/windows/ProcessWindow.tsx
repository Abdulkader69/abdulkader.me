"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  FiMessageCircle,
  FiCpu,
  FiPenTool,
  FiCode,
  FiUploadCloud,
  FiLifeBuoy,
  FiChevronLeft,
  FiChevronRight,
  FiPlay,
  FiPause,
} from "react-icons/fi";
import type { IconType } from "react-icons";
import AppWindow from "../AppWindow";

type Step = { title: string; text: string; Icon: IconType; from: string; to: string };

// Adapted from the "How I Work" section of abdulkader.me.
const steps: Step[] = [
  {
    title: "Ask",
    text: "I start with a few simple questions. Your answers help me shape clear guidelines for your brand's online experience.",
    Icon: FiMessageCircle,
    from: "#38bdf8",
    to: "#6366f1",
  },
  {
    title: "Think",
    text: "I'm solution-oriented: where others see problems, I see opportunities. I find answers through creative thinking and open feedback. I'll always tell you the truth, and your feedback will never hurt my feelings.",
    Icon: FiCpu,
    from: "#a78bfa",
    to: "#d946ef",
  },
  {
    title: "Design",
    text: "I make data-driven UX decisions and keep innovating at every step. From mobile to tablet to large displays, everything I design looks great on any screen.",
    Icon: FiPenTool,
    from: "#f472b6",
    to: "#f43f5e",
  },
  {
    title: "Develop",
    text: "I bring designs to life and make websites move in ways you didn't think possible. Everything I build is modular, so it can grow with your business and stay current as the web changes.",
    Icon: FiCode,
    from: "#fb923c",
    to: "#f59e0b",
  },
  {
    title: "Deploy",
    text: "I test every project thoroughly before launch, so it goes live bug-free and ready to use.",
    Icon: FiUploadCloud,
    from: "#34d399",
    to: "#10b981",
  },
  {
    title: "Support",
    text: "I'm here to help. Reach out anytime, for anything you need. Ongoing technical support is part of the deal, so you can focus on growing your business, worry-free.",
    Icon: FiLifeBuoy,
    from: "#2dd4bf",
    to: "#0ea5e9",
  },
];

const STEP_MS = 7000;
const num = (i: number) => String(i + 1).padStart(2, "0");

export default function ProcessWindow({ onClose }: { onClose: () => void }) {
  const [[step, direction], setStep] = useState<[number, number]>([0, 0]);
  const [playing, setPlaying] = useState(true);

  const go = useCallback((to: number, dir: number) => {
    setStep([(to + steps.length) % steps.length, dir]);
  }, []);

  // Manual navigation pauses the tour; the play button resumes it.
  const jump = useCallback(
    (to: number, dir: number) => {
      setPlaying(false);
      go(to, dir);
    },
    [go],
  );

  useEffect(() => {
    if (!playing) return;
    const t = window.setTimeout(() => go(step + 1, 1), STEP_MS);
    return () => window.clearTimeout(t);
  }, [playing, step, go]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") jump(step + 1, 1);
      else if (e.key === "ArrowLeft") jump(step - 1, -1);
      else if (e.key === " ") {
        e.preventDefault();
        setPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, jump]);

  const s = steps[step];

  return (
    <AppWindow
      title="How I Work"
      onClose={onClose}
      widthClass="w-[860px] max-w-[94vw]"
      heightClass="h-[560px] max-h-[86vh]"
    >
      <div className="relative flex h-full flex-col overflow-hidden text-black/80 dark:text-white/85">
        {/* colour wash that shifts with each step */}
        <motion.div
          className="pointer-events-none absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
          animate={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
          transition={{ duration: 0.8 }}
        />

        <div className="relative px-6 pt-6">
          <h1 className="text-[26px] font-extrabold">
            How I{" "}
            <span className="bg-linear-to-r from-amber-400 to-violet-600 bg-clip-text text-transparent">Work</span>
          </h1>
          <p className="text-[12px] text-black/45 dark:text-white/45">Six steps from first question to ongoing support</p>
        </div>

        {/* stepper */}
        <div className="relative px-6 pt-6 sm:px-10">
          <div className="absolute top-[calc(1.5rem+22px)] right-10 left-10 hidden h-0.5 rounded-full bg-black/10 sm:block dark:bg-white/10">
            <motion.div
              className="h-full rounded-full"
              animate={{
                width: `${(step / (steps.length - 1)) * 100}%`,
                background: `linear-gradient(90deg, ${steps[0].from}, ${s.to})`,
              }}
              transition={{ type: "spring", stiffness: 120, damping: 20 }}
            />
          </div>
          <div className="relative flex justify-between">
            {steps.map((st, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <button key={st.title} onClick={() => jump(i, i > step ? 1 : -1)} className="group flex flex-col items-center gap-2">
                  <motion.span
                    animate={{ scale: active ? 1.12 : 1 }}
                    whileHover={{ scale: active ? 1.12 : 1.06 }}
                    transition={{ type: "spring", stiffness: 400, damping: 22 }}
                    className={`relative flex h-11 w-11 items-center justify-center rounded-full border-2 transition-colors ${
                      active || done
                        ? "border-transparent text-white"
                        : "border-black/10 bg-white text-black/40 dark:border-white/15 dark:bg-neutral-800 dark:text-white/40"
                    }`}
                    style={
                      active || done ? { background: `linear-gradient(135deg, ${st.from}, ${st.to})` } : undefined
                    }
                  >
                    {active && (
                      <motion.span
                        layoutId="process-ring"
                        className="absolute -inset-1.5 rounded-full border-2"
                        style={{ borderColor: st.from }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <st.Icon size={18} />
                  </motion.span>
                  <span
                    className={`text-[11px] font-semibold transition-colors ${
                      active ? "text-black/85 dark:text-white" : "text-black/40 dark:text-white/40"
                    }`}
                  >
                    {st.title}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* step content */}
        <div className="relative flex-1 overflow-hidden px-6 sm:px-10">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={{
                enter: (d: number) => ({ opacity: 0, x: d * 80, filter: "blur(6px)" }),
                center: { opacity: 1, x: 0, filter: "blur(0px)" },
                exit: (d: number) => ({ opacity: 0, x: d * -80, filter: "blur(6px)" }),
              }}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring", stiffness: 260, damping: 30 }}
              className="flex h-full flex-col items-start gap-6 py-6 sm:flex-row sm:items-center"
            >
              <div className="relative shrink-0">
                <span
                  className="block bg-clip-text text-[96px] leading-none font-black text-transparent sm:text-[132px]"
                  style={{ backgroundImage: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
                >
                  {num(step)}
                </span>
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16, delay: 0.1 }}
                  className="absolute -right-3 -bottom-1 flex h-12 w-12 items-center justify-center rounded-2xl text-white shadow-lg"
                  style={{
                    background: `linear-gradient(135deg, ${s.from}, ${s.to})`,
                    boxShadow: `0 12px 28px -10px ${s.to}`,
                  }}
                >
                  <s.Icon size={22} />
                </motion.span>
              </div>
              <div className="min-w-0 max-w-lg">
                <h2 className="text-[28px] font-extrabold text-black/90 dark:text-white">{s.title}</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-black/60 dark:text-white/65">{s.text}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* controls + autoplay progress */}
        <div className="relative flex items-center gap-3 border-t border-black/10 px-6 py-3 dark:border-white/10">
          <button
            onClick={() => jump(step - 1, -1)}
            aria-label="Previous step"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? "Pause" : "Play"}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white"
            style={{ background: `linear-gradient(135deg, ${s.from}, ${s.to})` }}
          >
            {playing ? <FiPause size={13} /> : <FiPlay size={13} className="translate-x-px" />}
          </button>
          <button
            onClick={() => jump(step + 1, 1)}
            aria-label="Next step"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20"
          >
            <FiChevronRight />
          </button>

          <div className="flex flex-1 gap-1.5">
            {steps.map((st, i) => (
              <button
                key={st.title}
                onClick={() => jump(i, i > step ? 1 : -1)}
                aria-label={`Step ${i + 1}: ${st.title}`}
                className="relative h-1 flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/10"
              >
                {i < step && <span className="absolute inset-0" style={{ background: st.to }} />}
                {i === step && (
                  <motion.span
                    key={`${step}-${playing}`}
                    className="absolute inset-y-0 left-0"
                    style={{ background: `linear-gradient(90deg, ${st.from}, ${st.to})` }}
                    initial={{ width: playing ? "0%" : "100%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: playing ? STEP_MS / 1000 : 0, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>

          <span className="font-mono text-[11px] tabular-nums text-black/40 dark:text-white/40">
            {num(step)} / {num(steps.length - 1)}
          </span>
        </div>
      </div>
    </AppWindow>
  );
}
