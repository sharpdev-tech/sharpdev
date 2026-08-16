"use client";

import { MaskLines, Reveal, SectionLabel } from "./ui/Reveal";

const PROMISES = [
  {
    title: "Fixed price, agreed up front",
    body: "You get one number before we start. No hourly billing, no invoice that grows while you wait.",
  },
  {
    title: "You approve the design first",
    body: "The full Figma design comes before development. Nothing is published until you say yes.",
  },
  {
    title: "Revisions until it's right",
    body: "Change the layout, the colours, the wording. The design phase ends when you're satisfied — not before.",
  },
  {
    title: "Speed is part of the build",
    body: "Sites are built to load in about a second, on a normal phone, on a normal connection.",
  },
  {
    title: "You own everything",
    body: "Domain, hosting, code and accounts are all in your name. Leave whenever you want, take it all with you.",
  },
  {
    title: "You can edit it yourself",
    body: "Where it makes sense, text and images are editable without touching code. We show you how in one short call.",
  },
];

export default function Trust() {
  return (
    <section className="relative border-t border-line py-[clamp(5rem,12vw,10rem)]">
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionLabel index="05">Why people stay</SectionLabel>
            <MaskLines
              className="display mt-7 text-[clamp(2.4rem,5.4vw,4.6rem)]"
              lines={[
                <>Six promises,</>,
                <>
                  in <span className="serif-accent text-flare">writing</span>.
                </>,
              ]}
            />
          </div>
        </div>

        <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="group relative h-full bg-ink p-7 transition-colors duration-500 hover:bg-ink-2 lg:p-9">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-line transition-colors duration-500 group-hover:border-flare group-hover:bg-flare/10">
                  <svg viewBox="0 0 14 14" className="h-3.5 w-3.5 text-flare">
                    <path
                      d="M2 7.5l3.2 3.2L12 3.8"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="mt-6 text-[1.15rem] font-medium leading-snug tracking-[-0.03em]">
                  {p.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-[1.65] text-mute">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
