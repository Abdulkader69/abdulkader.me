'use client';

import {
  FaGithub,
  FaLinkedinIn,
  FaFacebookF,
  FaEnvelope,
} from 'react-icons/fa';
import { FiArrowUpRight, FiMail } from 'react-icons/fi';
import { useDesktop } from '@/context/DesktopContext';
import {
  SiHtml5,
  SiCss,
  SiJquery,
  SiReact,
  SiNextdotjs,
  SiMongodb,
  SiTailwindcss,
  SiNodedotjs,
  SiWordpress,
  SiPhp,
  SiLaravel,
  SiMysql,
} from 'react-icons/si';

// `darkColor` is only needed where the brand colour vanishes on a dark card.
export const skills = [
  { name: 'HTML', Icon: SiHtml5, color: '#E34F26' },
  { name: 'CSS', Icon: SiCss, color: '#1572B6', darkColor: '#3B9EE8' },
  { name: 'jQuery', Icon: SiJquery, color: '#0769AD', darkColor: '#3E9BDE' },
  { name: 'React', Icon: SiReact, color: '#61DAFB' },
  {
    name: 'Next JS',
    Icon: SiNextdotjs,
    color: '#111111',
    darkColor: '#FFFFFF',
  },
  { name: 'MongoDB', Icon: SiMongodb, color: '#47A248' },
  { name: 'Tailwind CSS', Icon: SiTailwindcss, color: '#06B6D4' },
  { name: 'Node JS', Icon: SiNodedotjs, color: '#339933' },
  {
    name: 'WordPress',
    Icon: SiWordpress,
    color: '#21759B',
    darkColor: '#4FA8D0',
  },
  { name: 'PHP', Icon: SiPhp, color: '#777BB4' },
  { name: 'Laravel', Icon: SiLaravel, color: '#FF2D20' },
  { name: 'MySQL', Icon: SiMysql, color: '#4479A1' },
];

export const socials = [
  { name: 'GitHub', Icon: FaGithub, href: 'https://github.com/Abdulkader69/' },
  {
    name: 'LinkedIn',
    Icon: FaLinkedinIn,
    href: 'https://www.linkedin.com/in/abdul-kader-394394186/',
  },
  {
    name: 'Facebook',
    Icon: FaFacebookF,
    href: 'https://www.facebook.com/abdulkaderyt',
  },
];

export function IntroContent() {
  const { launchApp } = useDesktop();

  return (
    <>
      <h1 className="flex flex-wrap items-baseline gap-x-3 text-[28px] leading-tight font-extrabold sm:text-[40px]">
        <span className="text-amber-400">I&rsquo;m</span>
        <span className="bg-linear-to-r from-pink-500 to-violet-600 bg-clip-text text-transparent">
          ABDUL KADER.
        </span>
        <span className="text-[16px] font-bold text-sky-500 sm:text-[19px]">
          A Tech Enthusiast
        </span>
      </h1>
      <p className="mt-3 text-[14px] leading-relaxed text-slate-500 sm:text-[15px] dark:text-slate-300">
        I&rsquo;m also a full-stack developer with a keen eye for creating
        engaging UI, bringing products to life. I am passionate about building
        excellent software that improves the lives of those around me. I&rsquo;m
        specialized in creating software for clients all over the world.
      </p>
      <div className="mt-3.5 flex items-center gap-3">
        <button
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            launchApp('mail', {
              x: r.left + r.width / 2,
              y: r.top + r.height / 2,
            });
          }}
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-1.5 rounded-full bg-linear-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-sm transition-transform hover:scale-105"
        >
          <FiMail size={13} />
          <span>Get in touch</span>
        </button>
      </div>
    </>
  );
}

/** `row` lays the icons out horizontally, which suits the stacked layout. */
export function SocialContent({ row = false }: { row?: boolean }) {
  const { launchApp } = useDesktop();

  return (
    <div
      className={`flex items-center gap-3 ${row ? 'flex-row justify-center' : 'flex-col'}`}
    >
      {socials.map(({ name, Icon, href }) => (
        <a
          key={name}
          href={href}
          aria-label={name}
          title={name}
          target="_blank"
          rel="noopener noreferrer"
          // Stop the press reaching the card, so a drag never opens the link.
          onPointerDown={(e) => e.stopPropagation()}
          draggable={false}
          className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white transition-transform hover:scale-105 dark:bg-neutral-100 dark:text-neutral-900"
        >
          <Icon size={24} />
        </a>
      ))}
      <button
        type="button"
        title="Send Message"
        aria-label="Send Message"
        onClick={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          launchApp('mail', {
            x: r.left + r.width / 2,
            y: r.top + r.height / 2,
          });
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-900 text-white transition-transform hover:scale-105 dark:bg-neutral-100 dark:text-neutral-900"
      >
        <FaEnvelope size={22} />
      </button>
    </div>
  );
}

export function SkillsContent({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-y-5 sm:grid-cols-3">
      {skills.map(({ name, Icon, color, darkColor }) => (
        <div key={name} className="flex flex-col items-center gap-1.5">
          <Icon
            size={26}
            style={{ color: darkMode ? (darkColor ?? color) : color }}
          />
          <span className="text-[11px] text-slate-600 dark:text-slate-300">
            {name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function Fact1Content() {
  const { launchApp } = useDesktop();
  return (
    <>
      <p className="flex items-baseline justify-center gap-2">
        <span className="bg-linear-to-r from-amber-400 to-violet-600 bg-clip-text text-[46px] leading-none font-extrabold text-transparent sm:text-[52px]">
          150+
        </span>
        <span className="text-[15px] font-bold text-sky-500">Projects</span>
      </p>
      <p className="mt-3 text-center text-[14px] leading-relaxed text-slate-500 sm:text-[15px] dark:text-slate-300">
        I&rsquo;ve worked on almost 150+ projects with multiple clients.
      </p>
      <div className="mt-3 flex justify-center">
        <button
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            launchApp('projects', {
              x: r.left + r.width / 2,
              y: r.top + r.height / 2,
            });
          }}
          // Keep the press from starting a card drag.
          onPointerDown={(e) => e.stopPropagation()}
          className="flex items-center gap-1 rounded-full bg-neutral-900 px-3.5 py-1.5 text-[12px] font-semibold text-white transition-transform hover:scale-105 dark:bg-neutral-100 dark:text-neutral-900"
        >
          View featured work <FiArrowUpRight size={13} />
        </button>
      </div>
    </>
  );
}

export function Fact2Content() {
  return (
    <>
      <p className="flex items-baseline justify-center gap-2">
        <span className="bg-linear-to-r from-pink-500 to-violet-600 bg-clip-text text-[46px] leading-none font-extrabold text-transparent sm:text-[52px]">
          7+
        </span>
        <span className="text-[15px] font-bold text-sky-500">Years</span>
      </p>
      <p className="mt-3 text-center text-[14px] leading-relaxed text-slate-500 sm:text-[15px] dark:text-slate-300">
        I&rsquo;ve been developing websites for more than 7 years.
      </p>
    </>
  );
}

export function Fact3Content() {
  return (
    <>
      <p className="text-[14px] leading-relaxed text-slate-500 sm:text-[15px] dark:text-slate-300">
        I&rsquo;m a web developer with a{' '}
        <strong className="font-bold text-slate-700 dark:text-slate-100">
          Political Science
        </strong>{' '}
        background. In other words, I went to{' '}
        <strong className="font-bold text-slate-700 dark:text-slate-100">
          Political Science
        </strong>{' '}
        Collage and returned a programmer.
      </p>
      <p className="mt-2 text-[15px] font-semibold text-slate-500 dark:text-slate-300">
        Oops
      </p>
    </>
  );
}
