"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import FigmaFrame from "./FigmaFrame";
import { MaskLines, Reveal, SectionLabel, WordFade } from "./ui/Reveal";
import { ArrowButton } from "./ui/Magnetic";
import { site } from "@/lib/site";
import type { Lang } from "@/lib/lang";
import { useCopy } from "./LangProvider";

type Step = { n: string; title: string; body: string; note: string };

const COPY: Record<
  Lang,
  {
    label: string;
    lines: [string, string, string];
    accent: string;
    intro: string;
    promiseLead: string;
    promise: string;
    stepOf: (i: number, total: number) => string;
    dislikeTitle: string;
    dislikeBody: string;
    dislikeCta: string;
    steps: Step[];
  }
> = {
  en: {
    label: "How we work",
    lines: ["You approve the", " before", "anything goes live."],
    accent: "design",
    intro:
      "No guessing, and no paying for something you haven't seen. You get a full design preview first, change whatever you want, and only then do we build it.",
    promiseLead: "Our promise:",
    promise:
      "your website is never published until you've seen the design and said yes.",
    stepOf: (i, total) => `Step ${i} of ${total}`,
    dislikeTitle: "What if I don't like the design?",
    dislikeBody:
      "Then we change it. That's the whole point of designing first — it's far easier to move a section in Figma than to rebuild a finished website. Tell us what feels off and you'll have a new version to look at.",
    dislikeCta: "Ask for a preview",
    steps: [
      {
        n: "01",
        title: "You tell us what you need",
        body: "A few lines is enough: what your business does and what you need. Use the short form below, or write us an email — whichever is easier. No calls you didn't ask for. You get a reply within 24 hours with honest feedback, a timeline and a fixed price.",
        note: `The form below, or ${site.email}`,
      },
      {
        n: "02",
        title: "You see the design first",
        body: "We design the full website in Figma and send you a private preview link. Real layout, real text, real colours — on desktop and phone. Nothing has been built yet, and nothing is public.",
        note: "A clickable Figma preview, shared privately",
      },
      {
        n: "03",
        title: "You change anything",
        body: "Comment straight on the design, or just reply to the email. Bigger heading, different colour, move that section up. We revise until you say it's right — the design phase doesn't end until you're satisfied.",
        note: "Revisions until you approve",
      },
      {
        n: "04",
        title: "Then we build and launch",
        body: "Only after your approval do we write code. When it's ready you get the site, the code, and a short guide for updating it. Everything is transferred into your accounts.",
        note: "You own the result — fully",
      },
    ],
  },
  sq: {
    label: "Si punojmë",
    lines: ["Ju e miratoni", " para", "se të publikohet asgjë."],
    accent: "dizajnin",
    intro:
      "Pa hamendje dhe pa paguar për diçka që nuk e keni parë. Së pari merrni një pamje të plotë të dizajnit, ndryshoni çfarë të doni, dhe vetëm pastaj e ndërtojmë.",
    promiseLead: "Premtimi ynë:",
    promise:
      "faqja juaj nuk publikohet kurrë para se ta keni parë dizajnin dhe të keni thënë po.",
    stepOf: (i, total) => `Hapi ${i} nga ${total}`,
    dislikeTitle: "Po nëse nuk më pëlqen dizajni?",
    dislikeBody:
      "Atëherë e ndryshojmë. Pikërisht për këtë dizajnojmë të parët — është shumë më e lehtë të zhvendoset një seksion në Figma sesa të rindërtohet një faqe e mbaruar. Na thoni çfarë nuk shkon dhe merrni një version të ri.",
    dislikeCta: "Kërko një pamje",
    steps: [
      {
        n: "01",
        title: "Na tregoni çfarë ju duhet",
        body: "Pak rreshta mjaftojnë: çfarë bën biznesi juaj dhe çfarë ju nevojitet. Përdorni formularin e shkurtër më poshtë, ose na shkruani një email — si t'ju vijë më lehtë. Pa telefonata që nuk i keni kërkuar. Merrni përgjigje brenda 24 orësh, me mendim të sinqertë, afat dhe çmim fiks.",
        note: `Formulari më poshtë, ose ${site.email}`,
      },
      {
        n: "02",
        title: "Së pari shihni dizajnin",
        body: "E dizajnojmë faqen e plotë në Figma dhe ju dërgojmë një lidhje private. Strukturë e vërtetë, tekst i vërtetë, ngjyra të vërteta — në kompjuter dhe në telefon. Ende nuk është ndërtuar asgjë dhe asgjë nuk është publike.",
        note: "Një pamje Figma e klikueshme, e ndarë privatisht",
      },
      {
        n: "03",
        title: "Ndryshoni çfarë të doni",
        body: "Komentoni drejt mbi dizajn, ose thjesht përgjigjuni emailit. Titull më të madh, ngjyrë tjetër, ngrini atë seksion më lart. Rishikojmë derisa të thoni se është si duhet — faza e dizajnit nuk mbaron para se të jeni të kënaqur.",
        note: "Rishikime derisa ta miratoni",
      },
      {
        n: "04",
        title: "Pastaj ndërtojmë dhe publikojmë",
        body: "Vetëm pas miratimit tuaj shkruajmë kod. Kur është gati, merrni faqen, kodin dhe një udhëzues të shkurtër për ta përditësuar. Gjithçka kalon në llogaritë tuaja.",
        note: "Rezultati është tërësisht juaji",
      },
    ],
  },
};

export default function Process() {
  const t = useCopy(COPY);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 60%", "end 90%"],
  });
  const height = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section
      id="process"
      className="relative border-t border-line py-[clamp(5rem,12vw,10rem)]"
    >
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionLabel index="03">{t.label}</SectionLabel>
            <MaskLines
              className="display mt-7 text-[clamp(2.4rem,5.4vw,4.6rem)]"
              lines={[
                <>{t.lines[0]}</>,
                <>
                  <span className="serif-accent text-flare">{t.accent}</span>
                  {t.lines[1]}
                </>,
                <>{t.lines[2]}</>,
              ]}
            />
          </div>
          <div className="lg:col-span-6 lg:col-start-7 lg:self-end">
            <WordFade
              className="max-w-[46ch] text-[1.02rem] leading-[1.6] text-mute"
              text={t.intro}
            />
          </div>
        </div>

        {/* ------------------------------- steps + sticky preview */}
        <div ref={ref} className="mt-20 grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* sticky visual */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-[calc(var(--nav-h)+40px)]">
              <Reveal>
                <FigmaFrame />
              </Reveal>
              <Reveal delay={0.1}>
                <div className="mt-6 rounded-xl border border-flare/25 bg-flare/[0.06] p-5">
                  <p className="text-[0.95rem] leading-[1.6] text-bone">
                    <span className="text-flare">{t.promiseLead}</span>{" "}
                    {t.promise}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>

          {/* steps */}
          <div className="relative lg:col-span-6 lg:col-start-7">
            <div className="absolute left-0 top-2 hidden h-full w-px bg-line sm:block">
              <motion.div className="w-px bg-flare" style={{ height }} />
            </div>

            <div className="flex flex-col gap-14 sm:pl-10">
              {t.steps.map((s, i) => (
                <Reveal key={s.n} delay={i * 0.05}>
                  <div className="relative">
                    <span className="absolute -left-10 top-2 hidden h-2 w-2 -translate-x-[3.5px] rounded-full bg-flare sm:block" />
                    <div className="label mb-4 flex items-center gap-3">
                      <span className="text-flare">{s.n}</span>
                      <span className="h-px w-6 bg-line" />
                      <span>{t.stepOf(i + 1, t.steps.length)}</span>
                    </div>
                    <h3 className="text-[clamp(1.5rem,2.8vw,2.1rem)] font-medium tracking-[-0.04em]">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-[52ch] text-[1rem] leading-[1.65] text-mute">
                      {s.body}
                    </p>
                    <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-[12px] text-flare-soft">
                      <svg viewBox="0 0 12 12" className="h-3 w-3">
                        <path
                          d="M2 6.5l2.6 2.6L10 3.4"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      {s.note}
                    </p>
                  </div>
                </Reveal>
              ))}

              <Reveal>
                <div className="rounded-2xl border border-line bg-ink-2 p-7">
                  <h4 className="text-[1.25rem] font-medium tracking-[-0.03em]">
                    {t.dislikeTitle}
                  </h4>
                  <p className="mt-3 max-w-[48ch] text-[0.97rem] leading-[1.65] text-mute">
                    {t.dislikeBody}
                  </p>
                  <div className="mt-6">
                    <ArrowButton href="#contact">{t.dislikeCta}</ArrowButton>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
