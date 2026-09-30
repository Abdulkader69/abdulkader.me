"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "motion/react";
import type { CatMood } from "./cat/mood";

// WebGL can't render on the server, so the canvas is browser-only.
const CatView = dynamic(() => import("./cat/CatView"), { ssr: false });

type Pt = { x: number; y: number };

const CANVAS = 195;
const FOOT_OFFSET = CANVAS * 0.846; // where the cat's feet sit inside the canvas
// Overlay anchors are fractions of the canvas, so they follow any size change.
const OVERLAY_X = CANVAS * 0.662;
const ZZZ_Y = CANVAS * 0.262;
const HEART_Y = CANVAS * 0.246;

const CHASE_RADIUS = 260; // how close the pointer must be to get her interested
const POUNCE_RADIUS = 320; // how close a desktop click must be to be worth pouncing on
const KEEP_DISTANCE = 46; // she stops short of the pointer rather than sitting on it
const LIE_AFTER = 7000; // ms of boredom before she flops down into a sphinx
const SLEEP_AFTER = 16000; // ...and longer still before she nods off
const TICK = 150;

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

export default function Cat() {
  const [pos, setPos] = useState<Pt | null>(null);
  const [mood, setMood] = useState<CatMood>("sit");
  const [facing, setFacing] = useState<1 | -1>(-1);
  const [blinking, setBlinking] = useState(false);
  const [look, setLook] = useState<Pt>({ x: 0, y: 0 });
  const [says, setSays] = useState<string | null>(null);
  const [hearts, setHearts] = useState(0);
  const [tooSmall, setTooSmall] = useState(false);

  // Pointer state lives in refs so mouse movement never triggers a render.
  const cursor = useRef<Pt>({ x: 0, y: 0 });
  const lastMoved = useRef(0);
  const posRef = useRef<Pt | null>(null);
  const moodRef = useRef<CatMood>("sit");
  const idleSince = useRef(Date.now());
  const busyUntil = useRef(0); // groom/pet/pounce hold her in one behaviour for a bit

  posRef.current = pos;
  moodRef.current = mood;

  const home = useCallback(
    (): Pt => ({ x: window.innerWidth - 120, y: window.innerHeight - 90 }),
    []
  );

  useEffect(() => {
    const start = home();
    setPos(start);
    posRef.current = start;
    cursor.current = { x: start.x, y: start.y - 200 };
  }, [home]);

  // Track the pointer, and keep her eyes on it.
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      cursor.current = { x: e.clientX, y: e.clientY };
      lastMoved.current = Date.now();
      const p = posRef.current;
      if (!p) return;
      const dx = e.clientX - p.x;
      const dy = e.clientY - (p.y - 40);
      const d = Math.max(1, Math.hypot(dx, dy));
      setLook({ x: clamp(dx / d, -1, 1), y: clamp(dy / d, -1, 1) });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // A click on empty desktop near her is a thing worth pouncing on.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest("button, input, a, [data-cat]")) return; // real UI, not a toy
      const p = posRef.current;
      if (!p) return;
      const target = { x: e.clientX, y: e.clientY };
      if (dist(target, p) > POUNCE_RADIUS) return;

      setFacing(target.x < p.x ? -1 : 1);
      setMood("pounce");
      setPos({
        x: clamp(target.x, 60, window.innerWidth - 60),
        y: clamp(target.y, 110, window.innerHeight - 60),
      });
      busyUntil.current = Date.now() + 700;
      idleSince.current = Date.now();
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  // Blinking, on a lazy random rhythm.
  useEffect(() => {
    let timer: number;
    const blink = () => {
      if (moodRef.current !== "sleep") {
        setBlinking(true);
        window.setTimeout(() => setBlinking(false), 140);
      }
      timer = window.setTimeout(blink, 2200 + Math.random() * 4000);
    };
    timer = window.setTimeout(blink, 1800);
    return () => window.clearTimeout(timer);
  }, []);

  // The brain: runs on a slow tick and decides what she feels like doing.
  useEffect(() => {
    const id = window.setInterval(() => {
      const now = Date.now();
      const p = posRef.current;
      if (!p || now < busyUntil.current) return;

      const m = moodRef.current;
      const d = dist(cursor.current, p);
      const pointerLively = now - lastMoved.current < 1800;

      // Something is moving nearby — that outranks whatever she was doing.
      if (d < CHASE_RADIUS && pointerLively) {
        const dx = p.x - cursor.current.x;
        const dy = p.y - cursor.current.y;
        const len = Math.max(1, Math.hypot(dx, dy));
        const target = {
          x: clamp(cursor.current.x + (dx / len) * KEEP_DISTANCE, 60, window.innerWidth - 60),
          y: clamp(cursor.current.y + (dy / len) * KEEP_DISTANCE, 110, window.innerHeight - 60),
        };
        if (dist(target, p) > 14) {
          setFacing(target.x < p.x ? -1 : 1);
          setPos(target);
        }
        if (m !== "chase") setMood("chase");
        idleSince.current = now;
        return;
      }

      // Nothing interesting. Wander home, groom, then eventually nap.
      if (m === "chase" || m === "pounce") {
        setMood("sit");
        idleSince.current = now;
        return;
      }

      const bored = now - idleSince.current;

      // sit -> lie down -> asleep, the way a cat actually settles.
      if (bored > SLEEP_AFTER) {
        if (m !== "sleep") setMood("sleep");
        return;
      }
      if (bored > LIE_AFTER) {
        if (m === "sit") setMood("lie");
        return;
      }

      // She'll groom from either posture, but only gets up to wander from sitting.
      if ((m === "sit" || m === "lie") && bored > 2600 && Math.random() < 0.25) {
        const roll = Math.random();
        if (roll < 0.45) {
          const back = m;
          setMood("groom");
          busyUntil.current = now + 2600;
          window.setTimeout(() => setMood(back), 2600);
        } else if (m === "sit") {
          const spot = {
            x: clamp(
              window.innerWidth * (0.62 + Math.random() * 0.33),
              window.innerWidth * 0.6,
              window.innerWidth - 80
            ),
            y: window.innerHeight - (75 + Math.random() * 110),
          };
          setFacing(spot.x < p.x ? -1 : 1);
          setMood("walk");
          setPos(spot);
          // Sit back down once she's arrived, instead of walking on the spot.
          busyUntil.current = now + 1500;
          idleSince.current = now;
          window.setTimeout(() => setMood("sit"), 1500);
        }
      }
    }, TICK);
    return () => window.clearInterval(id);
  }, []);

  // Keep her on screen if the window is resized, and stand down on small
  // screens — there's no cursor to chase and no room to roam.
  useEffect(() => {
    const onResize = () => {
      setTooSmall(window.innerWidth < 1024);
      setPos(home());
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [home]);

  const pet = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMood("pet");
    setHearts((h) => h + 1);
    setSays(Math.random() < 0.5 ? "meow!" : "purr…");
    busyUntil.current = Date.now() + 2000;
    idleSince.current = Date.now();
    window.setTimeout(() => {
      setSays(null);
      setMood("sit");
    }, 2000);
  };

  if (!pos || tooSmall) return null;

  return (
    <motion.div
      data-cat
      className="pointer-events-none fixed top-0 left-0 z-30 select-none"
      animate={{ x: pos.x - CANVAS / 2, y: pos.y - FOOT_OFFSET }}
      transition={
        mood === "pounce"
          ? { type: "spring", stiffness: 520, damping: 22 }
          : mood === "chase"
            ? { type: "spring", stiffness: 120, damping: 18, mass: 0.9 }
            : { type: "spring", stiffness: 55, damping: 16, mass: 1.1 }
      }
    >
      <div className="relative">
        <AnimatePresence>
          {says && (
            <motion.div
              key={says}
              className="absolute top-3 left-1/2 -translate-x-1/2 rounded-full bg-white/85 px-2 py-0.5 text-[11px] font-medium whitespace-nowrap text-black shadow dark:bg-neutral-800/85 dark:text-white"
              initial={{ opacity: 0, y: 6, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
            >
              {says}
            </motion.div>
          )}
        </AnimatePresence>

        {mood === "sleep" &&
          [0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute text-[13px] font-semibold text-white/80 [text-shadow:0_1px_2px_rgba(0,0,0,0.4)]"
              style={{ left: OVERLAY_X, top: ZZZ_Y }}
              animate={{ opacity: [0, 1, 0], y: [0, -22], x: [0, 12] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8 }}
            >
              z
            </motion.span>
          ))}

        <AnimatePresence>
          {mood === "pet" && (
            <motion.span
              key={hearts}
              className="absolute text-sm"
              style={{ left: OVERLAY_X, top: HEART_Y }}
              initial={{ opacity: 0, y: 0, scale: 0.6 }}
              animate={{ opacity: [0, 1, 0], y: -26, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6 }}
            >
              ❤️
            </motion.span>
          )}
        </AnimatePresence>

        <button
          onClick={pet}
          aria-label="Pet the cat"
          className="pointer-events-auto cursor-pointer bg-transparent"
        >
          <CatView
            mood={mood}
            facing={facing}
            look={look}
            blinking={blinking}
            size={CANVAS}
          />
        </button>
      </div>
    </motion.div>
  );
}
