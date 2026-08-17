"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3.5 text-[0.95rem] text-bone outline-none transition-all duration-300 placeholder:text-mute/50 hover:border-line/80 focus:border-flare/70 focus:bg-ink/90 focus:shadow-[0_0_0_3px_rgba(43,200,222,0.1)] disabled:opacity-50";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="label mb-2.5 flex items-baseline justify-between">
        <span>{label}</span>
        {hint && <span className="text-mute/60">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

export default function ContactForm() {
  const [state, setState] = useState<State>("idle");
  const [error, setError] = useState("");
  const [count, setCount] = useState(0);
  const formId = useId();

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
      setCount(0);
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
    <div className="relative mt-10">
      {/* soft edge light so the card lifts off the section background */}
      <div className="glow-flare pointer-events-none absolute -inset-x-6 -top-6 h-40 rounded-full opacity-[0.07] blur-3xl" />

      <form
        onSubmit={submit}
        id={formId}
        noValidate
        className="relative rounded-2xl border border-line bg-ink-2/70 p-6 backdrop-blur-sm sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Your name">
            <input
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Full name"
              disabled={state === "sending"}
              className={field}
            />
          </Field>

          <Field label="Your email">
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder="name@company.com"
              disabled={state === "sending"}
              className={field}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field
            label="What you need"
            hint={count > 0 ? `${count}/4000` : undefined}
          >
            <textarea
              name="message"
              required
              rows={5}
              maxLength={4000}
              onChange={(e) => setCount(e.target.value.length)}
              placeholder="What your business does, what you need the site to do, a rough deadline…"
              disabled={state === "sending"}
              className={`${field} resize-y leading-relaxed`}
            />
          </Field>
        </div>

        {/* Honeypot — hidden from people, catnip for bots. */}
        <input
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div className="mt-7 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="order-2 text-[0.82rem] text-mute sm:order-1">
            Replies within 24 hours — with a fixed price and a date.
          </p>

          <button
            type="submit"
            disabled={state === "sending"}
            className="group order-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-flare px-7 py-3.5 text-[0.92rem] font-medium text-ink transition-all duration-300 hover:shadow-[0_0_28px_-4px_rgba(43,200,222,0.55)] disabled:opacity-50 sm:order-2"
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
        </div>

        <AnimatePresence>
          {(state === "sent" || state === "error") && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden"
            >
              <div
                role={state === "error" ? "alert" : "status"}
                className={`mt-5 flex items-start gap-3 rounded-xl border px-4 py-3.5 text-[0.9rem] ${
                  state === "sent"
                    ? "border-flare/30 bg-flare/[0.07] text-bone"
                    : "border-line bg-ink/60 text-bone/85"
                }`}
              >
                <span
                  className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${
                    state === "sent" ? "bg-flare" : "bg-mute"
                  }`}
                />
                {state === "sent"
                  ? "Got it — your message is with us. You'll have a reply within 24 hours."
                  : error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
