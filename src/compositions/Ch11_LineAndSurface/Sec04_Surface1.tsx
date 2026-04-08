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

// 椭圆曲面分割可视化
const SurfacePartition: React.FC<{
  hLineOp: number;
  vLineOp: number;
  dotsOp: number;
}> = ({ hLineOp, vLineOp, dotsOp }) => {
  const { toPixel } = useCoordContext();

  // 椭圆参数：中心(0,0), a=2.2, b=1.4
  const a = 2.2;
  const b = 1.4;
  const N = 120;
  const ellipsePts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * 2 * Math.PI;
    const { px, py } = toPixel(a * Math.cos(t), b * Math.sin(t));
    ellipsePts.push(`${i === 0 ? "M" : "L"}${px},${py}`);
  }
  ellipsePts.push("Z");
  const ellipsePath = ellipsePts.join(" ");

  // 椭圆clipPath边界像素
  const { px: cx, py: cy } = toPixel(0, 0);
  const { px: rax } = toPixel(a, 0);
  const { py: ray } = toPixel(0, b);
  const pxA = Math.abs(rax - cx);
  const pxB = Math.abs(ray - cy);

  // 横线 y = -1.2 ~ 1.2，间距0.5
  const hLines: React.ReactNode[] = [];
  for (let yi = -1.2; yi <= 1.2 + 0.01; yi += 0.5) {
    const { py } = toPixel(0, yi);
    // 计算该 y 在椭圆上的 x 范围
    const ratio = 1 - (yi * yi) / (b * b);
    if (ratio <= 0) continue;
    const xLen = a * Math.sqrt(ratio);
    const { px: x1 } = toPixel(-xLen, yi);
    const { px: x2 } = toPixel(xLen, yi);
    hLines.push(
      <line
        key={`h${yi.toFixed(2)}`}
        x1={x1} y1={py} x2={x2} y2={py}
        stroke={COLORS.grid}
        strokeWidth={1.2}
        opacity={hLineOp}
      />
    );
  }

  // 竖线 x = -2.0 ~ 2.0，间距0.6
  const vLines: React.ReactNode[] = [];
  for (let xi = -2.0; xi <= 2.0 + 0.01; xi += 0.6) {
    const { px } = toPixel(xi, 0);
    const ratio = 1 - (xi * xi) / (a * a);
    if (ratio <= 0) continue;
    const yLen = b * Math.sqrt(ratio);
    const { py: y1 } = toPixel(xi, -yLen);
    const { py: y2 } = toPixel(xi, yLen);
    vLines.push(
      <line
        key={`v${xi.toFixed(2)}`}
        x1={px} y1={y1} x2={px} y2={y2}
        stroke={COLORS.grid}
        strokeWidth={1.2}
        opacity={vLineOp}
      />
    );
  }

  // 在椭圆内取若干小点（代表取点 (ξᵢ,ηᵢ,ζᵢ)）
  const samplePts: React.ReactNode[] = [];
  const ptCoords = [
    [-1.4, 0.8], [-0.6, 1.0], [0.3, 0.9], [1.2, 0.7],
    [-1.6, 0.1], [-0.5, 0.3], [0.5, 0.2], [1.4, 0.0],
    [-1.3, -0.5], [-0.4, -0.7], [0.6, -0.6], [1.2, -0.4],
    [-0.8, -1.0], [0.2, -1.0], [0.9, -0.9],
  ];
  ptCoords.forEach(([mx, my], idx) => {
    const { px, py } = toPixel(mx, my);
    samplePts.push(
      <circle key={idx} cx={px} cy={py} r={3.5}
        fill={COLORS.highlight} opacity={dotsOp} />
    );
  });

  return (
    <g>
      {/* 椭圆填充背景 */}
      <path d={ellipsePath} fill={COLORS.primaryCurve} fillOpacity={0.07} stroke="none" />
      {/* 横线（先出现） */}
      {hLines}
      {/* 竖线 */}
      {vLines}
      {/* 椭圆边框 */}
      <path d={ellipsePath} fill="none" stroke={COLORS.primaryCurve} strokeWidth={2.5} />
      {/* 取点 */}
      {samplePts}
      {/* 标注 Σ */}
      <text
        x={toPixel(0, 0).px}
        y={toPixel(0, 0).py}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={COLORS.primaryCurve}
        fontSize={28}
        fontStyle="italic"
        opacity={0.45}
      >
        Σ
      </text>
      {/* 标注小面积元素 */}
      {dotsOp > 0.5 && (
        <text
          x={toPixel(0.5, 0.2).px + 14}
          y={toPixel(0.5, 0.2).py - 14}
          fill={COLORS.highlight}
          fontSize={15}
          opacity={dotsOp}
        >
          (ξᵢ,ηᵢ,ζᵢ)
        </text>
      )}
    </g>
  );
};

// 球面面积示意（上半球投影到 xy 平面）
const SphereSurface: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { toPixel } = useCoordContext();
  const R = 1.5;
  // 画一个圆（投影）
  const center = toPixel(0, 0);
  const edge = toPixel(R, 0);
  const pxR = Math.abs(edge.px - center.px);

  // 上半球曲线（椭圆弧模拟）
  const N = 60;
  const upperPts: string[] = [];
  for (let i = 0; i <= N; i++) {
    const t = (i / N) * Math.PI;
    const { px, py } = toPixel(R * Math.cos(t), R * Math.sin(t));
    upperPts.push(`${i === 0 ? "M" : "L"}${px},${py}`);
  }

  // 赤道圆（虚线）
  const equatorPts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const t = (i / 60) * 2 * Math.PI;
    const { px, py } = toPixel(R * Math.cos(t), 0.35 * Math.sin(t));
    equatorPts.push(`${i === 0 ? "M" : "L"}${px},${py}`);
  }

  return (
    <g opacity={opacity}>
      {/* 投影圆（虚线） */}
      <circle
        cx={center.px} cy={center.py} r={pxR}
        fill="none"
        stroke={COLORS.secondaryCurve}
        strokeWidth={1.5}
        strokeDasharray="6 4"
      />
      {/* 上半球弧 */}
      <path d={upperPts.join(" ")} fill="none" stroke={COLORS.primaryCurve} strokeWidth={2.5} />
      {/* 赤道椭圆 */}
      <path d={equatorPts.join(" ")} fill="none" stroke={COLORS.primaryCurve} strokeWidth={1.5} strokeDasharray="5 3" />
      {/* 标注 */}
      <text x={toPixel(R + 0.15, 0).px} y={toPixel(R + 0.15, 0).py + 5}
        fill={COLORS.secondaryCurve} fontSize={16}>R</text>
      <text x={toPixel(-0.25, 1.0).px} y={toPixel(-0.25, 1.0).py}
        fill={COLORS.primaryCurve} fontSize={18} fontStyle="italic">Σ</text>
    </g>
  );
};

const Sec04Surface1: React.FC = () => {
  const frame = useCurrentFrame();

  const scene =
    frame < 80 ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  // Scene 1
  const s1Op = fade(frame, 0);

  // Scene 2: 定义
  const s2Title = fade(frame, 80, 20);
  const s2Def = fade(frame, 100, 22);
  const s2Thm = fade(frame, 128, 22);
  const s2Prop1 = fade(frame, 150, 18);
  const s2Prop2 = fade(frame, 162, 18);

  // Scene 3: 曲面分割可视化
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 20);
  const hLineOp = interpolate(frame, [205, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const vLineOp = interpolate(frame, [238, 268], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const dotsOp = fade(frame, 268, 18);
  const s3Formula = fade(frame, 276, 18);

  // Scene 4: 计算方法
  const s4Title = fade(frame, 290, 20);
  const s4Param = fade(frame, 308, 22);
  const s4dS = fade(frame, 336, 22);
  const s4Formula = fade(frame, 360, 20);

  // Scene 5: 球面例题
  const s5Title = fade(frame, 380, 20);
  const s5CoordOp = fade(frame, 396, 20);
  const s5Setup = fade(frame, 408, 20);
  const s5Step1 = fade(frame, 432, 18);
  const s5Result = fade(frame, 456, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.4"
          sectionTitle="对面积的曲面积分（第一类）"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 定义 + TheoremBox */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 100px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            第一类曲面积分的定义
          </div>
          <div style={{ opacity: s2Def }}>
            <MathFormula
              latex="\iint_\Sigma f(x,y,z)\,\mathrm{d}S = \lim_{\lambda\to 0}\sum_{i=1}^n f(\xi_i,\eta_i,\zeta_i)\,\Delta S_i"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="物理意义与基本性质" opacity={s2Thm} width={960}>
              <div style={{ fontSize: 21, lineHeight: 2.1, color: COLORS.formula }}>
                <div style={{ opacity: s2Prop1 }}>
                  • <span style={{ color: COLORS.primaryCurve }}>质量</span>：若 f(x,y,z) 为曲面面密度，则 ∬_Σ f dS 表示曲面的总质量
                </div>
                <div style={{ opacity: s2Prop2 }}>
                  • <span style={{ color: COLORS.highlight }}>特例</span>：f ≡ 1 时，∬_Σ dS = 曲面 Σ 的面积 S
                </div>
                <div style={{ opacity: s2Prop2 }}>
                  • <span style={{ color: COLORS.secondaryCurve }}>方向无关性</span>：dS ＞ 0，积分与曲面定向无关
                </div>
              </div>
            </TheoremBox>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 曲面分割可视化 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.vector, fontSize: 24, opacity: s3Title }}>
            曲面 Σ 分割成小面积元素 ΔSᵢ
          </div>
          <CoordinateSystem
            width={680}
            height={340}
            xRange={[-3, 3]}
            yRange={[-2, 2]}
            opacity={s3CoordOp}
            showGrid={false}
          >
            <SurfacePartition
              hLineOp={hLineOp}
              vLineOp={vLineOp}
              dotsOp={dotsOp}
            />
          </CoordinateSystem>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\Delta S_i = \text{第 } i \text{ 块小曲面面积},\quad (\xi_i,\eta_i,\zeta_i)\in\Delta S_i"
              fontSize={26}
              color={COLORS.annotation}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 计算方法 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 28, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s4Title }}>
            化为二重积分的计算公式
          </div>
          <div style={{ opacity: s4Param }}>
            <MathFormula
              latex="\Sigma:\; z = z(x,y),\;\; (x,y)\in D_{xy}"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4dS }}>
            <MathFormula
              latex="\mathrm{d}S = \sqrt{1 + \left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\;\mathrm{d}A"
              fontSize={36}
              color={COLORS.vector}
            />
          </div>
          <div style={{ opacity: s4Formula, padding: "12px 24px", border: `2px solid ${COLORS.primaryCurve}`, borderRadius: 10 }}>
            <MathFormula
              latex="\iint_\Sigma f(x,y,z)\,\mathrm{d}S = \iint_{D_{xy}} f\bigl(x,y,z(x,y)\bigr)\sqrt{1+z_x^2+z_y^2}\;\mathrm{d}x\,\mathrm{d}y"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 球面例题 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.highlight, fontSize: 24, opacity: s5Title }}>
            例题：计算球面 x²+y²+z²=R² 上的积分 ∬_Σ (x²+y²+z²) dS
          </div>
          <CoordinateSystem
            width={440}
            height={280}
            xRange={[-2, 2]}
            yRange={[-0.3, 2.2]}
            opacity={s5CoordOp}
            showGrid={false}
            showLabels={false}
          >
            <SphereSurface opacity={s5CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s5Setup }}>
            <MathFormula
              latex="\text{利用对称性：在球面 Σ 上，}x^2+y^2+z^2 = R^2 \text{（常数）}"
              fontSize={26}
              color={COLORS.annotation}
            />
          </div>
          <div style={{ opacity: s5Step1 }}>
            <MathFormula
              latex="\iint_\Sigma (x^2+y^2+z^2)\,\mathrm{d}S = R^2 \iint_\Sigma \mathrm{d}S = R^2 \cdot S_{\Sigma}"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Result, padding: "10px 32px", border: `2px solid ${COLORS.highlight}`, borderRadius: 10 }}>
            <MathFormula
              latex="= R^2 \cdot 4\pi R^2 = 4\pi R^4"
              fontSize={40}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec04Surface1;
