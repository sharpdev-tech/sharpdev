"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { MaskLines, Reveal, SectionLabel, WordFade } from "./ui/Reveal";

const TOOLS = [
  { name: "Figma", why: "Where your site is designed and approved" },
  { name: "Next.js", why: "The framework we build on" },
  { name: "React", why: "Interface components" },
  { name: "TypeScript", why: "Fewer bugs, safer changes" },
  { name: "Tailwind CSS", why: "Consistent styling at speed" },
  { name: "GSAP", why: "Precise scroll animation" },
  { name: "Three.js", why: "Real-time 3D in the browser" },
  { name: "Shopify", why: "Products, orders and payments" },
  { name: "Stripe", why: "Card payments and subscriptions" },
  { name: "Sanity", why: "So you can edit text yourself" },
  { name: "Vercel", why: "Global hosting, deployed in seconds" },
  { name: "Plausible", why: "Privacy-friendly visitor stats" },
];

const STATS = [
  { v: 24, suffix: "h", label: "Reply to your first email" },
  { v: 100, suffix: "", label: "Performance score we build toward" },
  { v: 1, prefix: "<", suffix: "s", label: "Target load time" },
  { v: 0, suffix: "", label: "Sites published without your approval" },
];

export default function Stack() {
  return (
    <section
      id="stack"
      className="relative border-t border-line py-[clamp(5rem,12vw,10rem)]"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="04">What we work with</SectionLabel>
            <MaskLines
              className="display mt-7 text-[clamp(2.4rem,5.4vw,4.6rem)]"
              lines={[
                <>Modern tools.</>,
                <>
                  No <span className="serif-accent text-flare">templates</span>.
                </>,
              ]}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <WordFade
              className="max-w-[46ch] text-[1.02rem] leading-[1.6] text-mute"
              text="Every site is built from scratch on tools that are proven, fast and widely supported — so any developer can pick it up later. You are never locked in."
            />
          </div>
        </div>

        {/* tools */}
        <div className="mt-16 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3 lg:grid-cols-4">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ delay: i * 0.035, duration: 0.6 }}
              className="group relative bg-ink p-5 transition-colors duration-500 hover:bg-ink-2 sm:p-6"
            >
              <span className="absolute left-0 top-0 h-px w-0 bg-flare transition-all duration-500 group-hover:w-full" />
              <div className="text-[1.05rem] font-medium tracking-[-0.03em]">
                {t.name}
              </div>
              <div className="mt-2 text-[0.85rem] leading-snug text-mute">
                {t.why}
              </div>
            </motion.div>
          ))}
        </div>

        {/* stats */}
        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.06}>
              <div className="border-t border-line pt-6">
                <Counter {...s} />
                <p className="mt-3 max-w-[24ch] text-[0.9rem] leading-snug text-mute">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Counter({
  v,
  prefix = "",
  suffix = "",
}: {
  v: number;
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-20%" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView || v === 0) return;
    let raf = 0;
    const start = performance.now();
    const dur = 1300;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setN(Math.round(v * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, v]);

  return (
    <div
      ref={ref}
      className="display text-[clamp(2.6rem,5vw,4rem)] tabular-nums"
    >
      <span className="text-mute">{prefix}</span>
      {n}
      <span className="text-flare">{suffix}</span>
    </div>
  );
}
