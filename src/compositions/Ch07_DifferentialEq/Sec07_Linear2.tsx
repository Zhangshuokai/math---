import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { fade } from "../../utils/animationUtils";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

// 三条曲线颜色：y₁=cos(x)蓝，y₂=sin(x)绿，叠加黄
const CURVE_COLORS = [
  COLORS.primaryCurve,  // cos(x) 蓝
  COLORS.tertiaryCurve, // sin(x) 绿
  COLORS.vector,        // cos(x)+sin(x) 黄
];

// 步骤圆点样式
function stepDot(bg: string): React.CSSProperties {
  return {
    width: 34,
    height: 34,
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

const Sec07Linear2: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–80 标题 ────────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 55);

  // ── Scene 2: 80–180 方程形式 ──────────────────────────────────────────────
  const s2Title   = fade(frame, 80, 28);
  const homOpacity = fade(frame, 95, 30);
  const inhOpacity = fade(frame, 130, 30);
  const annOpacity = fade(frame, 155, 23);

  // ── Scene 3: 180–290 叠加原理 ─────────────────────────────────────────────
  const s3Title  = fade(frame, 180, 28);
  const s3step1  = fade(frame, 198, 30);
  const s3step2  = fade(frame, 228, 30);
  const s3step3  = fade(frame, 258, 28);

  // ── Scene 4: 290–380 坐标系可视化（y''+y=0 简谐振动） ────────────────────
  const coordOpacity = fade(frame, 290, 28);
  // 三条曲线顺序出现
  const curve1Progress = interpolate(frame, [312, 350], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const curve2Progress = interpolate(frame, [330, 368], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const curve3Progress = interpolate(frame, [348, 386], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  const legendOpacity = fade(frame, 364, 18);

  // ── Scene 5: 380–480 通解结构 ─────────────────────────────────────────────
  const v0Opacity = fade(frame, 380, 28);
  const v1Opacity = fade(frame, 405, 28);
  const v2Opacity = fade(frame, 430, 28);
  const v3Opacity = fade(frame, 455, 25);

  const scene =
    frame < 80  ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  // x 范围：[0, 3π]
  const X_MAX = 3 * Math.PI;

  const cosFn    = (x: number) => Math.cos(x);
  const sinFn    = (x: number) => Math.sin(x);
  const superFn  = (x: number) => Math.cos(x) + Math.sin(x);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>

      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.7"
          sectionTitle="高阶线性微分方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 方程形式 ── */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 36,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, opacity: s2Title }}>
            二阶线性微分方程的一般形式
          </div>

          {/* 非齐次方程（一般形式） */}
          <div
            style={{
              opacity: inhOpacity,
              padding: "20px 48px",
              border: `2px solid ${COLORS.primaryCurve}`,
              borderRadius: 12,
              backgroundColor: COLORS.theoremBg,
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 10 }}>
              非齐次形式
            </div>
            <MathFormula
              latex="y'' + P(x)\,y' + Q(x)\,y = f(x)"
              fontSize={56}
              color={COLORS.formula}
            />
          </div>

          {/* 齐次方程 */}
          <div
            style={{
              opacity: homOpacity,
              padding: "18px 48px",
              border: `1.5px solid ${COLORS.secondaryCurve}`,
              borderRadius: 12,
              backgroundColor: "rgba(255,121,198,0.08)",
              width: "100%",
              textAlign: "center",
            }}
          >
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 10 }}>
              齐次形式（f(x) ≡ 0）
            </div>
            <MathFormula
              latex="y'' + P(x)\,y' + Q(x)\,y = 0"
              fontSize={52}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{ opacity: annOpacity, color: COLORS.annotation, fontSize: 24, textAlign: "center" }}>
            <span style={{ color: COLORS.highlight }}>线性</span>：方程对 y、y'、y'' 均为一次
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 叠加原理 ── */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 130px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, marginBottom: 6, opacity: s3Title }}>
            叠加原理（Superposition Principle）
          </div>

          {/* 原理陈述 */}
          <div style={{ opacity: s3step1, display: "flex", alignItems: "center", gap: 24, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                若 y₁, y₂ 均是齐次方程的解
              </div>
              <MathFormula
                latex="y_1''+P\,y_1'+Q\,y_1 = 0 \;,\quad y_2''+P\,y_2'+Q\,y_2 = 0"
                fontSize={36}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 叠加 */}
          <div style={{ opacity: s3step2, display: "flex", alignItems: "center", gap: 24, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                则它们的线性组合也是解
              </div>
              <MathFormula
                latex="y = C_1 y_1 + C_2 y_2 \;\text{ 也满足齐次方程}"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 结论 */}
          <div
            style={{
              opacity: s3step3,
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: "100%",
              borderTop: `2px solid ${COLORS.highlight}`,
              paddingTop: 18,
            }}
          >
            <div style={stepDot(COLORS.highlight)}>3</div>
            <div>
              <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 6 }}>
                若 y₁, y₂ 线性无关，则通解为
              </div>
              <MathFormula
                latex="y = C_1 y_1(x) + C_2 y_2(x)"
                fontSize={48}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 坐标系可视化（y''+y=0 简谐振动） ── */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 24, opacity: coordOpacity, marginBottom: 2 }}>
            <span style={{ color: COLORS.primaryCurve }}>y'' + y = 0</span> 的解族（简谐振动）
          </div>

          <CoordinateSystem
            width={920}
            height={400}
            xRange={[0, X_MAX]}
            yRange={[-2, 2]}
            opacity={coordOpacity}
          >
            <FunctionPlot
              fn={cosFn}
              color={CURVE_COLORS[0]}
              drawProgress={curve1Progress}
              strokeWidth={2.8}
            />
            <FunctionPlot
              fn={sinFn}
              color={CURVE_COLORS[1]}
              drawProgress={curve2Progress}
              strokeWidth={2.8}
            />
            <FunctionPlot
              fn={superFn}
              color={CURVE_COLORS[2]}
              drawProgress={curve3Progress}
              strokeWidth={3.2}
            />
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 40,
              opacity: legendOpacity,
              fontSize: 21,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div style={{ color: CURVE_COLORS[0] }}>— y₁ = cos(x)</div>
            <div style={{ color: CURVE_COLORS[1] }}>— y₂ = sin(x)</div>
            <div style={{ color: CURVE_COLORS[2] }}>— y = cos(x) + sin(x)（叠加）</div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 通解结构 ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 30,
            padding: "0 120px",
          }}
        >
          <div style={{ opacity: v0Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 14 }}>
              非齐次方程的通解结构
            </div>
            <MathFormula
              latex="y = \underbrace{C_1 y_1 + C_2 y_2}_{\text{齐次通解}} + \underbrace{y^*}_{\text{特解}}"
              fontSize={50}
              color={COLORS.formula}
            />
          </div>

          <TheoremBox title="通解结构定理" opacity={v1Opacity} width={940}>
            <div style={{ fontSize: 24, lineHeight: 2.0, color: COLORS.formula }}>
              <div>
                非齐次方程{" "}
                <span style={{ color: COLORS.primaryCurve }}>y'' + Py' + Qy = f(x)</span>{" "}
                的通解 =
              </div>
              <div style={{ marginLeft: 32 }}>
                <span style={{ color: COLORS.secondaryCurve }}>对应齐次方程的通解</span>{" "}
                +{" "}
                <span style={{ color: COLORS.highlight }}>非齐次方程的一个特解</span>
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: v2Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.secondaryCurve)}>齐</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>齐次通解（含两个任意常数）</div>
              <MathFormula
                latex="Y = C_1 y_1(x) + C_2 y_2(x)"
                fontSize={40}
                color={COLORS.secondaryCurve}
              />
            </div>
          </div>

          <div style={{ opacity: v3Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.highlight)}>特</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>特解（常数变易法或待定系数法）</div>
              <MathFormula
                latex="y^* = \text{（非齐次方程的某个特定解）}"
                fontSize={36}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec07Linear2;
