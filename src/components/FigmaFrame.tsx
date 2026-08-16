"use client";

import { motion } from "motion/react";

/**
 * Stylised mock of the Figma preview link a client receives
 * before development starts.
 */
export default function FigmaFrame() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-line bg-ink-2">
      {/* toolbar */}
      <div className="flex items-center justify-between border-b border-line px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          <span className="label ml-3 hidden sm:inline">
            yourbrand — design preview
          </span>
        </div>
        <span className="flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[10px] tracking-wide text-mute">
          <span className="h-1.5 w-1.5 rounded-full bg-flare" />
          Shared with you
        </span>
      </div>

      {/* canvas */}
      <div className="relative aspect-[4/3] bg-[radial-gradient(circle_at_50%_0%,rgba(43,200,222,0.08),transparent_60%)] p-5 sm:p-7">
        <div className="grid h-full grid-cols-6 grid-rows-6 gap-2.5">
          {[
            "col-span-6 row-span-2",
            "col-span-3 row-span-2",
            "col-span-3 row-span-2",
            "col-span-2 row-span-2",
            "col-span-2 row-span-2",
            "col-span-2 row-span-2",
          ].map((cls, i) => (
            <motion.div
              key={i}
              className={`${cls} rounded-lg border border-line bg-surface/60`}
              initial={{ opacity: 0, scale: 0.94 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{
                delay: 0.12 * i,
                duration: 0.7,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              <div className="flex h-full flex-col justify-center gap-2 p-3">
                <span className="h-1.5 w-1/3 rounded-full bg-line" />
                <span className="h-1.5 w-2/3 rounded-full bg-line/70" />
                {i === 0 && (
                  <span className="mt-1 h-1.5 w-1/4 rounded-full bg-flare/70" />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* selection box */}
        <motion.div
          className="pointer-events-none absolute left-[6%] top-[8%] h-[36%] w-[88%] rounded-lg border border-flare"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.4 }}
        >
          <span className="absolute -left-1 -top-1 h-2 w-2 rounded-[2px] border border-flare bg-ink" />
          <span className="absolute -right-1 -top-1 h-2 w-2 rounded-[2px] border border-flare bg-ink" />
          <span className="absolute -bottom-1 -left-1 h-2 w-2 rounded-[2px] border border-flare bg-ink" />
          <span className="absolute -bottom-1 -right-1 h-2 w-2 rounded-[2px] border border-flare bg-ink" />
          <span className="absolute -bottom-6 left-0 rounded bg-flare px-1.5 py-0.5 text-[9px] font-medium text-white">
            Hero
          </span>
        </motion.div>

        {/* client comment pin */}
        <motion.div
          className="absolute bottom-[16%] right-[8%] flex items-start gap-2"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.3, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full rounded-bl-none bg-bone text-[10px] font-bold text-ink">
            You
          </span>
          <span className="max-w-[150px] rounded-lg rounded-tl-none border border-line bg-surface px-2.5 py-1.5 text-[11px] leading-snug text-bone shadow-xl">
            Can this be bigger?
          </span>
        </motion.div>

        {/* moving cursor */}
        <motion.div
          className="pointer-events-none absolute"
          initial={{ left: "20%", top: "70%" }}
          whileInView={{ left: ["20%", "62%", "70%"], top: ["70%", "40%", "62%"] }}
          viewport={{ once: true }}
          transition={{ delay: 1, duration: 2.2, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 12 12" className="h-4 w-4 drop-shadow-lg">
            <path d="M0 0l4.5 12 1.9-5.1L11.5 5 0 0z" fill="#2bc8de" />
          </svg>
        </motion.div>
      </div>

      {/* footer bar */}
      <div className="flex items-center justify-between border-t border-line px-4 py-3">
        <span className="label">Revision 2 — awaiting your approval</span>
        <span className="flex items-center gap-2 text-[11px] text-mute">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-flare" />
          Nothing is live yet
        </span>
      </div>
    </div>
  );
}
