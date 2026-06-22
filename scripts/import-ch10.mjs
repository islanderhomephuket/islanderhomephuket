// One-off: order, compress, and number the CH10 (MGC Chalong Bay) photos.
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "C:/Users/Thana/Downloads/MGC Photo-20260622T134832Z-3-001/MGC Photo";
const OUT = "public/listings/ch-mgc-chalong-bay-ch10";

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
// Bare-number files (001,002,003) first, then "MGC (n)" by number.
files.sort((a, b) => {
  const ga = /^mgc/i.test(a) ? 1 : 0;
  const gb = /^mgc/i.test(b) ? 1 : 0;
  const na = parseInt((a.match(/(\d+)/) || [0, 0])[1], 10);
  const nb = parseInt((b.match(/(\d+)/) || [0, 0])[1], 10);
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
