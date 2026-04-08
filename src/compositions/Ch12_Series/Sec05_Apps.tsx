import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { CoordinateSystem, useCoordContext } from "../../components/math/CoordinateSystem";
import { FunctionPlot } from "../../components/math/FunctionPlot";
import { Arrow } from "../../components/math/Arrow";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

// eˣ 及其泰勒近似可视化
const TaylorApproxEx: React.FC<{
  order1Progress: number;
  order2Progress: number;
  order3Progress: number;
  trueOp: number;
}> = ({ order1Progress, order2Progress, order3Progress, trueOp }) => {
  return (
    <>
      {/* 真实函数 eˣ（白色） */}
      <FunctionPlot
        fn={(x) => Math.exp(x)}
        color={COLORS.formula}
        strokeWidth={2.5}
        drawProgress={trueOp}
        opacity={trueOp}
      />
      {/* 1阶：y = 1+x（蓝色） */}
      {order1Progress > 0 && (
        <FunctionPlot
          fn={(x) => 1 + x}
          color={COLORS.primaryCurve}
          strokeWidth={2.5}
          drawProgress={order1Progress}
        />
      )}
      {/* 2阶：y = 1+x+x²/2（绿色） */}
      {order2Progress > 0 && (
        <FunctionPlot
          fn={(x) => 1 + x + x * x / 2}
          color={COLORS.tertiaryCurve}
          strokeWidth={2.5}
          drawProgress={order2Progress}
        />
      )}
      {/* 3阶：y = 1+x+x²/2+x³/6（黄色） */}
      {order3Progress > 0 && (
        <FunctionPlot
          fn={(x) => 1 + x + x * x / 2 + x * x * x / 6}
          color={COLORS.vector}
          strokeWidth={2.5}
          drawProgress={order3Progress}
        />
      )}
    </>
  );
};

// 欧拉公式：单位圆 + 旋转点 + 投影
const EulerCircle: React.FC<{ theta: number; opacity: number }> = ({ theta, opacity }) => {
  const { toPixel } = useCoordContext();
  const cosT = Math.cos(theta);
  const sinT = Math.sin(theta);

  const { px: ox, py: oy } = toPixel(0, 0);
  const { px: rx } = toPixel(1, 0);
  const pxR = Math.abs(rx - ox);

  const { px: ptX, py: ptY } = toPixel(cosT, sinT);
  const { px: projX } = toPixel(cosT, 0);
  const { py: projY } = toPixel(0, sinT);

  return (
    <g opacity={opacity}>
      {/* 单位圆（虚线） */}
      <circle
        cx={ox} cy={oy} r={pxR}
        fill="none"
        stroke={COLORS.secondaryCurve}
        strokeWidth={2}
        strokeDasharray="7 4"
      />
      {/* 从原点到点的向量 */}
      <Arrow fromX={0} fromY={0} toX={cosT} toY={sinT}
        color={COLORS.primaryCurve} strokeWidth={3} opacity={1} />
      {/* x轴投影虚线（cos θ） */}
      <line
        x1={ptX} y1={ptY}
        x2={projX} y2={oy}
        stroke={COLORS.vector}
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      {/* y轴投影虚线（sin θ） */}
      <line
        x1={ptX} y1={ptY}
        x2={ox} y2={projY}
        stroke={COLORS.highlight}
        strokeWidth={1.5}
        strokeDasharray="5 3"
      />
      {/* 圆上的点 */}
      <circle cx={ptX} cy={ptY} r={6} fill={COLORS.primaryCurve} />
      {/* 角度弧 */}
      <path
        d={`M ${ox + 30} ${oy} A 30 30 0 0 ${sinT >= 0 ? 0 : 1} ${ox + 30 * Math.cos(theta)} ${oy - 30 * Math.sin(theta)}`}
        fill="none"
        stroke={COLORS.annotation}
        strokeWidth={1.5}
      />
      {/* 标注 */}
      <text x={projX} y={oy + 22} textAnchor="middle"
        fill={COLORS.vector} fontSize={16}>cos θ</text>
      <text x={ox - 52} y={projY} dominantBaseline="middle"
        fill={COLORS.highlight} fontSize={16}>sin θ</text>
      <text x={ox + 36} y={oy - 14}
        fill={COLORS.annotation} fontSize={15}>θ</text>
      <text x={ptX + 10} y={ptY - 10}
        fill={COLORS.primaryCurve} fontSize={16}>
        e^(iθ)
      </text>
    </g>
  );
};

const Sec05Apps: React.FC = () => {
  const frame = useCurrentFrame();

  const scene =
    frame < 80 ? 1
    : frame < 180 ? 2
    : frame < 290 ? 3
    : frame < 380 ? 4
    : 5;

  // Scene 1
  const s1Op = fade(frame, 0);

  // Scene 2: 近似计算
  const s2Title = fade(frame, 80, 20);
  const s2Series = fade(frame, 100, 20);
  const s2Approx = fade(frame, 130, 20);
  const s2Thm = fade(frame, 152, 22);
  const s2P1 = fade(frame, 163, 18);

  // Scene 3: 泰勒逼近可视化
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 196, 20);
  const trueOp = fade(frame, 200, 18);
  const order1Progress = interpolate(frame, [210, 240], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const order2Progress = interpolate(frame, [248, 268], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const order3Progress = interpolate(frame, [270, 285], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s3Legend = fade(frame, 274, 14);

  // Scene 4: 求和函数
  const s4Title = fade(frame, 290, 20);
  const s4Setup = fade(frame, 308, 20);
  const s4Step1 = fade(frame, 330, 20);
  const s4Step2 = fade(frame, 352, 20);
  const s4Result = fade(frame, 368, 18);

  // Scene 5: 欧拉公式
  const s5Title = fade(frame, 380, 20);
  const s5Formula1 = fade(frame, 398, 20);
  const s5Formula2 = fade(frame, 420, 20);
  const s5CoordOp = fade(frame, 432, 20);
  const theta = interpolate(frame, [432, 476], [0, Math.PI / 3], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const s5Euler = fade(frame, 460, 18);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.5"
          sectionTitle="幂级数的应用"
          opacity={s1Op}
        />
      )}

      {/* Scene 2: 应用1 近似计算 */}
      {scene === 2 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 22, padding: "0 100px" }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 26, opacity: s2Title }}>
            应用一：近似计算 — 估算 e^0.1
          </div>
          <div style={{ opacity: s2Series }}>
            <MathFormula
              latex="e^x = 1 + x + \frac{x^2}{2!} + \frac{x^3}{3!} + \cdots + \frac{x^n}{n!} + R_n(x)"
              fontSize={32}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s2Approx }}>
            <MathFormula
              latex="e^{0.1} \approx 1 + 0.1 + \frac{(0.1)^2}{2} + \frac{(0.1)^3}{6} = 1 + 0.1 + 0.005 + 0.000167 \approx 1.10517"
              fontSize={26}
              color={COLORS.highlight}
            />
          </div>
          <div style={{ opacity: s2Thm, width: "100%" }}>
            <TheoremBox title="截断误差估计（拉格朗日余项）" opacity={s2Thm} width={960}>
              <div style={{ fontSize: 21, lineHeight: 2.1, color: COLORS.formula }}>
                <div style={{ opacity: s2P1 }}>
                  <MathFormula
                    latex="|R_n(x)| = \left|\frac{f^{(n+1)}(\xi)}{(n+1)!}x^{n+1}\right| \leq \frac{M}{(n+1)!}|x|^{n+1}"
                    fontSize={26}
                    color={COLORS.formula}
                  />
                </div>
                <div style={{ opacity: s2P1, marginTop: 6 }}>
                  取 n=3, x=0.1：误差 ≤ e^{0.1}·(0.1)⁴/24 ≈ 4.6×10⁻⁶（精度很高）
                </div>
              </div>
            </TheoremBox>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 泰勒多项式逼近可视化 */}
      {scene === 3 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 14 }}>
          <div style={{ color: COLORS.primaryCurve, fontSize: 24, opacity: s3Title }}>
            eˣ 的泰勒多项式逼近（x ∈ [−2, 2]）
          </div>
          <CoordinateSystem
            width={760}
            height={380}
            xRange={[-2, 2]}
            yRange={[-1, 8]}
            opacity={s3CoordOp}
          >
            <TaylorApproxEx
              trueOp={trueOp}
              order1Progress={order1Progress}
              order2Progress={order2Progress}
              order3Progress={order3Progress}
            />
          </CoordinateSystem>
          <div style={{ display: "flex", gap: 32, opacity: s3Legend }}>
            <span style={{ color: COLORS.formula, fontSize: 16 }}>— eˣ（精确）</span>
            <span style={{ color: COLORS.primaryCurve, fontSize: 16 }}>— 1+x（1阶）</span>
            <span style={{ color: COLORS.tertiaryCurve, fontSize: 16 }}>— 1+x+x²/2（2阶）</span>
            <span style={{ color: COLORS.vector, fontSize: 16 }}>— +x³/6（3阶）</span>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 应用2 求和函数 */}
      {scene === 4 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 24, padding: "0 120px" }}>
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s4Title }}>
            应用二：逐项求导法求和函数
          </div>
          <div style={{ opacity: s4Setup }}>
            <MathFormula
              latex="\text{求 } S(x) = \sum_{n=1}^\infty n\,x^n \text{ 的和函数（}|x|<1\text{）}"
              fontSize={28}
              color={COLORS.annotation}
            />
          </div>
          <div style={{ opacity: s4Step1 }}>
            <MathFormula
              latex="\text{步骤1：}\sum_{n=1}^\infty x^n = \frac{x}{1-x},\quad |x|<1"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Step2 }}>
            <MathFormula
              latex="\text{步骤2：对 } x \text{ 求导：}\sum_{n=1}^\infty n\,x^{n-1} = \frac{1}{(1-x)^2}"
              fontSize={28}
              color={COLORS.formula}
            />
          </div>
          <div style={{ opacity: s4Result, padding: "10px 28px", border: `2px solid ${COLORS.highlight}`, borderRadius: 10 }}>
            <MathFormula
              latex="S(x) = \sum_{n=1}^\infty n\,x^n = \frac{x}{(1-x)^2},\quad |x|<1"
              fontSize={34}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 应用3 欧拉公式 */}
      {scene === 5 && (
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 16, padding: "0 80px" }}>
          <div style={{ color: COLORS.secondaryCurve, fontSize: 26, opacity: s5Title }}>
            应用三：欧拉公式的推导
          </div>
          <div style={{ display: "flex", gap: 48, alignItems: "center", width: "100%" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 18 }}>
              <div style={{ opacity: s5Formula1 }}>
                <MathFormula
                  latex="e^{ix} = 1 + ix + \frac{(ix)^2}{2!} + \frac{(ix)^3}{3!} + \cdots"
                  fontSize={26}
                  color={COLORS.formula}
                />
              </div>
              <div style={{ opacity: s5Formula2 }}>
                <MathFormula
                  latex="= \left(1 - \frac{x^2}{2!} + \frac{x^4}{4!}-\cdots\right) + i\left(x - \frac{x^3}{3!}+\frac{x^5}{5!}-\cdots\right)"
                  fontSize={23}
                  color={COLORS.formula}
                />
              </div>
              <div style={{ opacity: s5Euler, padding: "10px 20px", border: `2px solid ${COLORS.secondaryCurve}`, borderRadius: 10 }}>
                <MathFormula
                  latex="e^{i\theta} = \cos\theta + i\sin\theta"
                  fontSize={38}
                  color={COLORS.secondaryCurve}
                />
              </div>
              <div style={{ opacity: s5Euler, color: COLORS.annotation, fontSize: 18 }}>
                令 θ = π：e^(iπ) + 1 = 0（欧拉恒等式）
              </div>
            </div>
            <CoordinateSystem
              width={380}
              height={340}
              xRange={[-1.6, 1.8]}
              yRange={[-1.5, 1.5]}
              opacity={s5CoordOp}
              showLabels={false}
              showGrid={false}
            >
              <EulerCircle theta={theta} opacity={s5CoordOp} />
            </CoordinateSystem>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec05Apps;
