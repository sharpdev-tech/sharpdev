"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

const ITEMS = [
  "SaaS platforms",
  "E-commerce",
  "3D & WebGL",
  "Cinematic sites",
  "Brand & portfolio",
  "Landing pages",
  "Web apps",
  "Redesigns",
];

export default function Marquee() {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1600, 0, 1600], [-2, 1, 2], {
    clamp: false,
  });
  const skew = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6], {
    clamp: true,
  });

  const dir = useRef(1);

  // Base drift. The velocity factor below rests at 1, so `move += move * |f|`
  // doubles this when the page is still: 0.001 lands at ~190px/s on screen.
  // Raise it to speed the marquee up.
  const SPEED = 0.001;

  useAnimationFrame((_, delta) => {
    let move = dir.current * SPEED * delta;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += move * Math.abs(f);
    baseX.set(wrap(baseX.get() + move));
  });

  const x = useTransform(baseX, (v) => `${v}%`);

  return (
    <div className="relative border-y border-line bg-ink-2/40 py-6">
      <motion.div style={{ skewX: skew }} className="mask-fade-r overflow-hidden">
        <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
          {[...ITEMS, ...ITEMS, ...ITEMS, ...ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-8 px-8 text-[clamp(1.1rem,2.4vw,2rem)] font-medium tracking-[-0.03em] text-mute"
            >
              {item}
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-flare" />
            </span>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}

function wrap(v: number) {
  const range = 50;
  if (v <= -range) return v + range;
  if (v >= 0) return v - range;
  return v;
}
