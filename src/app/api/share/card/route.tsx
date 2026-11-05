import { ImageResponse } from "next/og";

export const runtime = "nodejs";

const BANDS: Record<string, { label: string; color: string }> = {
  READY: { label: "READY", color: "#5fd0f0" },
  MONITOR: { label: "MONITOR", color: "#f3c861" },
  COMPROMISED: { label: "COMPROMISED", color: "#f07a82" },
};

/**
 * GET /api/share/card?name=Falcons U18&score=87&band=READY
 * Generates a branded 1200x630 readiness card (PNG) for social sharing.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const name = (searchParams.get("name") ?? "My squad").slice(0, 28) || "My squad";
  const rawScore = Number.parseInt(searchParams.get("score") ?? "87", 10);
  const score = Number.isFinite(rawScore) ? Math.max(0, Math.min(100, rawScore)) : 87;
  const bandKey = searchParams.get("band") ?? "READY";
  const band = BANDS[bandKey] ?? BANDS.READY!;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "linear-gradient(135deg, #0b1529 0%, #13203a 70%, #0f1a30 100%)",
          color: "#e8f0f9",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 11,
                border: "2px solid #253755",
                background: "#0b1529",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
                color: "#5fd0f0",
              }}
            >
              &gt;&gt;
            </div>
            <div style={{ fontSize: 26, fontWeight: 700, letterSpacing: 3, color: "#5fd0f0" }}>
              SPORTMETRYX FOOTBALL
            </div>
          </div>
          <div
            style={{
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
              color: band.color,
              border: `2px solid ${band.color}55`,
              background: `${band.color}1f`,
              borderRadius: 999,
              padding: "8px 22px",
            }}
          >
            {band.label}
          </div>
        </div>

        {/* center */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 40, color: "#a9bbd6" }}>{name}</div>
            <div style={{ fontSize: 34, color: "#a9bbd6", marginTop: 10 }}>
              Squad readiness
            </div>
          </div>
          <div
            style={{
              fontSize: 190,
              fontWeight: 700,
              lineHeight: 0.9,
              color: band.color,
              marginLeft: "auto",
            }}
          >
            {score}
          </div>
        </div>

        {/* footer */}
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div
            style={{
              height: 5,
              borderRadius: 5,
              background: "linear-gradient(90deg, #5fd0f0, #9d78f5)",
              display: "flex",
            }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#a9bbd6" }}>
            <div>Validity-gated · explainable · consent-governed</div>
            <div style={{ color: "#e8f0f9", fontWeight: 700 }}>sportmatryx-v2.vercel.app</div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
