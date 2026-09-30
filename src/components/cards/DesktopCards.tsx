'use client';

import { useRef, useState } from 'react';
import DraggableCard, { StaticCard } from './DraggableCard';
import { useViewport, clamp } from './useViewport';
import { useDesktop } from '@/context/DesktopContext';
import {
  IntroContent,
  SocialContent,
  SkillsContent,
  Fact1Content,
  Fact2Content,
  Fact3Content,
} from './content';

const MENU_BAR = 52; // clears the menu bar
const DOCK = 110; // clears the dock
const CAT_ZONE = 200; // keeps the bottom-right card above where the cat sits
const SKILLS_H = 330; // approximate rendered heights, used only to budget space
const FACT3_H = 190;

/** Below this the free-floating scatter has nowhere to go, so we stack instead. */
export const SCATTER_MIN_W = 1024;
const SCATTER_MIN_H = 640;

const CARD_IDS = ['intro', 'social', 'skills', 'fact1', 'fact2', 'fact3'] as const;

/**
 * Tablet and phone layout: one readable column that scrolls, rather than
 * absolutely-placed cards that would pile on top of each other.
 */
function StackedCards({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="absolute inset-0 z-10 overflow-x-hidden overflow-y-auto overscroll-contain px-4 pt-11 pb-32">
      <div className="mx-auto flex w-full max-w-xl flex-col gap-4">
        <StaticCard bodyClass="px-5 py-5">
          <IntroContent />
        </StaticCard>
        <StaticCard bodyClass="p-4">
          <SocialContent row />
        </StaticCard>
        <StaticCard label="MySkills">
          <SkillsContent darkMode={darkMode} />
        </StaticCard>
        <StaticCard label="Fact_1">
          <Fact1Content />
        </StaticCard>
        <StaticCard label="Fact_2">
          <Fact2Content />
        </StaticCard>
        <StaticCard label="Fact_3">
          <Fact3Content />
        </StaticCard>
      </div>
    </div>
  );
}

export default function DesktopCards() {
  const { darkMode } = useDesktop();
  const viewport = useViewport();
  const bounds = useRef<HTMLDivElement>(null);
  // Last id in the list paints on top; focusing a card moves it to the end.
  // Deliberately not persisted — cards return to their default layout on reload.
  const [order, setOrder] = useState<string[]>([...CARD_IDS]);

  const focus = (id: string) =>
    setOrder((o) => (o[o.length - 1] === id ? o : [...o.filter((i) => i !== id), id]));

  // Kept below the cat (30), dock (40) and app windows (60) so those stay on top.
  const card = (id: string) => ({
    zIndex: 10 + order.indexOf(id),
    onFocus: () => focus(id),
    constraints: bounds,
  });

  // Wait for a real measurement rather than laying out against a guessed size.
  if (!viewport) return <div ref={bounds} className="absolute inset-0" />;
  const { vw, vh } = viewport;

  if (vw < SCATTER_MIN_W || vh < SCATTER_MIN_H) return <StackedCards darkMode={darkMode} />;

  // Margins and widths scale with the window; corners anchor to the edges so
  // no card position depends on assuming a particular screen size.
  const M = clamp(16, vw * 0.04, 56);
  const factW = clamp(230, vw * 0.22, 300);
  const skillsW = clamp(244, vw * 0.22, 296);
  const fact3W = clamp(280, vw * 0.3, 400);
  const socialW = 78;

  // The middle pair is centred in the gap *between* the side columns, not
  // across the whole window — centring on the window drives it into them.
  const GUTTER = 16;
  const gapLeft = M + factW + GUTTER;
  const gapRight = vw - M - Math.max(skillsW, fact3W) - GUTTER;
  const gapW = Math.max(260, gapRight - gapLeft);
  const introW = clamp(260, gapW - 14 - socialW, 600);
  const pairW = introW + 14 + socialW;
  const pairLeft = Math.max(M, Math.round(gapLeft + (gapW - pairW) / 2));
  const pairTop = Math.max(MENU_BAR, Math.round((vh - 230) / 2));

  // Cat clearance shrinks on short windows, so the right column's two cards
  // never collide with each other.
  const room = vh - DOCK - FACT3_H - (MENU_BAR + SKILLS_H) - GUTTER;
  const catZone = clamp(0, Math.min(CAT_ZONE, room), CAT_ZONE);

  return (
    <div ref={bounds} className="absolute inset-0 overflow-hidden">
      {/* Remount on resize: Framer Motion caches each card's measured box for
          dragging, and that cache goes stale when the CSS anchors move. */}
      <div key={`${vw}x${vh}`} className="contents">
        {/* ---- about me: centre of the desktop ---- */}
        <DraggableCard
          {...card('intro')}
          pos={{ left: pairLeft, top: pairTop }}
          width={introW}
          bodyClass="px-7 py-6"
        >
          <IntroContent />
        </DraggableCard>

        {/* ---- socials: alongside the intro, in the middle ---- */}
        <DraggableCard
          {...card('social')}
          pos={{ left: pairLeft + introW + 14, top: pairTop }}
          width={socialW}
          bodyClass="p-3"
        >
          <SocialContent />
        </DraggableCard>

        {/* ---- skills: top right ---- */}
        <DraggableCard
          {...card('skills')}
          label="MySkills"
          pos={{ right: M, top: MENU_BAR }}
          width={skillsW}
        >
          <SkillsContent darkMode={darkMode} />
        </DraggableCard>

        {/* ---- facts: top-left, bottom-left, bottom-right ---- */}
        <DraggableCard
          {...card('fact1')}
          label="Fact_1"
          pos={{ left: M, top: MENU_BAR }}
          width={factW}
        >
          <Fact1Content />
        </DraggableCard>

        <DraggableCard
          {...card('fact2')}
          label="Fact_2"
          pos={{ left: M, bottom: DOCK }}
          width={factW}
        >
          <Fact2Content />
        </DraggableCard>

        {/* sits just above the cat's corner of the desktop */}
        <DraggableCard
          {...card('fact3')}
          label="Fact_3"
          pos={{ right: M, bottom: DOCK + catZone }}
          width={fact3W}
        >
          <Fact3Content />
        </DraggableCard>
      </div>
    </div>
  );
}
