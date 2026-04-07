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

// 绘制曲线 L（半椭圆）及小段分割
const CurveL: React.FC<{ segmentCount: number; opacity?: number }> = ({ segmentCount, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  // 用参数化 x=2cosθ, y=sinθ，θ 从 0 到 π
  const N = 80;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI;
    pts.push({ x: 2 * Math.cos(t), y: Math.sin(t) });
  }
  const pathD = pts
    .map((p, i) => {
      const { px, py } = toPixel(p.x, p.y);
      return `${i === 0 ? "M" : "L"}${px},${py}`;
    })
    .join(" ");

  // 小段分割点（高亮）
  const segPts: React.ReactNode[] = [];
  for (let k = 0; k <= segmentCount; k++) {
    const t = (k / segmentCount) * Math.PI;
    const { px, py } = toPixel(2 * Math.cos(t), Math.sin(t));
    segPts.push(<circle key={k} cx={px} cy={py} r={4} fill={COLORS.highlight} />);
  }

  return (
    <g opacity={opacity}>
      <path d={pathD} fill="none" stroke={COLORS.primaryCurve} strokeWidth={3} />
      {segPts}
      {/* 起终点标注 */}
      <text x={toPixel(2, 0).px + 8} y={toPixel(2, 0).py + 4} fill={COLORS.annotation} fontSize={16}>A</text>
      <text x={toPixel(-2, 0).px - 18} y={toPixel(-2, 0).py + 4} fill={COLORS.annotation} fontSize={16}>B</text>
    </g>
  );
};

// 单位圆曲线（对称性例题）
const UnitCircle: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  const edge = toPixel(1, 0);
  const pxR = Math.abs(edge.px - center.px);
  return (
    <g opacity={opacity}>
      <circle cx={center.px} cy={center.py} r={pxR} fill="none" stroke={COLORS.secondaryCurve} strokeWidth={3} />
      <text x={center.px + pxR + 8} y={center.py + 5} fill={COLORS.secondaryCurve} fontSize={18}>L: x²+y²=1</text>
    </g>
  );
};

const Sec01Line1: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 定义动画
  const s2Title = fade(frame, 60, 20);
  const s2CoordOp = fade(frame, 75, 20);
  const segCount = Math.round(interpolate(frame, [90, 160], [2, 8], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const s2Formula = fade(frame, 155, 20);

  // Scene 3: 参数化计算方法
  const s3Title = fade(frame, 180, 20);
  const s3Param = fade(frame, 198, 20);
  const s3ds = fade(frame, 228, 20);
  const s3Formula = fade(frame, 258, 20);

  // Scene 4: 例题
  const s4Title = fade(frame, 300, 20);
  const s4Setup = fade(frame, 318, 20);
  const s4CoordOp = fade(frame, 335, 20);
  const s4Step = fade(frame, 355, 20);
  const s4Result = fade(frame, 375, 20);

  // Scene 5: 总结
  const s5Op = fade(frame, 390, 30);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.1"
          sectionTitle="对弧长的曲线积分"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 定义动画 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            将曲线 L 分割成小段 Δsᵢ，在各段取点求和
          </div>
          <CoordinateSystem
            width={680}
            height={340}
            xRange={[-2.5, 2.5]}
            yRange={[-0.3, 1.5]}
            opacity={s2CoordOp}
          >
            <CurveL segmentCount={segCount} opacity={s2CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="\int_L f(x,y)\,\mathrm{d}s = \lim_{\lambda\to 0}\sum_i f(\xi_i,\eta_i)\Delta s_i"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 参数化计算 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>参数化计算方法</div>
          <div style={{ opacity: s3Param }}>
            <MathFormula
              latex="L:\; x = x(t),\; y = y(t),\;\; t\in[\alpha,\beta]"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3ds }}>
            <MathFormula
              latex="\mathrm{d}s = \sqrt{x'(t)^2 + y'(t)^2}\,\mathrm{d}t"
              fontSize={36}
              color={COLORS.vector}
            />
          </div>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\int_L f\,\mathrm{d}s = \int_\alpha^\beta f(x(t),y(t))\sqrt{x'^2+y'^2}\,\mathrm{d}t"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 例题 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.highlight, fontSize: 26, opacity: s4Title }}>
            例题：∫_L (x²+y²) ds，L 为单位圆
          </div>
          <CoordinateSystem
            width={480}
            height={300}
            xRange={[-1.5, 1.5]}
            yRange={[-1.5, 1.5]}
            opacity={s4CoordOp}
          >
            <UnitCircle opacity={s4CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s4Setup }}>
            <MathFormula
              latex="x=\cos\theta,\;y=\sin\theta,\;\mathrm{d}s=\mathrm{d}\theta,\;\theta\in[0,2\pi]"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Step }}>
            <MathFormula
              latex="\int_0^{2\pi}(\cos^2\theta+\sin^2\theta)\,\mathrm{d}\theta = \int_0^{2\pi} 1\,\mathrm{d}\theta"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Result, padding: "8px 24px", border: `2px solid ${COLORS.highlight}`, borderRadius: 8 }}>
            <MathFormula latex="= 2\pi" fontSize={44} color={COLORS.highlight} />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="第一类曲线积分总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>定义</span>：沿曲线的弧长积分，与曲线方向无关</div>
              <div>• <span style={{ color: COLORS.vector }}>计算</span>：参数化后 ds = √(x'²+y'²)dt</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>对称性</span>：L 对称时，奇函数积分=0，偶函数可简化</div>
              <div>• <span style={{ color: COLORS.highlight }}>特例</span>：f=1 时 ∫_L ds = 曲线弧长</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec01Line1;
