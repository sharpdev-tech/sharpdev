"use client";

import { motion } from "motion/react";
import { nav, site } from "@/lib/site";
import { LogoMark } from "./ui/Logo";
import type { Lang } from "@/lib/lang";
import { useCopy } from "./LangProvider";

const COPY: Record<
  Lang,
  {
    blurb: string;
    sections: string;
    contact: string;
    follow: string;
    rights: string;
    allRights: string;
    built: string;
    backToTop: string;
    labels: Record<string, string>;
  }
> = {
  en: {
    blurb:
      "A design-led web studio. We design in Figma, build with Next.js, and never publish anything you haven't approved.",
    sections: "Sections",
    contact: "Contact",
    follow: "Follow / message",
    rights: "SharpDev.",
    allRights: " All rights reserved.",
    built: "Designed in Figma · Built with Next.js",
    backToTop: "Back to top",
    labels: {
      "#work": "Work",
      "#services": "Services",
      "#process": "Process",
      "#stack": "Stack",
      "#faq": "FAQ",
    },
  },
  sq: {
    blurb:
      "Një studio web e udhëhequr nga dizajni. Dizajnojmë në Figma, ndërtojmë me Next.js dhe nuk publikojmë kurrë asgjë që nuk e keni miratuar.",
    sections: "Seksionet",
    contact: "Kontakt",
    follow: "Na ndiqni / shkruani",
    rights: "SharpDev.",
    allRights: " Të gjitha të drejtat e rezervuara.",
    built: "Dizajnuar në Figma · Ndërtuar me Next.js",
    backToTop: "Kthehu lart",
    labels: {
      "#work": "Puna",
      "#services": "Shërbimet",
      "#process": "Procesi",
      "#stack": "Teknologjia",
      "#faq": "Pyetje",
    },
  },
};

const ICONS: Record<string, string> = {
  Instagram:
    "M12 2.2c3.2 0 3.6 0 4.9.07 1.2.05 1.8.25 2.2.42.6.22 1 .49 1.4.9.4.4.67.8.9 1.4.17.4.37 1 .42 2.2.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.05 1.2-.25 1.8-.42 2.2-.23.6-.5 1-.9 1.4-.4.4-.8.68-1.4.9-.4.17-1 .37-2.2.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.05-1.8-.25-2.2-.42-.6-.22-1-.5-1.4-.9-.4-.4-.68-.8-.9-1.4-.17-.4-.37-1-.42-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.05-1.2.25-1.8.42-2.2.22-.6.5-1 .9-1.4.4-.41.8-.68 1.4-.9.4-.17 1-.37 2.2-.42C8.4 2.2 8.8 2.2 12 2.2zm0 3.2A6.6 6.6 0 1 0 18.6 12 6.6 6.6 0 0 0 12 5.4zm0 10.9A4.3 4.3 0 1 1 16.3 12 4.3 4.3 0 0 1 12 16.3zm6.9-11.1a1.55 1.55 0 1 1-1.55-1.55A1.55 1.55 0 0 1 18.9 5.2z",
  Facebook:
    "M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.91 3.77-3.91 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.78-1.63 1.57v1.89h2.78l-.45 2.9h-2.33V22c4.78-.79 8.44-4.93 8.44-9.94z",
  TikTok:
    "M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-1.79-2.46V9.79a5.77 5.77 0 1 0 4.88 5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.24-1.48z",
};

export default function Footer() {
  const t = useCopy(COPY);

  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2">
      <div className="shell py-16 lg:py-20">
        {/* top */}
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <LogoMark className="h-9 w-9" />
              <span className="text-[17px] font-semibold tracking-[-0.02em]">
                Sharp<span className="chrome">Dev</span>
              </span>
            </div>
            <p className="mt-6 max-w-[36ch] text-[0.95rem] leading-[1.65] text-mute">
              {t.blurb}
            </p>
            <a
              href="#contact"
              className="group mt-7 inline-flex items-center gap-2 text-[1.05rem] tracking-[-0.02em] text-bone"
            >
              <span className="border-b border-line pb-0.5 transition-colors group-hover:border-flare group-hover:text-flare">
                {site.email}
              </span>
            </a>
          </div>

          {/* nav + socials — side by side at every width */}
          <div className="grid grid-cols-2 gap-6 sm:gap-10 lg:col-span-6 lg:col-start-7">
          <div>
            <span className="label">{t.sections}</span>
            <ul className="mt-5 space-y-3">
              {nav.map((n) => (
                <li key={n.href}>
                  <a
                    href={n.href}
                    className="group inline-flex items-center gap-2 text-[0.95rem] text-mute transition-colors hover:text-bone"
                  >
                    <span className="h-px w-0 bg-flare transition-all duration-400 group-hover:w-4" />
                    {t.labels[n.href] ?? n.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-2 text-[0.95rem] text-mute transition-colors hover:text-bone"
                >
                  <span className="h-px w-0 bg-flare transition-all duration-400 group-hover:w-4" />
                  {t.contact}
                </a>
              </li>
            </ul>
          </div>

          {/* socials */}
          <div>
            <span className="label">{t.follow}</span>
            <ul className="mt-5 space-y-3">
              {site.socials.map((s) => (
                <li key={s.name}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center gap-2.5 text-[0.95rem] text-mute transition-colors hover:text-bone sm:gap-3"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line transition-colors duration-400 group-hover:border-flare group-hover:bg-flare/10 sm:h-9 sm:w-9">
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 fill-current text-mute transition-colors group-hover:text-flare"
                      >
                        <path d={ICONS[s.name]} />
                      </svg>
                    </span>
                    <span className="flex min-w-0 flex-col leading-tight">
                      <span className="text-[0.9rem] text-bone/90 sm:text-[0.95rem]">
                        {s.name}
                      </span>
                      <span className="truncate text-[0.72rem] text-mute sm:text-[0.8rem]">
                        {s.handle}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="mt-20 overflow-hidden">
          <motion.div
            initial={{ y: "40%", opacity: 0 }}
            whileInView={{ y: "0%", opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="display select-none text-center text-[clamp(3.5rem,17vw,15rem)] leading-[0.85]"
          >
            <span className="chrome">SharpDev</span>
          </motion.div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-line pt-7">
          <p className="order-1 text-[0.82rem] text-mute">
            © {new Date().getFullYear()} {t.rights}
            <span className="hidden sm:inline">{t.allRights}</span>
          </p>
          <p className="order-3 w-full text-[0.82rem] text-mute sm:order-2 sm:w-auto">
            {t.built}
          </p>
          <a
            href="#top"
            className="group order-2 inline-flex items-center gap-2 text-[0.82rem] text-mute transition-colors hover:text-flare sm:order-3"
          >
            {t.backToTop}
            <svg viewBox="0 0 12 12" className="h-3 w-3 transition-transform duration-400 group-hover:-translate-y-1">
              <path
                d="M6 10V2M2.5 5.5L6 2l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.3"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
