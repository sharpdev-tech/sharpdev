/**
 * Turns the logo exports into every asset the site needs.
 *
 *   node scripts/prepare-logo.mjs [logo-source] [favicon-source]
 *
 * Defaults to logo-source.png and favicon-source.png in the project root.
 *
 * Two sources, because the mark sits on two different grounds:
 *   logo-source.png     for the site's near-black background
 *   favicon-source.png  for the browser tab
 *
 * Anything in the logo source too dark to read on #06070a is lifted to bone
 * before resizing — the navy mark measures 1.37:1 against that background,
 * well under the 3:1 a graphic needs, so it would all but disappear in the nav.
 * The accent colour is left alone.
 *
 * A favicon source that already carries its own tile (mostly opaque) is used
 * as-is. One that is mostly transparent gets an opaque cream tile: a dark mark
 * on transparency vanishes against dark browser chrome, and iOS fills
 * transparency with black on the home screen.
 *
 * NOTE: the sources are raster files, so every placement below is generated at
 * 2x the size it is displayed at. Replace this pipeline with an SVG master when
 * one exists — a vector mark would remove the resampling entirely and let the
 * favicons be generated crisply at any size.
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
const logoInput = resolve(root, process.argv[2] ?? "logo-source.png");
const iconInput = resolve(root, process.argv[3] ?? "favicon-source.png");

/** How far a pixel may stray from the sampled background and still count. */
const TOLERANCE = 34;
/** Clear space kept inside square icons, as a share of the box. */
const PADDING = 0.1;
/** Brand background, behind the OG card. */
const INK = { r: 6, g: 7, b: 10 };
/** Light ground for the mark, and the fallback favicon tile. */
const BONE = { r: 237, g: 241, b: 243 };
/** Below this share of transparent pixels a source counts as flat-background. */
const ALPHA_THRESHOLD = 0.02;
/** Above this share of opaque pixels a favicon source has its own tile. */
const OWN_TILE_THRESHOLD = 0.5;
/** Relative luminance under which a pixel is unreadable on INK. */
const TOO_DARK = 0.25;

for (const [label, path] of [
  ["logo", logoInput],
  ["favicon", iconInput],
]) {
  if (!existsSync(path)) {
    console.error(`\n  Could not find the ${label} source:  ${path}\n`);
    console.error("  Save it there first, or pass both paths:");
    console.error("    node scripts/prepare-logo.mjs logo.png favicon.png\n");
    process.exit(1);
  }
}

const luma = (r, g, b) => (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;

/** Returns a trimmed, background-free buffer plus what was done to it. */
async function flatten(input) {
  const src = sharp(input).ensureAlpha();
  const { width, height } = await src.metadata();
  const data = await src.raw().toBuffer(); // RGBA

  let clear = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] < 5) clear++;
  const total = width * height;
  const transparentShare = clear / total;

  // Already cut out? Leave the pixels alone — running the flood fill over a
  // dark mark on transparency would eat the mark itself.
  if (transparentShare > ALPHA_THRESHOLD) {
    const out = await sharp(data, { raw: { width, height, channels: 4 } })
      .png()
      .trim()
      .toBuffer();
    return { buffer: out, width, height, transparentShare, note: "already transparent" };
  }

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

  const seen = new Uint8Array(total);
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

    data[i + 3] = 0;
    cleared++;

    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const out = await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .trim()
    .toBuffer();

  return {
    buffer: out,
    width,
    height,
    transparentShare: cleared / total,
    note: `background rgb(${bg.join(", ")}) removed — ${((cleared / total) * 100).toFixed(1)}% of pixels`,
  };
}

/** Recolours anything too dark to read on INK, keeping the accent untouched. */
async function liftForDarkGround(buffer) {
  const img = sharp(buffer).ensureAlpha();
  const { width, height } = await img.metadata();
  const data = await img.raw().toBuffer();

  let lifted = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) continue;
    if (luma(data[i], data[i + 1], data[i + 2]) < TOO_DARK) {
      data[i] = BONE.r;
      data[i + 1] = BONE.g;
      data[i + 2] = BONE.b;
      lifted++;
    }
  }

  const out = await sharp(data, { raw: { width, height, channels: 4 } })
    .png()
    .toBuffer();
  return { buffer: out, lifted };
}

const transparent = { r: 0, g: 0, b: 0, alpha: 0 };

/** Square icon with the mark inset by PADDING, on an optional solid ground. */
async function square(base, size, file, background = transparent) {
  const inner = Math.round(size * (1 - PADDING * 2));
  const mark = await sharp(base)
    .resize(inner, inner, { fit: "contain", background: transparent })
    .toBuffer();

  return sharp({
    create: { width: size, height: size, channels: 4, background },
  })
    .composite([{ input: mark, gravity: "centre" }])
    .png({ compressionLevel: 9 })
    .toFile(resolve(root, file));
}

const logo = await flatten(logoInput);
const icon = await flatten(iconInput);

const { buffer: siteMark, lifted } = await liftForDarkGround(logo.buffer);

// The mark, transparent, lifted so it reads on the dark site.
await square(siteMark, 512, "public/logo.png");

// The favicon keeps its own tile if it has one, otherwise gets a bone tile.
const hasOwnTile = 1 - icon.transparentShare > OWN_TILE_THRESHOLD;
const iconGround = hasOwnTile ? transparent : { ...BONE, alpha: 1 };

await square(icon.buffer, 512, "src/app/icon.png", iconGround);
await square(icon.buffer, 32, "src/app/icon1.png", iconGround);
await square(icon.buffer, 16, "src/app/icon2.png", iconGround);
await square(icon.buffer, 180, "src/app/apple-icon.png", iconGround);

// OG / Twitter card: the mark centred on the brand background.
const ogMark = await sharp(siteMark)
  .resize(420, 420, { fit: "contain", background: transparent })
  .toBuffer();

await sharp({
  create: { width: 1200, height: 630, channels: 4, background: { ...INK, alpha: 1 } },
})
  .composite([{ input: ogMark, gravity: "centre" }])
  .png({ compressionLevel: 9 })
  .toFile(resolve(root, "public/logo-og.png"));

console.log(`
  Logo     ${logo.width}x${logo.height}  (${logo.note})
           ${lifted.toLocaleString()} px lifted to bone for the dark background
  Favicon  ${icon.width}x${icon.height}  (${icon.note})
           ${hasOwnTile ? "kept its own tile" : "given a bone tile"}
  Clear space ${PADDING * 100}% inside each square icon

  wrote  public/logo.png         512px
  wrote  public/logo-og.png      1200x630
  wrote  src/app/icon.png        512px
  wrote  src/app/icon1.png        32px
  wrote  src/app/icon2.png        16px
  wrote  src/app/apple-icon.png  180px

  Restart the dev server to see it.
`);
