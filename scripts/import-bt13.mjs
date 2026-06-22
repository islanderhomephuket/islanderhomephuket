// One-off: order, compress, and number the BT13 (Walai Layan Sea View) photos.
import { promises as fs } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "C:/Users/Thana/Downloads/PHOTO-20260622T133041Z-3-001/PHOTO";
const OUT = "public/listings/bt-walai-layan-bt13";

const files = (await fs.readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));
// Natural numeric sort by the number in "WalaiLayanPhuket (N).jpg".
files.sort((a, b) => {
  const na = parseInt((a.match(/(\d+)/) || [0, 0])[1], 10);
  const nb = parseInt((b.match(/(\d+)/) || [0, 0])[1], 10);
  return na - nb || a.localeCompare(b);
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
  if (n % 50 === 0) console.log(`  ${n}/${files.length} ...`);
}

console.log(`${n} photos imported`);
console.log(`size: ${(inB / 1e6).toFixed(0)}MB -> ${(outB / 1e6).toFixed(0)}MB`);
console.log(`PHOTO_COUNT=${n}`);
