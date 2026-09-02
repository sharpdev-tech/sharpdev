"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { useState } from "react";
import { nav, site } from "@/lib/site";
import type { Lang } from "@/lib/lang";
import { LogoMark, Wordmark } from "./ui/Logo";
import { useCopy } from "./LangProvider";
import LangToggle from "./LangToggle";

const COPY: Record<Lang, { home: string; menu: string; labels: Record<string, string> }> = {
  en: {
    home: "SharpDev home",
    menu: "Menu",
    labels: {
      "#work": "Work",
      "#services": "Services",
      "#process": "Process",
      "#stack": "Stack",
      "#faq": "FAQ",
    },
  },
  sq: {
    home: "SharpDev — ballina",
    menu: "Menyja",
    labels: {
      "#work": "Puna",
      "#services": "Shërbimet",
      "#process": "Procesi",
      "#stack": "Teknologjia",
      "#faq": "Pyetje",
    },
  },
};

export default function Nav() {
  const t = useCopy(COPY);
  const { scrollY } = useScroll();
  const [solid, setSolid] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState(0);

  useMotionValueEvent(scrollY, "change", (y) => {
    setSolid(y > 40);
    setHidden(y > last && y > 400 && !open);
    setLast(y);
  });

  return (
    <>
      <motion.header
        className="fixed inset-x-0 top-0 z-[900]"
        animate={{ y: hidden ? "-110%" : "0%" }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className={`transition-all duration-500 ${
            solid
              ? "border-b border-line bg-ink/70 backdrop-blur-xl"
              : "border-b border-transparent"
          }`}
        >
          <div className="shell flex h-[var(--nav-h)] items-center justify-between">
            <a href="#top" className="group flex items-center gap-2.5" aria-label={t.home}>
              <LogoMark className="h-7 w-7" />
              <Wordmark />
            </a>

            <nav className="hidden items-center gap-1 lg:flex">
              {nav.map((n) => (
                <a
                  key={n.href}
                  href={n.href}
                  className="group relative rounded-full px-4 py-2 text-[13.5px] text-mute transition-colors hover:text-bone"
                >
                  {t.labels[n.href] ?? n.label}
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              <LangToggle className="hidden sm:flex" />
              <a
                href="#contact"
                className="hidden rounded-full border border-line px-5 py-2.5 text-[13px] tracking-tight transition-colors hover:border-flare hover:text-flare sm:inline-block"
              >
                {site.email}
              </a>
              <button
                onClick={() => setOpen((o) => !o)}
                aria-label={t.menu}
                className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-full border border-line lg:hidden"
              >
                <span
                  className={`h-px w-4 bg-bone transition-transform duration-300 ${
                    open ? "translate-y-[3px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`h-px w-4 bg-bone transition-transform duration-300 ${
                    open ? "-translate-y-[3px] -rotate-45" : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[899] flex flex-col justify-center bg-ink px-6 lg:hidden"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex flex-col gap-2">
              {nav.map((n, i) => (
                <motion.a
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="display text-[13vw] text-bone"
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {t.labels[n.href] ?? n.label}
                </motion.a>
              ))}
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-4">
              <a href="#contact" className="text-[15px] text-flare" onClick={() => setOpen(false)}>
                {site.email}
              </a>
              <LangToggle />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
