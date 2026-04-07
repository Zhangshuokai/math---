import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// 切点标记
const TangentDot: React.FC<{ x: number; y: number; color?: string; opacity?: number }> = ({
  x, y, color = COLORS.highlight, opacity = 1,
}) => {
  const { toPixel } = useCoordContext();
  const p = toPixel(x, y);
  return (
    <>
      <circle cx={p.px} cy={p.py} r={7} fill={color} opacity={opacity} />
      <circle cx={p.px} cy={p.py} r={12} fill="none" stroke={color} strokeWidth={2} opacity={opacity * 0.5} />
    </>
  );
};

// 切线（在 CoordinateSystem 内）
const TangentLine: React.FC<{
  x0: number; y0: number; slope: number; halfLen?: number;
  color?: string; opacity?: number;
}> = ({ x0, y0, slope, halfLen = 1.5, color = COLORS.secondaryCurve, opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const p1 = toPixel(x0 - halfLen, y0 - slope * halfLen);
  const p2 = toPixel(x0 + halfLen, y0 + slope * halfLen);
  return (
    <line x1={p1.px} y1={p1.py} x2={p2.px} y2={p2.py}
      stroke={color} strokeWidth={2.5} opacity={opacity} strokeDasharray="8,4" />
  );
};

// 标注文字
const SvgLabel: React.FC<{
  x: number; y: number; text: string; color?: string; opacity?: number; fontSize?: number;
}> = ({ x, y, text, color = COLORS.annotation, opacity = 1, fontSize = 16 }) => {
  const { toPixel } = useCoordContext();
  const p = toPixel(x, y);
  return (
    <text x={p.px + 8} y={p.py - 8} fill={color} fontSize={fontSize} opacity={opacity}>{text}</text>
  );
};

const Sec02Partial: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-150 定义
  const s2Title = fade(frame, 60, 20);
  const s2Limit = fade(frame, 80, 20);
  const s2Explain = fade(frame, 115, 20);
  const s2Note = fade(frame, 135, 15);

  // Scene 3: 150-270 几何意义
  const s3Title = fade(frame, 150, 20);
  const s3CoordOp = fade(frame, 165, 25);
  const s3CurveProgress = interpolate(frame, [185, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3TangentOp = fade(frame, 245, 20);
  const s3FormulaOp = fade(frame, 258, 18);

  // Scene 4: 270-390 例题
  const s4Title = fade(frame, 270, 20);
  const s4Func = fade(frame, 288, 20);
  const s4Fx = fade(frame, 318, 20);
  const s4FxResult = fade(frame, 345, 18);
  const s4Fy = fade(frame, 355, 18);
  const s4FyResult = fade(frame, 375, 18);

  // Scene 5: 390-450 高阶偏导
  const s5Title = fade(frame, 390, 20);
  const s5Formula = fade(frame, 408, 20);
  const s5Theorem = fade(frame, 430, 20);

  // Scene 6: 450-540 总结
  const s6Opacity = fade(frame, 450, 30);

  // x₀ = π/2, y₀ = 1
  const x0 = Math.PI / 2;
  const y0 = 1;
  const z0 = Math.sin(x0) + y0 * y0; // sin(π/2) + 1 = 2
  const slope = Math.cos(x0); // ≈ 0

  const scene = frame < 60 ? 1
    : frame < 150 ? 2
    : frame < 270 ? 3
    : frame < 390 ? 4
    : frame < 450 ? 5
    : 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法"
          sectionNum="9.2"
          sectionTitle="偏导数"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 偏导数定义 */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, opacity: s2Title }}>
            偏导数的定义
          </div>

          <div style={{
            opacity: s2Limit,
            padding: "16px 32px",
            border: `2px solid ${COLORS.primaryCurve}`,
            borderRadius: 12,
            backgroundColor: "rgba(97,218,251,0.08)",
          }}>
            <MathFormula
              latex="\frac{\partial f}{\partial x} = \lim_{\Delta x \to 0} \frac{f(x+\Delta x,\,y) - f(x,\,y)}{\Delta x}"
              fontSize={42}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Explain, display: "flex", gap: 36 }}>
            <div style={{
              padding: "12px 20px",
              border: `2px solid ${COLORS.vector}`,
              borderRadius: 8,
              backgroundColor: "rgba(255,215,0,0.1)",
              textAlign: "center",
            }}>
              <div style={{ color: COLORS.vector, fontSize: 20 }}>∂f/∂x</div>
              <div style={{ color: COLORS.annotation, fontSize: 18, marginTop: 6 }}>
                固定 y，对 x 求导
              </div>
            </div>
            <div style={{
              padding: "12px 20px",
              border: `2px solid ${COLORS.secondaryCurve}`,
              borderRadius: 8,
              backgroundColor: "rgba(255,121,198,0.1)",
              textAlign: "center",
            }}>
              <div style={{ color: COLORS.secondaryCurve, fontSize: 20 }}>∂f/∂y</div>
              <div style={{ color: COLORS.annotation, fontSize: 18, marginTop: 6 }}>
                固定 x，对 y 求导
              </div>
            </div>
          </div>

          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 22 }}>
            也记作 fₓ(x, y)、fᵧ(x, y) 或 zₓ、zᵧ
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 几何意义 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s3Title }}>
            几何意义：截面曲线上的切线斜率（y₀=1，z = sin(x)+1）
          </div>

          <CoordinateSystem
            width={900}
            height={420}
            xRange={[-0.5, 7]}
            yRange={[-0.5, 3.5]}
            opacity={s3CoordOp}
          >
            {/* 截面曲线 z = sin(x) + 1 */}
            <FunctionPlot
              fn={(x) => Math.sin(x) + 1}
              color={COLORS.primaryCurve}
              drawProgress={s3CurveProgress}
              strokeWidth={3}
            />
            {/* 切线 */}
            <TangentLine
              x0={x0} y0={z0} slope={slope}
              color={COLORS.secondaryCurve}
              opacity={s3TangentOp}
            />
            {/* 切点 */}
            <TangentDot x={x0} y={z0} color={COLORS.highlight} opacity={s3TangentOp} />
            <SvgLabel x={x0} y={z0} text={`(π/2, ${z0.toFixed(1)})`} color={COLORS.highlight} opacity={s3TangentOp} />
          </CoordinateSystem>

          <div style={{ opacity: s3FormulaOp, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <MathFormula
              latex="\left.\frac{\partial z}{\partial x}\right|_{x=\pi/2,\,y=1} = \cos\!\left(\frac{\pi}{2}\right) = 0"
              fontSize={36}
              color={COLORS.formula}
            />
            <div style={{ color: COLORS.annotation, fontSize: 20 }}>
              切线水平（斜率 = 0），即该点处函数关于 x 的变化率为零
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 例题 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 20,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 30, opacity: s4Title }}>
            例题：求偏导数
          </div>

          <div style={{ opacity: s4Func }}>
            <MathFormula
              latex="z = x^2 y + \sin(xy)"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <div style={{ width: "100%", opacity: s4Fx }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
              视 y 为常数，对 x 求偏导：
            </div>
            <MathFormula
              latex="\frac{\partial z}{\partial x} = 2xy + \cos(xy)\cdot y"
              fontSize={38}
              color={COLORS.primaryCurve}
            />
          </div>

          <div style={{ width: "100%", opacity: s4FxResult }}>
            <MathFormula
              latex="\frac{\partial z}{\partial x} = 2xy + y\cos(xy)"
              fontSize={38}
              color={COLORS.primaryCurve}
            />
          </div>

          <div style={{ width: "100%", opacity: s4Fy }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 6 }}>
              视 x 为常数，对 y 求偏导：
            </div>
            <MathFormula
              latex="\frac{\partial z}{\partial y} = x^2 + \cos(xy)\cdot x"
              fontSize={38}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{ width: "100%", opacity: s4FyResult }}>
            <MathFormula
              latex="\frac{\partial z}{\partial y} = x^2 + x\cos(xy)"
              fontSize={38}
              color={COLORS.secondaryCurve}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 高阶偏导数 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.tertiaryCurve, fontSize: 30, opacity: s5Title }}>
            高阶偏导数：混合偏导数相等定理
          </div>

          <div style={{ opacity: s5Formula }}>
            <MathFormula
              latex="\frac{\partial^2 z}{\partial x \partial y} = \frac{\partial}{\partial x}\!\left(\frac{\partial z}{\partial y}\right), \quad \frac{\partial^2 z}{\partial y \partial x} = \frac{\partial}{\partial y}\!\left(\frac{\partial z}{\partial x}\right)"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <div style={{
            opacity: s5Theorem,
            padding: "16px 28px",
            border: `2px solid ${COLORS.tertiaryCurve}`,
            borderRadius: 10,
            backgroundColor: "rgba(80,250,123,0.08)",
          }}>
            <div style={{ color: COLORS.tertiaryCurve, fontSize: 22, marginBottom: 8 }}>【定理】</div>
            <div style={{ color: COLORS.formula, fontSize: 22 }}>
              若 ∂²z/∂x∂y 与 ∂²z/∂y∂x 在点 (x,y) 处均连续，则：
            </div>
            <div style={{ marginTop: 12 }}>
              <MathFormula
                latex="\frac{\partial^2 z}{\partial x \partial y} = \frac{\partial^2 z}{\partial y \partial x}"
                fontSize={40}
                color={COLORS.tertiaryCurve}
              />
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 6: 总结 */}
      {scene === 6 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 80px",
          }}
        >
          <TheoremBox title="偏导数知识小结" opacity={s6Opacity} width={960}>
            <div style={{ fontSize: 24, lineHeight: 2.3, color: COLORS.formula }}>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>偏导数定义</span>：
                固定其他变量，对某一变量求导数的极限
              </div>
              <div>
                • <span style={{ color: COLORS.secondaryCurve }}>几何意义</span>：
                曲面 z=f(x,y) 与平行坐标面截线在切点处的切线斜率
              </div>
              <div>
                • <span style={{ color: COLORS.tertiaryCurve }}>混合偏导相等</span>：
                在连续条件下 fₓᵧ = fᵧₓ
              </div>
              <div>
                • <span style={{ color: COLORS.vector }}>计算方法</span>：
                视其他变量为常数，按一元函数求导法则计算
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec02Partial;
