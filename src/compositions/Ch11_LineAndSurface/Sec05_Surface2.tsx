import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { Arrow } from "../../components/math/Arrow";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 曲面轮廓（y = 0.5*sin(x*π/2) + 0.5）及法向量可视化
const SurfaceNormals: React.FC<{
  surfaceOp: number;
  arrowCount: number;
  arrowOp: number;
}> = ({ surfaceOp, arrowCount, arrowOp }) => {
  const { toPixel } = useCoordContext();

  // 绘制曲面轮廓曲线
  const N = 80;
  const surfacePts: string[] = [];
  const surfaceFn = (x: number) => 0.5 * Math.sin(x * Math.PI / 2) + 0.5;
  for (let i = 0; i <= N; i++) {
    const x = -2.5 + (i / N) * 5;
    const y = surfaceFn(x);
    const { px, py } = toPixel(x, y);
    surfacePts.push(`${i === 0 ? "M" : "L"}${px},${py}`);
  }

  // 曲面下方填充区域（从曲线到 y=0 基线）
  const fillPts = [...surfacePts];
  const { px: rightX, py: baseY } = toPixel(2.5, -0.6);
  const { px: leftX } = toPixel(-2.5, -0.6);
  fillPts.push(`L${rightX},${baseY}`, `L${leftX},${baseY}`, "Z");

  // 法向量的基点（在曲面上均匀取点）
  const arrowBaseXs = [-2.0, -1.2, -0.3, 0.6, 1.4, 2.2];
  const normalLength = 0.9;

  // 法向量方向：切线 (1, f'(x))，法向量 (-f'(x), 1)，归一化朝上
  const fprime = (x: number) => 0.5 * (Math.PI / 2) * Math.cos(x * Math.PI / 2);

  const arrows = arrowBaseXs.slice(0, arrowCount).map((bx, idx) => {
    const by = surfaceFn(bx);
    const dx = fprime(bx);
    // 法向量 (-dx, 1)，单位化
    const len = Math.sqrt(dx * dx + 1);
    const nx = -dx / len;
    const ny = 1 / len;
    const tx = bx + nx * normalLength;
    const ty = by + ny * normalLength;
    return (
      <Arrow
        key={idx}
        fromX={bx}
        fromY={by}
        toX={tx}
        toY={ty}
        color={COLORS.tertiaryCurve}
        strokeWidth={2.5}
        opacity={arrowOp}
      />
    );
  });

  return (
    <g opacity={surfaceOp}>
      {/* 曲面填充 */}
      <path d={fillPts.join(" ")} fill={COLORS.primaryCurve} fillOpacity={0.08} stroke="none" />
      {/* 曲面轮廓 */}
      <path d={surfacePts.join(" ")} fill="none" stroke={COLORS.primaryCurve} strokeWidth={3} />
      {/* 法向量箭头 */}
      {arrows}
      {/* 标注 Σ */}
      <text
        x={toPixel(1.8, 1.2).px}
        y={toPixel(1.8, 1.2).py}
        fill={COLORS.primaryCurve}
        fontSize={22}
        fontStyle="italic"
        opacity={0.9}
      >
        Σ
      </text>
      {/* 法向量标注 */}
      {arrowCount >= 3 && (
        <text
          x={toPixel(-0.3, 1.7).px}
          y={toPixel(-0.3, 1.7).py}
          fill={COLORS.tertiaryCurve}
          fontSize={16}
          opacity={arrowOp}
        >
          n（正侧）
        </text>
      )}
    </g>
  );
};

// 场景5：方向余弦几何示意（2D 法向量分量）
const NormalAngle: React.FC<{ opacity: number }> = ({ opacity }) => {
  const { toPixel } = useCoordContext();
  const { px: ox, py: oy } = toPixel(0, 0);

  // 画一个单位法向量 n = (cosα, cosγ) 示意（2D平面内）
  const angle = Math.PI / 4; // 45度
  const len = 1.6;
  const nx = Math.cos(angle) * len;
  const ny = Math.sin(angle) * len;

  const { px: tx, py: ty } = toPixel(nx, ny);

  // x轴投影虚线
  const { px: px_x, py: py_x } = toPixel(nx, 0);
  // y轴投影虚线
  const { px: px_y, py: py_y } = toPixel(0, ny);

  return (
    <g opacity={opacity}>
      {/* 虚线到 x 轴投影 */}
      <line x1={tx} y1={ty} x2={px_x} y2={py_x}
        stroke={COLORS.vector} strokeWidth={1.5} strokeDasharray="5 3" />
      {/* 虚线到 y 轴投影（这里用 z 轴方向） */}
      <line x1={tx} y1={ty} x2={ox} y2={ty}
        stroke={COLORS.secondaryCurve} strokeWidth={1.5} strokeDasharray="5 3" />
      {/* 法向量 n */}
      <Arrow fromX={0} fromY={0} toX={nx} toY={ny}
        color={COLORS.tertiaryCurve} strokeWidth={3} label="n" opacity={1} />
      {/* 角度弧 */}
      <path
        d={`M ${ox + 36} ${oy} A 36 36 0 0 0 ${ox + 36 * Math.cos(angle)} ${oy - 36 * Math.sin(angle)}`}
        fill="none" stroke={COLORS.annotation} strokeWidth={1.5}
      />
      {/* 标注 cosα, cosγ */}
      <text x={px_x} y={py_x + 22} textAnchor="middle"
        fill={COLORS.vector} fontSize={16}>cos α</text>
      <text x={ox - 56} y={ty} dominantBaseline="middle"
        fill={COLORS.secondaryCurve} fontSize={16}>cos γ</text>
      <text x={ox + 44} y={oy - 16}
        fill={COLORS.annotation} fontSize={15}>α</text>
    </g>
  );
};

const Sec05Surface2: React.FC = () => {
  const frame = useCurrentFrame();

  const scene =
    frame < 80 ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  // Scene 1
  const s1Op = fade(frame, 0);

  // Scene 2: 物理背景
  const s2Title = fade(frame, 80, 20);
  const s2Flux = fade(frame, 100, 20);
  const s2Thm = fade(frame, 126, 22);
  const s2P1 = fade(frame, 148, 18);
  const s2P2 = fade(frame, 162, 18);

  // Scene 3: 法向量可视化
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 196, 20);
  const surfaceOp = fade(frame, 204, 18);
  const arrowCount = Math.round(interpolate(frame, [220, 272], [0, 6], { extrapolateLeft: "clamp", extrapolateRight: "clamp" }));
  const arrowOp = fade(frame, 218, 20);
  const s3Formula = fade(frame, 274, 16);

  // Scene 4: 计算公式 + 正负侧
  const s4Title = fade(frame, 290, 20);
  const s4Formula = fade(frame, 308, 22);
  const s4Rule = fade(frame, 338, 20);
  const s4Plus = fade(frame, 355, 18);
  const s4Minus = fade(frame, 366, 18);

  // Scene 5: 两类关系
  const s5Title = fade(frame, 380, 20);
  const s5CoordOp = fade(frame, 396, 20);
  const s5Relation = fade(frame, 414, 22);
  const s5Thm = fade(frame, 440, 22);
  const s5P1 = fade(frame, 456, 18);
  const s5P2 = fade(frame, 466, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.5"
          sectionTitle="对坐标的曲面积分（第二类）"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 物理背景 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 100px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            流量积分：速度场穿过曲面的通量
          </div>
          <div style={{ opacity: s2Flux }}>
            <MathFormula
              latex="\Phi = \iint_\Sigma \vec{v}\cdot\vec{n}\,\mathrm{d}S = \iint_\Sigma P\,\mathrm{d}y\mathrm{d}z + Q\,\mathrm{d}z\mathrm{d}x + R\,\mathrm{d}x\mathrm{d}y"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="第二类曲面积分（流量积分）" opacity={s2Thm} width={960}>
              <div style={{ fontSize: 21, lineHeight: 2.1, color: COLORS.formula }}>
                <div style={{ opacity: s2P1 }}>
                  • <span style={{ color: COLORS.primaryCurve }}>物理含义</span>：单位时间内流体经有向曲面 Σ 流向正侧的流量
                </div>
                <div style={{ opacity: s2P2 }}>
                  • <span style={{ color: COLORS.highlight }}>有向性</span>：取决于曲面法向量方向，改变侧则积分变号
                </div>
                <div style={{ opacity: s2P2 }}>
                  • <span style={{ color: COLORS.secondaryCurve }}>向量场</span>：v = (P, Q, R)，n = (cos α, cos β, cos γ) 为单位外法向量
                </div>
              </div>
            </TheoremBox>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 法向量方向可视化 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16 }}>
          <div style={{ color: COLORS.vector, fontSize: 24, opacity: s3Title }}>
            曲面取向：法向量指向正侧
          </div>
          <CoordinateSystem
            width={720}
            height={340}
            xRange={[-3, 3]}
            yRange={[-0.8, 2.2]}
            opacity={s3CoordOp}
            showGrid={false}
          >
            <SurfaceNormals
              surfaceOp={surfaceOp}
              arrowCount={arrowCount}
              arrowOp={arrowOp}
            />
          </CoordinateSystem>
          <div style={{ opacity: s3Formula }}>
            <MathFormula
              latex="\vec{n} = \frac{(-z_x,\,-z_y,\,1)}{\sqrt{1+z_x^2+z_y^2}}\quad\text{（上侧）}"
              fontSize={28}
              color={COLORS.tertiaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 计算公式 + 正负侧规则 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 26, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s4Title }}>
            化为二重积分的计算方法
          </div>
          <div style={{ opacity: s4Formula, padding: "12px 24px", border: `2px solid ${COLORS.primaryCurve}`, borderRadius: 10 }}>
            <MathFormula
              latex="\iint_\Sigma R(x,y,z)\,\mathrm{d}x\mathrm{d}y = \pm\iint_{D_{xy}} R\bigl(x,y,z(x,y)\bigr)\,\mathrm{d}x\mathrm{d}y"
              fontSize={30}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Rule, color: COLORS.annotation, fontSize: 22 }}>
            符号选取规则（取决于法向量与 z 轴夹角）：
          </div>
          <div style={{ display: "flex", gap: 48, alignItems: "center" }}>
            <div style={{ opacity: s4Plus, textAlign: "center", padding: "10px 24px", border: `2px solid ${COLORS.tertiaryCurve}`, borderRadius: 8 }}>
              <div style={{ color: COLORS.tertiaryCurve, fontSize: 18, marginBottom: 6 }}>上侧（法向量向上）</div>
              <MathFormula latex="\cos\gamma > 0 \;\Rightarrow\; \mathbf{+}" fontSize={28} color={COLORS.tertiaryCurve} />
            </div>
            <div style={{ opacity: s4Minus, textAlign: "center", padding: "10px 24px", border: `2px solid ${COLORS.highlight}`, borderRadius: 8 }}>
              <div style={{ color: COLORS.highlight, fontSize: 18, marginBottom: 6 }}>下侧（法向量向下）</div>
              <MathFormula latex="\cos\gamma < 0 \;\Rightarrow\; \mathbf{-}" fontSize={28} color={COLORS.highlight} />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 两类曲面积分关系 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 20, padding: "0 100px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s5Title }}>
            两类曲面积分的联系
          </div>
          <CoordinateSystem
            width={360}
            height={260}
            xRange={[-2.2, 2.2]}
            yRange={[-0.5, 2.2]}
            opacity={s5CoordOp}
            showGrid={false}
            showLabels={false}
          >
            <NormalAngle opacity={s5CoordOp} />
          </CoordinateSystem>
          <div style={{ opacity: s5Relation }}>
            <MathFormula
              latex="\iint_\Sigma P\,\mathrm{d}y\mathrm{d}z+Q\,\mathrm{d}z\mathrm{d}x+R\,\mathrm{d}x\mathrm{d}y = \iint_\Sigma (P\cos\alpha+Q\cos\beta+R\cos\gamma)\,\mathrm{d}S"
              fontSize={26}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s5Thm, width: "100%" }}>
            <TheoremBox title="两类曲面积分总结" opacity={s5Thm} width={960}>
              <div style={{ fontSize: 20, lineHeight: 2.1, color: COLORS.formula }}>
                <div style={{ opacity: s5P1 }}>
                  • <span style={{ color: COLORS.primaryCurve }}>第一类</span>（对面积）：dS ＞ 0，与方向无关
                </div>
                <div style={{ opacity: s5P2 }}>
                  • <span style={{ color: COLORS.secondaryCurve }}>第二类</span>（对坐标）：有向，改变侧则变号
                </div>
                <div style={{ opacity: s5P2 }}>
                  • <span style={{ color: COLORS.highlight }}>联系</span>：第二类 = (P cosα + Q cosβ + R cosγ) · 第一类
                </div>
              </div>
            </TheoremBox>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec05Surface2;
