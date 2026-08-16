# SharpDev

Agency site for SharpDev — dark, cinematic, scroll-driven.

## Run it

```bash
npm run dev
```

Then open http://localhost:3000

Other commands:

```bash
npm run build
```

```bash
npm run lint
```

## Where to change things

| What | File |
| --- | --- |
| Email, socials, nav links, logo path | `src/lib/site.ts` |
| Colours, fonts, grain, animations | `src/app/globals.css` |
| Section order | `src/app/page.tsx` |
| Services copy | `src/components/Services.tsx` |
| Process / Figma-preview steps | `src/components/Process.tsx` |
| Work cards | `src/components/Work.tsx` |
| Tools + stats | `src/components/Stack.tsx` |
| Promises | `src/components/Trust.tsx` |
| FAQ | `src/components/Faq.tsx` |
| Contact block | `src/components/Contact.tsx` |
| Footer | `src/components/Footer.tsx` |

## The logo

Already installed. The assets below were generated from `logo-source.png` in
the project root.

To regenerate them (new export, different crop, different sizes) — replace
`logo-source.png` and run:

```bash
npm run logo
```

The script trims the margins, removes a white background if there is one, and
writes:

| File | Size | Used for |
| --- | --- | --- |
| `public/logo.png` | 512px | Nav and footer mark |
| `src/app/icon.png` | 512px | Browser tab favicon |
| `src/app/apple-icon.png` | 180px | iOS home-screen icon |

Restart the dev server afterwards.

To use a file somewhere else:

```bash
node scripts/prepare-logo.mjs "C:/Users/fatim/Downloads/sharpdev-logo.png"
```

**On the background removal:** if an export has a white background it would
render as a white box on the dark site. The script clears it with an edge
flood-fill rather than a global "delete all white" pass, so the silver `</>`
and any bright highlights *inside* the mark survive. The current
`logo-source.png` was already transparent, so that step was a no-op — the
script reported `0.0%` cleared, which is the correct result for a transparent
source, not a failure.

## Replacing the concept cards with real work

`src/components/Work.tsx` holds a `CARDS` array. Each card carries a `Concept`
badge so nothing is presented as a client project it isn't. When you have real
work, swap the copy and remove the badge — it's the `<span>` reading `Concept`
inside `StickyCard`.

## Colour palette

| Token | Value | Use |
| --- | --- | --- |
| `ink` | `#06070a` | Page background |
| `ink-2` | `#0b0d12` | Raised panels, footer |
| `surface` | `#12151c` | Cards inside panels |
| `line` | `#1f242e` | Borders, hairlines |
| `bone` | `#edf1f3` | Body text |
| `mute` | `#8a93a0` | Secondary text |
| `flare` | `#2bc8de` | Accent (from the logo) |
| `flare-soft` | `#7fd9e8` | Accent, lighter |

## Deploying

Push to a Git repo and import it at [vercel.com/new](https://vercel.com/new).
Zero configuration needed. Add `sharpdev.dev` under the project's Domains tab.

## Notes

- Smooth scroll is Lenis; it disables itself under `prefers-reduced-motion`.
- The custom cursor only renders on fine-pointer devices.
- All animation is Motion (`motion/react`).
- No images or external assets — every visual is CSS/SVG, so the page stays fast.
