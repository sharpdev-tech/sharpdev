"use client";

import { useState } from "react";

type State = "idle" | "sending" | "sent" | "error";

const field =
  "w-full rounded-xl border border-line bg-ink/60 px-4 py-3.5 text-[1rem] text-bone outline-none transition-colors duration-200 placeholder:text-mute/50 focus:border-flare/70 focus:bg-ink/90 disabled:opacity-50";

export default function SkicaForm() {
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
        body: JSON.stringify({ ...data, source: "skica" }),
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
          ? "Emaili nuk duket i saktë. Kontrollojeni edhe një herë."
          : "Diçka shkoi keq. Provoni sërish për pak.",
      );
      setState("error");
    }
  };

  if (state === "sent") {
    return (
      <div
        role="status"
        className="rounded-2xl border border-flare/30 bg-flare/[0.07] p-6 sm:p-7"
      >
        <p className="text-[1.15rem] font-medium tracking-[-0.02em] text-bone">
          E morëm.
        </p>
        <p className="mt-2 text-[0.98rem] leading-[1.6] text-mute">
          Ju kthehemi me skicën brenda 48 orësh, në kontaktin që latë. Nuk keni
          nevojë të bëni asgjë tjetër.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-3">
      <label className="block">
        <span className="sr-only">Emri juaj</span>
        <input
          name="name"
          required
          maxLength={100}
          autoComplete="name"
          placeholder="Emri juaj"
          disabled={state === "sending"}
          className={field}
        />
      </label>

      <label className="block">
        <span className="sr-only">Emri i biznesit</span>
        <input
          name="business"
          maxLength={150}
          autoComplete="organization"
          placeholder="Emri i biznesit"
          disabled={state === "sending"}
          className={field}
        />
      </label>

      <label className="block">
        <span className="sr-only">Faqja juaj aktuale</span>
        <input
          name="website"
          maxLength={300}
          autoComplete="url"
          placeholder="Faqja aktuale ose Instagram"
          disabled={state === "sending"}
          className={field}
        />
      </label>

      <label className="block">
        <span className="sr-only">WhatsApp ose email</span>
        <input
          name="contact"
          required
          maxLength={200}
          placeholder="WhatsApp ose email"
          disabled={state === "sending"}
          className={field}
        />
      </label>

      {/* Honeypot — i fshehur për njerëzit, joshës për botët. */}
      <input
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <button
        type="submit"
        disabled={state === "sending"}
        className="mt-2 flex w-full items-center justify-center gap-2.5 rounded-full bg-flare px-7 py-4 text-[1rem] font-medium text-ink transition-opacity duration-200 hover:opacity-90 disabled:opacity-60"
      >
        {state === "sending" ? "Duke dërguar…" : "Dua skicën"}
        <svg
          viewBox="0 0 12 12"
          className="h-3.5 w-3.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          aria-hidden="true"
        >
          <path d="M1 6h9M6.5 2 10.5 6l-4 4" />
        </svg>
      </button>

      {state === "error" && (
        <p
          role="alert"
          className="rounded-xl border border-line bg-ink/60 px-4 py-3 text-[0.92rem] text-bone/85"
        >
          {error}
        </p>
      )}

      <p className="pt-1 text-center text-[0.82rem] text-mute">
        Pa detyrim. Nuk kërkojmë të dhëna pagese.
      </p>
    </form>
  );
}
