// One-off generator: rasterizes the real spiral logo (public/logo.png) into
// the square icon sizes the app declares in layout.tsx metadata.icons and
// public/site.webmanifest, replacing the unrelated placeholder icon set.
// Run with: node scripts/generate-brand-icons.mjs
import { ImageResponse } from "next/og.js";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";

const e = React.createElement;
const CREAM = "#FBF3DE";
// logo.png is 1536x1024 (3:2) — not square, so it's fit-contained with margin.
const LOGO_ASPECT = 1536 / 1024;

const targets = [
  { file: "public/favicon-16x16.png", size: 16 },
  { file: "public/favicon-32x32.png", size: 32 },
  { file: "public/apple-touch-icon.png", size: 180 },
  { file: "public/android-chrome-192x192.png", size: 192 },
  { file: "public/android-chrome-512x512.png", size: 512 },
];

async function main() {
  const logoBytes = await readFile(
    path.join(process.cwd(), "public/logo.png"),
  );
  const logoDataUri = `data:image/png;base64,${logoBytes.toString("base64")}`;

  for (const target of targets) {
    const imgWidth = Math.round(target.size * 0.82);
    const imgHeight = Math.round(imgWidth / LOGO_ASPECT);

    const tree = e(
      "div",
      {
        style: {
          width: target.size,
          height: target.size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
        },
      },
      e("img", { src: logoDataUri, width: imgWidth, height: imgHeight }),
    );

    const response = new ImageResponse(tree, {
      width: target.size,
      height: target.size,
    });
    const buffer = Buffer.from(await response.arrayBuffer());
    await writeFile(path.join(process.cwd(), target.file), buffer);
    console.log(`wrote ${target.file} (${buffer.length} bytes)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
