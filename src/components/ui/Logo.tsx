import { site } from "@/lib/site";

/**
 * The SharpDev mark.
 *
 * The file is a raster export, generated at 512px by `npm run logo` and never
 * displayed larger than ~40px, so it stays sharp on retina without a srcset.
 *
 * TODO: replace with an SVG master when one exists. A vector would drop the
 * weight, remove the resampling, and let the favicons be generated crisply at
 * any size instead of from a bitmap.
 *
 * To swap the logo: save the new export to logo-source.png in the project root
 * and run `npm run logo` — it rewrites the mark, both favicons, the Apple
 * touch icon and the OG card.
 */
export function LogoMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={site.logoSrc}
      alt=""
      aria-hidden
      className={`${className} select-none object-contain`}
    />
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`text-[15px] font-semibold tracking-[-0.02em] ${className}`}>
      Sharp<span className="chrome">Dev</span>
    </span>
  );
}
