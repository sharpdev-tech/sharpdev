"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { MaskLines, Reveal, SectionLabel } from "./ui/Reveal";
import { ArrowButton } from "./ui/Magnetic";
import { mailto, site } from "@/lib/site";
import ContactForm from "./ContactForm";
import type { Lang } from "@/lib/lang";
import { useCopy } from "./LangProvider";

const COPY: Record<
  Lang,
  {
    label: string;
    lines: [string, string, string];
    accent: string;
    intro: string;
    orEmail: string;
    copy: string;
    copied: string;
    openMail: string;
    checklistTitle: string;
    checklistNote: string;
    checklist: string[];
    social: string;
    socialStrong: string;
    available: string;
  }
> = {
  en: {
    label: "Start here",
    lines: ["Write one", "email. Get a", "."],
    accent: "design",
    intro:
      "No sales calls, no pressure. Tell us what you need and you'll have a reply within 24 hours — with an honest opinion, a fixed price and a date.",
    orEmail: "Or email us directly",
    copy: "Copy",
    copied: "Copied",
    openMail: "Open in your email app",
    checklistTitle: "What to tell us",
    checklistNote: "Four lines is plenty.",
    checklist: [
      "What your business does",
      "What you need the website to do",
      "A rough deadline, if you have one",
      "A site you like the look of",
    ],
    social: "Prefer social? Message",
    socialStrong: "on Instagram, Facebook or TikTok.",
    available: "Currently taking on new projects",
  },
  sq: {
    label: "Filloni këtu",
    lines: ["Shkruani një", "email. Merrni një", "."],
    accent: "dizajn",
    intro:
      "Pa telefonata shitjeje, pa presion. Na tregoni çfarë ju duhet dhe merrni përgjigje brenda 24 orësh — me mendim të sinqertë, çmim fiks dhe një datë.",
    orEmail: "Ose na shkruani drejtpërdrejt",
    copy: "Kopjo",
    copied: "U kopjua",
    openMail: "Hape në aplikacionin e emailit",
    checklistTitle: "Çfarë të na tregoni",
    checklistNote: "Katër rreshta mjaftojnë.",
    checklist: [
      "Çfarë bën biznesi juaj",
      "Çfarë doni të bëjë faqja",
      "Një afat të përafërt, nëse keni",
      "Një faqe që ju pëlqen si duket",
    ],
    social: "Preferoni rrjetet sociale? Na shkruani",
    socialStrong: "në Instagram, Facebook ose TikTok.",
    available: "Aktualisht po marrim projekte të reja",
  },
};

export default function Contact() {
  const t = useCopy(COPY);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-line py-[clamp(5rem,13vw,11rem)]"
    >
      {/* glow */}
      <div className="glow-flare pointer-events-none absolute -bottom-1/2 left-1/2 h-[80vmin] w-[80vmin] -translate-x-1/2 rounded-full opacity-60 blur-2xl" />

      <div className="shell relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionLabel index="07">{t.label}</SectionLabel>

            <MaskLines
              as="h2"
              className="display mt-7 text-[clamp(2.6rem,7vw,6rem)]"
              lines={[
                <>{t.lines[0]}</>,
                <>
                  {t.lines[1]}{" "}
                  <span className="serif-accent text-flare">{t.accent}</span>
                  {t.lines[2]}
                </>,
              ]}
            />

            <Reveal delay={0.15}>
              <p className="mt-8 max-w-[48ch] text-[1.05rem] leading-[1.65] text-mute">
                {t.intro}
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <ContactForm />
            </Reveal>

            {/* secondary route — for people who'd rather use their own inbox */}
            <Reveal delay={0.25}>
              <div className="mt-8 border-t border-line pt-7">
                <span className="label">{t.orEmail}</span>

                <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-4">
                  <span className="text-[clamp(1.05rem,2.2vw,1.45rem)] font-medium tracking-[-0.03em]">
                    {site.email}
                  </span>

                  <button
                    onClick={copy}
                    className="rounded-full border border-line px-4 py-1.5 text-[12.5px] text-mute transition-colors hover:border-flare hover:text-flare"
                  >
                    <motion.span
                      key={copied ? "y" : "n"}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25 }}
                      className="block"
                    >
                      {copied ? t.copied : t.copy}
                    </motion.span>
                  </button>

                  <ArrowButton href={mailto()} variant="ghost" className="!py-3">
                    {t.openMail}
                  </ArrowButton>
                </div>
              </div>
            </Reveal>
          </div>

          {/* what to include */}
          <div className="lg:col-span-4 lg:col-start-9">
            <Reveal delay={0.1}>
              <div className="rounded-2xl border border-line bg-ink-2/80 p-7 backdrop-blur-sm lg:p-8">
                <h3 className="text-[1.1rem] font-medium tracking-[-0.03em]">
                  {t.checklistTitle}
                </h3>
                <p className="mt-2 text-[0.9rem] leading-snug text-mute">
                  {t.checklistNote}
                </p>
                <ul className="mt-6 space-y-4">
                  {t.checklist.map((c, i) => (
                    <li key={c} className="flex items-start gap-3">
                      <span className="label mt-0.5 text-flare">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="text-[0.95rem] leading-snug text-bone/90">
                        {c}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-7 border-t border-line pt-5">
                  <p className="text-[0.88rem] leading-relaxed text-mute">
                    {t.social}{" "}
                    <span className="text-bone">@sharpdev.dev</span>{" "}
                    {t.socialStrong}
                  </p>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.18}>
              <div className="mt-4 flex items-center gap-3 rounded-2xl border border-flare/25 bg-flare/[0.06] px-5 py-4">
                <span className="relative flex h-2 w-2">
                  <span className="absolute h-2 w-2 rounded-full bg-flare" />
                  <span className="absolute h-2 w-2 rounded-full bg-flare [animation:pulse-ring_2.4s_ease-out_infinite]" />
                </span>
                <p className="text-[0.9rem] text-bone">
                  {t.available}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
