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

// 柱坐标网格俯视图（2D 圆 + 放射线）
const CylindricalGridTop: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  const edge = toPixel(2, 0);
  const pxR = Math.abs(edge.px - center.px);
  const circles: React.ReactNode[] = [];
  for (let r = 0.5; r <= 2.0; r += 0.5) {
    circles.push(
      <circle key={`c${r}`} cx={center.px} cy={center.py} r={pxR * (r / 2)}
        fill="none" stroke={COLORS.primaryCurve} strokeWidth={1.5} opacity={0.6} />
    );
  }
  const lines: React.ReactNode[] = [];
  for (let i = 0; i < 8; i++) {
    const a = (i * Math.PI * 2) / 8;
    lines.push(
      <line key={`l${i}`}
        x1={center.px} y1={center.py}
        x2={center.px + pxR * Math.cos(a)}
        y2={center.py - pxR * Math.sin(a)}
        stroke={COLORS.primaryCurve} strokeWidth={1} opacity={0.5} />
    );
  }
  return (
    <g opacity={opacity}>
      {circles}
      {lines}
      <circle cx={center.px} cy={center.py} r={pxR} fill="none" stroke={COLORS.primaryCurve} strokeWidth={2.5} />
    </g>
  );
};

// 球坐标示意（单位球的截面圆）
const SphericalDemo: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  const edge = toPixel(1, 0);
  const pxR = Math.abs(edge.px - center.px);
  // 画几个经线/纬线椭圆（简化为圆弧）
  return (
    <g opacity={opacity}>
      {/* 赤道圆 */}
      <circle cx={center.px} cy={center.py} r={pxR} fill={COLORS.integralArea} stroke={COLORS.secondaryCurve} strokeWidth={2.5} />
      {/* 经线：2 个椭圆 */}
      <ellipse cx={center.px} cy={center.py} rx={pxR * 0.4} ry={pxR} fill="none" stroke={COLORS.secondaryCurve} strokeWidth={1.5} opacity={0.6} />
      <ellipse cx={center.px} cy={center.py} rx={pxR} ry={pxR * 0.4} fill="none" stroke={COLORS.secondaryCurve} strokeWidth={1.5} opacity={0.6} />
      {/* ρ 向量 */}
      <line x1={center.px} y1={center.py}
        x2={center.px + pxR * Math.cos(Math.PI / 4)}
        y2={center.py - pxR * Math.sin(Math.PI / 4)}
        stroke={COLORS.vector} strokeWidth={2.5} />
      <text x={center.px + pxR * 0.38} y={center.py - pxR * 0.52}
        fill={COLORS.vector} fontSize={18} fontStyle="italic">ρ</text>
      {/* φ 角标注 */}
      <text x={center.px + 14} y={center.py - 8} fill={COLORS.highlight} fontSize={16} fontStyle="italic">φ</text>
    </g>
  );
};

const Sec03Triple: React.FC = () => {
  const frame = useCurrentFrame();

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  const s1Op = fade(frame, 0);

  // Scene 2: 定义与对比
  const s2Title = fade(frame, 60, 20);
  const s2Def = fade(frame, 80, 20);
  const s2Compare = fade(frame, 112, 20);
  const s2Note = fade(frame, 150, 20);

  // Scene 3: 柱坐标
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 20);
  const s3Sub = fade(frame, 225, 20);
  const s3dV = fade(frame, 258, 20);
  const s3Formula = fade(frame, 275, 20);

  // Scene 4: 球坐标
  const s4Title = fade(frame, 300, 20);
  const s4CoordOp = fade(frame, 315, 20);
  const s4Sub = fade(frame, 335, 20);
  const s4dV = fade(frame, 358, 20);

  // Scene 5: 例题 + 总结
  const s5Title = fade(frame, 390, 20);
  const s5Step1 = fade(frame, 408, 20);
  const s5Step2 = fade(frame, 432, 20);
  const s5Result = fade(frame, 456, 20);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十"
          chapterTitle="重积分"
          sectionNum="10.3"
          sectionTitle="三重积分"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 定义与对比 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28, padding: "0 120px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s2Title }}>三重积分定义</div>
          <div style={{ opacity: s2Def }}>
            <MathFormula
              latex="\iiint_\Omega f(x,y,z)\,\mathrm{d}V = \lim_{\lambda\to 0}\sum_{i} f(\xi_i,\eta_i,\zeta_i)\Delta V_i"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Compare, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            与二重积分类比：积分区域从平面区域 D 推广到空间区域 Ω<br />
            面积微元 dσ → 体积微元 dV
          </div>
          <div style={{ opacity: s2Note, padding: "10px 24px", border: `1px solid ${COLORS.grid}`, borderRadius: 8 }}>
            <MathFormula
              latex="\mathrm{d}V = \mathrm{d}x\,\mathrm{d}y\,\mathrm{d}z \quad \text{(直角坐标)}"
              fontSize={30}
              color={COLORS.vector}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 柱坐标 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s3Title }}>
            柱坐标变换（俯视图）
          </div>
          <CoordinateSystem
            width={500}
            height={320}
            xRange={[-2.5, 2.5]}
            yRange={[-2.5, 2.5]}
            opacity={s3CoordOp}
          >
            <CylindricalGridTop opacity={s3CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s3Sub }}>
            <MathFormula
              latex="x = r\cos\theta,\;\; y = r\sin\theta,\;\; z = z"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s3dV }}>
            <MathFormula
              latex="\mathrm{d}V = r\,\mathrm{d}r\,\mathrm{d}\theta\,\mathrm{d}z"
              fontSize={36}
              color={COLORS.vector}
            />
          </div>
          <div style={{ opacity: s3Formula, color: COLORS.annotation, fontSize: 20 }}>
            适用于：积分区域关于 z 轴对称（圆柱、圆锥等）
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 球坐标 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>
            球坐标变换
          </div>
          <CoordinateSystem
            width={500}
            height={320}
            xRange={[-1.5, 1.5]}
            yRange={[-1.5, 1.5]}
            opacity={s4CoordOp}
          >
            <SphericalDemo opacity={s4CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s4Sub }}>
            <MathFormula
              latex="x=\rho\sin\varphi\cos\theta,\;\; y=\rho\sin\varphi\sin\theta,\;\; z=\rho\cos\varphi"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4dV }}>
            <MathFormula
              latex="\mathrm{d}V = \rho^2\sin\varphi\,\mathrm{d}\rho\,\mathrm{d}\varphi\,\mathrm{d}\theta"
              fontSize={36}
              color={COLORS.secondaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 例题 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 120px" }}>
          <div style={{ color: COLORS.highlight, fontSize: 26, opacity: s5Title }}>
            例题：球坐标计算 ∭_(ρ≤1) dV
          </div>
          <div style={{ opacity: s5Step1 }}>
            <MathFormula
              latex="\int_0^{2\pi}\!\mathrm{d}\theta\int_0^{\pi}\!\sin\varphi\,\mathrm{d}\varphi\int_0^1\!\rho^2\,\mathrm{d}\rho"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Step2 }}>
            <MathFormula
              latex="= 2\pi \cdot 2 \cdot \frac{1}{3} = \frac{4\pi}{3}"
              fontSize={36}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Result, padding: "10px 28px", border: `2px solid ${COLORS.highlight}`, borderRadius: 8 }}>
            <MathFormula
              latex="\text{单位球体积} = \frac{4\pi}{3}"
              fontSize={42}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec03Triple;
