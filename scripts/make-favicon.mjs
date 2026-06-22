import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { writeFile } from "node:fs/promises";
import path from "node:path";

// Generates the search-engine / browser icons from the processed round logo.
//   - src/app/favicon.ico  : multi-resolution (16/32/48) — what Google's favicon
//                            crawler and browsers request at /favicon.ico
//   - src/app/apple-icon.png: 180x180 — iOS home screen & some social crawlers
//
// Next.js auto-emits the matching <link> tags from these files in src/app/.
// Source is the already-processed public/logo.png (the original source jpeg is
// no longer in the repo). Run: node scripts/make-favicon.mjs

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public", "logo.png");
const appDir = path.join(root, "src", "app");

const ICO_SIZES = [16, 32, 48];

/** Assemble PNG buffers into a single .ico (icons may embed PNG data). */
function buildIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type: 1 = icon
  header.writeUInt16LE(images.length, 4); // image count

  let offset = 6 + 16 * images.length;
  const entries = images.map(({ size, data }) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // width  (0 means 256)
    e.writeUInt8(size >= 256 ? 0 : size, 1); // height (0 means 256)
    e.writeUInt8(0, 2); // palette colors
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // color planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(data.length, 8); // image data size
    e.writeUInt32LE(offset, 12); // offset of image data
    offset += data.length;
    return e;
  });

  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

async function build() {
  const pngs = await Promise.all(
    ICO_SIZES.map(async (size) => ({
      size,
      data: await sharp(src)
        .resize(size, size, {
          fit: "contain",
          background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
        .png()
        .toBuffer(),
    })),
  );

  await writeFile(path.join(appDir, "favicon.ico"), buildIco(pngs));

  await sharp(src)
    .resize(180, 180, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toFile(path.join(appDir, "apple-icon.png"));

  console.log("✓ wrote src/app/favicon.ico (16/32/48) and src/app/apple-icon.png");
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
