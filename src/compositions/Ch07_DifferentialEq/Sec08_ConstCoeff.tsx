import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

function stepDot(bg: string): React.CSSProperties {
  return {
    width: 36,
    height: 36,
    borderRadius: "50%",
    backgroundColor: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: COLORS.background,
    fontWeight: "bold",
    fontSize: 18,
    flexShrink: 0,
  };
}

const Sec08ConstCoeff: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–60 标题 ──────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 30);

  // ── Scene 2: 60–150 方程 & 特征方程 ─────────────────────────────────────
  const eq1Opacity = fade(frame, 60, 25);
  const eq2Opacity = fade(frame, 95, 25);
  const eq3Opacity = fade(frame, 125, 25);

  // ── Scene 3: 150–300 三种情况 ────────────────────────────────────────────
  const c1Opacity = fade(frame, 150, 30);
  const c2Opacity = fade(frame, 200, 30);
  const c3Opacity = fade(frame, 250, 30);

  // ── Scene 4: 300–420 例题 y'' - 3y' + 2y = 0 ─────────────────────────────
  const ex1Opacity = fade(frame, 300, 25);
  const ex2Opacity = fade(frame, 330, 25);
  const ex3Opacity = fade(frame, 360, 25);
  const ex4Opacity = fade(frame, 390, 25);

  // ── Scene 5: 420–540 振荡解曲线 ──────────────────────────────────────────
  const coordOpacity = fade(frame, 420, 30);
  // y'' + y = 0 → y = A cos x + B sin x
  const osc1Progress = interpolate(frame, [450, 510], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const osc2Progress = interpolate(frame, [465, 525], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const osc3Progress = interpolate(frame, [480, 535], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const oscLegendOpacity = fade(frame, 510, 25);

  // ── Scene 6: 540–600 总结 ─────────────────────────────────────────────────
  const summaryOpacity = fade(frame, 540, 30);

  const scene =
    frame < 60
      ? 1
      : frame < 150
      ? 2
      : frame < 300
      ? 3
      : frame < 420
      ? 4
      : frame < 540
      ? 5
      : 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.8"
          sectionTitle="常系数齐次线性方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 方程与特征方程 ── */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 40,
            padding: "0 120px",
          }}
        >
          <div
            style={{
              opacity: eq1Opacity,
              padding: "20px 48px",
              border: `2px solid ${COLORS.primaryCurve}`,
              borderRadius: 12,
              backgroundColor: COLORS.theoremBg,
            }}
          >
            <MathFormula
              latex="y'' + py' + qy = 0"
              fontSize={60}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: eq2Opacity, color: COLORS.annotation, fontSize: 28 }}>
            设 y = e^(rx)，代入方程，两边除以 e^(rx)
          </div>

          <div
            style={{
              opacity: eq3Opacity,
              padding: "16px 48px",
              border: `2px solid ${COLORS.highlight}`,
              borderRadius: 12,
              backgroundColor: "rgba(255,107,107,0.1)",
            }}
          >
            <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 8, textAlign: "center" }}>
              特征方程
            </div>
            <MathFormula
              latex="r^2 + pr + q = 0"
              fontSize={52}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 三种情况 ── */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 28, marginBottom: 8 }}>
            特征根的三种情况
          </div>

          {/* 情况1：两不等实根 */}
          <div
            style={{
              opacity: c1Opacity,
              width: "100%",
              padding: "16px 24px",
              border: `2px solid ${COLORS.tertiaryCurve}`,
              borderRadius: 10,
              backgroundColor: "rgba(80,250,123,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ color: COLORS.tertiaryCurve, fontSize: 22, minWidth: 220 }}>
              情况 1：r₁ ≠ r₂（两不等实根）
            </div>
            <MathFormula
              latex="y = C_1 e^{r_1 x} + C_2 e^{r_2 x}"
              fontSize={36}
              color={COLORS.tertiaryCurve}
            />
          </div>

          {/* 情况2：重根 */}
          <div
            style={{
              opacity: c2Opacity,
              width: "100%",
              padding: "16px 24px",
              border: `2px solid ${COLORS.vector}`,
              borderRadius: 10,
              backgroundColor: "rgba(255,215,0,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ color: COLORS.vector, fontSize: 22, minWidth: 220 }}>
              情况 2：r₁ = r₂ = r（重根）
            </div>
            <MathFormula
              latex="y = (C_1 + C_2 x)\,e^{rx}"
              fontSize={36}
              color={COLORS.vector}
            />
          </div>

          {/* 情况3：共轭复根 */}
          <div
            style={{
              opacity: c3Opacity,
              width: "100%",
              padding: "16px 24px",
              border: `2px solid ${COLORS.secondaryCurve}`,
              borderRadius: 10,
              backgroundColor: "rgba(255,121,198,0.08)",
              display: "flex",
              alignItems: "center",
              gap: 24,
            }}
          >
            <div style={{ color: COLORS.secondaryCurve, fontSize: 22, minWidth: 220 }}>
              情况 3：r = α ± βi（复根）
            </div>
            <MathFormula
              latex="y = e^{\alpha x}\!\left(C_1\cos\beta x + C_2\sin\beta x\right)"
              fontSize={33}
              color={COLORS.secondaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 例题 y'' - 3y' + 2y = 0 ── */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 140px",
          }}
        >
          <div style={{ opacity: ex1Opacity }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 12, textAlign: "center" }}>
              例题：求 y'' − 3y' + 2y = 0 的通解
            </div>
            <MathFormula latex="y'' - 3y' + 2y = 0" fontSize={52} color={COLORS.formula} />
          </div>

          <div style={{ opacity: ex2Opacity, display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>写出特征方程</div>
              <MathFormula
                latex="r^2 - 3r + 2 = 0 \implies (r-1)(r-2)=0"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: ex3Opacity, display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>特征根</div>
              <MathFormula
                latex="r_1 = 1,\quad r_2 = 2 \quad \text{（两不等实根）}"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div
            style={{
              opacity: ex4Opacity,
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "100%",
              borderTop: `2px solid ${COLORS.highlight}`,
              paddingTop: 16,
            }}
          >
            <div style={stepDot(COLORS.highlight)}>3</div>
            <div>
              <div style={{ color: COLORS.highlight, fontSize: 22 }}>通解</div>
              <MathFormula
                latex="y = C_1 e^x + C_2 e^{2x}"
                fontSize={44}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 振荡解（复根情况 y'' + y = 0） ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ opacity: coordOpacity, textAlign: "center" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 26, marginBottom: 4 }}>
              复根情况：y'' + y = 0（特征根 r = ±i）
            </div>
            <div style={{ color: COLORS.annotation, fontSize: 22 }}>
              通解：y = C₁cos x + C₂sin x，呈振荡曲线
            </div>
          </div>

          <CoordinateSystem
            width={900}
            height={400}
            xRange={[-1, 8]}
            yRange={[-3, 3]}
            opacity={coordOpacity}
          >
            {/* y = cos x */}
            <FunctionPlot
              fn={(x) => Math.cos(x)}
              color={COLORS.primaryCurve}
              drawProgress={osc1Progress}
              strokeWidth={3}
            />
            {/* y = sin x */}
            <FunctionPlot
              fn={(x) => Math.sin(x)}
              color={COLORS.secondaryCurve}
              drawProgress={osc2Progress}
              strokeWidth={3}
            />
            {/* y = cos x + sin x = √2 · sin(x + π/4) */}
            <FunctionPlot
              fn={(x) => Math.cos(x) + Math.sin(x)}
              color={COLORS.tertiaryCurve}
              drawProgress={osc3Progress}
              strokeWidth={2.5}
              opacity={0.9}
            />
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 40,
              opacity: oscLegendOpacity,
              fontSize: 22,
            }}
          >
            <div style={{ color: COLORS.primaryCurve }}>— C₁=1, C₂=0: y=cos x</div>
            <div style={{ color: COLORS.secondaryCurve }}>— C₁=0, C₂=1: y=sin x</div>
            <div style={{ color: COLORS.tertiaryCurve }}>— C₁=C₂=1: y=cos x+sin x</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 6: 总结 ── */}
      {scene === 6 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 100px",
          }}
        >
          <TheoremBox title="常系数齐次线性方程通解" opacity={summaryOpacity} width={1000}>
            <div style={{ fontSize: 24, lineHeight: 2.1, color: COLORS.formula }}>
              <div>
                方程{" "}
                <span style={{ color: COLORS.primaryCurve }}>y'' + py' + qy = 0</span>{" "}
                的通解由特征根决定：
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.tertiaryCurve }}>r₁ ≠ r₂（实根）</span>：
                y = C₁e^(r₁x) + C₂e^(r₂x)
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.vector }}>r₁ = r₂（重根）</span>：
                y = (C₁ + C₂x)e^(rx)
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.secondaryCurve }}>r = α ± βi（复根）</span>：
                y = e^(αx)(C₁cos βx + C₂sin βx)
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec08ConstCoeff;
