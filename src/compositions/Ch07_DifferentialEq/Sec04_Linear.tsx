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

const CURVE_COLORS = [
  "#ff6b6b",
  "#ff79c6",
  "#61dafb",
  "#50fa7b",
  "#ffd700",
];

const Sec04Linear: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–60 标题 ──────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 30);

  // ── Scene 2: 60–150 标准形式 ─────────────────────────────────────────────
  const stdOpacity = fade(frame, 60, 30);
  const stdAnnOpacity = fade(frame, 95, 30);

  // ── Scene 3: 150–270 积分因子推导 ────────────────────────────────────────
  const d1Opacity = fade(frame, 150, 25);
  const d2Opacity = fade(frame, 183, 25);
  const d3Opacity = fade(frame, 216, 25);
  const d4Opacity = fade(frame, 249, 25);

  // ── Scene 4: 270–390 例题 y' + y = x ─────────────────────────────────────
  const ex1Opacity = fade(frame, 270, 25);
  const ex2Opacity = fade(frame, 300, 25);
  const ex3Opacity = fade(frame, 330, 25);
  const ex4Opacity = fade(frame, 360, 25);

  // ── Scene 5: 390–480 解族曲线 ────────────────────────────────────────────
  const coordOpacity = fade(frame, 390, 30);
  const cValues = [-2, -1, 0, 1, 2];
  const curveProgress = cValues.map((_, i) =>
    interpolate(frame, [420 + i * 12, 470 + i * 12], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    })
  );
  const legendOpacity = fade(frame, 460, 25);

  // ── Scene 6: 480–540 总结 ─────────────────────────────────────────────────
  const summaryOpacity = fade(frame, 480, 30);

  const scene =
    frame < 60
      ? 1
      : frame < 150
      ? 2
      : frame < 270
      ? 3
      : frame < 390
      ? 4
      : frame < 480
      ? 5
      : 6;

  // y = Ce^(-x) + x - 1
  const makeLinearFn = (C: number) => (x: number) => {
    const val = C * Math.exp(-x) + x - 1;
    return Math.max(-8, Math.min(8, val));
  };

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.4"
          sectionTitle="一阶线性微分方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 标准形式 ── */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 48,
            padding: "0 120px",
          }}
        >
          <div
            style={{
              opacity: stdOpacity,
              padding: "24px 60px",
              border: `2px solid ${COLORS.primaryCurve}`,
              borderRadius: 12,
              backgroundColor: COLORS.theoremBg,
            }}
          >
            <MathFormula
              latex="y' + P(x)\,y = Q(x)"
              fontSize={64}
              color={COLORS.formula}
            />
          </div>

          <div
            style={{
              opacity: stdAnnOpacity,
              display: "flex",
              gap: 48,
              fontSize: 26,
            }}
          >
            <div
              style={{
                color: COLORS.primaryCurve,
                padding: "10px 24px",
                border: `1px solid ${COLORS.primaryCurve}`,
                borderRadius: 8,
              }}
            >
              P(x) — y 的系数函数
            </div>
            <div
              style={{
                color: COLORS.secondaryCurve,
                padding: "10px 24px",
                border: `1px solid ${COLORS.secondaryCurve}`,
                borderRadius: 8,
              }}
            >
              Q(x) — 非齐次项
            </div>
          </div>

          <div style={{ opacity: stdAnnOpacity, color: COLORS.annotation, fontSize: 26 }}>
            <span style={{ color: COLORS.highlight }}>线性</span>：方程对 y 和 y' 均为一次（线性）
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 积分因子推导 ── */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 22,
            padding: "0 140px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 8, opacity: d1Opacity }}>
            积分因子法推导通解公式
          </div>

          <div style={{ opacity: d1Opacity, display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 4 }}>
                乘以积分因子 μ(x) = e^(∫P dx)
              </div>
              <MathFormula
                latex="\mu(x) = e^{\int P(x)\,dx}"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: d2Opacity, display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 4 }}>
                两边乘以 μ，左边变成完全导数
              </div>
              <MathFormula
                latex="\left(y\,e^{\int P\,dx}\right)' = Q(x)\,e^{\int P\,dx}"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: d3Opacity, display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>3</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 4 }}>
                两边积分
              </div>
              <MathFormula
                latex="y\,e^{\int P\,dx} = \int Q(x)\,e^{\int P\,dx}\,dx + C"
                fontSize={36}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div
            style={{
              opacity: d4Opacity,
              display: "flex",
              alignItems: "center",
              gap: 20,
              width: "100%",
              borderTop: `2px solid ${COLORS.highlight}`,
              paddingTop: 16,
            }}
          >
            <div style={stepDot(COLORS.highlight)}>4</div>
            <div>
              <div style={{ color: COLORS.highlight, fontSize: 20, marginBottom: 4 }}>通解公式</div>
              <MathFormula
                latex="y = e^{-\int P\,dx}\!\left[\int Q\,e^{\int P\,dx}\,dx + C\right]"
                fontSize={36}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 例题 y' + y = x ── */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 22,
            padding: "0 140px",
          }}
        >
          <div style={{ opacity: ex1Opacity }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 12, textAlign: "center" }}>
              例题：求方程 y' + y = x 的通解
            </div>
            <MathFormula latex="y' + y = x" fontSize={52} color={COLORS.formula} />
          </div>

          <div style={{ opacity: ex2Opacity, display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>
                P(x) = 1，Q(x) = x
              </div>
              <MathFormula
                latex="\mu = e^{\int 1\,dx} = e^x"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: ex3Opacity, display: "flex", alignItems: "center", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>
                两边乘以 e^x，再积分
              </div>
              <MathFormula
                latex="y e^x = \int x e^x\,dx = (x-1)e^x + C"
                fontSize={36}
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
                latex="y = C e^{-x} + x - 1"
                fontSize={44}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 解族曲线 ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 28, opacity: coordOpacity, marginBottom: 4 }}>
            解族：y = Ce⁻ˣ + x − 1，不同 C 值的曲线
          </div>

          <CoordinateSystem
            width={900}
            height={430}
            xRange={[-1, 3]}
            yRange={[-5, 5]}
            opacity={coordOpacity}
          >
            {cValues.map((C, i) => (
              <FunctionPlot
                key={C}
                fn={makeLinearFn(C)}
                color={CURVE_COLORS[i]}
                drawProgress={curveProgress[i]}
                strokeWidth={2.5}
              />
            ))}
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 24,
              opacity: legendOpacity,
              fontSize: 20,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {cValues.map((C, i) => (
              <div key={C} style={{ color: CURVE_COLORS[i] }}>
                — C = {C}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 6: 总结 ── */}
      {scene === 6 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 120px",
          }}
        >
          <TheoremBox title="一阶线性方程通解公式" opacity={summaryOpacity} width={960}>
            <div style={{ fontSize: 26, lineHeight: 2.2, color: COLORS.formula }}>
              <div style={{ marginBottom: 12 }}>
                方程{" "}
                <span style={{ color: COLORS.primaryCurve }}>y' + P(x)y = Q(x)</span>{" "}
                的通解：
              </div>
              <div style={{ marginBottom: 20 }}>
                <MathFormula
                  latex="y = e^{-\int P\,dx}\left[\int Q\,e^{\int P\,dx}\,dx + C\right]"
                  fontSize={34}
                  color={COLORS.highlight}
                />
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.primaryCurve }}>积分因子</span>
                ：μ = e^(∫P dx)
              </div>
              <div>
                • 当 Q(x) = 0 时，为{" "}
                <span style={{ color: COLORS.primaryCurve }}>齐次方程</span>
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

// 辅助：步骤圆点样式
function stepDot(bg: string): React.CSSProperties {
  return {
    width: 32,
    height: 32,
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

export default Sec04Linear;
