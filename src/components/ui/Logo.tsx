import { site } from "@/lib/site";

/**
 * The SharpDev mark.
 *
 * To use your own exported logo instead of the bundled vector:
 *   1. save it (transparent background, PNG or SVG) to  public/logo.png
 *   2. change `logoSrc` in src/lib/site.ts to "/logo.png"
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
