import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pub = path.join(__dirname, "..", "public");
const src = path.join(pub, "logo-source.jpeg");

const SIZE = 512;

// Circle mask SVG (white circle on transparent → used as dest-in alpha mask)
const circle = Buffer.from(
  `<svg width="${SIZE}" height="${SIZE}"><circle cx="${SIZE / 2}" cy="${SIZE / 2}" r="${SIZE / 2}" fill="#fff"/></svg>`,
);

async function build() {
  // 1) Trim the surrounding white margin so the badge fills the frame,
  //    then resize to a square and apply a circular alpha mask.
  const base = await sharp(src)
    .trim({ threshold: 20 })
    .resize(SIZE, SIZE, { fit: "cover" })
    .png()
    .toBuffer();

  const roundBuffer = await sharp(base)
    .composite([{ input: circle, blend: "dest-in" }])
    .png()
    .toBuffer();

  await sharp(roundBuffer).toFile(path.join(pub, "logo.png"));
  await sharp(roundBuffer).resize(256, 256).toFile(path.join(pub, "icon.png"));

  // App favicon (Next picks up src/app/icon.png automatically)
  await sharp(roundBuffer)
    .resize(256, 256)
    .toFile(path.join(__dirname, "..", "src", "app", "icon.png"));

  console.log("✓ wrote public/logo.png, public/icon.png, src/app/icon.png");
}

build().catch((e) => {
  console.error(e);
  process.exit(1);
});
