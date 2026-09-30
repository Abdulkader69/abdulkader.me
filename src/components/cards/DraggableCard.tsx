'use client';

import { ReactNode, RefObject } from 'react';
import { motion } from 'motion/react';

const SHELL =
  'overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgba(80,50,90,0.13)] dark:bg-neutral-900';

/** The code-style caption each card wears, e.g. `<MySkills />`. */
function CardLabel({ name }: { name: string }) {
  return (
    <span className="font-mono text-[13px] tracking-tight">
      <span className="text-pink-400">&lt;</span>
      <span className="text-purple-500">{name}</span>
      <span className="text-pink-400"> /&gt;</span>
    </span>
  );
}

function CaptionBar({ label }: { label: string }) {
  return (
    <div className="flex h-9 items-center justify-center border-b border-black/5 bg-neutral-100/90 dark:border-white/5 dark:bg-neutral-800/80">
      <CardLabel name={label} />
    </div>
  );
}

/** Anchor a card to any edge; bottom/right anchoring needs no height guess. */
export type CardPos = { left?: number; right?: number; top?: number; bottom?: number };

/** Non-draggable card, used by the stacked layout on tablet and mobile. */
export function StaticCard({
  label,
  children,
  bodyClass = 'p-5',
}: {
  label?: string;
  children: ReactNode;
  bodyClass?: string;
}) {
  return (
    <motion.div
      className={SHELL}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {label && <CaptionBar label={label} />}
      <div className={bodyClass}>{children}</div>
    </motion.div>
  );
}

export default function DraggableCard({
  label,
  pos,
  width,
  zIndex,
  onFocus,
  constraints,
  children,
  bodyClass = 'p-5',
}: {
  /** Omit for a bare card with no caption bar (the socials strip). */
  label?: string;
  pos: CardPos;
  width: number;
  zIndex: number;
  onFocus: () => void;
  constraints: RefObject<HTMLDivElement | null>;
  children: ReactNode;
  bodyClass?: string;
}) {
  return (
    <motion.div
      drag
      dragMomentum={false}
      dragElastic={0}
      dragConstraints={constraints}
      onPointerDown={onFocus}
      whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
      style={{ ...pos, width, zIndex, position: 'absolute' }}
      className={`${SHELL} cursor-grab touch-none select-none`}
      initial={{ opacity: 0, y: 18, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 26 }}
    >
      {label && <CaptionBar label={label} />}
      <div className={bodyClass}>{children}</div>
    </motion.div>
  );
}
