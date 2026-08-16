"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { MaskLines, SectionLabel, WordFade } from "./ui/Reveal";

type Card = {
  n: string;
  kind: string;
  title: string;
  body: string;
  metrics: { k: string; v: string }[];
  accent: string;
};

const CARDS: Card[] = [
  {
    n: "01",
    kind: "SaaS platform",
    title: "Explain the product in one screen",
    body: "A marketing site built around a single question: what does this do for me? Short sections, one clear action, pricing you can read without a call.",
    metrics: [
      { k: "Build", v: "3 weeks" },
      { k: "Pages", v: "7" },
      { k: "Load", v: "< 1s" },
    ],
    accent: "from-[#2bc8de]/25",
  },
  {
    n: "02",
    kind: "E-commerce",
    title: "A storefront that behaves on mobile",
    body: "Fast product pages, honest photography, and a checkout with nothing in the way. Stock, prices and collections stay editable by the owner.",
    metrics: [
      { k: "Build", v: "4 weeks" },
      { k: "Products", v: "120+" },
      { k: "Self-managed", v: "Yes" },
    ],
    accent: "from-[#7fd9e8]/25",
  },
  {
    n: "03",
    kind: "3D & WebGL",
    title: "Turn the product, change the colour",
    body: "A real-time 3D viewer running in the browser. Drag to rotate, pick a finish, see the price update — smooth on a three-year-old phone.",
    metrics: [
      { k: "Build", v: "5 weeks" },
      { k: "Frame rate", v: "60fps" },
      { k: "App needed", v: "None" },
    ],
    accent: "from-[#6ba8ff]/20",
  },
  {
    n: "04",
    kind: "Cinematic",
    title: "A story told by scrolling",
    body: "Full-bleed film, type that arrives on cue, and pacing that holds attention to the last frame. Motion used to guide the eye, never to show off.",
    metrics: [
      { k: "Build", v: "4 weeks" },
      { k: "Scenes", v: "6" },
      { k: "Sound", v: "Optional" },
    ],
    accent: "from-[#c58bff]/20",
  },
];

export default function Work() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section id="work" className="relative border-t border-line py-[clamp(5rem,12vw,10rem)]">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel index="01">Selected concepts</SectionLabel>
            <MaskLines
              className="display mt-7 text-[clamp(2.4rem,5.4vw,4.6rem)]"
              lines={[
                <>The kind of work</>,
                <>
                  we <span className="serif-accent text-flare">ship</span>.
                </>,
              ]}
            />
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:self-end">
            <WordFade
              className="max-w-[44ch] text-[1.02rem] leading-[1.6] text-mute"
              text="Four builds, four different problems. Scroll through to see how we think about layout, speed and the one action every page should lead to."
            />
          </div>
        </div>
      </div>

      <div ref={ref} className="shell mt-16">
        {CARDS.map((c, i) => (
          <StickyCard key={c.n} card={c} index={i} total={CARDS.length} />
        ))}
      </div>
    </section>
  );
}

function StickyCard({
  card,
  index,
  total,
}: {
  card: Card;
  index: number;
  total: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.9]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.25]);

  return (
    <div
      ref={ref}
      className="sticky"
      style={{ top: `calc(var(--nav-h) + ${18 + index * 14}px)` }}
    >
      <motion.article
        style={{ scale, opacity }}
        className="relative mb-6 overflow-hidden rounded-3xl border border-line bg-ink-2 will-change-transform"
      >
        <div
          className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${card.accent} via-transparent to-transparent`}
        />
        <div className="relative grid gap-8 p-7 sm:p-10 lg:grid-cols-12 lg:gap-10 lg:p-12">
          <div className="lg:col-span-6">
            <div className="label flex items-center gap-3">
              <span className="text-flare">{card.n}</span>
              <span className="h-px w-6 bg-line" />
              <span>{card.kind}</span>
              <span className="ml-auto rounded-full border border-line px-2 py-0.5 text-[10px] normal-case tracking-normal">
                Concept
              </span>
            </div>

            <h3 className="mt-6 max-w-[18ch] text-[clamp(1.7rem,3.4vw,2.8rem)] font-medium leading-[1.05] tracking-[-0.045em]">
              {card.title}
            </h3>

            <p className="mt-5 max-w-[46ch] text-[1rem] leading-[1.65] text-mute">
              {card.body}
            </p>

            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4 border-t border-line pt-6">
              {card.metrics.map((m) => (
                <div key={m.k}>
                  <div className="text-[1.35rem] font-medium tracking-[-0.03em]">
                    {m.v}
                  </div>
                  <div className="label mt-1">{m.k}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Visual index={index} />
          </div>
        </div>

        <div className="relative flex items-center justify-between border-t border-line px-7 py-4 sm:px-10 lg:px-12">
          <span className="label">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="label">Designed in Figma — built with Next.js</span>
        </div>
      </motion.article>
    </div>
  );
}

/* Abstract per-card visual, no external assets. */
function Visual({ index }: { index: number }) {
  const common =
    "relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-line bg-ink";

  if (index === 0)
    return (
      <div className={common}>
        <div className="flex h-full flex-col gap-3 p-5">
          <div className="h-1/3 rounded-lg border border-line bg-surface/60" />
          <div className="grid flex-1 grid-cols-2 gap-3">
            {[0, 1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="rounded-lg border border-line bg-surface/40"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 3, delay: i * 0.35, repeat: Infinity }}
              />
            ))}
          </div>
          <div className="h-10 rounded-full bg-flare/80" />
        </div>
      </div>
    );

  if (index === 1)
    return (
      <div className={common}>
        <div className="grid h-full grid-cols-2 gap-2 p-4">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex flex-col justify-end rounded-lg border border-line bg-surface/40 p-2"
            >
              <span className="h-1 w-2/3 rounded-full bg-line" />
              <span className="mt-1 h-1 w-1/3 rounded-full bg-flare/70" />
            </div>
          ))}
        </div>
      </div>
    );

  if (index === 2)
    return (
      <div className={`${common} flex items-center justify-center`}>
        <motion.div
          className="relative h-40 w-40"
          animate={{ rotateY: 360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformStyle: "preserve-3d" }}
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute inset-0 rounded-xl border border-flare/40 bg-flare/[0.05]"
              style={{ transform: `rotateY(${i * 90}deg) translateZ(80px)` }}
            />
          ))}
        </motion.div>
        <div className="absolute bottom-5 flex gap-2">
          {["#2bc8de", "#edf1f3", "#6ba8ff"].map((c) => (
            <span
              key={c}
              className="h-5 w-5 rounded-full border border-line"
              style={{ background: c }}
            />
          ))}
        </div>
      </div>
    );

  return (
    <div className={`${common} flex items-end`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(197,139,255,0.25),transparent_60%)]" />
      <div className="relative w-full space-y-2 p-5">
        {[100, 78, 55, 34].map((w, i) => (
          <motion.div
            key={i}
            className="h-2.5 rounded-full bg-bone/80"
            style={{ width: `${w}%` }}
            initial={{ scaleX: 0, originX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </div>
    </div>
  );
}
