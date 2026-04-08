import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { IntegralArea } from "../../components/math/IntegralArea";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 均匀薄片（矩形区域）及质心标记
const ThinPlate: React.FC<{ opacity?: number; showCentroid?: boolean }> = ({ opacity = 1, showCentroid = false }) => {
  const { toPixel } = useCoordContext();
  const { px: x0, py: y0 } = toPixel(0, 0);
  const { px: x2, py: y1 } = toPixel(2, 1);
  const { px: cx, py: cy } = toPixel(1, 0.5);
  return (
    <g opacity={opacity}>
      <rect x={x0} y={y1} width={x2 - x0} height={y0 - y1}
        fill={COLORS.integralArea} stroke={COLORS.primaryCurve} strokeWidth={2} />
      {showCentroid && (
        <>
          <circle cx={cx} cy={cy} r={7} fill={COLORS.highlight} />
          <text x={cx + 12} y={cy - 10} fill={COLORS.highlight} fontSize={18}>质心 (1, 0.5)</text>
          <line x1={cx - 18} y1={cy} x2={cx + 18} y2={cy} stroke={COLORS.highlight} strokeWidth={2} strokeDasharray="4,3" />
          <line x1={cx} y1={cy - 18} x2={cx} y2={cy + 18} stroke={COLORS.highlight} strokeWidth={2} strokeDasharray="4,3" />
        </>
      )}
    </g>
  );
};

const Sec04Apps: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 420 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 曲面面积
  const s2Title = fade(frame, 60, 20);
  const s2Deriv = fade(frame, 82, 20);
  const s2Formula = fade(frame, 118, 20);
  const s2Note = fade(frame, 155, 20);

  // Scene 3: 质心
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 20);
  const s3Centroid = fade(frame, 230, 20);
  const s3Formula = fade(frame, 262, 20);
  const s3FillProgress = interpolate(frame, [200, 270], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Scene 4: 转动惯量
  const s4Title = fade(frame, 300, 20);
  const s4Formula1 = fade(frame, 320, 20);
  const s4Formula2 = fade(frame, 355, 20);
  const s4Note = fade(frame, 390, 20);

  // Scene 5: 总结
  const s5Op = fade(frame, 420, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十"
          chapterTitle="重积分"
          sectionNum="10.4"
          sectionTitle="重积分的应用"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 曲面面积 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s2Title }}>曲面面积</div>
          <div style={{ opacity: s2Deriv, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            曲面 z = f(x,y)，面积微元来自切平面近似：
          </div>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="S = \iint_D \sqrt{1 + z_x^2 + z_y^2}\;\mathrm{d}A"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 22 }}>
            其中 D 是曲面在 xOy 平面上的投影区域，zₓ = ∂z/∂x，zᵧ = ∂z/∂y
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 质心 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.vector, fontSize: 28, opacity: s3Title }}>
            薄片质心（面密度 ρ(x,y)）
          </div>
          <CoordinateSystem
            width={620}
            height={320}
            xRange={[-0.3, 2.5]}
            yRange={[-0.3, 1.5]}
            opacity={s3CoordOp}
          >
            <ThinPlate opacity={s3CoordOp} showCentroid={s3Centroid > 0.5} />
            <IntegralArea
              fn={x => Math.sqrt(Math.max(0, 1 - (x - 1) * (x - 1)))}
              a={0}
              b={2}
              fillColor={COLORS.primaryCurve + '55'}
              fillProgress={s3FillProgress}
            />
          </CoordinateSystem>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\bar{x} = \frac{\iint_D x\rho\,\mathrm{d}A}{\iint_D \rho\,\mathrm{d}A}, \quad \bar{y} = \frac{\iint_D y\rho\,\mathrm{d}A}{\iint_D \rho\,\mathrm{d}A}"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 转动惯量 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26, padding: "0 120px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 28, opacity: s4Title }}>转动惯量</div>
          <div style={{ opacity: s4Formula1 }}>
            <MathFormula
              latex="I_x = \iint_D y^2 \rho(x,y)\,\mathrm{d}A \quad \text{（对 x 轴）}"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Formula2 }}>
            <MathFormula
              latex="I_O = \iint_D (x^2+y^2)\rho\,\mathrm{d}A \quad \text{（对原点）}"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Note, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            物理意义：I = mr²，即质量分布离转轴越远，转动惯量越大
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="重积分应用总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>曲面面积</span>：S = ∬_D √(1+zₓ²+zᵧ²) dA</div>
              <div>• <span style={{ color: COLORS.vector }}>质心</span>：x̄ = ∬xρ dA / ∬ρ dA（均匀薄片时 ρ=常数）</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>转动惯量</span>：I = ∬r²ρ dA（r 为到转轴距离）</div>
              <div>• <span style={{ color: COLORS.highlight }}>质量</span>：M = ∬_D ρ(x,y) dA</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec04Apps;
