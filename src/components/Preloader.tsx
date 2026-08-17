"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";
import { LogoMark } from "./ui/Logo";
import { site } from "@/lib/site";

const STAGES = [
  { at: 0, label: "Preparing the canvas" },
  { at: 25, label: "Loading typography" },
  { at: 50, label: "Composing the layout" },
  { at: 75, label: "Warming up motion" },
  { at: 100, label: "Ready" },
];

const DISCIPLINES = ["SaaS", "E-commerce", "3D", "Cinematic"];

export default function Preloader() {
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;

    document.body.style.overflow = "hidden";
    let n = 0;
    const id = setInterval(() => {
      n += Math.floor(Math.random() * 7) + 3;
      if (n >= 100) {
        n = 100;
        clearInterval(id);
        setTimeout(() => setDone(true), 520);
      }
      setCount(n);
    }, 70);

    return () => {
      clearInterval(id);
      document.body.style.overflow = "";
    };
  }, [reducedMotion]);

  useEffect(() => {
    if (done) document.body.style.overflow = "";
  }, [done]);

  if (reducedMotion) return null;

  const stage = [...STAGES].reverse().find((s) => count >= s.at) ?? STAGES[0];
  const revealed = Math.floor((count / 100) * DISCIPLINES.length);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col bg-ink px-6 py-8 lg:px-12 lg:py-10"
          exit={{ y: "-100%" }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* ambient glow */}
          <div className="glow-flare pointer-events-none absolute -bottom-1/3 left-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 rounded-full opacity-40 blur-2xl" />

          {/* corner ticks */}
          <span className="pointer-events-none absolute left-6 top-6 h-4 w-4 border-l border-t border-line lg:left-10 lg:top-10" />
          <span className="pointer-events-none absolute right-6 top-6 h-4 w-4 border-r border-t border-line lg:right-10 lg:top-10" />
          <span className="pointer-events-none absolute bottom-6 left-6 h-4 w-4 border-b border-l border-line lg:bottom-10 lg:left-10" />
          <span className="pointer-events-none absolute bottom-6 right-6 h-4 w-4 border-b border-r border-line lg:bottom-10 lg:right-10" />

          {/* ---------------------------------------------------------- top */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-between"
          >
            <div className="flex items-center gap-2.5">
              <LogoMark className="h-7 w-7" />
              <span className="text-[15px] font-semibold tracking-[-0.02em]">
                Sharp<span className="chrome">Dev</span>
              </span>
            </div>
            <span className="label hidden sm:block">{site.tagline}</span>
          </motion.div>

          {/* ------------------------------------------------------- centre */}
          <div className="relative flex flex-1 flex-col items-center justify-center gap-7">
            <span className="block overflow-hidden pb-[0.08em]">
              <motion.span
                className="display relative block text-[clamp(2.5rem,9vw,7rem)] leading-[0.9]"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* the not-yet-loaded portion */}
                <span className="block text-bone/[0.14]">SharpDev</span>

                {/* brushed metal from the logo mark, revealed bottom-up as it loads */}
                <span
                  aria-hidden="true"
                  className="chrome absolute inset-0 block transition-[clip-path] duration-300 ease-out"
                  style={{ clipPath: `inset(${100 - count}% 0 0 0)` }}
                >
                  SharpDev
                </span>
              </motion.span>
            </span>

            {/* disciplines revealing as it loads */}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
              {DISCIPLINES.map((d, i) => (
                <motion.span
                  key={d}
                  className="label flex items-center gap-3"
                  animate={{ opacity: i < revealed ? 1 : 0.2 }}
                  transition={{ duration: 0.45 }}
                >
                  {d}
                  {i < DISCIPLINES.length - 1 && (
                    <span className="h-1 w-1 rounded-full bg-flare" />
                  )}
                </motion.span>
              ))}
            </div>
          </div>

          {/* ------------------------------------------------------- bottom */}
          <div className="relative">
            <div className="flex items-end justify-between gap-6">
              <span className="display text-[clamp(2.2rem,7vw,3.6rem)] leading-[0.85] text-bone tabular-nums">
                {String(count).padStart(3, "0")}
                <span className="text-flare">%</span>
              </span>

              <div className="mb-2 flex flex-col items-end gap-1.5 text-right">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stage.label}
                    className="label text-bone"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {stage.label}
                  </motion.span>
                </AnimatePresence>
                <span className="label hidden sm:block">
                  Designed in Figma · Built with Next.js
                </span>
              </div>
            </div>

            <div className="mt-5 h-px w-full bg-line">
              <motion.div
                className="h-px bg-flare shadow-[0_0_12px_2px_rgba(43,200,222,0.5)]"
                animate={{ width: `${count}%` }}
                transition={{ ease: "linear", duration: 0.2 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
