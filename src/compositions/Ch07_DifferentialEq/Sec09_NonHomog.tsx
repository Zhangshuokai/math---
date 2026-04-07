import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
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

const Sec09NonHomog: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–60 标题 ──────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 30);

  // ── Scene 2: 60–150 方程结构 ─────────────────────────────────────────────
  const eq1Opacity = fade(frame, 60, 25);
  const struct1Opacity = fade(frame, 90, 25);
  const struct2Opacity = fade(frame, 118, 25);

  // ── Scene 3: 150–300 待定系数法（f(x) = e^λx 型） ────────────────────────
  const uc1Opacity = fade(frame, 150, 25);
  const uc2Opacity = fade(frame, 183, 25);
  const uc3Opacity = fade(frame, 216, 25);
  const uc4Opacity = fade(frame, 257, 25);

  // ── Scene 4: 300–420 例题 y'' - 3y' + 2y = eˣ ────────────────────────────
  const ex1Opacity = fade(frame, 300, 25);
  const ex2Opacity = fade(frame, 330, 25);
  const ex3Opacity = fade(frame, 358, 25);
  const ex4Opacity = fade(frame, 386, 25);

  // ── Scene 5: 420–480 总结 ─────────────────────────────────────────────────
  const summaryOpacity = fade(frame, 420, 30);
  const hlOpacity = fade(frame, 455, 25);

  const scene =
    frame < 60
      ? 1
      : frame < 150
      ? 2
      : frame < 300
      ? 3
      : frame < 420
      ? 4
      : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.9"
          sectionTitle="常系数非齐次线性方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 方程结构 ── */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 44,
            padding: "0 120px",
          }}
        >
          {/* 非齐次方程 */}
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
              latex="y'' + py' + qy = f(x)"
              fontSize={60}
              color={COLORS.formula}
            />
          </div>

          {/* 解的结构 */}
          <div
            style={{
              opacity: struct1Opacity,
              width: "100%",
              padding: "20px 32px",
              border: `2px solid ${COLORS.highlight}`,
              borderRadius: 12,
              backgroundColor: "rgba(255,107,107,0.08)",
              textAlign: "center",
            }}
          >
            <div style={{ color: COLORS.highlight, fontSize: 26, marginBottom: 12 }}>
              解的结构定理
            </div>
            <div style={{ color: COLORS.formula, fontSize: 28 }}>
              通解 ={" "}
              <span style={{ color: COLORS.primaryCurve }}>对应齐次方程的通解 Y</span>
              {" "}+{" "}
              <span style={{ color: COLORS.secondaryCurve }}>非齐次方程的一个特解 y*</span>
            </div>
          </div>

          <div style={{ opacity: struct2Opacity }}>
            <MathFormula
              latex="y = \underbrace{C_1 y_1 + C_2 y_2}_{Y \text{（齐次通解）}} + \underbrace{y^*}_{\text{特解}}"
              fontSize={42}
              color={COLORS.annotation}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 待定系数法 ── */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 22,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 8, opacity: uc1Opacity }}>
            待定系数法：f(x) = Pₙ(x)·e^λx 型
          </div>

          <div style={{ opacity: uc1Opacity, display: "flex", alignItems: "flex-start", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                若 λ 不是特征根，设特解形式为：
              </div>
              <MathFormula
                latex="y^* = Q_n(x)\,e^{\lambda x}"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: uc2Opacity, display: "flex", alignItems: "flex-start", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                若 λ 是特征方程的 k 重根，设：
              </div>
              <MathFormula
                latex="y^* = x^k Q_n(x)\,e^{\lambda x}"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: uc3Opacity, display: "flex", alignItems: "flex-start", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>3</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                将 y* 代入原方程，比较系数，确定待定系数
              </div>
            </div>
          </div>

          <div
            style={{
              opacity: uc4Opacity,
              width: "100%",
              padding: "14px 24px",
              border: `1px solid ${COLORS.vector}`,
              borderRadius: 8,
              backgroundColor: "rgba(255,215,0,0.06)",
            }}
          >
            <div style={{ color: COLORS.vector, fontSize: 22 }}>
              关键：特解形式的选取取决于 λ 是否是特征根
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 例题 y'' - 3y' + 2y = eˣ ── */}
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
            <div style={{ color: COLORS.primaryCurve, fontSize: 26, marginBottom: 12, textAlign: "center" }}>
              例题：求 y'' − 3y' + 2y = eˣ 的通解
            </div>
            <MathFormula
              latex="y'' - 3y' + 2y = e^x"
              fontSize={50}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: ex2Opacity, display: "flex", alignItems: "flex-start", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 21 }}>
                对应齐次方程特征根：r₁=1, r₂=2，故齐次通解
              </div>
              <MathFormula
                latex="Y = C_1 e^x + C_2 e^{2x}"
                fontSize={36}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: ex3Opacity, display: "flex", alignItems: "flex-start", gap: 20, width: "100%" }}>
            <div style={stepDot(COLORS.secondaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 21 }}>
                λ=1 是单特征根（k=1），设特解 y* = Axeˣ，代入得 A = −1
              </div>
              <MathFormula
                latex="y^* = -x e^x"
                fontSize={38}
                color={COLORS.secondaryCurve}
              />
            </div>
          </div>

          <div
            style={{
              opacity: ex4Opacity,
              display: "flex",
              alignItems: "flex-start",
              gap: 20,
              width: "100%",
              borderTop: `2px solid ${COLORS.highlight}`,
              paddingTop: 14,
            }}
          >
            <div style={stepDot(COLORS.highlight)}>3</div>
            <div>
              <div style={{ color: COLORS.highlight, fontSize: 21 }}>通解 = 齐次通解 + 特解</div>
              <MathFormula
                latex="y = C_1 e^x + C_2 e^{2x} - x e^x"
                fontSize={40}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 总结 ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 40,
            padding: "0 120px",
          }}
        >
          <div style={{ opacity: hlOpacity }}>
            <MathFormula
              latex="y = Y + y^*"
              fontSize={64}
              color={COLORS.highlight}
            />
          </div>

          <TheoremBox title="常系数非齐次线性方程" opacity={summaryOpacity} width={960}>
            <div style={{ fontSize: 25, lineHeight: 2.1, color: COLORS.formula }}>
              <div>
                •{" "}
                <span style={{ color: COLORS.primaryCurve }}>解的结构</span>：
                通解 = 齐次通解 Y + 非齐次特解 y*
              </div>
              <div>
                •{" "}
                <span style={{ color: COLORS.primaryCurve }}>待定系数法</span>：
                适用于 f(x) = Pₙ(x)·e^λx 型
              </div>
              <div>
                • λ 不是特征根 → y* = Qₙ(x)eˡˣ
              </div>
              <div>
                • λ 是 k 重特征根 → y* = xᵏQₙ(x)eˡˣ
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec09NonHomog;
