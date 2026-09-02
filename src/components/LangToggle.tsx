"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { persistLang, type Lang } from "@/lib/lang";
import { useLang } from "./LangProvider";

const LABELS: Record<Lang, string> = { en: "EN", sq: "SQ" };

export default function LangToggle({ className = "" }: { className?: string }) {
  const active = useLang();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const choose = (lang: Lang) => {
    if (lang === active) return;
    persistLang(lang);
    startTransition(() => router.refresh());
  };

  return (
    <div
      className={`flex items-center rounded-full border border-line p-0.5 text-[12px] ${className}`}
      role="group"
      aria-label="Language"
    >
      {(Object.keys(LABELS) as Lang[]).map((l) => (
        <button
          key={l}
          onClick={() => choose(l)}
          disabled={pending}
          aria-pressed={l === active}
          className={`rounded-full px-2.5 py-1 transition-colors duration-300 ${
            l === active
              ? "bg-bone text-ink"
              : "text-mute hover:text-bone disabled:opacity-60"
          }`}
        >
          {LABELS[l]}
        </button>
      ))}
    </div>
  );
}
