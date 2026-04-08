import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { fade } from "../../utils/animationUtils";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

// 三条曲线颜色：蓝、绿、黄
const CURVE_COLORS = [
  COLORS.primaryCurve,  // #61dafb 蓝
  COLORS.tertiaryCurve, // #50fa7b 绿
  COLORS.vector,        // #ffd700 黄
];

// 步骤编号圆点样式
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

const Sec03Homogeneous: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–90 标题 ────────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 60);

  // ── Scene 2: 90–200 定义 ──────────────────────────────────────────────────
  const eqOpacity    = fade(frame, 90, 40);
  const annOpacity   = fade(frame, 125, 40);
  const thmOpacity   = fade(frame, 150, 40);

  // ── Scene 3: 200–300 换元推导（3步） ─────────────────────────────────────
  const s3Title  = fade(frame, 200, 25);
  const s3step1  = fade(frame, 210, 30);
  const s3step2  = fade(frame, 240, 28);
  const s3step3  = fade(frame, 268, 28);

  // ── Scene 4: 300–390 坐标系可视化 ─────────────────────────────────────────
  const coordOpacity = fade(frame, 300, 30);
  const cValues = [-1, 1, 2];
  const curveProgress = [
    interpolate(frame, [320, 362], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [336, 378], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [352, 394], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  ];
  const legendOpacity = fade(frame, 370, 20);

  // ── Scene 5: 390–480 具体例子 ─────────────────────────────────────────────
  const ex0Opacity = fade(frame, 390, 30);
  const ex1Opacity = fade(frame, 412, 30);
  const ex2Opacity = fade(frame, 434, 28);
  const ex3Opacity = fade(frame, 456, 24);

  const scene =
    frame < 90  ? 1
    : frame < 200 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  // 解族 y = C·x（dy/dx = y/x 的通解），限幅避免溢出
  const makeHomFn = (C: number) => (x: number) =>
    Math.max(-4, Math.min(4, C * x));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>

      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.3"
          sectionTitle="齐次方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 方程定义 ── */}
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
          {/* 方程框 */}
          <div
            style={{
              opacity: eqOpacity,
              padding: "24px 64px",
              border: `2px solid ${COLORS.primaryCurve}`,
              borderRadius: 12,
              backgroundColor: COLORS.theoremBg,
            }}
          >
            <MathFormula
              latex="\frac{\mathrm{d}y}{\mathrm{d}x} = f\!\left(\frac{y}{x}\right)"
              fontSize={72}
              color={COLORS.formula}
            />
          </div>

          {/* 说明文字 */}
          <div style={{ opacity: annOpacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 28, marginBottom: 16 }}>
              方程右端可以表示为{" "}
              <span style={{ color: COLORS.primaryCurve }}>y/x 的函数</span>
              ，即为<span style={{ color: COLORS.highlight }}>齐次方程</span>
            </div>
            <div style={{ color: COLORS.annotation, fontSize: 24 }}>
              例：<span style={{ color: COLORS.secondaryCurve }}>dy/dx = y²/x²</span>，
              <span style={{ color: COLORS.secondaryCurve }}>  dy/dx = sin(y/x)</span>，
              均属齐次型
            </div>
          </div>

          {/* 定理框 */}
          <TheoremBox title="齐次方程判断" opacity={thmOpacity} width={920}>
            <div style={{ fontSize: 24, lineHeight: 2.0, color: COLORS.formula }}>
              <div>
                若 <span style={{ color: COLORS.primaryCurve }}>M(x,y)dx + N(x,y)dy = 0</span>
                {" "}中 M, N 均为 n 次齐次函数，
              </div>
              <div>
                则方程可化为{" "}
                <span style={{ color: COLORS.highlight }}>dy/dx = f(y/x)</span>{" "}
                的形式
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 换元推导 ── */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 140px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, marginBottom: 8, opacity: s3Title }}>
            换元法求解：令 <span style={{ color: COLORS.highlight }}>u = y/x</span>
          </div>

          {/* 步骤1 */}
          <div style={{ opacity: s3step1, display: "flex", alignItems: "center", gap: 24, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                令 u = y/x，则 y = ux
              </div>
              <MathFormula
                latex="u = \frac{y}{x} \implies y = ux"
                fontSize={44}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 步骤2 */}
          <div style={{ opacity: s3step2, display: "flex", alignItems: "center", gap: 24, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                对 y = ux 两边对 x 求导
              </div>
              <MathFormula
                latex="y' = u + x\frac{\mathrm{d}u}{\mathrm{d}x}"
                fontSize={44}
                color={COLORS.formula}
              />
            </div>
          </div>

          {/* 步骤3 */}
          <div
            style={{
              opacity: s3step3,
              display: "flex",
              alignItems: "center",
              gap: 24,
              width: "100%",
              borderTop: `2px solid ${COLORS.highlight}`,
              paddingTop: 20,
            }}
          >
            <div style={stepDot(COLORS.highlight)}>3</div>
            <div>
              <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 6 }}>
                代入原方程，化为可分离变量型
              </div>
              <MathFormula
                latex="x\frac{\mathrm{d}u}{\mathrm{d}x} = f(u) - u \;\Longrightarrow\; \frac{\mathrm{d}u}{f(u)-u} = \frac{\mathrm{d}x}{x}"
                fontSize={38}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 坐标系可视化（解族） ── */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 26, opacity: coordOpacity, marginBottom: 4 }}>
            解族示例：<span style={{ color: COLORS.primaryCurve }}>dy/dx = y/x</span>{" "}
            的通解为过原点的直线族 y = Cx
          </div>

          <CoordinateSystem
            width={900}
            height={420}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            opacity={coordOpacity}
          >
            {cValues.map((C, i) => (
              <FunctionPlot
                key={C}
                fn={makeHomFn(C)}
                color={CURVE_COLORS[i]}
                drawProgress={curveProgress[i]}
                strokeWidth={2.8}
              />
            ))}
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 36,
              opacity: legendOpacity,
              fontSize: 22,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {cValues.map((C, i) => (
              <div key={C} style={{ color: CURVE_COLORS[i] }}>
                — y = {C}x &nbsp;(C={C})
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 具体例题 ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 26,
            padding: "0 140px",
          }}
        >
          <div style={{ opacity: ex0Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 14 }}>
              例题：求 dy/dx = (y/x) + (y/x)² 的通解
            </div>
            <MathFormula
              latex="\frac{\mathrm{d}y}{\mathrm{d}x} = \frac{y}{x} + \left(\frac{y}{x}\right)^{\!2}"
              fontSize={52}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: ex1Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>令 u = y/x，代入方程</div>
              <MathFormula
                latex="u + x\frac{\mathrm{d}u}{\mathrm{d}x} = u + u^2 \;\Longrightarrow\; x\frac{\mathrm{d}u}{\mathrm{d}x} = u^2"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: ex2Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>分离变量并积分</div>
              <MathFormula
                latex="\int \frac{\mathrm{d}u}{u^2} = \int \frac{\mathrm{d}x}{x} \;\Longrightarrow\; -\frac{1}{u} = \ln|x| + C_1"
                fontSize={38}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div
            style={{
              opacity: ex3Opacity,
              display: "flex",
              alignItems: "center",
              gap: 22,
              width: "100%",
              borderTop: `2px solid ${COLORS.highlight}`,
              paddingTop: 18,
            }}
          >
            <div style={stepDot(COLORS.highlight)}>3</div>
            <div>
              <div style={{ color: COLORS.highlight, fontSize: 22 }}>回代 u = y/x，得通解</div>
              <MathFormula
                latex="y = -\frac{x}{\ln|x| + C}"
                fontSize={48}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec03Homogeneous;
