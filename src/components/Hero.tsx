"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowButton } from "./ui/Magnetic";

const line = {
  hidden: { y: "115%" },
  show: (i: number) => ({
    y: "0%",
    transition: { duration: 1.15, delay: 1.15 + i * 0.09, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const textY = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);
  const orbY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const orbScale = useTransform(scrollYProgress, [0, 1], [1, 1.35]);
  const gridY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  return (
    <section ref={ref} id="top" className="relative min-h-[100svh] overflow-hidden">
      {/* ---------- backdrop ---------- */}
      <motion.div
        style={{ y: orbY, scale: orbScale }}
        className="pointer-events-none absolute left-1/2 top-[46%] h-[95vmin] w-[95vmin] -translate-x-1/2 -translate-y-1/2"
      >
        {/* core glow */}
        <div className="glow-flare absolute inset-0 rounded-full blur-[6px]" />
        {/* eclipse disc */}
        <div className="absolute inset-[16%] rounded-full bg-ink shadow-[0_0_120px_40px_rgba(43,200,222,0.28)]" />
        <div className="absolute inset-[16%] rounded-full bg-[radial-gradient(circle_at_30%_25%,rgba(127,217,232,0.14),transparent_55%)]" />
        {/* rotating rings */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border border-flare/20"
            style={{ inset: `${6 + i * 5}%` }}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: 44 + i * 16, repeat: Infinity, ease: "linear" }}
          >
            <span
              className="absolute h-1.5 w-1.5 rounded-full bg-flare shadow-[0_0_14px_4px_rgba(43,200,222,0.6)]"
              style={{ top: "-3px", left: "50%" }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* horizon grid */}
      <motion.div
        style={{ y: gridY }}
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] [mask-image:linear-gradient(to_top,#000,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(43,200,222,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(43,200,222,0.16)_1px,transparent_1px)] bg-[size:70px_70px] [transform:perspective(340px)_rotateX(58deg)] origin-bottom" />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,transparent_25%,var(--color-ink)_78%)]" />

      {/* ---------- content ---------- */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="shell relative z-10 flex min-h-[100svh] flex-col justify-between gap-8 pb-10 pt-[calc(var(--nav-h)+4vh)] [@media(min-height:800px)]:pt-[calc(var(--nav-h)+7vh)]"
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="label mb-8 flex flex-wrap items-center gap-3"
          >
            <span className="rounded-full border border-line px-3 py-1.5">
              Web design &amp; development studio
            </span>
            <span className="hidden sm:inline">Available for new projects</span>
          </motion.div>

          {/* Sized off height as well as width — on wide but short screens a
              width-only clamp pushes the buttons below the fold. */}
          <h1 className="display max-w-[15ch] text-[clamp(3rem,min(10.5vw,13vh),10.5rem)]">
            {["Websites", "worth the"].map((t, i) => (
              <span key={t} className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  className="block"
                  variants={line}
                  initial="hidden"
                  animate="show"
                  custom={i}
                >
                  {t}
                </motion.span>
              </span>
            ))}
            <span className="block overflow-hidden pb-[0.06em]">
              <motion.span className="block" variants={line} initial="hidden" animate="show" custom={2}>
                <span className="serif-accent text-flare">scroll</span>
                <span className="text-mute">.</span>
              </motion.span>
            </span>
          </h1>
        </div>

        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-[46ch] text-[clamp(1rem,1.35vw,1.2rem)] leading-[1.55] text-mute"
          >
            We design and build fast, beautiful websites — from SaaS platforms
            to storefronts and 3D experiences.{" "}
            <span className="text-bone">
              You see the finished design in Figma before a single line goes
              live.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.7, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap items-center gap-3"
          >
            <ArrowButton href="#contact">Start a project</ArrowButton>
            <ArrowButton href="#process" variant="ghost">
              See how it works
            </ArrowButton>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 1 }}
          className="mt-2 hidden items-center gap-3 [@media(min-height:860px)]:lg:flex"
        >
          <span className="label">Scroll</span>
          <div className="h-10 w-px overflow-hidden bg-line">
            <motion.div
              className="h-4 w-px bg-flare"
              animate={{ y: [-16, 40] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
