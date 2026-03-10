import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Ambar & Larimar Shop — Fine Caribbean Jewelry";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
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
          background: "linear-gradient(135deg, #0E3A54 0%, #0C1420 100%)",
          fontFamily: "serif",
        }}
      >
        {/* Gold accent line */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#C9A84C",
            marginBottom: 30,
          }}
        />

        {/* Brand name */}
        <div
          style={{
            fontSize: 56,
            color: "#EDD8A0",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 400,
          }}
        >
          Ambar & Larimar Shop
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 22,
            color: "#3AADCC",
            letterSpacing: "0.25em",
            marginTop: 16,
            textTransform: "uppercase",
          }}
        >
          Fine Caribbean Jewelry
        </div>

        {/* Gold accent line */}
        <div
          style={{
            width: 80,
            height: 3,
            background: "#C9A84C",
            marginTop: 30,
          }}
        />

        {/* Description */}
        <div
          style={{
            fontSize: 18,
            color: "rgba(250, 247, 240, 0.6)",
            marginTop: 24,
            letterSpacing: "0.1em",
          }}
        >
          Handcrafted Larimar & Amber from the Dominican Republic
        </div>
      </div>
    ),
    { ...size }
  );
}
