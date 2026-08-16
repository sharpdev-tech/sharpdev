"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

export function Magnetic({
  children,
  strength = 0.28,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 16, mass: 0.35 });
  const sy = useSpring(y, { stiffness: 180, damping: 16, mass: 0.35 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onPointerMove={(e) => {
        if (e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ Button */

export function ArrowButton({
  href,
  children,
  variant = "solid",
  className = "",
  external,
}: {
  href: string;
  children: ReactNode;
  variant?: "solid" | "ghost";
  className?: string;
  external?: boolean;
}) {
  const solid = variant === "solid";
  return (
    <Magnetic className="inline-block">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        data-cursor="hover"
        className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full px-7 py-4 text-[14px] font-medium tracking-tight transition-colors duration-500 ${
          solid
            ? "bg-bone text-ink hover:text-bone"
            : "border border-line text-bone hover:text-ink"
        } ${className}`}
      >
        <span
          className={`absolute inset-0 -z-0 translate-y-full rounded-full transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 ${
            solid ? "bg-flare" : "bg-bone"
          }`}
        />
        <span className="relative z-10">{children}</span>
        <span className="relative z-10 flex h-4 w-4 items-center overflow-hidden">
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4 shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-5"
          >
            <path
              d="M1 8h13M9 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <svg
            viewBox="0 0 16 16"
            fill="none"
            className="h-4 w-4 shrink-0 -translate-x-5 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-x-4"
          >
            <path
              d="M1 8h13M9 3l5 5-5 5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </a>
    </Magnetic>
  );
}
