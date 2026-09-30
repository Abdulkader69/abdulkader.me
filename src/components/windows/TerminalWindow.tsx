"use client";

import { ReactNode, useEffect, useRef, useState } from "react";
import AppWindow from "../AppWindow";

type Line = { type: "input" | "output"; content: ReactNode };

const PROMPT = "guest@abdulkader ~ %";
const GITHUB_USER = "Abdulkader69";
const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

function runCommand(cmd: string): ReactNode[] {
  const trimmed = cmd.trim();
  const [name, ...rest] = trimmed.split(/\s+/);
  switch (name) {
    case "":
      return [];
    case "help":
      return [
        "Available commands:",
        "  github         show my GitHub profile and recent repositories",
        "  github open    open my GitHub profile in a new tab",
        "  whoami, date, echo, ls, clear",
      ];
    case "github":
      if (rest[0] === "open") {
        window.open(GITHUB_URL, "_blank", "noopener,noreferrer");
        return [`Opening ${GITHUB_URL} …`];
      }
      return [<GitHubProfile key="gh" />];
    case "whoami":
      return ["guest"];
    case "date":
      return [new Date().toString()];
    case "echo":
      return [rest.join(" ")];
    case "ls":
      return ["Desktop  Documents  Downloads  Pictures  Music"];
    default:
      return [`zsh: command not found: ${name}`];
  }
}

export default function TerminalWindow({ onClose }: { onClose: () => void }) {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", content: "Last login: today on ttys000" },
    { type: "output", content: "Type 'github' to see my GitHub profile, or 'help' for more." },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView();
  }, [lines]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setHistory((h) => [...h, input]);
    setHistoryIndex(null);
    if (input.trim() === "clear") {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "input", content: `${PROMPT} ${input}` },
        ...runCommand(input).map((content) => ({ type: "output" as const, content })),
      ]);
    }
    setInput("");
  };

  // ↑ / ↓ walk back through earlier commands, like a real shell.
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
    e.preventDefault();
    if (!history.length) return;
    const last = history.length - 1;
    const next =
      e.key === "ArrowUp"
        ? historyIndex === null ? last : Math.max(0, historyIndex - 1)
        : historyIndex === null ? null : historyIndex + 1 > last ? null : historyIndex + 1;
    setHistoryIndex(next);
    setInput(next === null ? "" : history[next]);
  };

  return (
    <AppWindow
      title="terminal — zsh — 80x24"
      onClose={onClose}
      widthClass="w-[680px] max-w-[92vw]"
      heightClass="h-[460px] max-h-[80vh]"
    >
      <div
        className="h-full overflow-auto bg-black/95 p-3 font-mono text-[13px] text-[#3ff03f]"
        onClick={() => {
          // Don't steal the click from text selection or links in the output.
          if (!window.getSelection()?.toString()) document.getElementById("terminal-input")?.focus();
        }}
      >
        {lines.map((l, i) => (
          <div key={i} className={`whitespace-pre-wrap ${l.type === "input" ? "text-white" : ""}`}>
            {l.content}
          </div>
        ))}
        <form onSubmit={onSubmit} className="flex gap-2">
          <span className="text-white">{PROMPT}</span>
          <input
            id="terminal-input"
            autoFocus
            autoComplete="off"
            spellCheck={false}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            className="flex-1 bg-transparent text-white outline-none"
          />
        </form>
        <div ref={bottomRef} />
      </div>
    </AppWindow>
  );
}

/* ------------------------------------------------------------------ github */

type GitHubUser = {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  location: string | null;
  blog: string | null;
  public_repos: number;
  followers: number;
  following: number;
  created_at: string;
};

type GitHubRepo = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  fork: boolean;
  pushed_at: string;
};

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; user: GitHubUser; repos: GitHubRepo[] };

/**
 * GitHub refuses to be framed (X-Frame-Options: deny), so instead of an
 * iframe this renders the public profile from the REST API, neofetch-style.
 */
function GitHubProfile() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let cancelled = false;
    const get = (path: string) =>
      fetch(`https://api.github.com${path}`, { headers: { Accept: "application/vnd.github+json" } }).then((r) => {
        if (r.status === 403 || r.status === 429) throw new Error("GitHub API rate limit reached — try again later.");
        if (!r.ok) throw new Error(`GitHub API responded ${r.status}.`);
        return r.json();
      });

    Promise.all([
      get(`/users/${GITHUB_USER}`),
      get(`/users/${GITHUB_USER}/repos?sort=pushed&per_page=12`),
    ])
      .then(([user, repos]: [GitHubUser, GitHubRepo[]]) => {
        if (!cancelled) setState({ status: "ready", user, repos: repos.filter((r) => !r.fork).slice(0, 6) });
      })
      .catch((e: Error) => !cancelled && setState({ status: "error", message: e.message }));
    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <span className="animate-pulse text-white/60">Fetching github.com/{GITHUB_USER} …</span>;
  }

  if (state.status === "error") {
    return (
      <span>
        <span className="text-[#ff5f57]">error:</span> {state.message} View it at{" "}
        <TermLink href={GITHUB_URL}>{GITHUB_URL}</TermLink>
      </span>
    );
  }

  const { user, repos } = state;
  const joined = new Date(user.created_at).getFullYear();
  const blog = user.blog && (user.blog.startsWith("http") ? user.blog : `https://${user.blog}`);
  const fields: [string, ReactNode][] = [
    ["Name", user.name ?? user.login],
    ["Bio", user.bio],
    ["Location", user.location],
    ["Website", blog && <TermLink href={blog}>{blog.replace(/^https?:\/\//, "").replace(/\/$/, "")}</TermLink>],
    ["Repos", user.public_repos],
    ["Followers", `${user.followers} · Following ${user.following}`],
    ["Joined", joined],
  ];

  return (
    <div className="my-2 whitespace-normal">
      <div className="flex gap-4">
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- remote avatar, tiny */}
          <img
            src={user.avatar_url}
            alt={`${user.login} avatar`}
            className="h-24 w-24 rounded-md border border-[#3ff03f]/40 grayscale-30 transition hover:grayscale-0"
          />
        </a>
        <div className="min-w-0">
          <p>
            <TermLink href={GITHUB_URL} className="font-bold text-white">
              {user.login}
            </TermLink>
            <span className="text-white/40">@github.com</span>
          </p>
          <p className="text-white/30">{"-".repeat(user.login.length + 11)}</p>
          {fields
            .filter(([, v]) => v !== null && v !== undefined && v !== "")
            .map(([k, v]) => (
              <p key={k}>
                <span className="font-bold">{k}</span>
                <span className="text-white/40">: </span>
                <span className="text-white/85">{v}</span>
              </p>
            ))}
        </div>
      </div>

      {repos.length > 0 && (
        <div className="mt-3">
          <p className="text-white/50">Recently updated repositories</p>
          {repos.map((r) => (
            <p key={r.id} className="truncate">
              <span className="text-white/30">› </span>
              <TermLink href={r.html_url} className="text-[#61afef]">
                {r.name}
              </TermLink>
              {r.language && <span className="text-[#e5c07b]"> [{r.language}]</span>}
              {r.stargazers_count > 0 && <span className="text-white/50"> ★{r.stargazers_count}</span>}
              {r.description && <span className="text-white/50"> — {r.description}</span>}
            </p>
          ))}
        </div>
      )}

      <p className="mt-3 text-white/50">
        Run <span className="text-white">github open</span> or visit{" "}
        <TermLink href={GITHUB_URL}>{GITHUB_URL}</TermLink>
      </p>
    </div>
  );
}

function TermLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className={`underline decoration-dotted underline-offset-2 hover:decoration-solid ${className}`}
    >
      {children}
    </a>
  );
}
