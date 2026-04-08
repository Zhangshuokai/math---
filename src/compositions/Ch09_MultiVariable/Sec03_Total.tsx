import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { Arrow } from "../../components/math/Arrow";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// Δx/Δy 方向示意（在坐标系内）
const IncrementArrows: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const origin = toPixel(1, 2); // 基点 (x₀, y₀) = (1, 2)
  const dx = 1.5; // Δx
  const dy = 1.2; // Δy

  const pt0 = toPixel(1, 2);
  const ptDx = toPixel(1 + dx, 2);
  const ptDxDy = toPixel(1 + dx, 2 + dy);

  return (
    <g opacity={opacity}>
      {/* 基点 */}
      <circle cx={pt0.px} cy={pt0.py} r={6} fill={COLORS.highlight} />
      <text x={pt0.px - 50} y={pt0.py + 20} fill={COLORS.highlight} fontSize={16}>(x₀, y₀)</text>

      {/* Δx 水平箭头（蓝色） */}
      <line
        x1={pt0.px} y1={pt0.py}
        x2={ptDx.px} y2={ptDx.py}
        stroke={COLORS.primaryCurve} strokeWidth={3}
        markerEnd="url(#arrow-deltax)"
      />
      <defs>
        <marker id="arrow-deltax" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.primaryCurve} />
        </marker>
      </defs>
      <text
        x={(pt0.px + ptDx.px) / 2}
        y={pt0.py + 22}
        fill={COLORS.primaryCurve}
        fontSize={18}
        textAnchor="middle"
      >
        Δx
      </text>

      {/* Δy 垂直箭头（绿色） */}
      <line
        x1={ptDx.px} y1={ptDx.py}
        x2={ptDxDy.px} y2={ptDxDy.py}
        stroke={COLORS.tertiaryCurve} strokeWidth={3}
        markerEnd="url(#arrow-deltay)"
      />
      <defs>
        <marker id="arrow-deltay" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.tertiaryCurve} />
        </marker>
      </defs>
      <text
        x={ptDx.px + 20}
        y={(ptDx.py + ptDxDy.py) / 2}
        fill={COLORS.tertiaryCurve}
        fontSize={18}
      >
        Δy
      </text>

      {/* 目标点 (x₀+Δx, y₀+Δy) */}
      <circle cx={ptDxDy.px} cy={ptDxDy.py} r={5} fill={COLORS.secondaryCurve} />
      <text x={ptDxDy.px + 8} y={ptDxDy.py - 8} fill={COLORS.secondaryCurve} fontSize={14}>
        (x₀+Δx, y₀+Δy)
      </text>

      {/* 斜向总增量箭头（白色虚线） */}
      <line
        x1={pt0.px} y1={pt0.py}
        x2={ptDxDy.px} y2={ptDxDy.py}
        stroke={COLORS.formula} strokeWidth={2}
        strokeDasharray="6,4"
        opacity={0.6}
      />
    </g>
  );
};

const Sec03Total: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-80 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 80-180 全微分定义
  const s2Title = fade(frame, 80, 20);
  const s2Def = fade(frame, 100, 20);
  const s2Thm = fade(frame, 130, 25);
  const s2Note = fade(frame, 158, 20);

  // Scene 3: 180-290 几何意义 Δx/Δy
  const s3Title = fade(frame, 180, 20);
  const s3Eq = fade(frame, 200, 20);
  const s3CoordOp = fade(frame, 215, 20);
  const s3ArrowOp = fade(frame, 235, 25);
  const s3TotalOp = fade(frame, 265, 20);

  // Scene 4: 290-380 坐标系可视化 z=x²+y²
  const s4Title = fade(frame, 290, 20);
  const s4CoordOp = fade(frame, 305, 20);
  const s4Curve1 = interpolate(frame, [318, 348], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Curve1Op = fade(frame, 318, 15);
  const s4Curve2 = interpolate(frame, [348, 375], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s4Curve2Op = fade(frame, 348, 15);
  const s4LegendOp = fade(frame, 365, 15);

  // Scene 5: 380-480 近似计算
  const s5Title = fade(frame, 380, 20);
  const s5Step1 = fade(frame, 400, 20);
  const s5Step2 = fade(frame, 425, 20);
  const s5Step3 = fade(frame, 450, 20);
  const s5Result = fade(frame, 465, 15);

  const scene = frame < 80 ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法及其应用"
          sectionNum="9.3"
          sectionTitle="全微分"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 全微分定义 */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 22,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s2Title }}>
            全微分：函数增量的线性主部
          </div>

          <div style={{ opacity: s2Def }}>
            <MathFormula
              latex="\Delta z = f_x \Delta x + f_y \Delta y + o(\rho), \quad \rho = \sqrt{\Delta x^2 + \Delta y^2}"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="全微分定义" opacity={1} width={960}>
              <div style={{ fontSize: 23, lineHeight: 2.1, color: COLORS.formula }}>
                <div>
                  若 Δz 可写成{" "}
                  <span style={{ color: COLORS.primaryCurve }}>A·Δx + B·Δy + o(ρ)</span>，
                  则称 f 在该点<span style={{ color: COLORS.highlight }}> 可微</span>
                </div>
                <div style={{ marginTop: 4 }}>
                  此时全微分：
                  <MathFormula
                    latex="\mathrm{d}z = \frac{\partial z}{\partial x}\mathrm{d}x + \frac{\partial z}{\partial y}\mathrm{d}y = f_x\,\mathrm{d}x + f_y\,\mathrm{d}y"
                    fontSize={38}
                    color={COLORS.vector}
                  />
                </div>
              </div>
            </TheoremBox>
          </div>

          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 21, textAlign: "center" }}>
            可微 ⇒ 偏导数存在（反之不成立）；
            偏导数<span style={{ color: COLORS.highlight }}>连续</span> ⇒ 可微
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 几何意义 Δx/Δy */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title }}>
            全微分的几何意义：用切平面增量近似曲面增量
          </div>

          <div style={{ opacity: s3Eq }}>
            <MathFormula
              latex="\mathrm{d}z = f_x\,\Delta x + f_y\,\Delta y \approx \Delta z"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <CoordinateSystem
            width={760}
            height={380}
            xRange={[-0.5, 3.5]}
            yRange={[-0.5, 3.5]}
            opacity={s3CoordOp}
          >
            {/* Δx/Δy 方向箭头 */}
            <IncrementArrows opacity={s3ArrowOp} />
          </CoordinateSystem>

          <div style={{ opacity: s3TotalOp, display: "flex", gap: 40, fontSize: 20 }}>
            <div style={{ color: COLORS.primaryCurve }}>→ Δx 方向（水平）</div>
            <div style={{ color: COLORS.tertiaryCurve }}>↑ Δy 方向（垂直）</div>
            <div style={{ color: COLORS.formula, opacity: 0.7 }}>⤡ 总增量方向（虚线）</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 截线可视化 z=x², z=y² */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s4Title }}>
            以 z = x² + y² 为例：沿坐标方向的截线
          </div>

          <CoordinateSystem
            width={820}
            height={420}
            xRange={[-3, 3]}
            yRange={[0, 9]}
            opacity={s4CoordOp}
          >
            {/* z = x²（固定 y=0 时沿 x 方向截线，蓝色） */}
            <FunctionPlot
              fn={(x) => x * x}
              color={COLORS.primaryCurve}
              strokeWidth={3}
              drawProgress={s4Curve1}
              opacity={s4Curve1Op}
            />

            {/* z = y²（固定 x=0 时沿 y 方向截线，绿色） */}
            {/* 这里用参数 t 代替 x 轴变量，绘制 t↦t² 同形状曲线稍微偏移标注 */}
            <FunctionPlot
              fn={(x) => x * x}
              color={COLORS.tertiaryCurve}
              strokeWidth={3}
              drawProgress={s4Curve2}
              opacity={s4Curve2Op}
              xMin={-2.8}
              xMax={2.8}
            />

            {/* 标注偏导 */}
            {s4Curve1Op > 0.5 && (
              <text x={420} y={80} fill={COLORS.primaryCurve} fontSize={18} opacity={s4Curve1Op}>
                ∂z/∂x = 2x（沿x轴截线斜率）
              </text>
            )}
            {s4Curve2Op > 0.5 && (
              <text x={420} y={110} fill={COLORS.tertiaryCurve} fontSize={18} opacity={s4Curve2Op}>
                ∂z/∂y = 2y（沿y轴截线斜率）
              </text>
            )}
          </CoordinateSystem>

          <div style={{ display: "flex", gap: 48, opacity: s4LegendOp, fontSize: 20 }}>
            <div style={{ color: COLORS.primaryCurve }}>— z=x²（y固定为0，蓝色）</div>
            <div style={{ color: COLORS.tertiaryCurve }}>— z=y²（x固定为0，绿色）</div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 近似计算应用 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 22,
            padding: "0 100px",
          }}
        >
          <div style={{ color: COLORS.tertiaryCurve, fontSize: 28, opacity: s5Title }}>
            全微分的应用：近似计算 dz ≈ Δz
          </div>

          <div style={{ width: "100%", opacity: s5Step1 }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>
              【第1步】设 f(x,y) = √(x²+y²)，在 (1,2) 处展开，Δx=0.02, Δy=−0.03
            </div>
            <MathFormula
              latex="f_x = \frac{x}{\sqrt{x^2+y^2}}\bigg|_{(1,2)} = \frac{1}{\sqrt{5}}, \quad f_y = \frac{y}{\sqrt{x^2+y^2}}\bigg|_{(1,2)} = \frac{2}{\sqrt{5}}"
              fontSize={34}
              color={COLORS.primaryCurve}
            />
          </div>

          <div style={{ width: "100%", opacity: s5Step2 }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>
              【第2步】计算全微分 dz = f_x·Δx + f_y·Δy
            </div>
            <MathFormula
              latex="dz = \frac{1}{\sqrt{5}}(0.02) + \frac{2}{\sqrt{5}}(-0.03) = \frac{0.02 - 0.06}{\sqrt{5}} = \frac{-0.04}{\sqrt{5}}"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>

          <div style={{ width: "100%", opacity: s5Step3 }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>
              【第3步】近似值 f(1.02, 1.97) ≈ f(1,2) + dz
            </div>
            <MathFormula
              latex="\sqrt{1.02^2 + 1.97^2} \approx \sqrt{5} - \frac{0.04}{\sqrt{5}} \approx 2.2361 - 0.0179 \approx 2.2182"
              fontSize={32}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{
            opacity: s5Result,
            padding: "12px 28px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 10,
          }}>
            <MathFormula
              latex="|\Delta z - dz| = o(\rho) \to 0 \;\text{（误差为高阶无穷小）}"
              fontSize={36}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec03Total;
