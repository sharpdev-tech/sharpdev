"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import type { Lang } from "@/lib/lang";
import { useCopy } from "./LangProvider";

type State = "idle" | "sending" | "sent" | "error";

const COPY: Record<Lang, Record<string, string>> = {
  en: {
    name: "Your name",
    namePlaceholder: "Full name",
    email: "Your email",
    emailPlaceholder: "name@company.com",
    message: "What you need",
    messagePlaceholder:
      "What your business does, what you need the site to do, a rough deadline…",
    note: "Replies within 24 hours — with a fixed price and a date.",
    send: "Send message",
    sending: "Sending…",
    sent: "Got it — your message is with us. You will have a reply within 24 hours.",
    badEmail: "That email address does not look right.",
    failed: "Something went wrong. Please email us directly instead.",
  },
  sq: {
    name: "Emri juaj",
    namePlaceholder: "Emri i plotë",
    email: "Emaili juaj",
    emailPlaceholder: "emri@kompania.com",
    message: "Çfarë ju duhet",
    messagePlaceholder:
      "Çfarë bën biznesi juaj, çfarë doni të bëjë faqja, një afat të përafërt…",
    note: "Përgjigje brenda 24 orësh — me çmim fiks dhe një datë.",
    send: "Dërgo mesazhin",
    sending: "Duke dërguar…",
    sent: "E morëm — mesazhi juaj është tek ne. Merrni përgjigje brenda 24 orësh.",
    badEmail: "Kjo adresë emaili nuk duket e saktë.",
    failed: "Diçka shkoi keq. Ju lutemi na shkruani drejtpërdrejt.",
  },
};

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
  const t = useCopy(COPY);
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
          ? t.badEmail
          : t.failed,
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
          <Field label={t.name}>
            <input
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              placeholder={t.namePlaceholder}
              disabled={state === "sending"}
              className={field}
            />
          </Field>

          <Field label={t.email}>
            <input
              name="email"
              type="email"
              required
              maxLength={200}
              autoComplete="email"
              placeholder={t.emailPlaceholder}
              disabled={state === "sending"}
              className={field}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field
            label={t.message}
            hint={count > 0 ? `${count}/4000` : undefined}
          >
            <textarea
              name="message"
              required
              rows={5}
              maxLength={4000}
              onChange={(e) => setCount(e.target.value.length)}
              placeholder={t.messagePlaceholder}
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
            {t.note}
          </p>

          <button
            type="submit"
            disabled={state === "sending"}
            className="group order-1 inline-flex items-center justify-center gap-2.5 rounded-full bg-flare px-7 py-3.5 text-[0.92rem] font-medium text-ink transition-all duration-300 hover:shadow-[0_0_28px_-4px_rgba(43,200,222,0.55)] disabled:opacity-50 sm:order-2"
          >
            {state === "sending" ? t.sending : t.send}
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
                  ? t.sent
                  : error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
