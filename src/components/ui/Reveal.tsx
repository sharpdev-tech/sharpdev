"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";

/* ---------------------------------------------------------------- Reveal */

export function Reveal({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------- Masked headline */

export function MaskLines({
  lines,
  className,
  delay = 0,
  as: Tag = "h2",
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  as?: "h1" | "h2" | "h3" | "p";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px -10% 0px" });

  return (
    <div ref={ref}>
      <Tag className={className}>
        {lines.map((line, i) => (
          <span key={i} className="block overflow-hidden pb-[0.12em]">
            <motion.span
              className="block will-change-transform"
              initial={{ y: "110%" }}
              animate={inView ? { y: "0%" } : undefined}
              transition={{
                duration: 1.05,
                delay: delay + i * 0.085,
                ease: [0.16, 1, 0.3, 1],
              }}
            >
              {line}
            </motion.span>
          </span>
        ))}
      </Tag>
    </div>
  );
}

/* --------------------------------------------------- Word-by-word paragraph */

export function WordFade({
  text,
  className,
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const words = text.split(" ");
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : undefined}
          transition={{
            duration: 0.55,
            delay: delay + i * 0.018,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </p>
  );
}

/* ---------------------------------------------------------- Section label */

export function SectionLabel({
  index,
  children,
}: {
  index: string;
  children: ReactNode;
}) {
  return (
    <Reveal>
      <div className="label flex items-center gap-3">
        <span className="text-flare">{index}</span>
        <span className="h-px w-8 bg-line" />
        <span>{children}</span>
      </div>
    </Reveal>
  );
}
