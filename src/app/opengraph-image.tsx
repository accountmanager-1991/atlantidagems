import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ambar & Larimar Shop — Fine Caribbean Jewelry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ambarlarimarshop.com";
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(ellipse at center, #1A2A3E 0%, #0C1420 60%, #08080E 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Logo seal */}
        <img
          src={`${baseUrl}/images/logos/logo-mark-400.png`}
          width={200}
          height={200}
          alt=""
          style={{ marginBottom: 24 }}
        />

        {/* Gold accent line */}
        <div style={{ width: 100, height: 2, background: "#C9A84C", marginBottom: 22 }} />

        {/* Brand name */}
        <div
          style={{
            fontSize: 60,
            color: "#FAF7F0",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          Ambar & Larimar
        </div>

        {/* Italic Shop subtitle */}
        <div
          style={{
            fontSize: 32,
            color: "#EDD8A0",
            letterSpacing: "0.4em",
            fontStyle: "italic",
            marginTop: 6,
          }}
        >
          Shop
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#C9A84C",
            letterSpacing: "0.3em",
            marginTop: 24,
            textTransform: "uppercase",
          }}
        >
          The Rarest Stones on Earth
        </div>

        {/* Bottom small text */}
        <div
          style={{
            fontSize: 14,
            color: "rgba(237, 216, 160, 0.65)",
            marginTop: 32,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
          }}
        >
          Fine Caribbean Jewelry · Dominican Republic
        </div>
      </div>
    ),
    { ...size }
  );
}
