import type { Metadata } from "next";
import SkicaForm from "./SkicaForm";
import { LogoMark } from "@/components/ui/Logo";

export const metadata: Metadata = {
  title: "Skicë falas brenda 48 orësh",
  description:
    "Ridizajnojmë kryefaqen e biznesit tuaj në Figma dhe ua dërgojmë brenda 48 orësh. Falas, pa detyrim.",
  alternates: { canonical: "/skica" },
  openGraph: {
    title: "Skicë falas brenda 48 orësh",
    description:
      "Ridizajnojmë kryefaqen e biznesit tuaj në Figma dhe ua dërgojmë brenda 48 orësh. Falas, pa detyrim.",
    locale: "sq_AL",
  },
};

/**
 * Proof shown under the form. Add a screenshot by dropping the file into
 * public/work/ and setting `image` — it renders lazily when present, and the
 * card stays text-only until then rather than shipping a broken image.
 */
const PROOF: { name: string; line: string; image?: string }[] = [
  {
    name: "Prestige",
    line: "Skicë e kryefaqes, dorëzuar brenda 48 orësh.",
  },
  {
    name: "Chopsticks",
    line: "Menu dhe kryefaqe të rindërtuara për telefon.",
  },
  {
    name: "Villa Serena",
    line: "Faqe pritëse me kërkesë rezervimi në një ekran.",
  },
];

export default function SkicaPage() {
  return (
    <>
      {/* /skica is Albanian whatever the site toggle says. Runs during parse,
          before first paint, so assistive tech never sees the wrong language. */}
      <script
        dangerouslySetInnerHTML={{ __html: `document.documentElement.lang="sq"` }}
      />

      <main className="relative mx-auto w-full max-w-[560px] px-5 pb-16 pt-10 sm:px-6 sm:pt-14">
        {/* wordmark only — no navigation, nothing to click away to */}
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-8 w-8" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">
            Sharp<span className="chrome">Dev</span>
          </span>
        </div>

        <h1 className="display mt-10 text-[clamp(2.1rem,9vw,3.1rem)] leading-[1.02]">
          Skicë falas e faqes suaj,{" "}
          <span className="serif-accent text-flare">brenda 48 orësh</span>.
        </h1>

        <div className="mt-7 space-y-3 text-[1.02rem] leading-[1.6] text-mute">
          <p>
            Ridizajnojmë <span className="text-bone">një ekran</span> — kryefaqen
            e biznesit tuaj — në Figma dhe ua dërgojmë si imazh.
          </p>
          <p>
            Është skicë, jo faqe e plotë. E shihni si do të dukej biznesi juaj
            para se të vendosni asgjë.
          </p>
          <p>
            <span className="text-bone">Falas dhe pa detyrim.</span> Nuk kërkojmë
            të dhëna pagese dhe nuk ju marrim në telefon pa e kërkuar ju.
          </p>
        </div>

        <div className="mt-9 rounded-2xl border border-line bg-ink-2/70 p-5 sm:p-6">
          <SkicaForm />
        </div>

        {/* proof */}
        <section className="mt-12 border-t border-line pt-8">
          <h2 className="label">Punë të fundit</h2>
          <ul className="mt-5 space-y-4">
            {PROOF.map((p) => (
              <li key={p.name} className="flex items-start gap-4">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={72}
                    height={72}
                    className="h-16 w-16 shrink-0 rounded-lg border border-line object-cover"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-flare"
                  />
                )}
                <div>
                  <div className="text-[1rem] font-medium tracking-[-0.02em]">
                    {p.name}
                  </div>
                  <p className="mt-1 text-[0.9rem] leading-snug text-mute">
                    {p.line}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-10 text-[0.8rem] leading-relaxed text-mute/80">
          SharpDev — studio dizajni dhe zhvillimi faqesh.
        </p>
      </main>
    </>
  );
}
