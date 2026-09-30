'use client';

/* eslint-disable @next/next/no-img-element -- full-page screenshots have varying
   heights and are shown at their natural aspect inside a scroll frame. */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PointerEvent,
} from 'react';
import Image from 'next/image';
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from 'motion/react';
import {
  FiArrowLeft,
  FiArrowUpRight,
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiGrid,
  FiList,
  FiMonitor,
  FiSearch,
  FiSmartphone,
  FiX,
  FiLayers,
  FiHeart,
  FiAward,
  FiBriefcase,
  FiActivity,
  FiTool,
  FiBookOpen,
  FiGlobe,
  FiMapPin,
} from 'react-icons/fi';
import AppWindow from '../AppWindow';
import {
  projects,
  shot,
  hostname,
  type Project,
  type ProjectCategory,
} from '@/lib/projects';

type Filter =
  | { type: 'all' }
  | { type: 'category'; value: ProjectCategory }
  | { type: 'region'; value: Project['region'] };

const categoryIcons: Record<ProjectCategory, typeof FiLayers> = {
  Nonprofit: FiHeart,
  Sports: FiAward,
  Business: FiBriefcase,
  'Wellness & Care': FiActivity,
  Industry: FiTool,
  Education: FiBookOpen,
};

const categories = Object.keys(categoryIcons) as ProjectCategory[];
const regions = Array.from(new Set(projects.map((p) => p.region)));

const matches = (p: Project, f: Filter, q: string) => {
  if (f.type === 'category' && p.category !== f.value) return false;
  if (f.type === 'region' && p.region !== f.value) return false;
  if (!q) return true;
  const hay = [
    p.name,
    p.tagline,
    p.industry,
    p.location,
    p.category,
    ...p.stack,
  ]
    .join(' ')
    .toLowerCase();
  return hay.includes(q.toLowerCase());
};

const filterLabel = (f: Filter) =>
  f.type === 'all' ? 'All Projects' : f.value;

export default function ProjectsWindow({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<Filter>({ type: 'all' });
  const [query, setQuery] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  // The card the details page was opened from — only it shares a layoutId with
  // the preview frame, so paging to another project doesn't fly in from its card.
  const [originSlug, setOriginSlug] = useState<string | null>(null);
  const [direction, setDirection] = useState(0);

  const visible = useMemo(
    () => projects.filter((p) => matches(p, filter, query)),
    [filter, query],
  );

  // Paging walks the filtered list, so prev/next stays within what was browsed.
  const list = visible.some((p) => p.slug === openSlug) ? visible : projects;
  const openIndex = list.findIndex((p) => p.slug === openSlug);
  const openProject = openIndex >= 0 ? list[openIndex] : null;

  const open = (slug: string) => {
    setDirection(0);
    setOriginSlug(slug);
    setOpenSlug(slug);
  };

  const step = useCallback(
    (delta: number) => {
      if (openIndex < 0) return;
      setDirection(delta);
      setOriginSlug(null);
      setOpenSlug(list[(openIndex + delta + list.length) % list.length].slug);
    },
    [list, openIndex],
  );

  const goTo = (slug: string) => {
    const i = list.findIndex((p) => p.slug === slug);
    setDirection(i > openIndex ? 1 : -1);
    setOriginSlug(null);
    setOpenSlug(slug);
  };

  // Escape backs out of a project before it closes the window: the capture-phase
  // listener runs ahead of AppWindow's and swallows the key.
  useEffect(() => {
    if (!openSlug) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === 'INPUT') return;
      if (e.key === 'Escape') {
        e.stopImmediatePropagation();
        setOpenSlug(null);
      } else if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [openSlug, step]);

  const selectFilter = (f: Filter) => {
    setFilter(f);
    setOpenSlug(null);
  };

  return (
    <AppWindow
      title={openProject ? `Projects — ${openProject.name}` : 'Projects'}
      onClose={onClose}
      widthClass="w-[1600px] max-w-[94vw]"
      heightClass="h-[920px] max-h-[86vh]"
    >
      <LayoutGroup>
        <div className="flex h-full text-[13px] text-black/80 dark:text-white/85">
          <Sidebar filter={filter} onSelect={selectFilter} />

          <div className="relative min-w-0 flex-1">
            <Gallery
              items={visible}
              filter={filter}
              onFilter={selectFilter}
              query={query}
              onQuery={setQuery}
              view={view}
              onView={setView}
              onOpen={open}
            />

            <AnimatePresence>
              {openProject && (
                <motion.div
                  key="detail"
                  className="absolute inset-0 z-10 bg-white dark:bg-neutral-900"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.22 }}
                >
                  <ProjectDetail
                    project={openProject}
                    index={openIndex}
                    list={list}
                    direction={direction}
                    shareLayout={openProject.slug === originSlug}
                    onBack={() => setOpenSlug(null)}
                    onStep={step}
                    onGoTo={goTo}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </LayoutGroup>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------ sidebar */

function Sidebar({
  filter,
  onSelect,
}: {
  filter: Filter;
  onSelect: (f: Filter) => void;
}) {
  const item = (
    f: Filter,
    label: string,
    Icon: typeof FiLayers,
    count: number,
  ) => {
    const active =
      f.type === filter.type &&
      (f.type === 'all' || (filter.type !== 'all' && f.value === filter.value));
    return (
      <button
        key={label}
        onClick={() => onSelect(f)}
        className={`relative flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors ${
          active ? 'text-white' : 'hover:bg-black/5 dark:hover:bg-white/5'
        }`}
      >
        {active && (
          <motion.span
            layoutId="projects-sidebar-active"
            className="absolute inset-0 rounded-md bg-[var(--accent)]"
            transition={{ type: 'spring', stiffness: 500, damping: 38 }}
          />
        )}
        <Icon
          size={14}
          className={`relative ${active ? '' : 'text-[var(--accent)]'}`}
        />
        <span className="relative flex-1 truncate">{label}</span>
        <span
          className={`relative text-[11px] tabular-nums ${active ? 'text-white/80' : 'text-black/35 dark:text-white/35'}`}
        >
          {count}
        </span>
      </button>
    );
  };

  return (
    <aside className="hidden w-52 shrink-0 flex-col gap-4 overflow-y-auto border-r border-black/10 bg-black/[0.03] p-3 md:flex dark:border-white/10 dark:bg-white/[0.03]">
      <div>
        <p className="mb-1 px-2 text-[11px] font-semibold text-black/40 dark:text-white/40">
          Library
        </p>
        {item({ type: 'all' }, 'All Projects', FiLayers, projects.length)}
      </div>
      <div>
        <p className="mb-1 px-2 text-[11px] font-semibold text-black/40 dark:text-white/40">
          Categories
        </p>
        {categories.map((c) =>
          item(
            { type: 'category', value: c },
            c,
            categoryIcons[c],
            projects.filter((p) => p.category === c).length,
          ),
        )}
      </div>
      <div>
        <p className="mb-1 px-2 text-[11px] font-semibold text-black/40 dark:text-white/40">
          Regions
        </p>
        {regions.map((r) =>
          item(
            { type: 'region', value: r },
            r,
            r === 'Global' ? FiGlobe : FiMapPin,
            projects.filter((p) => p.region === r).length,
          ),
        )}
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ gallery */

function Gallery({
  items,
  filter,
  onFilter,
  query,
  onQuery,
  view,
  onView,
  onOpen,
}: {
  items: Project[];
  filter: Filter;
  onFilter: (f: Filter) => void;
  query: string;
  onQuery: (q: string) => void;
  view: 'grid' | 'list';
  onView: (v: 'grid' | 'list') => void;
  onOpen: (slug: string) => void;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* toolbar */}
      <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-black/10 px-5 py-3 dark:border-white/10">
        <div className="mr-auto">
          <h2 className="text-[17px] font-semibold text-black/85 dark:text-white/90">
            {filterLabel(filter)}
          </h2>
          <p className="text-[11px] text-black/45 dark:text-white/45">
            {items.length} live {items.length === 1 ? 'website' : 'websites'}
          </p>
        </div>
        <label className="flex h-7 items-center gap-1.5 rounded-md bg-black/5 px-2 text-black/50 focus-within:ring-2 focus-within:ring-[var(--accent-soft)] dark:bg-white/10 dark:text-white/50">
          <FiSearch size={13} />
          <input
            value={query}
            onChange={(e) => onQuery(e.target.value)}
            placeholder="Search"
            className="w-28 bg-transparent text-[12px] text-black/80 outline-none placeholder:text-black/35 sm:w-40 dark:text-white/85 dark:placeholder:text-white/35"
          />
          {query && (
            <button onClick={() => onQuery('')} aria-label="Clear search">
              <FiX size={12} />
            </button>
          )}
        </label>
        <div className="flex h-7 rounded-md bg-black/5 p-0.5 dark:bg-white/10">
          {(['grid', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => onView(v)}
              aria-label={`${v} view`}
              className="relative flex w-8 items-center justify-center"
            >
              {view === v && (
                <motion.span
                  layoutId="projects-view-toggle"
                  className="absolute inset-0 rounded bg-white shadow-sm dark:bg-white/20"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              {v === 'grid' ? (
                <FiGrid size={13} className="relative" />
              ) : (
                <FiList size={13} className="relative" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* category chips stand in for the sidebar on narrow windows */}
      <div className="flex shrink-0 gap-1.5 overflow-x-auto px-5 pt-3 md:hidden">
        {[
          { type: 'all' } as Filter,
          ...categories.map((c) => ({ type: 'category', value: c }) as Filter),
        ].map((f) => {
          const active = filterLabel(f) === filterLabel(filter);
          return (
            <button
              key={filterLabel(f)}
              onClick={() => onFilter(f)}
              className={`shrink-0 rounded-full px-3 py-1 text-[12px] ${
                active
                  ? 'bg-[var(--accent)] text-white'
                  : 'bg-black/5 dark:bg-white/10'
              }`}
            >
              {f.type === 'all' ? 'All' : f.value}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-black/45 dark:text-white/45">
            <FiSearch size={28} />
            <p>No projects match &ldquo;{query}&rdquo;</p>
          </div>
        ) : view === 'grid' ? (
          <motion.div
            layout
            className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {items.map((p, i) => (
                <ProjectCard
                  key={p.slug}
                  project={p}
                  index={i}
                  onOpen={onOpen}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div layout className="flex flex-col gap-2">
            <AnimatePresence mode="popLayout">
              {items.map((p, i) => (
                <ProjectRow
                  key={p.slug}
                  project={p}
                  index={i}
                  onOpen={onOpen}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function Monogram({ project, size = 28 }: { project: Project; size?: number }) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-lg font-bold text-white shadow-sm"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.45,
        background: project.color,
      }}
    >
      {project.name[0]}
    </span>
  );
}

function ProjectCard({
  project: p,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
}) {
  // Pointer position over the card (0–1) drives a gentle 3D tilt and a glare.
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const spring = { stiffness: 260, damping: 22 };
  const rotateX = useSpring(useTransform(my, [0, 1], [7, -7]), spring);
  const rotateY = useSpring(useTransform(mx, [0, 1], [-7, 7]), spring);
  const gx = useTransform(mx, (v) => `${v * 100}%`);
  const gy = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 55%)`;

  const onMove = (e: PointerEvent<HTMLButtonElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 18, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{
        type: 'spring',
        stiffness: 320,
        damping: 30,
        delay: Math.min(index, 10) * 0.035,
      }}
      style={{ perspective: 900 }}
    >
      <motion.button
        onClick={() => onOpen(p.slug)}
        onPointerMove={onMove}
        onPointerLeave={reset}
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        whileTap={{ scale: 0.98 }}
        className="group relative block w-full rounded-xl border border-black/10 bg-white text-left shadow-sm transition-shadow hover:shadow-xl dark:border-white/10 dark:bg-neutral-800/80"
      >
        {/* soft brand glow behind the card on hover */}
        <span
          className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-60"
          style={{ background: p.color }}
        />

        <motion.div
          layoutId={`project-frame-${p.slug}`}
          className="overflow-hidden rounded-t-xl"
        >
          <div className="flex h-5 items-center gap-1 bg-neutral-100 px-2 dark:bg-neutral-700/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 truncate text-[9px] text-black/40 dark:text-white/40">
              {hostname(p.url)}
            </span>
          </div>
          <div className="relative aspect-[16/10] overflow-hidden bg-neutral-200 dark:bg-neutral-700">
            <Image
              src={shot(p.slug, 'thumb')}
              alt={`${p.name} homepage`}
              fill
              sizes="(max-width: 640px) 90vw, 340px"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.06]"
            />
            <span className="absolute inset-x-0 bottom-0 flex translate-y-full items-center justify-center pb-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <span className="flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                View project <FiArrowUpRight size={12} />
              </span>
            </span>
          </div>
        </motion.div>

        <div className="flex items-start gap-2.5 p-3">
          <Monogram project={p} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-semibold text-black/85 dark:text-white/90">
              {p.name}
            </p>
            <p className="truncate text-[11px] text-black/50 dark:text-white/50">
              {p.tagline}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between px-3 pb-3 text-[10px]">
          <span
            className="rounded-full px-2 py-0.5 font-medium"
            style={{ background: `${p.color}1f`, color: p.color }}
          >
            {p.category}
          </span>
          <span className="flex items-center gap-1 text-black/40 dark:text-white/40">
            <FiMapPin size={10} />
            {p.location}
          </span>
        </div>

        <motion.span
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{ background: glare }}
        />
      </motion.button>
    </motion.div>
  );
}

function ProjectRow({
  project: p,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (slug: string) => void;
}) {
  return (
    <motion.button
      layout
      onClick={() => onOpen(p.slug)}
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 12 }}
      transition={{
        type: 'spring',
        stiffness: 380,
        damping: 32,
        delay: Math.min(index, 12) * 0.025,
      }}
      className="group flex w-full items-center gap-3 rounded-lg p-2 text-left hover:bg-black/5 dark:hover:bg-white/5"
    >
      <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-md border border-black/10 dark:border-white/10">
        <Image
          src={shot(p.slug, 'thumb')}
          alt=""
          fill
          sizes="80px"
          className="object-cover object-top"
        />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-black/85 dark:text-white/90">
          {p.name}
        </p>
        <p className="truncate text-[11px] text-black/50 dark:text-white/50">
          {p.tagline}
        </p>
      </div>
      <span className="hidden w-36 truncate text-[11px] text-black/50 lg:block dark:text-white/50">
        {p.industry}
      </span>
      <span className="hidden w-40 truncate text-[11px] text-black/50 sm:block dark:text-white/50">
        {p.location}
      </span>
      <FiChevronRight className="text-black/30 transition-transform group-hover:translate-x-0.5 dark:text-white/30" />
    </motion.button>
  );
}

/* ------------------------------------------------------------------ details */

function ProjectDetail({
  project: p,
  index,
  list,
  direction,
  shareLayout,
  onBack,
  onStep,
  onGoTo,
}: {
  project: Project;
  index: number;
  list: Project[];
  direction: number;
  shareLayout: boolean;
  onBack: () => void;
  onStep: (delta: number) => void;
  onGoTo: (slug: string) => void;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    scroller.current?.scrollTo({ top: 0 });
  }, [p.slug]);

  const more = [1, 2, 3]
    .map((d) => list[(index + d) % list.length])
    .filter((m) => m.slug !== p.slug);

  return (
    <div className="flex h-full flex-col">
      {/* toolbar */}
      <div className="flex shrink-0 items-center gap-2 border-b border-black/10 px-4 py-2.5 dark:border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-[var(--accent)] hover:bg-black/5 dark:hover:bg-white/10"
        >
          <FiArrowLeft size={14} /> All Projects
        </button>
        <div className="flex-1" />
        <span className="text-[11px] tabular-nums text-black/40 dark:text-white/40">
          {index + 1} / {list.length}
        </span>
        <div className="flex rounded-md bg-black/5 dark:bg-white/10">
          <button
            onClick={() => onStep(-1)}
            aria-label="Previous project"
            className="p-1.5 hover:text-[var(--accent)]"
          >
            <FiChevronLeft size={15} />
          </button>
          <button
            onClick={() => onStep(1)}
            aria-label="Next project"
            className="p-1.5 hover:text-[var(--accent)]"
          >
            <FiChevronRight size={15} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="relative flex-1 overflow-x-hidden overflow-y-auto"
      >
        {/* brand-tinted wash at the top of the page */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 top-0 h-72"
          animate={{
            background: `linear-gradient(180deg, ${p.color}2e, transparent)`,
          }}
          transition={{ duration: 0.5 }}
        />

        <AnimatePresence mode="popLayout" initial={false} custom={direction}>
          <motion.div
            key={p.slug}
            custom={direction}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 60 }),
              center: { opacity: 1, x: 0 },
              exit: (d: number) => ({ opacity: 0, x: d * -60 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="relative grid gap-6 p-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:p-6"
          >
            <Preview project={p} shareLayout={shareLayout} />
            <Info project={p} />
          </motion.div>
        </AnimatePresence>

        {more.length > 0 && (
          <div className="relative border-t border-black/10 px-5 py-5 lg:px-6 dark:border-white/10">
            <p className="mb-3 text-[11px] font-semibold tracking-wide text-black/40 uppercase dark:text-white/40">
              More projects
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {more.map((m) => (
                <button
                  key={m.slug}
                  onClick={() => onGoTo(m.slug)}
                  className="group overflow-hidden rounded-lg border border-black/10 text-left transition-shadow hover:shadow-lg dark:border-white/10"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={shot(m.slug, 'thumb')}
                      alt=""
                      fill
                      sizes="240px"
                      className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex items-center gap-2 p-2">
                    <Monogram project={m} size={20} />
                    <span className="truncate text-[12px] font-medium">
                      {m.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Scroll frame for a full-page screenshot. Hovering auto-scrolls it like a
 * slow page tour; the moment the visitor scrolls it themselves, it hands over.
 */
function useTour() {
  const ref = useRef<HTMLDivElement>(null);
  const raf = useRef<number | null>(null);
  const handedOver = useRef(false);
  const [progress, setProgress] = useState(0);
  const [touring, setTouring] = useState(false);

  const stop = useCallback(() => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setTouring(false);
  }, []);

  const start = useCallback(() => {
    const el = ref.current;
    if (!el || handedOver.current || raf.current) return;
    let last = performance.now();
    // Long pages scroll faster, so any page tours in about 20 seconds.
    const speed = Math.max(0.14, (el.scrollHeight - el.clientHeight) / 20000);
    const tick = (now: number) => {
      el.scrollTop += (now - last) * speed;
      last = now;
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 1) return stop();
      raf.current = requestAnimationFrame(tick);
    };
    setTouring(true);
    raf.current = requestAnimationFrame(tick);
  }, [stop]);

  const takeOver = useCallback(() => {
    handedOver.current = true;
    stop();
  }, [stop]);

  // Switching device starts a fresh tour from the top. (Each project mounts
  // its own Preview, so a new project gets a fresh tour for free.)
  const reset = () => {
    handedOver.current = false;
    stop();
    setProgress(0);
  };

  useEffect(() => stop, [stop]);

  const onScroll = () => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollHeight - el.clientHeight;
    setProgress(max > 0 ? el.scrollTop / max : 0);
  };

  const replay = () => {
    handedOver.current = false;
    ref.current?.scrollTo({ top: 0 });
    start();
  };

  return {
    ref,
    progress,
    touring,
    start,
    stop,
    takeOver,
    onScroll,
    replay,
    reset,
  };
}

function Preview({
  project: p,
  shareLayout,
}: {
  project: Project;
  shareLayout: boolean;
}) {
  const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const tour = useTour();
  const src = shot(p.slug, device);

  const frameHandlers = {
    ref: tour.ref,
    onScroll: tour.onScroll,
    onPointerMove: tour.start,
    onMouseLeave: tour.stop,
    onWheel: tour.takeOver,
    onTouchStart: tour.takeOver,
  };

  const screenshot = (
    <>
      {!loaded[src] && (
        <img
          src={shot(p.slug, 'thumb')}
          alt=""
          className="absolute inset-x-0 top-0 w-full blur-sm"
        />
      )}
      <img
        key={src}
        src={src}
        alt={`${p.name} full page (${device})`}
        onLoad={() => setLoaded((l) => ({ ...l, [src]: true }))}
        className={`relative block w-full transition-opacity duration-300 ${loaded[src] ? 'opacity-100' : 'opacity-0'}`}
      />
    </>
  );

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex rounded-lg bg-black/5 p-0.5 dark:bg-white/10">
          {(['desktop', 'mobile'] as const).map((d) => (
            <button
              key={d}
              onClick={() => {
                if (d === device) return;
                tour.reset();
                setDevice(d);
              }}
              className="relative flex items-center gap-1.5 px-3 py-1 text-[12px] capitalize"
            >
              {device === d && (
                <motion.span
                  layoutId="projects-device-toggle"
                  className="absolute inset-0 rounded-md bg-white shadow-sm dark:bg-white/20"
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                />
              )}
              <span className="relative flex items-center gap-1.5">
                {d === 'desktop' ? (
                  <FiMonitor size={12} />
                ) : (
                  <FiSmartphone size={12} />
                )}
                {d}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={tour.replay}
          className="text-[11px] text-black/45 hover:text-[var(--accent)] dark:text-white/45"
        >
          {tour.touring ? 'Touring…' : 'Hover to tour · scroll to explore'}
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {device === 'desktop' ? (
          <motion.div
            key="desktop"
            layoutId={shareLayout ? `project-frame-${p.slug}` : undefined}
            initial={shareLayout ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 300, damping: 32 }}
            className="overflow-hidden rounded-xl border border-black/10 bg-white shadow-2xl dark:border-white/10 dark:bg-neutral-800"
            style={{ boxShadow: `0 24px 60px -20px ${p.color}80` }}
          >
            <div className="flex h-7 items-center gap-1.5 bg-neutral-100 px-3 dark:bg-neutral-700/80">
              <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
              <span className="mx-auto truncate rounded bg-black/5 px-10 py-0.5 text-[10px] text-black/50 dark:bg-white/10 dark:text-white/50">
                {hostname(p.url)}
              </span>
            </div>
            <div className="relative h-1 bg-black/5 dark:bg-white/10">
              <span
                className="absolute inset-y-0 left-0"
                style={{
                  width: `${tour.progress * 100}%`,
                  background: p.color,
                }}
              />
            </div>
            <div
              {...frameHandlers}
              className="relative h-[340px] overflow-y-auto overscroll-contain lg:h-[400px]"
            >
              {screenshot}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="mobile"
            initial={{ opacity: 0, y: 20, rotate: -3 }}
            animate={{ opacity: 1, y: 0, rotate: 0 }}
            exit={{ opacity: 0, y: 20, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="flex justify-center"
          >
            <div
              className="relative rounded-[34px] border-[6px] border-neutral-900 bg-neutral-900 shadow-2xl"
              style={{ boxShadow: `0 24px 60px -20px ${p.color}90` }}
            >
              <span className="absolute top-1.5 left-1/2 z-10 h-4 w-16 -translate-x-1/2 rounded-full bg-black" />
              <div
                {...frameHandlers}
                className="relative h-[400px] w-[200px] overflow-y-auto overscroll-contain rounded-[28px] bg-white [scrollbar-width:none] lg:h-[436px] lg:w-[210px]"
              >
                {screenshot}
              </div>
              <span className="absolute -right-2 bottom-10 top-10 w-0.5 rounded-full bg-black/10 dark:bg-white/10">
                <span
                  className="absolute inset-x-0 top-0 rounded-full"
                  style={{
                    height: `${tour.progress * 100}%`,
                    background: p.color,
                  }}
                />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Info({ project: p }: { project: Project }) {
  const meta = [
    { label: 'Industry', value: p.industry },
    { label: 'Location', value: p.location },
    { label: 'Platform', value: p.stack[0] },
    { label: 'Website', value: hostname(p.url) },
  ];

  const stagger = (i: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: {
      delay: 0.08 + i * 0.05,
      type: 'spring' as const,
      stiffness: 320,
      damping: 28,
    },
  });

  return (
    <div className="min-w-0">
      <motion.div {...stagger(0)} className="flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
          style={{ background: `${p.color}1f`, color: p.color }}
        >
          {p.category}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-black/45 dark:text-white/45">
          <FiMapPin size={11} /> {p.region}
        </span>
      </motion.div>

      <motion.div {...stagger(1)} className="mt-3 flex items-center gap-3">
        <Monogram project={p} size={40} />
        <div className="min-w-0">
          <h1 className="text-[22px] leading-tight font-bold text-black/90 dark:text-white">
            {p.name}
          </h1>
          <p className="text-[13px] font-medium" style={{ color: p.color }}>
            {p.tagline}
          </p>
        </div>
      </motion.div>

      <motion.p
        {...stagger(2)}
        className="mt-4 text-[13px] leading-relaxed text-black/65 dark:text-white/70"
      >
        {p.description}
      </motion.p>

      <motion.dl {...stagger(3)} className="mt-4 grid grid-cols-2 gap-2">
        {meta.map((m) => (
          <div
            key={m.label}
            className="rounded-lg bg-black/[0.04] px-3 py-2 dark:bg-white/[0.06]"
          >
            <dt className="text-[10px] font-medium tracking-wide text-black/40 uppercase dark:text-white/40">
              {m.label}
            </dt>
            <dd className="truncate text-[12px] font-medium">{m.value}</dd>
          </div>
        ))}
      </motion.dl>

      <motion.div {...stagger(4)} className="mt-5">
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-black/40 uppercase dark:text-white/40">
          Highlights
        </p>
        <ul className="space-y-1.5">
          {p.features.map((f, i) => (
            <motion.li
              key={f}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              className="flex items-start gap-2 text-[12.5px]"
            >
              <span
                className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white"
                style={{ background: p.color }}
              >
                <FiCheck size={10} />
              </span>
              {f}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      <motion.div {...stagger(6)} className="mt-5">
        <p className="mb-2 text-[11px] font-semibold tracking-wide text-black/40 uppercase dark:text-white/40">
          Built with
        </p>
        <div className="flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span
              key={s}
              className="rounded-md border border-black/10 bg-white px-2 py-0.5 text-[11px] dark:border-white/10 dark:bg-white/5"
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      <motion.a
        {...stagger(7)}
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-[13px] font-semibold text-white shadow-lg"
        style={{
          background: p.color,
          boxShadow: `0 10px 30px -10px ${p.color}`,
        }}
      >
        Visit live site <FiArrowUpRight size={15} />
      </motion.a>
    </div>
  );
}
