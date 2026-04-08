import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { fade } from "../../utils/animationUtils";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

// 三条解曲线颜色
const CURVE_COLORS = [
  COLORS.primaryCurve,  // 蓝
  COLORS.tertiaryCurve, // 绿
  COLORS.vector,        // 黄
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

// 类型标签卡片
interface TypeCardProps {
  num: string;
  form: string;
  desc: string;
  color: string;
  opacity: number;
}

const TypeCard: React.FC<TypeCardProps> = ({ num, form, desc, color, opacity }) => (
  <div
    style={{
      opacity,
      display: "flex",
      alignItems: "center",
      gap: 20,
      padding: "14px 24px",
      border: `1.5px solid ${color}`,
      borderRadius: 10,
      backgroundColor: `${color}15`,
      width: "100%",
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: "50%",
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: COLORS.background,
        fontWeight: "bold",
        fontSize: 18,
        flexShrink: 0,
      }}
    >
      {num}
    </div>
    <div>
      <div style={{ color, fontSize: 22, fontWeight: "bold", marginBottom: 4 }}>{form}</div>
      <div style={{ color: COLORS.annotation, fontSize: 20 }}>{desc}</div>
    </div>
  </div>
);

const Sec06HighOrder: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–80 标题 ────────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 55);

  // ── Scene 2: 80–180 三类可降阶方程 ───────────────────────────────────────
  const s2Title = fade(frame, 80, 28);
  const type1Op = fade(frame, 95, 28);
  const type2Op = fade(frame, 120, 28);
  const type3Op = fade(frame, 145, 28);

  // ── Scene 3: 180–290 类型1降阶（逐次积分） ────────────────────────────────
  const s3Title  = fade(frame, 180, 28);
  const s3step1  = fade(frame, 195, 30);
  const s3step2  = fade(frame, 225, 28);
  const s3step3  = fade(frame, 253, 28);

  // ── Scene 4: 290–380 坐标系可视化 ─────────────────────────────────────────
  const coordOpacity = fade(frame, 290, 30);
  // 导函数 y' = 3x² + C₁（单条蓝色曲线）
  const derProgress = interpolate(frame, [310, 348], [0, 1], {
    extrapolateLeft: "clamp", extrapolateRight: "clamp",
  });
  // y = x³ + C₁x + C₂，3组不同初始条件（C₁,C₂）
  const solConfigs: [number, number][] = [[0, 0], [-1, 0], [1, 2]];
  const solProgress = [
    interpolate(frame, [320, 358], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [336, 372], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [352, 388], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  ];
  const legendOpacity = fade(frame, 362, 20);

  // ── Scene 5: 380–480 类型2换元 ────────────────────────────────────────────
  const v0Opacity = fade(frame, 380, 28);
  const v1Opacity = fade(frame, 402, 28);
  const v2Opacity = fade(frame, 428, 28);
  const v3Opacity = fade(frame, 454, 26);

  const scene =
    frame < 80  ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  // y'' = 6x 的解：导数 y' = 3x² + C₁
  const derivFn = (x: number) => Math.max(-10, Math.min(10, 3 * x * x));

  // y = x³ + C₁x + C₂（限幅）
  const makeSolFn = (c1: number, c2: number) => (x: number) =>
    Math.max(-9, Math.min(9, x * x * x + c1 * x + c2));

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>

      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.6"
          sectionTitle="可降阶的高阶微分方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 三类可降阶方程 ── */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, marginBottom: 4, opacity: s2Title }}>
            三类可降阶的高阶微分方程
          </div>

          <TypeCard
            num="I"
            form="y⁽ⁿ⁾ = f(x)"
            desc="右端仅含自变量 x，逐次积分降阶"
            color={COLORS.primaryCurve}
            opacity={type1Op}
          />

          <TypeCard
            num="II"
            form="y'' = f(x, y')"
            desc="不含 y，令 p = y' 化为一阶方程"
            color={COLORS.tertiaryCurve}
            opacity={type2Op}
          />

          <TypeCard
            num="III"
            form="y'' = f(y, y')"
            desc="不含 x，令 p = y'，以 y 为自变量"
            color={COLORS.vector}
            opacity={type3Op}
          />
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 类型1降阶（逐次积分） ── */}
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
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, marginBottom: 6, opacity: s3Title }}>
            类型 I：逐次积分法（以 y'' = 6x 为例）
          </div>

          {/* 步骤1 */}
          <div style={{ opacity: s3step1, display: "flex", alignItems: "center", gap: 24, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                对 y'' = 6x 积分一次
              </div>
              <MathFormula
                latex="y' = \int 6x\,\mathrm{d}x = 3x^2 + C_1"
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
                再积分一次
              </div>
              <MathFormula
                latex="y = \int (3x^2 + C_1)\,\mathrm{d}x = x^3 + C_1 x + C_2"
                fontSize={42}
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
              paddingTop: 18,
            }}
          >
            <div style={stepDot(COLORS.highlight)}>3</div>
            <div>
              <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 6 }}>
                通解（含两个任意常数 C₁, C₂）
              </div>
              <MathFormula
                latex="y = x^3 + C_1 x + C_2"
                fontSize={50}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 坐标系可视化 ── */}
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
            <span style={{ color: COLORS.primaryCurve }}>y'' = 6x</span> 的解族：
            导函数（蓝）与三条原函数曲线（绿/黄/红）
          </div>

          <CoordinateSystem
            width={900}
            height={420}
            xRange={[-2, 2]}
            yRange={[-8, 8]}
            opacity={coordOpacity}
          >
            {/* 导函数 y' = 3x²（C₁=0） */}
            <FunctionPlot
              fn={derivFn}
              color={COLORS.primaryCurve}
              drawProgress={derProgress}
              strokeWidth={2.5}
            />
            {/* 原函数族 */}
            {solConfigs.map(([c1, c2], i) => (
              <FunctionPlot
                key={`${c1}-${c2}`}
                fn={makeSolFn(c1, c2)}
                color={CURVE_COLORS[i]}
                drawProgress={solProgress[i]}
                strokeWidth={2.5}
              />
            ))}
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 28,
              opacity: legendOpacity,
              fontSize: 19,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <div style={{ color: COLORS.primaryCurve }}>— y' = 3x²（导函数）</div>
            {solConfigs.map(([c1, c2], i) => (
              <div key={i} style={{ color: CURVE_COLORS[i] }}>
                — C₁={c1}, C₂={c2}
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 类型2换元 ── */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 140px",
          }}
        >
          <div style={{ opacity: v0Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 12 }}>
              类型 II：令 p = y'，降为一阶方程
            </div>
            <MathFormula
              latex="y'' = f(x,\, y') \;\Rightarrow\; \frac{\mathrm{d}p}{\mathrm{d}x} = f(x, p)"
              fontSize={46}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: v1Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>令 p = y'，则 y'' = dp/dx</div>
              <MathFormula
                latex="p' = f(x, p) \quad\text{（一阶方程）}"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: v2Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>求解一阶方程，得 p = φ(x, C₁)</div>
              <MathFormula
                latex="y' = \varphi(x,\, C_1)"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div
            style={{
              opacity: v3Opacity,
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
              <div style={{ color: COLORS.highlight, fontSize: 22 }}>再积分，得含 C₁, C₂ 的通解</div>
              <MathFormula
                latex="y = \int \varphi(x,\, C_1)\,\mathrm{d}x + C_2"
                fontSize={44}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec06HighOrder;
