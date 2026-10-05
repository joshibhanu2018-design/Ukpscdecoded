/**
 * Builds every logo/icon file from the round UKPSC Decoded badge
 * (scripts/assets/logo-source.webp: the badge on a black background).
 *
 *   npx.cmd --yes tsx scripts/make-app-icons.mts
 *
 * - public/logo-badge.png: the badge alone, transparent outside the circle
 *   (navbar, PDF watermark, Bunny video watermark).
 * - public/icons/icon-*.png: "any" icons. 16/32 transparent (browser tab);
 *   180/192/512 on the badge's navy so iOS/Android don't add a white box.
 * - public/icons/maskable-*.png: Android adaptive icons; the badge sits inside
 *   the central safe zone because launchers crop to a circle or squircle.
 * - docs/play-store/app-icon-512.png: Play Store listing icon.
 */
import path from "node:path";
import sharp from "sharp";

const SRC = path.join(process.cwd(), "scripts", "assets", "logo-source.webp");
const ICONS = path.join(process.cwd(), "public", "icons");
const NAVY = { r: 0, g: 26, b: 58, alpha: 1 }; // the badge's own background
// The white ring's bounding box in the source image (found by scanning it).
const RING = { left: 267, top: 2, width: 1465, height: 1485 };

const square = await sharp(SRC).extract(RING).resize(1024, 1024, { fit: "fill" }).png().toBuffer();
const mask = Buffer.from('<svg width="1024" height="1024"><circle cx="512" cy="512" r="510" fill="#fff"/></svg>');
const badge = await sharp(square).composite([{ input: mask, blend: "dest-in" }]).png().toBuffer();

async function onNavy(size: number, share: number): Promise<Buffer> {
  const inner = Math.round(size * share);
  const art = await sharp(badge).resize(inner, inner).toBuffer();
  return sharp({ create: { width: size, height: size, channels: 4, background: NAVY } })
    .composite([{ input: art, gravity: "centre" }])
    .png()
    .toBuffer();
}

await sharp(badge).resize(512, 512).png().toFile(path.join(process.cwd(), "public", "logo-badge.png"));
for (const s of [16, 32]) await sharp(badge).resize(s, s).png().toFile(path.join(ICONS, `icon-${s}.png`));
for (const s of [180, 192, 512]) await sharp(await onNavy(s, 0.96)).toFile(path.join(ICONS, `icon-${s}.png`));
for (const s of [192, 512]) await sharp(await onNavy(s, 0.8)).toFile(path.join(ICONS, `maskable-${s}.png`));
await sharp(await onNavy(512, 0.96)).toFile(path.join(process.cwd(), "docs", "play-store", "app-icon-512.png"));
console.log("wrote public/logo-badge.png, public/icons/*, docs/play-store/app-icon-512.png");
