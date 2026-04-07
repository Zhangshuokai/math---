import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 等比级数部分和动画（在数轴上逐步逼近 1）
const GeomSeriesAnim: React.FC<{ stepCount: number; opacity?: number }> = ({ stepCount, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const segments: React.ReactNode[] = [];
  let pos = 0;
  for (let n = 1; n <= stepCount; n++) {
    const step = Math.pow(0.5, n);
    const { px: x0 } = toPixel(pos, 0);
    const { px: x1 } = toPixel(pos + step, 0);
    const { py: y0 } = toPixel(0, 0);
    const hue = (n * 40) % 360;
    segments.push(
      <g key={n}>
        <line x1={x0} y1={y0} x2={x1} y2={y0}
          stroke={`hsl(${hue},80%,60%)`} strokeWidth={6} />
        <circle cx={x1} cy={y0} r={5} fill={`hsl(${hue},80%,60%)`} />
      </g>
    );
    pos += step;
  }
  // 标记 S=1
  const { px: px1 } = toPixel(1, 0);
  const { py: py0 } = toPixel(0, 0);
  return (
    <g opacity={opacity}>
      {segments}
      <line x1={px1} y1={py0 - 20} x2={px1} y2={py0 + 20}
        stroke={COLORS.highlight} strokeWidth={2} strokeDasharray="4,3" />
      <text x={px1} y={py0 - 28} textAnchor="middle" fill={COLORS.highlight} fontSize={18}>S=1</text>
    </g>
  );
};

// 调和级数柱状图
const HarmonicBars: React.FC<{ barCount: number; opacity?: number }> = ({ barCount, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const bars: React.ReactNode[] = [];
  let sum = 0;
  for (let n = 1; n <= barCount; n++) {
    sum += 1 / n;
    const { px: x0 } = toPixel(n - 0.4, 0);
    const { px: x1 } = toPixel(n + 0.4, 0);
    const { py: py0 } = toPixel(0, 0);
    const { py: pyS } = toPixel(0, sum);
    bars.push(
      <rect key={n} x={x0} y={pyS} width={x1 - x0} height={py0 - pyS}
        fill={COLORS.secondaryCurve} opacity={0.5}
        stroke={COLORS.secondaryCurve} strokeWidth={1} />
    );
  }
  return <g opacity={opacity}>{bars}</g>;
};

const Sec01Concept: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 等比级数收敛
  const s2Title = fade(frame, 60, 20);
  const s2CoordOp = fade(frame, 75, 20);
  const stepCount = Math.round(interpolate(frame, [88, 165], [1, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const s2Formula = fade(frame, 155, 20);

  // Scene 3: 调和级数发散
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 20);
  const barCount = Math.round(interpolate(frame, [208, 285], [1, 10], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const s3Note = fade(frame, 275, 20);

  // Scene 4: 必要条件
  const s4Title = fade(frame, 300, 20);
  const s4Cond = fade(frame, 318, 20);
  const s4Props = fade(frame, 348, 20);
  const s4Warn = fade(frame, 372, 18);

  // Scene 5: 总结
  const s5Op = fade(frame, 390, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {scene === 1 && (
        <TitleCard
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.1"
          sectionTitle="常数项级数的概念与性质"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 等比级数收敛 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            等比级数 ∑(1/2)ⁿ 的部分和趋向 1（收敛）
          </div>
          <CoordinateSystem
            width={700}
            height={200}
            xRange={[-0.1, 1.2]}
            yRange={[-0.5, 0.5]}
            showGrid={false}
            opacity={s2CoordOp}
          >
            <GeomSeriesAnim stepCount={stepCount} opacity={s2CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="\sum_{n=1}^{\infty}\frac{1}{2^n} = \frac{1}{2}+\frac{1}{4}+\frac{1}{8}+\cdots = 1"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 调和级数发散 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s3Title }}>
            调和级数 ∑1/n 的部分和趋向 ∞（发散）
          </div>
          <CoordinateSystem
            width={700}
            height={320}
            xRange={[0, 11]}
            yRange={[0, 3.5]}
            opacity={s3CoordOp}
          >
            <HarmonicBars barCount={barCount} opacity={s3CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s3Note }}>
            <MathFormula
              latex="\sum_{n=1}^{\infty}\frac{1}{n} = 1+\frac{1}{2}+\frac{1}{3}+\cdots = +\infty"
              fontSize={32}
              color={COLORS.secondaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 必要条件与性质 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s4Title }}>级数收敛的必要条件与基本性质</div>
          <div style={{ opacity: s4Cond }}>
            <MathFormula
              latex="\text{必要条件：}\sum u_n\text{ 收敛} \;\Rightarrow\; \lim_{n\to\infty} u_n = 0"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Props, color: COLORS.annotation, fontSize: 22, lineHeight: 1.9 }}>
            <div>• 线性性：∑(au_n+bv_n) = a∑u_n + b∑v_n（若两级数均收敛）</div>
            <div>• 可加性：改变有限项不影响级数的收敛性</div>
          </div>
          <div style={{ opacity: s4Warn, padding: "8px 24px", border: `1px solid ${COLORS.highlight}`, borderRadius: 8 }}>
            <span style={{ color: COLORS.highlight, fontSize: 20 }}>
              注意：u_n→0 是必要条件但不充分（调和级数反例）
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="常数项级数概念总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>定义</span>：部分和 Sₙ = u₁+u₂+...+uₙ 的极限（若存在）为级数的和</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>等比级数</span>：|q|{"<"}1 收敛，和为 a/(1-q)；|q|≥1 发散</div>
              <div>• <span style={{ color: COLORS.vector }}>必要条件</span>：收敛则通项→0（反之不成立）</div>
              <div>• <span style={{ color: COLORS.highlight }}>调和级数</span>：∑1/n 发散（通项→0 但和为∞）</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec01Concept;
