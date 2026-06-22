// One-off: order, compress, and number the TH01 (Super Villas Thalang) photos.
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC =
  "C:/Users/Thana/Downloads/Super Villas Thalang _ small size-20260622T133618Z-3-001/Super Villas Thalang _ small size";
const OUT = "public/listings/th-super-villas-thalang-th01";

// Natural numeric sort: bare-number files first (0,4,6,7,8,10), then "A (n)".
function key(name) {
  const lower = name.toLowerCase();
  const isA = lower.startsWith("a ");
  const m = name.match(/(\d+)/);
  const num = m ? parseInt(m[1], 10) : 0;
  return [isA ? 1 : 0, num];
}

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
files.sort((a, b) => {
  const [ga, na] = key(a);
  const [gb, nb] = key(b);
  return ga - gb || na - nb || a.localeCompare(b);
});

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
console.log(`size: ${(inB / 1e6).toFixed(0)}MB -> ${(outB / 1e6).toFixed(0)}MB`);
console.log(`PHOTO_COUNT=${n}`);
