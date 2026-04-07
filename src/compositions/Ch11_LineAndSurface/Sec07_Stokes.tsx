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

// 斯托克斯定理的曲面示意（椭圆形曲面 + 边界曲线）
const StokesDemo: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const cx = 300;
  const cy = 160;
  return (
    <svg width={600} height={320} opacity={opacity}>
      {/* 曲面（用椭圆简化表示） */}
      <ellipse cx={cx} cy={cy} rx={200} ry={80}
        fill={COLORS.integralArea} stroke={COLORS.primaryCurve} strokeWidth={2} opacity={0.7} />
      {/* 法线向量 */}
      <line x1={cx} y1={cy} x2={cx} y2={cy - 70} stroke={COLORS.vector} strokeWidth={2.5} />
      <polygon points={`${cx},${cy - 70} ${cx - 6},${cy - 56} ${cx + 6},${cy - 56}`} fill={COLORS.vector} />
      <text x={cx + 8} y={cy - 65} fill={COLORS.vector} fontSize={16}>n</text>
      {/* 曲面标注 */}
      <text x={cx} y={cy + 10} textAnchor="middle" fill={COLORS.primaryCurve} fontSize={20} fontStyle="italic">Σ</text>
      {/* 边界曲线 L */}
      <ellipse cx={cx} cy={cy + 80} rx={200} ry={30}
        fill="none" stroke={COLORS.secondaryCurve} strokeWidth={3} strokeDasharray="8,4" />
      <text x={cx + 205} y={cy + 85} fill={COLORS.secondaryCurve} fontSize={18} fontStyle="italic">L</text>
      {/* 方向箭头 */}
      <polygon
        points={`${cx + 200},${cy + 80} ${cx + 188},${cy + 70} ${cx + 195},${cy + 90}`}
        fill={COLORS.secondaryCurve} />
    </svg>
  );
};

const Sec07Stokes: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 斯托克斯公式
  const s2Title = fade(frame, 60, 20);
  const s2DiagOp = fade(frame, 75, 25);
  const s2Formula = fade(frame, 110, 20);
  const s2Det = fade(frame, 150, 20);

  // Scene 3: 与格林公式关系
  const s3Title = fade(frame, 180, 20);
  const s3Green = fade(frame, 200, 20);
  const s3Stokes = fade(frame, 228, 20);
  const s3Note = fade(frame, 260, 20);

  // Scene 4: 旋度物理意义
  const s4Title = fade(frame, 300, 20);
  const s4Formula = fade(frame, 318, 20);
  const s4Physical = fade(frame, 355, 20);

  // Scene 5: 总结
  const s5Op = fade(frame, 390, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.7"
          sectionTitle="斯托克斯公式"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 斯托克斯公式 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            斯托克斯公式：曲线积分 ↔ 曲面积分
          </div>
          <StokesDemo opacity={s2DiagOp} />
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="\oint_L P\,\mathrm{d}x+Q\,\mathrm{d}y+R\,\mathrm{d}z = \iint_\Sigma \begin{vmatrix}\mathrm{d}y\mathrm{d}z & \mathrm{d}z\mathrm{d}x & \mathrm{d}x\mathrm{d}y\\\frac{\partial}{\partial x}&\frac{\partial}{\partial y}&\frac{\partial}{\partial z}\\P&Q&R\end{vmatrix}"
              fontSize={24}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Det, color: COLORS.annotation, fontSize: 20 }}>
            L 是曲面 Σ 的正向边界曲线
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 与格林公式关系 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>格林公式是斯托克斯公式的平面特例</div>
          <div style={{ opacity: s3Green }}>
            <MathFormula
              latex="\text{令 }R=0,\;\Sigma\text{ 在 }xOy\text{ 平面（法向量向上）}"
              fontSize={28}
              color={COLORS.annotation}
            />
          </div>
          <div style={{ opacity: s3Stokes }}>
            <MathFormula
              latex="\oint_L P\,\mathrm{d}x+Q\,\mathrm{d}y = \iint_D\left(\frac{\partial Q}{\partial x}-\frac{\partial P}{\partial y}\right)\mathrm{d}x\mathrm{d}y"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Note, color: COLORS.primaryCurve, fontSize: 22, textAlign: "center" }}>
            斯托克斯公式统一了格林公式与三维空间的旋转定理
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 旋度 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>旋度的物理意义</div>
          <div style={{ opacity: s4Formula }}>
            <MathFormula
              latex="\mathrm{curl}\,\mathbf{F} = \nabla\times\mathbf{F} = \begin{vmatrix}\mathbf{i}&\mathbf{j}&\mathbf{k}\\\frac{\partial}{\partial x}&\frac{\partial}{\partial y}&\frac{\partial}{\partial z}\\P&Q&R\end{vmatrix}"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Physical, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            旋度表示流场的旋转程度（角速度）<br />
            旋度为零 ↔ 无旋场 ↔ 存在势函数（保守场）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="斯托克斯公式总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>斯托克斯公式</span>：∮_L F·dr = ∬_Σ (curl F)·n dS</div>
              <div>• <span style={{ color: COLORS.vector }}>旋度</span>：curl F = ∇×F（旋转强度）</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>格林公式</span>：斯托克斯公式在平面上的特例（R=0）</div>
              <div>• <span style={{ color: COLORS.highlight }}>无旋场</span>：curl F = 0 则存在势函数，积分与路径无关</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec07Stokes;
