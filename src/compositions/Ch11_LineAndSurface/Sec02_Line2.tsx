import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { VectorField } from "../../components/math/VectorField";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 上半圆路径（从 (1,0) 到 (-1,0)）
const UpperSemicircle: React.FC<{ progress?: number; opacity?: number }> = ({ progress = 1, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const N = 60;
  const totalPts = Math.round(progress * N);
  const pts: string[] = [];
  for (let i = 0; i <= totalPts; i++) {
    const t = (i / N) * Math.PI; // 从 0 到 π
    const x = Math.cos(t);
    const y = Math.sin(t);
    const { px, py } = toPixel(x, y);
    pts.push(`${i === 0 ? "M" : "L"}${px},${py}`);
  }

  // 方向箭头（中点处）
  const midT = Math.PI / 2;
  const midX = Math.cos(midT);
  const midY = Math.sin(midT);
  const { px: mx, py: my } = toPixel(midX, midY);
  const { px: mx2, py: my2 } = toPixel(Math.cos(midT + 0.15), Math.sin(midT + 0.15));

  return (
    <g opacity={opacity}>
      <path d={pts.join(" ")} fill="none" stroke={COLORS.primaryCurve} strokeWidth={3} />
      {/* 起终点 */}
      <text x={toPixel(1, 0).px + 8} y={toPixel(1, 0).py + 16} fill={COLORS.annotation} fontSize={16}>(1,0)</text>
      <text x={toPixel(-1, 0).px - 58} y={toPixel(-1, 0).py + 16} fill={COLORS.annotation} fontSize={16}>(-1,0)</text>
      {/* 方向箭头 */}
      {progress > 0.5 && (
        <polygon
          points={`${mx2},${my2} ${mx2 - 8},${my2 + 10} ${mx2 + 10},${my2 + 6}`}
          fill={COLORS.primaryCurve}
          transform={`rotate(${Math.atan2(my2 - my, mx2 - mx) * 180 / Math.PI}, ${mx2}, ${my2})`}
        />
      )}
    </g>
  );
};

// WorkPathLine：在 CoordinateSystem 内渲染带进度的路径线段
interface WorkPathLineProps {
  points: Array<[number, number]>;
  progress?: number;  // 0~1
  opacity?: number;
  color?: string;
  strokeWidth?: number;
  showArrow?: boolean;
}

const WorkPathLine: React.FC<WorkPathLineProps> = ({
  points,
  progress = 1,
  opacity = 1,
  color = '#F59E0B',
  strokeWidth = 3,
  showArrow = true,
}) => {
  const { toPixel } = useCoordContext();
  const visibleCount = Math.max(2, Math.floor(points.length * progress));
  const visiblePoints = points.slice(0, visibleCount);
  const pixelPoints = visiblePoints.map(([mx, my]) => {
    const { px, py } = toPixel(mx, my);
    return [px, py] as [number, number];
  });
  const d = pixelPoints
    .map(([px, py], i) => `${i === 0 ? 'M' : 'L'} ${px} ${py}`)
    .join(' ');
  const last = pixelPoints[pixelPoints.length - 1];
  const prev = pixelPoints[pixelPoints.length - 2] ?? last;
  const angle = Math.atan2(last[1] - prev[1], last[0] - prev[0]) * (180 / Math.PI);
  return (
    <>
      <path d={d} stroke={color} strokeWidth={strokeWidth} fill="none" opacity={opacity} />
      {showArrow && progress > 0.05 && (
        <polygon
          points="-8,-5 8,0 -8,5"
          transform={`translate(${last[0]}, ${last[1]}) rotate(${angle})`}
          fill={color}
          opacity={opacity}
        />
      )}
    </>
  );
};

const Sec02Line2: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 270 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 力场做功
  const s2Title = fade(frame, 60, 20);
  const s2CoordOp = fade(frame, 75, 20);
  const s2FieldOp = fade(frame, 95, 25);
  const s2PathOp = fade(frame, 125, 20);
  const s2Formula = fade(frame, 155, 20);

  // Scene 3: 方向性
  const s3Title = fade(frame, 180, 20);
  const s3Msg = fade(frame, 200, 20);
  const s3Formula = fade(frame, 228, 20);
  const s3Note = fade(frame, 250, 18);

  // Scene 4: 例题
  const s4Title = fade(frame, 270, 20);
  const s4CoordOp = fade(frame, 285, 20);
  const pathProgress = interpolate(frame, [298, 370], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Formula = fade(frame, 355, 20);
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
          sectionNum="11.2"
          sectionTitle="对坐标的曲线积分"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 力场做功 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            力场 F⃗ = (P, Q) 沿路径 L 做的功
          </div>
          <CoordinateSystem
            width={640}
            height={360}
            xRange={[-2, 2]}
            yRange={[-1.5, 1.5]}
            opacity={s2CoordOp}
          >
            <VectorField
              Px={(_x, _y) => 0.5}
              Py={(x, _y) => -0.3 * x}
              gridCount={7}
              scale={0.4}
              color={COLORS.vector}
              opacity={s2FieldOp * 0.7}
            />
            {/* 路径：从 (-1,-0.5) 到 (1,0.5) */}
            {s2PathOp > 0 && (() => {
              const N = 20;
              const pathPts: Array<[number, number]> = Array.from({ length: N + 1 }, (_, i) => {
                const tt = i / N;
                return [-1 + 2 * tt, -0.5 + tt] as [number, number];
              });
              return (
                <WorkPathLine
                  points={pathPts}
                  progress={Math.min(1, s2PathOp / 0.7)}
                  opacity={s2PathOp}
                  color="#F59E0B"
                />
              );
            })()}
          </CoordinateSystem>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="W = \int_L P\,\mathrm{d}x + Q\,\mathrm{d}y = \int_L \vec{F}\cdot\mathrm{d}\vec{r}"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 方向性 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26, padding: "0 120px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s3Title }}>
            第二类曲线积分具有方向性
          </div>
          <div style={{ opacity: s3Msg, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            与第一类不同：反向则积分变号（力做功依赖运动方向）
          </div>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\int_{L^-} P\,\mathrm{d}x + Q\,\mathrm{d}y = -\int_L P\,\mathrm{d}x + Q\,\mathrm{d}y"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3Note, color: COLORS.vector, fontSize: 22 }}>
            L⁻ 表示与 L 方向相反的路径
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 例题 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.highlight, fontSize: 24, opacity: s4Title }}>
            例题：∫_L x dy − y dx，L 为从(1,0)到(-1,0)的上半圆
          </div>
          <CoordinateSystem
            width={520}
            height={320}
            xRange={[-1.5, 1.5]}
            yRange={[-0.3, 1.5]}
            opacity={s4CoordOp}
          >
            <UpperSemicircle progress={pathProgress} opacity={s4CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s4Formula }}>
            <MathFormula
              latex="x=\cos\theta,\;y=\sin\theta:\;\int_0^\pi (\cos^2\theta+\sin^2\theta)\,\mathrm{d}\theta"
              fontSize={26}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Result, padding: "8px 24px", border: `2px solid ${COLORS.highlight}`, borderRadius: 8 }}>
            <MathFormula latex="= \pi \;\text{（等于上半圆面积的 2 倍）}" fontSize={34} color={COLORS.highlight} />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="第二类曲线积分总结" opacity={s5Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>定义</span>：∫_L P dx + Q dy = ∫_L (P cos α + Q cos β) ds</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>方向性</span>：反向路径积分变号</div>
              <div>• <span style={{ color: COLORS.vector }}>计算</span>：参数化后 dx=x'(t)dt，dy=y'(t)dt</div>
              <div>• <span style={{ color: COLORS.highlight }}>物理意义</span>：力场沿路径做的功</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec02Line2;
