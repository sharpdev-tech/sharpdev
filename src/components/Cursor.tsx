"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/lib/useMediaQuery";

export default function Cursor() {
  const finePointer = useMediaQuery("(pointer: fine)");
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [state, setState] = useState<"idle" | "hover">("idle");

  useEffect(() => {
    if (!finePointer) return;

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const t = e.target as HTMLElement;
      const hot = t?.closest?.("a, button, [data-cursor='hover']");
      setState(hot ? "hover" : "idle");
    };
    window.addEventListener("pointermove", move);
    return () => window.removeEventListener("pointermove", move);
  }, [finePointer, x, y]);

  if (!finePointer) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden lg:block"
      style={{ x: sx, y: sy }}
    >
      <motion.div
        className="rounded-full border border-flare"
        animate={{
          width: state === "hover" ? 46 : 12,
          height: state === "hover" ? 46 : 12,
          x: state === "hover" ? -23 : -6,
          y: state === "hover" ? -23 : -6,
          backgroundColor:
            state === "hover" ? "rgba(43,200,222,0)" : "rgba(43,200,222,1)",
        }}
        transition={{ type: "spring", stiffness: 320, damping: 26 }}
      />
    </motion.div>
  );
}
