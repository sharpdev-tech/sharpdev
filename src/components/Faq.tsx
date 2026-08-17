"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MaskLines, Reveal, SectionLabel } from "./ui/Reveal";
import { site } from "@/lib/site";

const FAQS = [
  {
    q: "How much does a website cost?",
    a: "It depends on what you need — a one-page site is a very different job to a store with 200 products or a 3D configurator. Send a short email describing your business and you'll get a fixed price within 24 hours. That price doesn't change unless you ask for something new.",
  },
  {
    q: "Can I really see the design before I commit?",
    a: "Yes. That's the whole way we work. You get a private Figma link showing the finished design on desktop and mobile — real layout, real colours, real text. Only after you approve it do we start building.",
  },
  {
    q: "What if I don't like what I see?",
    a: "We change it. Comment directly on the design or just reply to the email, and you'll get a new version. The design stage isn't finished until you're happy with it.",
  },
  {
    q: "How long does it take?",
    a: "A landing page is usually about a week. A full marketing site is two to three weeks. A store or a 3D build is typically four to six. You get a date with your quote, and we tell you early if anything moves.",
  },
  {
    q: "Do I need to know anything technical?",
    a: "No. You describe your business and what you want people to do on the site. We handle domains, hosting, email setup and everything else, then hand it over with a short guide.",
  },
  {
    q: "Who owns the website when it's done?",
    a: "You do — completely. The code, the domain and the hosting all sit in your accounts. There's no lock-in and no monthly fee required to keep your site online.",
  },
  {
    q: "Can you redesign the site I already have?",
    a: "Often that's the best option. Send the link and we'll tell you honestly whether it needs a rebuild or just a sharper design on top of what's there.",
  },
  {
    q: "What happens after launch?",
    a: "You get everything you need to run it yourself. If you'd rather not, we offer optional monthly care — updates, small changes, and keeping an eye on speed and uptime.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className="relative border-t border-line py-[clamp(5rem,12vw,10rem)]"
    >
      <div className="shell grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+40px)]">
            <SectionLabel index="06">Questions</SectionLabel>
            <MaskLines
              className="display mt-7 text-[clamp(2.2rem,4.4vw,3.6rem)]"
              lines={[
                <>Answers,</>,
                <>
                  no <span className="serif-accent text-flare">jargon</span>.
                </>,
              ]}
            />
            <Reveal delay={0.15}>
              <p className="mt-7 max-w-[34ch] text-[0.97rem] leading-[1.65] text-mute">
                Still unsure about something? Ask directly —{" "}
                <a
                  href="#contact"
                  className="text-bone underline decoration-flare decoration-1 underline-offset-4 transition-colors hover:text-flare"
                >
                  {site.email}
                </a>
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="border-t border-line">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <Reveal key={f.q} delay={i * 0.03}>
                  <div className="border-b border-line">
                    <button
                      onClick={() => setOpen(isOpen ? null : i)}
                      aria-expanded={isOpen}
                      className="group flex w-full items-start gap-5 py-6 text-left"
                    >
                      <span className="label mt-1.5 shrink-0">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`flex-1 text-[1.08rem] font-medium leading-snug tracking-[-0.025em] transition-colors duration-300 sm:text-[1.2rem] ${
                          isOpen ? "text-bone" : "text-bone/85 group-hover:text-bone"
                        }`}
                      >
                        {f.q}
                      </span>
                      <span className="relative mt-2 h-3 w-3 shrink-0">
                        <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-flare" />
                        <span
                          className={`absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-flare transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isOpen ? "scale-y-0" : "scale-y-100"
                          }`}
                        />
                      </span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <p className="max-w-[62ch] pb-7 pl-[3.1rem] pr-8 text-[0.98rem] leading-[1.7] text-mute">
                            {f.a}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
