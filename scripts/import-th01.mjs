// One-off: order, compress, and number the TH01 (Sasinee Villa) photos.
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "C:/Users/Thana/Downloads/Sasinee Villa-20260622T132429Z-3-001/Sasinee Villa";
const OUT = "public/listings/th-thalang-pool-villa-th01";

// Lower number = shown earlier. The first image becomes the card cover.
// IMPORTANT: more specific prefixes must come BEFORE shorter ones that they
// start with (e.g. "poolside" before "pool"), since the first match wins.
const ORDER = [
  ["drone", 0],
  ["poolside bed", 110],
  ["poolside twin", 115],
  ["pool", 10],
  ["outdoor shower", 19],
  ["outdoor", 18],
  ["night", 25],
  ["sala", 35],
  ["living", 45],
  ["dining", 55],
  ["kitchen", 65],
  ["master bed view", 73],
  ["master bathroom", 85],
  ["master closet", 90],
  ["master bed", 75],
  ["main twin bed", 78],
  ["bedroom4", 100],
  ["bathroom", 125],
  ["carpark", 200],
];

function rank(name) {
  const lower = name.toLowerCase();
  for (const [kw, base] of ORDER) {
    if (lower.startsWith(kw)) {
      const m = lower.match(/(\d+)/);
      return base + (m ? parseInt(m[1], 10) : 0) / 100;
    }
  }
  return 999;
}

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
files.sort((a, b) => rank(a) - rank(b) || a.localeCompare(b));

await fs.rm(OUT, { recursive: true, force: true });
await fs.mkdir(OUT, { recursive: true });

let n = 0,
  inB = 0,
  outB = 0;
for (const f of files) {
  n++;
  const src = path.join(SRC, f);
  const out = path.join(OUT, `${n}.jpg`);
  inB += (await fs.stat(src)).size;
  await sharp(src)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(out);
  outB += (await fs.stat(out)).size;
}

console.log(`${n} photos imported`);
console.log(`order: ${files.map((f, i) => `${i + 1}=${f}`).slice(0, 6).join(", ")} ...`);
console.log(`size: ${(inB / 1e6).toFixed(0)}MB -> ${(outB / 1e6).toFixed(0)}MB`);
console.log(`PHOTO_COUNT=${n}`);
