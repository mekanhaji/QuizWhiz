import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";

export const alt =
  "M.I.Ready — grind smarter, not harder. Free MCQ drilling with AI-written questions.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CREAM = "#FBF3DE";
const INK = "#13130C";
const GREEN = "#2CA14C";
const YELLOW = "#FFD500";

async function loadDisplayFont() {
  try {
    const fontPath = path.join(
      process.cwd(),
      "src/app/_og/baloo-2-latin-700-normal.woff",
    );
    return await readFile(fontPath);
  } catch {
    return null;
  }
}

async function loadLogoDataUri() {
  try {
    const logoPath = path.join(process.cwd(), "public/logo.png");
    const bytes = await readFile(logoPath);
    return `data:image/png;base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function OgImage() {
  const [displayFont, logoDataUri] = await Promise.all([
    loadDisplayFont(),
    loadLogoDataUri(),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: CREAM,
          fontFamily: displayFont ? "Baloo 2" : "sans-serif",
        }}
      >
        {/* offset shadow block behind the sticker card */}
        <div
          style={{
            position: "absolute",
            width: 1040,
            height: 540,
            background: INK,
            transform: "translate(16px, 16px)",
          }}
        />
        <div
          style={{
            position: "relative",
            width: 1040,
            height: 540,
            display: "flex",
            flexDirection: "column",
            background: CREAM,
            border: `6px solid ${INK}`,
            padding: "48px 64px",
          }}
        >
          {/* brand lockup */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
            {logoDataUri && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoDataUri}
                width={84}
                height={56}
                alt=""
                style={{ marginRight: 14 }}
              />
            )}
            <div
              style={{
                display: "flex",
                background: GREEN,
                color: CREAM,
                padding: "4px 14px",
                borderRadius: 14,
                fontWeight: 700,
                fontSize: 34,
              }}
            >
              M.I.R
            </div>
            <div style={{ display: "flex", color: INK, fontWeight: 700, fontSize: 34 }}>
              eady
            </div>
          </div>

          {/* headline */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontWeight: 700,
              fontSize: 84,
              lineHeight: 1.05,
              color: INK,
              letterSpacing: -1,
              marginBottom: 24,
            }}
          >
            <div style={{ display: "flex" }}>Grind smarter,</div>
            <div style={{ display: "flex" }}>
              not&nbsp;<span style={{ color: GREEN }}>harder.</span>
            </div>
          </div>

          {/* subline */}
          <div
            style={{
              display: "flex",
              fontSize: 26,
              lineHeight: 1.35,
              color: "#4A4A3A",
              fontFamily: "sans-serif",
              fontWeight: 400,
              maxWidth: 900,
              marginBottom: 28,
            }}
          >
            Your AI writes the questions. M.I.Ready drills you until they
            stick.
          </div>

          {/* bottom mono row */}
          <div style={{ display: "flex", alignItems: "center", marginTop: "auto" }}>
            <div
              style={{
                display: "flex",
                width: 34,
                height: 14,
                background: YELLOW,
                border: `2px solid ${INK}`,
                borderRadius: 3,
                marginRight: 16,
                transform: "rotate(-3deg)",
              }}
            />
            <div
              style={{
                display: "flex",
                fontFamily: "monospace",
                fontSize: 22,
                color: "#4A4A3A",
              }}
            >
              free · no account · miready.vercel.app
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: displayFont
        ? [{ name: "Baloo 2", data: displayFont, weight: 700, style: "normal" }]
        : undefined,
    },
  );
}
