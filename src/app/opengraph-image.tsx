import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Share card — generated at build time (no binary asset needed). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "linear-gradient(135deg, #0b1529 0%, #13203a 70%, #0f1a30 100%)",
          color: "#e8f0f9",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: "3px solid #253755",
              background: "#0b1529",
              fontSize: 34,
              fontWeight: 700,
              color: "#5fd0f0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            &gt;&gt;
          </div>
          <div style={{ fontSize: 34, letterSpacing: 4, fontWeight: 700, color: "#5fd0f0" }}>
            SPORTMETRYX
          </div>
        </div>
        <div style={{ fontSize: 86, fontWeight: 700, marginTop: 34, lineHeight: 1.02 }}>
          Decisions you can defend.
        </div>
        <div style={{ fontSize: 32, marginTop: 26, color: "#a9bbd6" }}>
          Validity-gated readiness intelligence for sport
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 44,
            left: 90,
            right: 90,
            height: 4,
            borderRadius: 4,
            background: "linear-gradient(90deg, #5fd0f0, #9d78f5)",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size },
  );
}
