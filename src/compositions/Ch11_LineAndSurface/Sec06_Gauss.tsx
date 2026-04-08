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

// 散度示意（正散度=源，负散度=汇）
const DivergenceDemo: React.FC<{ opacity?: number; type?: "source" | "sink" }> = ({
  opacity = 1,
  type = "source",
}) => {
  const cx = 200;
  const cy = 160;
  const r = 50;
  const arrows: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i * Math.PI * 2) / 8;
    const x1 = cx + (type === "source" ? r * 0.5 : r * 1.2) * Math.cos(angle);
    const y1 = cy - (type === "source" ? r * 0.5 : r * 1.2) * Math.sin(angle);
    const x2 = cx + (type === "source" ? r * 1.2 : r * 0.5) * Math.cos(angle);
    const y2 = cy - (type === "source" ? r * 1.2 : r * 0.5) * Math.sin(angle);
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / len;
    const ny = dy / len;
    arrows.push(
      <g key={i}>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={type === "source" ? COLORS.primaryCurve : COLORS.secondaryCurve}
          strokeWidth={2.5} />
        <polygon
          points={`${x2},${y2} ${x2 - 8 * nx - 5 * ny},${y2 - 8 * ny + 5 * nx} ${x2 - 8 * nx + 5 * ny},${y2 - 8 * ny - 5 * nx}`}
          fill={type === "source" ? COLORS.primaryCurve : COLORS.secondaryCurve}
        />
      </g>
    );
  }

  return (
    <g opacity={opacity}>
      {arrows}
      <circle cx={cx} cy={cy} r={12}
        fill={type === "source" ? COLORS.primaryCurve : COLORS.secondaryCurve}
        opacity={0.8} />
      <text x={cx} y={cy + 40} textAnchor="middle"
        fill={type === "source" ? COLORS.primaryCurve : COLORS.secondaryCurve}
        fontSize={18}>
        {type === "source" ? "源 (div F > 0)" : "汇 (div F < 0)"}
      </text>
    </g>
  );
};

const Sec06Gauss: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 高斯公式
  const s2Title = fade(frame, 60, 20);
  const s2Sketch = fade(frame, 75, 25);
  const s2Formula = fade(frame, 110, 20);
  const s2Note = fade(frame, 148, 20);

  // Scene 3: 散度物理意义
  const s3Title = fade(frame, 180, 20);
  const s3SourceOp = fade(frame, 198, 25);
  const s3SinkOp = fade(frame, 245, 25);
  const s3DivFormula = fade(frame, 278, 20);

  // Scene 4: 例题
  const s4Title = fade(frame, 300, 20);
  const s4Setup = fade(frame, 318, 20);
  const s4Div = fade(frame, 345, 20);
  const s4Integral = fade(frame, 365, 20);
  const s4Result = fade(frame, 375, 20);

  // Scene 5: 总结
  const s5Op = fade(frame, 390, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.6"
          sectionTitle="高斯公式"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 高斯公式 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 120px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>高斯公式：曲面积分 ↔ 体积分</div>
          <div style={{ opacity: s2Sketch, display: "flex", gap: 20, alignItems: "center" }}>
            <svg width={200} height={200} opacity={s2Sketch}>
              {/* 球体示意 */}
              <ellipse cx={100} cy={110} rx={70} ry={40} fill={COLORS.integralArea} stroke={COLORS.primaryCurve} strokeWidth={2} />
              <ellipse cx={100} cy={90} rx={70} ry={80} fill="none" stroke={COLORS.primaryCurve} strokeWidth={2.5} />
              {/* 外法线箭头 */}
              <line x1={100} y1={12} x2={100} y2={0} stroke={COLORS.vector} strokeWidth={2} />
              <polygon points="100,0 94,12 106,12" fill={COLORS.vector} />
              <text x={108} y={8} fill={COLORS.vector} fontSize={14}>n (外法线)</text>
              <text x={80} y={115} fill={COLORS.primaryCurve} fontSize={18} fontStyle="italic">Ω</text>
              <text x={148} y={60} fill={COLORS.primaryCurve} fontSize={16} fontStyle="italic">Σ</text>
            </svg>
          </div>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="\oiint_\Sigma P\,\mathrm{d}y\mathrm{d}z + Q\,\mathrm{d}z\mathrm{d}x + R\,\mathrm{d}x\mathrm{d}y = \iiint_\Omega \left(\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}\right)\mathrm{d}V"
              fontSize={26}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 20 }}>
            Σ 是 Ω 的外表面，正方向为外法线方向（朝外）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 散度物理意义 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20 }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>
            散度的物理意义：流体源与汇
          </div>
          <div style={{ display: "flex", gap: 80 }}>
            <svg width={400} height={320}>
              <DivergenceDemo opacity={s3SourceOp} type="source" />
            </svg>
            <svg width={400} height={320}>
              <DivergenceDemo opacity={s3SinkOp} type="sink" />
            </svg>
          </div>
          <div style={{ opacity: s3DivFormula }}>
            <MathFormula
              latex="\nabla\cdot\vec{F} = \frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z}"
              fontSize={34}
              color={COLORS.vector}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 例题 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 120px" }}>
          <div style={{ color: COLORS.highlight, fontSize: 24, opacity: s4Title }}>
            例题：∯_Σ x²dydz + y²dzdx + z²dxdy，Σ 为单位球面（外侧）
          </div>
          <div style={{ opacity: s4Setup }}>
            <MathFormula
              latex="P=x^2,\; Q=y^2,\; R=z^2"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Div }}>
            <MathFormula
              latex="\frac{\partial P}{\partial x}+\frac{\partial Q}{\partial y}+\frac{\partial R}{\partial z} = 2x+2y+2z"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Integral }}>
            <MathFormula
              latex="\iiint_\Omega 2(x+y+z)\,\mathrm{d}V = 0 \quad \text{（对称性，奇函数）}"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Result, padding: "8px 24px", border: `2px solid ${COLORS.highlight}`, borderRadius: 8 }}>
            <MathFormula latex="= 0" fontSize={44} color={COLORS.highlight} />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="高斯公式总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>高斯公式</span>：∯_Σ F·n dS = ∭_Ω div F dV</div>
              <div>• <span style={{ color: COLORS.vector }}>散度</span>：div F = ∂P/∂x + ∂Q/∂y + ∂R/∂z</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>条件</span>：Σ 是封闭曲面，正方向为外法线</div>
              <div>• <span style={{ color: COLORS.highlight }}>应用</span>：化曲面积分为体积分，利用对称性简化计算</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec06Gauss;
