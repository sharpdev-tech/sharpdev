"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { MaskLines, Reveal, SectionLabel, WordFade } from "./ui/Reveal";

const SERVICES = [
  {
    n: "01",
    title: "SaaS & product",
    tags: ["Marketing site", "Dashboard UI", "Pricing", "Onboarding"],
    body: "Make a complex product obvious in ten seconds. Clear pages, honest pricing, and flows that turn visitors into sign-ups.",
  },
  {
    n: "02",
    title: "E-commerce",
    tags: ["Shopify", "Headless", "Product pages", "Checkout"],
    body: "Storefronts that load instantly and sell on mobile. Product pages built to answer questions before they're asked.",
  },
  {
    n: "03",
    title: "3D & interactive",
    tags: ["WebGL", "Configurators", "Product viewers"],
    body: "Real-time 3D that runs smooth on a phone. Spin a product, change a colour, see it in the room — no app required.",
  },
  {
    n: "04",
    title: "Cinematic & editorial",
    tags: ["Scroll stories", "Film", "Fashion", "Launches"],
    body: "Scroll-driven storytelling for studios, labels and launches. Every movement has a reason — nothing moves for decoration.",
  },
  {
    n: "05",
    title: "Brand & portfolio",
    tags: ["Founders", "Studios", "Creatives"],
    body: "A site that looks like the work deserves. Quiet, confident, and quick to update when the work changes.",
  },
  {
    n: "06",
    title: "Landing & campaign",
    tags: ["One-pagers", "Events", "Ads"],
    body: "One page, one goal, live in days. Built with tracking from the start so you know what actually worked.",
  },
];

export default function Services() {
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="services" className="relative py-[clamp(5rem,12vw,10rem)]">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="02">What we build</SectionLabel>
            <MaskLines
              className="display mt-7 text-[clamp(2.4rem,5.4vw,4.6rem)]"
              lines={[
                <>Six kinds of</>,
                <>
                  <span className="serif-accent text-flare">website</span>, one
                </>,
                <>standard.</>,
              ]}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <WordFade
              className="max-w-[46ch] text-[1.02rem] leading-[1.6] text-mute"
              text="We don't do everything. We do websites — and we do them properly. Whatever the type, the same rules apply: fast, readable, easy to run, and yours to own."
            />
          </div>
        </div>

        <div className="mt-16 border-t border-line">
          {SERVICES.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.04}>
              <div
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="group relative border-b border-line"
              >
                <motion.span
                  className="absolute inset-0 origin-bottom bg-[linear-gradient(180deg,transparent,rgba(43,200,222,0.07))]"
                  initial={false}
                  animate={{ scaleY: active === i ? 1 : 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                />
                <div className="relative grid gap-4 py-8 lg:grid-cols-12 lg:items-baseline lg:gap-6 lg:py-10">
                  <span className="label lg:col-span-1">{s.n}</span>

                  <h3 className="text-[clamp(1.5rem,3vw,2.3rem)] font-medium tracking-[-0.04em] lg:col-span-4">
                    <span className="inline-block transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-2">
                      {s.title}
                    </span>
                  </h3>

                  <p className="max-w-[52ch] text-[0.97rem] leading-[1.6] text-mute transition-colors duration-500 group-hover:text-bone lg:col-span-5">
                    {s.body}
                  </p>

                  <div className="flex flex-wrap gap-1.5 lg:col-span-2 lg:justify-end">
                    {s.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-line px-2.5 py-1 text-[11px] text-mute transition-colors duration-500 group-hover:border-flare/40 group-hover:text-flare-soft"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p className="mt-8 text-[0.95rem] text-mute">
            Not sure which one you need?{" "}
            <a
              href="#contact"
              className="text-bone underline decoration-flare decoration-1 underline-offset-4 transition-colors hover:text-flare"
            >
              Describe it in a sentence
            </a>{" "}
            and we&apos;ll tell you.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
