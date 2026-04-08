import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { fade } from "../../utils/animationUtils";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { TheoremBox } from "../../components/ui/TheoremBox";

// 同心圆颜色
const CIRCLE_COLORS = [
  COLORS.primaryCurve,  // C=1, r=1
  COLORS.tertiaryCurve, // C=4, r=2
  COLORS.vector,        // C=9, r=3
];

const CIRCLE_RADII = [1, 2, 3];
const CIRCLE_LABELS = ["C = 1", "C = 4", "C = 9"];

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

// 同心椭圆（数学上的圆，像素空间可能为椭圆）
interface CircleArcProps {
  radius: number;
  color: string;
  drawProgress: number;
  strokeWidth?: number;
}

const CircleArc: React.FC<CircleArcProps> = ({
  radius,
  color,
  drawProgress,
  strokeWidth = 2.8,
}) => {
  const { toPixel } = useCoordContext();

  const center  = toPixel(0, 0);
  const rightPt = toPixel(radius, 0);
  const topPt   = toPixel(0, radius);

  const rx = Math.abs(rightPt.px - center.px);
  const ry = Math.abs(topPt.py  - center.py);

  // 用大数保证 dasharray 覆盖整个周长
  const totalLen = 10000;
  const dashLen  = totalLen * drawProgress;

  return (
    <ellipse
      cx={center.px}
      cy={center.py}
      rx={rx}
      ry={ry}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={`${dashLen} ${totalLen}`}
      strokeDashoffset={0}
      strokeLinecap="round"
    />
  );
};

// 坐标系内标注文字
interface CircleLabelProps {
  radius: number;
  label: string;
  color: string;
  opacity: number;
}

const CircleLabel: React.FC<CircleLabelProps> = ({ radius, label, color, opacity }) => {
  const { toPixel } = useCoordContext();
  // 标注在圆的右上角附近
  const pt = toPixel(radius * 0.72, radius * 0.72);

  return (
    <text
      x={pt.px}
      y={pt.py}
      fill={color}
      fontSize={16}
      opacity={opacity}
      fontFamily="sans-serif"
      fontWeight="bold"
    >
      {label}
    </text>
  );
};

const Sec05Exact: React.FC = () => {
  const frame = useCurrentFrame();

  // ── Scene 1: 0–80 标题 ────────────────────────────────────────────────────
  const titleOpacity = fade(frame, 0, 55);

  // ── Scene 2: 80–180 定义 ──────────────────────────────────────────────────
  const eqOpacity   = fade(frame, 80, 35);
  const condOpacity = fade(frame, 115, 35);
  const thmOpacity  = fade(frame, 145, 33);

  // ── Scene 3: 180–290 求解方法 ─────────────────────────────────────────────
  const s3Title  = fade(frame, 180, 28);
  const s3step1  = fade(frame, 195, 30);
  const s3step2  = fade(frame, 225, 30);
  const s3step3  = fade(frame, 255, 28);

  // ── Scene 4: 290–380 坐标系可视化（等势线） ───────────────────────────────
  const coordOpacity = fade(frame, 290, 28);
  const circleProgress = [
    interpolate(frame, [310, 348], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [326, 364], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
    interpolate(frame, [342, 380], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }),
  ];
  const labelOpacity = fade(frame, 360, 20);

  // ── Scene 5: 380–480 验证步骤 ─────────────────────────────────────────────
  const v0Opacity = fade(frame, 380, 28);
  const v1Opacity = fade(frame, 400, 28);
  const v2Opacity = fade(frame, 425, 28);
  const v3Opacity = fade(frame, 450, 28);

  const scene =
    frame < 80  ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>

      {/* ── Scene 1: 标题 ── */}
      {scene === 1 && (
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.5"
          sectionTitle="全微分方程"
          opacity={titleOpacity}
        />
      )}

      {/* ── Scene 2: 定义 ── */}
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
          {/* 方程形式 */}
          <div
            style={{
              opacity: eqOpacity,
              padding: "24px 56px",
              border: `2px solid ${COLORS.primaryCurve}`,
              borderRadius: 12,
              backgroundColor: COLORS.theoremBg,
            }}
          >
            <MathFormula
              latex="P(x,y)\,\mathrm{d}x + Q(x,y)\,\mathrm{d}y = 0"
              fontSize={62}
              color={COLORS.formula}
            />
          </div>

          {/* 全微分条件 */}
          <div
            style={{
              opacity: condOpacity,
              display: "flex",
              gap: 40,
              alignItems: "center",
              fontSize: 26,
            }}
          >
            <div style={{ color: COLORS.annotation }}>全微分条件：</div>
            <div
              style={{
                padding: "12px 32px",
                border: `2px solid ${COLORS.highlight}`,
                borderRadius: 8,
                backgroundColor: "rgba(255,107,107,0.1)",
              }}
            >
              <MathFormula
                latex="\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x}"
                fontSize={46}
                color={COLORS.highlight}
              />
            </div>
          </div>

          {/* 定理 */}
          <TheoremBox title="全微分方程" opacity={thmOpacity} width={920}>
            <div style={{ fontSize: 24, lineHeight: 2.0, color: COLORS.formula }}>
              <div>
                若存在函数 <span style={{ color: COLORS.primaryCurve }}>u(x,y)</span>，使得
              </div>
              <div>
                <MathFormula
                  latex="\mathrm{d}u = P\,\mathrm{d}x + Q\,\mathrm{d}y"
                  fontSize={36}
                  color={COLORS.highlight}
                />
              </div>
              <div>
                则方程 Pdx + Qdy = 0 的解为{" "}
                <span style={{ color: COLORS.highlight }}>u(x,y) = C</span>
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}

      {/* ── Scene 3: 求解方法 ── */}
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
            求解全微分方程：构造势函数 u(x,y)
          </div>

          {/* 步骤1 */}
          <div style={{ opacity: s3step1, display: "flex", alignItems: "center", gap: 24, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
                验证全微分条件 ∂P/∂y = ∂Q/∂x
              </div>
              <MathFormula
                latex="\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x}"
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
                对 x 积分求 u（固定 y）
              </div>
              <MathFormula
                latex="u(x,y) = \int P(x,y)\,\mathrm{d}x + \varphi(y)"
                fontSize={40}
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
                用 ∂u/∂y = Q 定出 φ(y)，解为 u(x,y) = C
              </div>
              <MathFormula
                latex="\frac{\partial u}{\partial y} = Q(x,y) \;\Rightarrow\; u(x,y) = C"
                fontSize={40}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 4: 坐标系可视化（等势线 x²+y²=C） ── */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 18,
          }}
        >
          <div style={{ color: COLORS.formula, fontSize: 24, opacity: coordOpacity, marginBottom: 4 }}>
            等势线（等值线）：<span style={{ color: COLORS.primaryCurve }}>u = x² + y² = C</span>{" "}
            的解族为同心圆
          </div>

          <CoordinateSystem
            width={880}
            height={420}
            xRange={[-3.5, 3.5]}
            yRange={[-3.5, 3.5]}
            opacity={coordOpacity}
          >
            {CIRCLE_RADII.map((r, i) => (
              <CircleArc
                key={r}
                radius={r}
                color={CIRCLE_COLORS[i]}
                drawProgress={circleProgress[i]}
                strokeWidth={2.8}
              />
            ))}
            {CIRCLE_RADII.map((r, i) => (
              <CircleLabel
                key={`lbl-${r}`}
                radius={r}
                label={CIRCLE_LABELS[i]}
                color={CIRCLE_COLORS[i]}
                opacity={labelOpacity}
              />
            ))}
          </CoordinateSystem>

          <div
            style={{
              display: "flex",
              gap: 32,
              opacity: labelOpacity,
              fontSize: 21,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {CIRCLE_RADII.map((r, i) => (
              <div key={r} style={{ color: CIRCLE_COLORS[i] }}>
                — {CIRCLE_LABELS[i]}（r = {r}）
              </div>
            ))}
          </div>
        </AbsoluteFill>
      )}

      {/* ── Scene 5: 验证步骤 ── */}
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
            <div style={{ color: COLORS.primaryCurve, fontSize: 28, marginBottom: 14 }}>
              例：验证 2x dx + 2y dy = 0 为全微分方程
            </div>
            <MathFormula
              latex="2x\,\mathrm{d}x + 2y\,\mathrm{d}y = 0"
              fontSize={52}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: v1Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>1</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>P = 2x，Q = 2y</div>
              <MathFormula
                latex="\frac{\partial P}{\partial y} = 0 = \frac{\partial Q}{\partial x}"
                fontSize={40}
                color={COLORS.formula}
              />
            </div>
          </div>

          <div style={{ opacity: v2Opacity, display: "flex", alignItems: "center", gap: 22, width: "100%" }}>
            <div style={stepDot(COLORS.primaryCurve)}>2</div>
            <div>
              <div style={{ color: COLORS.annotation, fontSize: 22 }}>条件满足，构造 u</div>
              <MathFormula
                latex="u = \int 2x\,\mathrm{d}x = x^2 + \varphi(y)"
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
              <div style={{ color: COLORS.highlight, fontSize: 22 }}>
                由 ∂u/∂y = 2y 得 φ'(y) = 2y，φ = y²，通解
              </div>
              <MathFormula
                latex="x^2 + y^2 = C"
                fontSize={52}
                color={COLORS.highlight}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec05Exact;
