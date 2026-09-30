"use client";

import AppWindow from "../AppWindow";
import { VscFiles, VscSearch, VscSourceControl, VscExtensions, VscAccount } from "react-icons/vsc";

const files = ["page.tsx", "layout.tsx", "Dock.tsx", "MenuBar.tsx", "globals.css"];

const code = `export default function Dock() {
  return (
    <div className="fixed bottom-2 inset-x-0 flex justify-center">
      {apps.map((app) => (
        <DockIcon key={app.id} {...app} />
      ))}
    </div>
  );
}`;

export default function VSCodeWindow({ onClose }: { onClose: () => void }) {
  return (
    <AppWindow
      title="Dock.tsx — mac-os"
      onClose={onClose}
      widthClass="w-[760px] max-w-[92vw]"
      heightClass="h-[500px] max-h-[85vh]"
    >
      <div className="flex h-full flex-col bg-[#1e1e1e] text-white">
        <div className="flex flex-1 overflow-hidden">
          <div className="flex w-11 flex-col items-center gap-4 bg-[#333333] py-3 text-white/60">
            <VscFiles size={20} className="text-white" />
            <VscSearch size={20} />
            <VscSourceControl size={20} />
            <VscExtensions size={20} />
            <div className="flex-1" />
            <VscAccount size={20} />
          </div>
          <div className="hidden w-40 shrink-0 border-r border-white/10 bg-[#252526] p-2 text-[12px] sm:block">
            <p className="mb-2 px-1 text-white/50">MAC-OS</p>
            {files.map((f) => (
              <div key={f} className={`rounded px-2 py-1 ${f === "Dock.tsx" ? "bg-white/10" : "hover:bg-white/5"}`}>
                {f}
              </div>
            ))}
          </div>
          <pre className="flex-1 overflow-auto p-4 text-[12px] leading-5 text-[#d4d4d4]">
            <code>{code}</code>
          </pre>
        </div>
        <div className="flex h-6 shrink-0 items-center justify-between bg-[#007acc] px-3 text-[11px]">
          <span>main*</span>
          <span>TypeScript</span>
        </div>
      </div>
    </AppWindow>
  );
}
