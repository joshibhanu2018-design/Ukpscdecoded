/**
 * Draws the app icons in public/icons from the site logo (the lucide
 * BookOpen glyph in saffron-400 on graphite-950, as in the navbar).
 *
 *   npx.cmd --yes tsx scripts/make-app-icons.mts
 *
 * - icon-*.png: "any" icons (favicons, apple-touch, manifest), glyph at ~62%.
 * - maskable-*.png: Android adaptive icons. Launchers crop to a circle or
 *   squircle, so the glyph stays inside the central safe zone (~46%).
 */
import path from "node:path";
import sharp from "sharp";

const OUT = path.join(process.cwd(), "public", "icons");
const BG = "#0f0f0e"; // graphite-950
const FG = "#ffb620"; // saffron-400
const GLYPH = [
  "M12 5v16",
  "M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z",
];

function svg(size: number, glyphShare: number): string {
  const g = size * glyphShare;
  const offset = (size - g) / 2;
  const scale = g / 24;
  const paths = GLYPH.map((d) => `<path d="${d}"/>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
<rect width="${size}" height="${size}" fill="${BG}"/>
<g transform="translate(${offset} ${offset}) scale(${scale})" fill="none" stroke="${FG}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${paths}</g>
</svg>`;
}

const jobs: [string, number, number][] = [
  ["icon-16.png", 16, 0.8],
  ["icon-32.png", 32, 0.74],
  ["icon-180.png", 180, 0.62],
  ["icon-192.png", 192, 0.62],
  ["icon-512.png", 512, 0.62],
  ["maskable-192.png", 192, 0.46],
  ["maskable-512.png", 512, 0.46],
];

for (const [name, size, share] of jobs) {
  await sharp(Buffer.from(svg(size, share))).png().toFile(path.join(OUT, name));
  console.log(`wrote public/icons/${name}`);
}
