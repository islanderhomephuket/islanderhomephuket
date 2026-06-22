// Compress full-res listing photos into web-optimized versions.
// Reads from public/_listings_ORIGINAL_BACKUP, writes to public/listings.
// Max width 1600px, JPEG quality 78. Originals are never modified.
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "public/_listings_ORIGINAL_BACKUP";
const OUT = "public/listings";
const MAX_W = 1600;
const QUALITY = 78;

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else files.push(full);
  }
  return files;
}

const all = await walk(SRC);
let done = 0,
  failed = 0,
  inBytes = 0,
  outBytes = 0;

for (const src of all) {
  const rel = path.relative(SRC, src);
  const out = path.join(OUT, rel);
  await fs.mkdir(path.dirname(out), { recursive: true });
  try {
    const stat = await fs.stat(src);
    inBytes += stat.size;
    await sharp(src)
      .rotate()
      .resize({ width: MAX_W, withoutEnlargement: true })
      .jpeg({ quality: QUALITY, mozjpeg: true })
      .toFile(out);
    outBytes += (await fs.stat(out)).size;
    done++;
    if (done % 100 === 0) console.log(`  ${done}/${all.length} ...`);
  } catch (err) {
    failed++;
    console.error(`  FAIL ${rel}: ${err.message}`);
  }
}

console.log(
  `\nDone. ${done} compressed, ${failed} failed.\n` +
    `Input:  ${(inBytes / 1e6).toFixed(0)} MB\n` +
    `Output: ${(outBytes / 1e6).toFixed(0)} MB`,
);
