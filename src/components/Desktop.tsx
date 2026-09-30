"use client";

import { AnimatePresence } from "motion/react";
import { useDesktop } from "@/context/DesktopContext";
import { wallpapers } from "@/lib/wallpapers";
import MenuBar from "./MenuBar";
import Dock from "./Dock";
import Cat from "./Cat";
import DesktopCards from "./cards/DesktopCards";
import TerminalWindow from "./windows/TerminalWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ServicesWindow from "./windows/ServicesWindow";
import ProcessWindow from "./windows/ProcessWindow";
import MailWindow from "./windows/MailWindow";

export default function Desktop() {
  const { wallpaperId, darkMode, brightness, openApp, closeApp } = useDesktop();
  const wallpaper = wallpapers.find((w) => w.id === wallpaperId) ?? wallpapers[0];

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div
        className="absolute inset-0 transition-[background] duration-500"
        style={{ background: darkMode ? wallpaper.dark : wallpaper.light }}
      />
      <div
        className="pointer-events-none absolute inset-0 bg-black transition-opacity duration-200"
        style={{ opacity: ((100 - brightness) / 100) * 0.85 }}
      />

      {/* The landing layout: draggable intro cards sitting on the desktop.
          App windows open above them. */}
      <DesktopCards />

      <Cat />

      <MenuBar />
      <Dock />

      <AnimatePresence>
        {openApp === "terminal" && <TerminalWindow key="terminal" onClose={closeApp} />}
        {openApp === "projects" && <ProjectsWindow key="projects" onClose={closeApp} />}
        {openApp === "services" && <ServicesWindow key="services" onClose={closeApp} />}
        {openApp === "process" && <ProcessWindow key="process" onClose={closeApp} />}
        {openApp === "mail" && <MailWindow key="mail" onClose={closeApp} />}
      </AnimatePresence>
    </div>
  );
}
