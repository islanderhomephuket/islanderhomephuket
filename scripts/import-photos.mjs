/**
 * Copy real property photos from the user's photo library (E:\download1\<folder>)
 * into public/listings/<neutral-slug>/ .
 *
 * PRIVACY: target slugs are neutral (village + price only) — landlord names from
 * the source folder names are never copied into the project or any public URL.
 *
 * Add entries to PHOTO_FOLDERS as more photo sets arrive.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const SRC_BASE = process.env.PHOTO_SRC || "E:\\download1";
const OUT_BASE = path.join(root, "public", "listings");

// source folder name (exact)  →  neutral target slug (no owner names)
const PHOTO_FOLDERS = [
  ["Thalang 4045K Van Kotchanan owner", "th-smileville-40k"],
  ["the place thalang 16.9MB Natthamon Beebee owner", "th-the-place"],
  ["thalang 40K Fern Ratsiya owner", "th-gardenhouse-40k"],
  ["Thalang 14.5MB nid&Bond owner", "th-villa-145m"],
  ["supalai primo thalang 50K Suteera Tidboonkrong owner", "th-primo-50k"],
  ["thalang 65K 3bed4bath Boonchana Samermit owner", "th-poolvilla-65k"],
  ["Supalai bella thalang 40 50K ยุ line owner", "th-bella-40-50k"],
  ["Supalai bella thalang 68K owner WA 5bed 4 bath", "th-bella-68k"],
  ["Thalang 35K Beam Bst owner", "th-house-35k"],
  ["Anasiri thalang 55K ซี' อ้อ'อ owner", "th-anasiri-55k"],
];

const IMG_RE = /\.(jpe?g|png|webp)$/i;

fs.mkdirSync(OUT_BASE, { recursive: true });

let totalImgs = 0;
for (const [folder, slug] of PHOTO_FOLDERS) {
  const src = path.join(SRC_BASE, folder);
  if (!fs.existsSync(src)) {
    console.warn(`  ! missing source: ${folder}`);
    continue;
  }
  const dest = path.join(OUT_BASE, slug);
  fs.mkdirSync(dest, { recursive: true });
  const files = fs
    .readdirSync(src)
    .filter((f) => IMG_RE.test(f))
    .sort();
  files.forEach((f, i) => {
    const ext = path.extname(f).toLowerCase();
    fs.copyFileSync(path.join(src, f), path.join(dest, `${i + 1}${ext}`));
  });
  totalImgs += files.length;
  console.log(`  ${slug}: ${files.length} photos`);
}

console.log(`\n✓ Copied ${totalImgs} photos into public/listings/`);
