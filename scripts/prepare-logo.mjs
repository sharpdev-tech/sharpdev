/**
 * Turns a logo export into every asset the site needs.
 *
 *   node scripts/prepare-logo.mjs [path-to-your-logo]
 *
 * Defaults to logo-source.png in the project root.
 *
 * NOTE: the source is a raster file, so every placement below is generated at
 * 2x the size it is displayed at. Replace this pipeline with an SVG master when
 * one exists — a vector mark would remove the resampling entirely and let the
 * favicons be generated crisply at any size.
 *
 * The background is removed with an edge flood-fill sampled from the corners,
 * so it works for a mark on white *or* on near-black. Only pixels connected to
 * the edge are cleared, so background-coloured details inside the mark survive.
 *
 * Writes:
 *   public/logo.png             512px  — nav + footer mark (displayed at ~36px)
 *   public/logo-og.png         1200x630 — OG / Twitter card
 *   src/app/icon.png            512px  — favicon (large)
 *   src/app/icon1.png            32px  — favicon
 *   src/app/icon2.png            16px  — favicon
 *   src/app/apple-icon.png      180px  — iOS home screen
 */

import sharp from "sharp";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, process.argv[2] ?? "logo-source.png");

/** How far a pixel may stray from the sampled background and still count. */
const TOLERANCE = 34;
/** Clear space kept inside square icons, as a share of the box. */
const PADDING = 0.1;
/** Brand background, used behind the OG card. */
const INK = { r: 6, g: 7, b: 10 };

if (!existsSync(input)) {
  console.error(`\n  Could not find:  ${input}\n`);
  console.error("  Save your logo there first, or pass the path:");
  console.error("    node scripts/prepare-logo.mjs C:/path/to/logo.png\n");
  process.exit(1);
}

const src = sharp(input).ensureAlpha();
const { width, height } = await src.metadata();
const data = await src.raw().toBuffer(); // RGBA

// Sample the four corners — whatever they agree on is the background.
const at = (x, y) => {
  const i = (y * width + x) * 4;
  return [data[i], data[i + 1], data[i + 2]];
};
const corners = [
  at(0, 0),
  at(width - 1, 0),
  at(0, height - 1),
  at(width - 1, height - 1),
];
const bg = [0, 1, 2].map((c) =>
  Math.round(corners.reduce((sum, p) => sum + p[c], 0) / corners.length),
);

const isBackground = (i) =>
  Math.abs(data[i] - bg[0]) <= TOLERANCE &&
  Math.abs(data[i + 1] - bg[1]) <= TOLERANCE &&
  Math.abs(data[i + 2] - bg[2]) <= TOLERANCE;

// Flood fill inward from every edge pixel.
const seen = new Uint8Array(width * height);
const stack = [];

for (let x = 0; x < width; x++) stack.push([x, 0], [x, height - 1]);
for (let y = 0; y < height; y++) stack.push([0, y], [width - 1, y]);

let cleared = 0;
while (stack.length) {
  const [x, y] = stack.pop();
  if (x < 0 || y < 0 || x >= width || y >= height) continue;

  const p = y * width + x;
  if (seen[p]) continue;
  seen[p] = 1;

  const i = p * 4;
  if (!isBackground(i)) continue;

  data[i + 3] = 0; // transparent
  cleared++;

  stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
}

const base = await sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .trim() // crop the now-empty margins so padding is measured from the mark
  .toBuffer();

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

/** Square icon with the mark inset by PADDING on every side. */
const square = async (size, file) => {
  const inner = Math.round(size * (1 - PADDING * 2));
  const mark = await sharp(base)
    .resize(inner, inner, { fit: "contain", background: transparent })
    .toBuffer();

  return sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: transparent,
    },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(resolve(root, file));
};

await square(512, "public/logo.png");
await square(512, "src/app/icon.png");
await square(32, "src/app/icon1.png");
await square(16, "src/app/icon2.png");
await square(180, "src/app/apple-icon.png");

// OG / Twitter card: the mark centred on the brand background.
const ogMark = await sharp(base)
  .resize(420, 420, { fit: "contain", background: transparent })
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 4, background: { ...INK, alpha: 1 } },
})
  .composite([{ input: ogMark, gravity: "centre" }])
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, "public/logo-og.png"));

const pct = ((cleared / (width * height)) * 100).toFixed(1);
console.log(`
  Source      ${width}x${height}
  Background  rgb(${bg.join(", ")}) — ${pct}% of pixels made transparent
  Clear space ${PADDING * 100}% inside each square icon

  wrote  public/logo.png         512px
  wrote  public/logo-og.png      1200x630  (OG / Twitter)
  wrote  src/app/icon.png        512px
  wrote  src/app/icon1.png        32px
  wrote  src/app/icon2.png        16px
  wrote  src/app/apple-icon.png  180px

  Restart the dev server to see it.
`);

if (cleared === 0) {
  console.warn(
    "  Nothing was cleared — the source may already have a transparent\n" +
      "  background. That's fine: the resized copies were still written.\n",
  );
}
