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

// 黎曼和矩形条（在坐标系内绘制）
const RiemannBars: React.FC<{ progress: number; opacity?: number }> = ({ progress, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const n = 6; // 分割成 n 条
  const bars: React.ReactNode[] = [];
  const count = Math.round(progress * n);
  for (let i = 0; i < count; i++) {
    const x0 = i * (2 / n);
    const x1 = (i + 1) * (2 / n);
    const xMid = (x0 + x1) / 2;
    const yVal = 0.5 * xMid + 0.5; // f(x,y)=0.5x+0.5 样本高度（简化）
    const { px: px0, py: py0 } = toPixel(x0, 0);
    const { px: px1, py: py1 } = toPixel(x1, yVal);
    bars.push(
      <rect
        key={i}
        x={px0}
        y={py1}
        width={px1 - px0 - 2}
        height={py0 - py1}
        fill={COLORS.primaryCurve}
        opacity={0.4}
        stroke={COLORS.primaryCurve}
        strokeWidth={1}
      />
    );
  }
  return <g opacity={opacity}>{bars}</g>;
};

// 区域 D 轮廓（矩形 [0,2]×[0,2]）
const RegionD: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const { px: x0, py: y0 } = toPixel(0, 0);
  const { px: x2, py: y2 } = toPixel(2, 2);
  return (
    <g opacity={opacity}>
      <rect
        x={x0}
        y={y2}
        width={x2 - x0}
        height={y0 - y2}
        fill={COLORS.integralArea}
        stroke={COLORS.primaryCurve}
        strokeWidth={2}
      />
      <text x={(x0 + x2) / 2} y={(y0 + y2) / 2} textAnchor="middle" fill={COLORS.primaryCurve} fontSize={22} fontStyle="italic">D</text>
    </g>
  );
};

// 对称性示意：左侧蓝色（正）右侧粉色（负）
const SymmetryDemo: React.FC<{ progress: number }> = ({ progress }) => {
  const { toPixel } = useCoordContext();
  const leftOpacity = interpolate(progress, [0, 0.5], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rightOpacity = interpolate(progress, [0.5, 1], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const { px: cx, py: cy } = toPixel(0, 0);
  const { px: lx, py: ly } = toPixel(-2, 2);
  const { px: rx, py: ry } = toPixel(2, 2);
  return (
    <g>
      {/* 左侧区域（负值，粉色） */}
      <rect x={lx} y={ly} width={cx - lx} height={cy - ly} fill={COLORS.secondaryCurve} opacity={0.35 * rightOpacity} />
      {/* 右侧区域（正值，蓝色） */}
      <rect x={cx} y={ry} width={rx - cx} height={cy - ry} fill={COLORS.primaryCurve} opacity={0.35 * leftOpacity} />
      <text x={(lx + cx) / 2} y={(cy + ly) / 2} textAnchor="middle" fill={COLORS.secondaryCurve} fontSize={20} opacity={rightOpacity}>-∬f dσ</text>
      <text x={(cx + rx) / 2} y={(cy + ry) / 2} textAnchor="middle" fill={COLORS.primaryCurve} fontSize={20} opacity={leftOpacity}>+∬f dσ</text>
    </g>
  );
};

const Sec01Concept: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1 : frame < 180 ? 2 : frame < 300 ? 3 : frame < 390 ? 4 : 5;

  // Scene 1
  const s1Op = fade(frame, 0);

  // Scene 2: 60-180 黎曼和动画
  const s2Title = fade(frame, 60, 20);
  const s2CoordOp = fade(frame, 70, 20);
  const barsProgress = interpolate(frame, [80, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s2Formula = fade(frame, 150, 20);

  // Scene 3: 180-300 对称性
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 20);
  const symProgress = interpolate(frame, [210, 285], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Formula = fade(frame, 270, 20);

  // Scene 4: 300-390 性质公式
  const s4Title = fade(frame, 300, 20);
  const s4P1 = fade(frame, 318, 20);
  const s4P2 = fade(frame, 342, 20);
  const s4P3 = fade(frame, 362, 20);

  // Scene 5: 390-480 总结
  const s5Op = fade(frame, 390, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十"
          chapterTitle="重积分"
          sectionNum="10.1"
          sectionTitle="二重积分的概念与性质"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 曲顶柱体可视化 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            曲顶柱体：用黎曼和逼近二重积分
          </div>
          <CoordinateSystem
            width={700}
            height={380}
            xRange={[-0.5, 2.8]}
            yRange={[-0.3, 2.5]}
            opacity={s2CoordOp}
          >
            <IntegralArea
              fn={x => x * x}
              a={0}
              b={2}
              fillColor={COLORS.primaryCurve + '66'}
              fillProgress={barsProgress}
            />
            <RegionD opacity={s2CoordOp} />
            <RiemannBars progress={barsProgress} opacity={s2CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="\sum_{i} f(\xi_i,\eta_i)\Delta\sigma_i \;\xrightarrow{\lambda\to 0}\; \iint_D f(x,y)\,\mathrm{d}\sigma"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 对称性 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>
            利用对称性化简：D 关于 y 轴对称，f 为奇函数
          </div>
          <CoordinateSystem
            width={700}
            height={380}
            xRange={[-2.8, 2.8]}
            yRange={[-0.5, 2.8]}
            opacity={s3CoordOp}
          >
            <SymmetryDemo progress={symProgress} />
          </CoordinateSystem>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="f(-x,y)=-f(x,y) \;\Rightarrow\; \iint_D f(x,y)\,\mathrm{d}\sigma = 0"
              fontSize={34}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 性质公式 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s4Title }}>二重积分基本性质</div>
          <div style={{ opacity: s4P1 }}>
            <MathFormula
              latex="\text{线性性：}\;\iint_D [\alpha f + \beta g]\,\mathrm{d}\sigma = \alpha\iint_D f\,\mathrm{d}\sigma + \beta\iint_D g\,\mathrm{d}\sigma"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4P2 }}>
            <MathFormula
              latex="\text{比较定理：}\;f \leq g \;\Rightarrow\; \iint_D f\,\mathrm{d}\sigma \leq \iint_D g\,\mathrm{d}\sigma"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4P3 }}>
            <MathFormula
              latex="\text{估值定理：}\;m\sigma(D)\leq \iint_D f\,\mathrm{d}\sigma \leq M\sigma(D)"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="二重积分概念总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>定义</span>：将积分区域 D 分割为小区域，取样点值乘面积求和再取极限</div>
              <div>• <span style={{ color: COLORS.vector }}>几何意义</span>：f≥0 时等于曲顶柱体体积</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>对称性</span>：D 关于坐标轴对称时，奇函数积分为0，偶函数积分加倍</div>
              <div>• <span style={{ color: COLORS.highlight }}>可加性</span>：D = D₁ ∪ D₂ 时，∬_D = ∬_(D₁) + ∬_(D₂)</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec01Concept;
