/**
 * Turns a white-background logo export into the transparent assets the site needs.
 *
 *   node scripts/prepare-logo.mjs [path-to-your-logo]
 *
 * Defaults to logo-source.png in the project root.
 *
 * The background is removed with an edge flood-fill, not a global "delete all
 * white" pass — so the white/silver highlights *inside* the mark survive.
 *
 * Writes:
 *   public/logo.png      512px  — the mark used in the nav and footer
 *   src/app/icon.png     512px  — browser tab favicon
 *   src/app/apple-icon.png 180px — iOS home-screen icon
 */

import sharp from "sharp";
import { existsSync, readFileSync, writeFileSync, rmSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const input = resolve(root, process.argv[2] ?? "logo-source.png");

/** How far a pixel may stray from pure white and still count as background. */
const TOLERANCE = 30;

if (!existsSync(input)) {
  console.error(`\n  Could not find:  ${input}\n`);
  console.error("  Save your logo there first, or pass the path:");
  console.error("    node scripts/prepare-logo.mjs C:/path/to/logo.png\n");
  process.exit(1);
}

const src = sharp(input).ensureAlpha();
const { width, height } = await src.metadata();
const data = await src.raw().toBuffer(); // RGBA

const isBackground = (i) => {
  const r = data[i], g = data[i + 1], b = data[i + 2];
  return (
    r >= 255 - TOLERANCE &&
    g >= 255 - TOLERANCE &&
    b >= 255 - TOLERANCE &&
    Math.max(r, g, b) - Math.min(r, g, b) <= 12 // near-neutral, not tinted
  );
};

// Flood fill inward from every edge pixel.
const seen = new Uint8Array(width * height);
const stack = [];

for (let x = 0; x < width; x++) {
  stack.push([x, 0], [x, height - 1]);
}
for (let y = 0; y < height; y++) {
  stack.push([0, y], [width - 1, y]);
}

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

const cleaned = sharp(data, { raw: { width, height, channels: 4 } })
  .png()
  .trim(); // crop the now-empty margins

const base = await cleaned.toBuffer();

const square = (size) =>
  sharp(base)
    .resize(size, size, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png({ compressionLevel: 9 });

await square(512).toFile(resolve(root, "public/logo.png"));
await square(512).toFile(resolve(root, "src/app/icon.png"));
await square(180).toFile(resolve(root, "src/app/apple-icon.png"));

// The PNG now supersedes the bundled vector placeholder.
const siteFile = resolve(root, "src/lib/site.ts");
const site = readFileSync(siteFile, "utf8");
if (site.includes('logoSrc: "/logo.svg"')) {
  writeFileSync(siteFile, site.replace('logoSrc: "/logo.svg"', 'logoSrc: "/logo.png"'));
  console.log("  updated  src/lib/site.ts       logoSrc -> /logo.png");
}

const svgIcon = resolve(root, "src/app/icon.svg");
if (existsSync(svgIcon)) {
  rmSync(svgIcon);
  console.log("  removed  src/app/icon.svg      (replaced by icon.png)");
}

const pct = ((cleared / (width * height)) * 100).toFixed(1);
console.log(`
  Source     ${width}x${height}
  Background ${pct}% of pixels made transparent

  wrote    public/logo.png        512px
  wrote    src/app/icon.png       512px  (favicon)
  wrote    src/app/apple-icon.png 180px

  Restart the dev server to see it.
`);

if (cleared === 0) {
  console.warn(
    "  Nothing was cleared — the background may not be white.\n" +
      "  If your export already has a transparent background, that's fine:\n" +
      "  the resized copies were still written correctly.\n",
  );
}
