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

// 三角形区域 D: 0≤x≤1, 0≤y≤x
const TriangleRegion: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const { px: p00x, py: p00y } = toPixel(0, 0);
  const { px: p10x, py: p10y } = toPixel(1, 0);
  const { px: p11x, py: p11y } = toPixel(1, 1);
  return (
    <g opacity={opacity}>
      <polygon
        points={`${p00x},${p00y} ${p10x},${p10y} ${p11x},${p11y}`}
        fill={COLORS.integralArea}
        stroke={COLORS.primaryCurve}
        strokeWidth={2}
      />
      <text x={(p00x + p10x + p11x) / 3} y={(p00y + p10y + p11y) / 3 - 10}
        textAnchor="middle" fill={COLORS.primaryCurve} fontSize={20} fontStyle="italic">D</text>
    </g>
  );
};

// 竖向扫描线（x 固定时 y 的范围）
const VerticalScanLine: React.FC<{ xPos: number; opacity?: number }> = ({ xPos, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const { px, py: py0 } = toPixel(xPos, 0);
  const { py: py1 } = toPixel(xPos, xPos);
  return (
    <g opacity={opacity}>
      <line x1={px} y1={py0} x2={px} y2={py1} stroke={COLORS.highlight} strokeWidth={3} />
      <circle cx={px} cy={py0} r={4} fill={COLORS.highlight} />
      <circle cx={px} cy={py1} r={4} fill={COLORS.highlight} />
    </g>
  );
};

// 水平扫描线（y 固定时 x 的范围）
const HorizontalScanLine: React.FC<{ yPos: number; opacity?: number }> = ({ yPos, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const { py, px: px0 } = toPixel(yPos, yPos);
  const { px: px1 } = toPixel(1, yPos);
  return (
    <g opacity={opacity}>
      <line x1={px0} y1={py} x2={px1} y2={py} stroke={COLORS.secondaryCurve} strokeWidth={3} />
      <circle cx={px0} cy={py} r={4} fill={COLORS.secondaryCurve} />
      <circle cx={px1} cy={py} r={4} fill={COLORS.secondaryCurve} />
    </g>
  );
};

// 极坐标网格（单位圆内的同心圆弧 + 放射线）
const PolarGrid: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  const edge = toPixel(1, 0);
  const pxRadius = Math.abs(edge.px - center.px);

  const circles: React.ReactNode[] = [];
  for (let r = 0.25; r <= 1.0; r += 0.25) {
    circles.push(
      <circle key={`c${r}`} cx={center.px} cy={center.py} r={pxRadius * r}
        fill="none" stroke={COLORS.grid} strokeWidth={1.5} opacity={0.7} />
    );
  }

  const lines: React.ReactNode[] = [];
  const numLines = 12;
  for (let i = 0; i < numLines; i++) {
    const angle = (i * Math.PI * 2) / numLines;
    const x2 = center.px + pxRadius * Math.cos(angle);
    const y2 = center.py - pxRadius * Math.sin(angle);
    lines.push(
      <line key={`l${i}`} x1={center.px} y1={center.py} x2={x2} y2={y2}
        stroke={COLORS.grid} strokeWidth={1} opacity={0.6} />
    );
  }

  // 单位圆外轮廓
  const circleOutline = (
    <circle cx={center.px} cy={center.py} r={pxRadius}
      fill="none" stroke={COLORS.primaryCurve} strokeWidth={2.5} />
  );

  return (
    <g opacity={opacity}>
      {circles}
      {lines}
      {circleOutline}
      <text x={center.px + pxRadius * 0.55} y={center.py - 10}
        fill={COLORS.vector} fontSize={16}>r dr dθ</text>
    </g>
  );
};

const Sec02Calc2D: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 450 ? 4
    : frame < 540 ? 5
    : 6;

  // Scene 1
  const s1Op = fade(frame, 0);

  // Scene 2: 60-180 直角坐标累次积分
  const s2Title = fade(frame, 60, 20);
  const s2CoordOp = fade(frame, 72, 20);
  const s2ScanX = interpolate(frame, [90, 160], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s2Formula = fade(frame, 150, 20);

  // Scene 3: 180-300 交换积分次序
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 192, 20);
  const s3ScanY = interpolate(frame, [210, 280], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Formula = fade(frame, 268, 20);

  // Scene 4: 300-450 极坐标变换
  const s4Title = fade(frame, 300, 20);
  const s4CoordOp = fade(frame, 312, 20);
  const s4Formula1 = fade(frame, 345, 20);
  const s4Formula2 = fade(frame, 378, 20);
  const s4JacOp = fade(frame, 420, 20);

  // Scene 5: 450-540 例题
  const s5Title = fade(frame, 450, 20);
  const s5Step1 = fade(frame, 465, 20);
  const s5Step2 = fade(frame, 490, 20);
  const s5Result = fade(frame, 515, 20);

  // Scene 6: 540-600 总结
  const s6Op = fade(frame, 540, 30);

  const scanX = 0.1 + s2ScanX * 0.8;
  const scanY = 0.1 + s3ScanY * 0.85;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十"
          chapterTitle="重积分"
          sectionNum="10.2"
          sectionTitle="二重积分的计算法"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 直角坐标累次积分 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            直角坐标：化为累次积分（x 型区域）
          </div>
          <CoordinateSystem
            width={600}
            height={340}
            xRange={[-0.2, 1.5]}
            yRange={[-0.2, 1.4]}
            opacity={s2CoordOp}
          >
            <TriangleRegion opacity={s2CoordOp} />
            <VerticalScanLine xPos={scanX} opacity={s2CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s2Formula }}>
            <MathFormula
              latex="\iint_D f\,\mathrm{d}x\mathrm{d}y = \int_0^1\!\left[\int_0^x f(x,y)\,\mathrm{d}y\right]\mathrm{d}x"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 交换积分次序 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s3Title }}>
            交换积分次序（y 型区域）
          </div>
          <CoordinateSystem
            width={600}
            height={340}
            xRange={[-0.2, 1.5]}
            yRange={[-0.2, 1.4]}
            opacity={s3CoordOp}
          >
            <TriangleRegion opacity={s3CoordOp} />
            <HorizontalScanLine yPos={scanY} opacity={s3CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\iint_D f\,\mathrm{d}x\mathrm{d}y = \int_0^1\!\left[\int_y^1 f(x,y)\,\mathrm{d}x\right]\mathrm{d}y"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 极坐标变换 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s4Title }}>
            极坐标变换（单位圆区域）
          </div>
          <CoordinateSystem
            width={580}
            height={360}
            xRange={[-1.5, 1.5]}
            yRange={[-1.5, 1.5]}
            opacity={s4CoordOp}
          >
            <PolarGrid opacity={s4CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s4Formula1 }}>
            <MathFormula
              latex="x = r\cos\theta,\; y = r\sin\theta,\; \mathrm{d}x\mathrm{d}y = r\,\mathrm{d}r\,\mathrm{d}\theta"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Formula2 }}>
            <MathFormula
              latex="\iint_D f\,\mathrm{d}x\mathrm{d}y = \int_0^{2\pi}\!\!\int_0^1 f(r\cos\theta,\,r\sin\theta)\cdot r\,\mathrm{d}r\,\mathrm{d}\theta"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{
            opacity: s4JacOp,
            padding: "8px 20px",
            border: `1px solid ${COLORS.vector}`,
            borderRadius: 8,
            backgroundColor: "rgba(255,215,0,0.08)",
          }}>
            <span style={{ color: COLORS.vector, fontSize: 22 }}>
              雅可比行列式 J = r（面积微元中的 r 正是来自极坐标变换）
            </span>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 例题 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 120px" }}>
          <div style={{ color: COLORS.highlight, fontSize: 26, opacity: s5Title }}>
            例题：计算 ∬_(x²+y²≤1) e^(x²+y²) dA
          </div>
          <div style={{ opacity: s5Step1 }}>
            <MathFormula
              latex="\text{极坐标代入：}\;\int_0^{2\pi}\!\mathrm{d}\theta\int_0^1 e^{r^2}\cdot r\,\mathrm{d}r"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Step2 }}>
            <MathFormula
              latex="= 2\pi \int_0^1 r e^{r^2}\,\mathrm{d}r = 2\pi \cdot \frac{1}{2}\left[e^{r^2}\right]_0^1"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{
            opacity: s5Result,
            padding: "10px 28px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 8,
          }}>
            <MathFormula
              latex="= \pi(e-1)"
              fontSize={48}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", padding: "0 80px" }}>
          <TheoremBox title="二重积分计算法总结" opacity={s6Op} width={980}>
            <div style={{ fontSize: 22, lineHeight: 2.2, color: COLORS.formula }}>
              <div>• <span style={{ color: COLORS.primaryCurve }}>直角坐标（x型）</span>：先对 y 积分，再对 x 积分</div>
              <div>• <span style={{ color: COLORS.secondaryCurve }}>直角坐标（y型）</span>：先对 x 积分，再对 y 积分</div>
              <div>• <span style={{ color: COLORS.vector }}>极坐标</span>：区域为圆形/扇形时使用，需乘以 Jacobi 因子 r</div>
              <div>• <span style={{ color: COLORS.highlight }}>换序技巧</span>：交换积分次序可简化被积函数</div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec02Calc2D;
