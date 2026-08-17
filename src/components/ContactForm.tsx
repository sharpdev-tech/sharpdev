"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line bg-ink-2/80 px-4 py-3 text-[0.95rem] text-bone outline-none transition-colors placeholder:text-mute/70 focus:border-flare disabled:opacity-60";

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state === "sending") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setState("sending");
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const { error: code } = await res.json().catch(() => ({ error: "" }));
        throw new Error(code === "email" ? "email" : "send");
      }

      form.reset();
      setState("sent");
    } catch (err) {
      setError(
        err instanceof Error && err.message === "email"
          ? "That email address doesn't look right."
          : "Something went wrong. Please email us directly instead.",
      );
      setState("error");
    }
  };

  return (
    <form onSubmit={submit} className="mt-10 space-y-3" noValidate>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="sr-only">Your name</span>
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            placeholder="Your name"
            disabled={state === "sending"}
            className={field}
          />
        </label>
        <label className="block">
          <span className="sr-only">Your email</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="Your email"
            disabled={state === "sending"}
            className={field}
          />
        </label>
      </div>

      <label className="block">
        <span className="sr-only">Your message</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          placeholder="What your business does, what you need the site to do, a rough deadline…"
          disabled={state === "sending"}
          className={`${field} resize-y`}
        />
      </label>

      {/* Honeypot — hidden from people, catnip for bots. */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={state === "sending"}
          className="group inline-flex items-center gap-2.5 rounded-full bg-flare px-6 py-3 text-[0.92rem] font-medium text-ink transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === "sending" ? "Sending…" : "Send message"}
          <svg
            viewBox="0 0 12 12"
            className="h-3 w-3 transition-transform duration-400 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M1 6h9M6.5 2 10.5 6l-4 4" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          {state === "sent" && (
            <motion.p
              key="sent"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[0.9rem] text-flare"
            >
              Got it — you&apos;ll have a reply within 24 hours.
            </motion.p>
          )}
          {state === "error" && (
            <motion.p
              key="error"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              role="alert"
              className="text-[0.9rem] text-bone/80"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </form>
  );
}
