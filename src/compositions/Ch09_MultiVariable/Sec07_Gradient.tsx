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

// 等值线（同心圆 f(x,y)=x²+y²=r²）
const ContourCircles: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const { toPixel } = useCoordContext();
  const center = toPixel(0, 0);
  // 画几个等值圆
  const radii = [0.5, 1.0, 1.5, 2.0, 2.5];
  return (
    <g opacity={opacity}>
      {radii.map((r) => {
        // 从数学坐标半径估算像素半径
        const pEdge = toPixel(r, 0);
        const pxRadius = Math.abs(pEdge.px - center.px);
        return (
          <circle
            key={r}
            cx={center.px}
            cy={center.py}
            r={pxRadius}
            fill="none"
            stroke={COLORS.primaryCurve}
            strokeWidth={1.5}
            opacity={0.6}
          />
        );
      })}
      {/* 等值线标注 */}
      {radii.map((r) => {
        const pEdge = toPixel(r + 0.05, 0.05);
        return (
          <text
            key={`label-${r}`}
            x={pEdge.px + 4}
            y={pEdge.py}
            fill={COLORS.primaryCurve}
            fontSize={12}
            opacity={0.7}
          >
            {r * r}
          </text>
        );
      })}
    </g>
  );
};

const Sec07Gradient: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-180 方向导数定义
  const s2Title = fade(frame, 60, 20);
  const s2Def = fade(frame, 78, 20);
  const s2Cosine = fade(frame, 108, 20);
  const s2Formula = fade(frame, 138, 20);
  const s2Note = fade(frame, 162, 18);

  // Scene 3: 180-300 梯度可视化
  const s3Title = fade(frame, 180, 20);
  const s3CoordOp = fade(frame, 195, 25);
  const s3ContourOp = fade(frame, 215, 25);
  const s3FieldOp = fade(frame, 240, 30);
  const s3LabelOp = fade(frame, 275, 20);

  // Scene 4: 300-390 例题
  const s4Title = fade(frame, 300, 20);
  const s4Func = fade(frame, 318, 20);
  const s4GradComp = fade(frame, 340, 20);
  const s4DirComp = fade(frame, 362, 20);
  const s4Result = fade(frame, 378, 18);

  // Scene 5: 390-480 拉格朗日乘数法
  const s5Title = fade(frame, 390, 20);
  const s5Intro = fade(frame, 408, 20);
  const s5System = fade(frame, 435, 20);
  const s5Note = fade(frame, 462, 18);

  // Scene 6: 480-540 总结
  const s6Opacity = fade(frame, 480, 30);

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : frame < 480 ? 5
    : 6;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法"
          sectionNum="9.7"
          sectionTitle="方向导数与梯度"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 方向导数定义 */}
      {scene === 2 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, opacity: s2Title }}>
            方向导数：函数在给定方向 l 的变化率
          </div>

          <div style={{ opacity: s2Def }}>
            <MathFormula
              latex="\frac{\partial f}{\partial \vec{l}} = \lim_{t \to 0^+} \frac{f(x+t\cos\alpha,\,y+t\cos\beta) - f(x,y)}{t}"
              fontSize={36}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Cosine, display: "flex", gap: 32, fontSize: 22 }}>
            <div style={{ color: COLORS.vector }}>cos α — l 方向与 x 轴的方向余弦</div>
            <div style={{ color: COLORS.secondaryCurve }}>cos β — l 方向与 y 轴的方向余弦</div>
          </div>

          <div style={{
            opacity: s2Formula,
            padding: "16px 32px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 12,
            backgroundColor: "rgba(255,107,107,0.08)",
          }}>
            <MathFormula
              latex="\frac{\partial f}{\partial \vec{l}} = f_x \cos\alpha + f_y \cos\beta"
              fontSize={48}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Note, color: COLORS.annotation, fontSize: 22 }}>
            可推广到三元：∂f/∂l = fₓcos α + fᵧcos β + f_z cos γ
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 梯度可视化 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 26, opacity: s3Title, marginBottom: 4 }}>
            梯度 = 函数值增长最快方向（f = x²+y²，grad f = (2x, 2y)）
          </div>

          <CoordinateSystem
            width={800}
            height={460}
            xRange={[-3, 3]}
            yRange={[-3, 3]}
            opacity={s3CoordOp}
          >
            {/* 等值线（同心圆） */}
            <ContourCircles opacity={s3ContourOp} />

            {/* 梯度向量场 grad f = (2x, 2y) */}
            <VectorField
              Px={(x, y) => 2 * x}
              Py={(x, y) => 2 * y}
              gridCount={8}
              scale={0.25}
              color={COLORS.vector}
              opacity={s3FieldOp * 0.85}
            />
          </CoordinateSystem>

          <div style={{ opacity: s3LabelOp, display: "flex", gap: 40, fontSize: 22 }}>
            <div style={{ color: COLORS.primaryCurve }}>— 等值线（x²+y²=C）</div>
            <div style={{ color: COLORS.vector }}>→ 梯度向量（指向函数增长最快方向）</div>
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
            gap: 22,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 28, opacity: s4Title }}>
            例题：u = xyz，在点(1,1,1)沿 l=(1,1,1)/√3 方向的方向导数
          </div>

          <div style={{ opacity: s4Func }}>
            <MathFormula
              latex="u = xyz, \quad \text{点 }(1,1,1), \quad \vec{l} = \frac{1}{\sqrt{3}}(1,1,1)"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>

          <div style={{ width: "100%", opacity: s4GradComp }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>计算梯度各分量：</div>
            <MathFormula
              latex="u_x = yz,\; u_y = xz,\; u_z = xy \;\Rightarrow\; \nabla u\big|_{(1,1,1)} = (1,\,1,\,1)"
              fontSize={32}
              color={COLORS.primaryCurve}
            />
          </div>

          <div style={{ width: "100%", opacity: s4DirComp }}>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>代入方向导数公式：</div>
            <MathFormula
              latex="\frac{\partial u}{\partial \vec{l}} = 1\cdot\frac{1}{\sqrt{3}} + 1\cdot\frac{1}{\sqrt{3}} + 1\cdot\frac{1}{\sqrt{3}}"
              fontSize={36}
              color={COLORS.formula}
            />
          </div>

          <div style={{
            opacity: s4Result,
            padding: "12px 28px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 8,
          }}>
            <MathFormula
              latex="\frac{\partial u}{\partial \vec{l}} = \frac{3}{\sqrt{3}} = \sqrt{3}"
              fontSize={44}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 拉格朗日乘数法 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 30, opacity: s5Title }}>
            拉格朗日乘数法（条件极值）
          </div>

          <div style={{ opacity: s5Intro, color: COLORS.annotation, fontSize: 24, textAlign: "center" }}>
            求 f(x,y) 在约束条件 g(x,y)=0 下的极值<br />
            梯度方向关系：<span style={{ color: COLORS.secondaryCurve }}>∇f = λ·∇g</span>
          </div>

          <div style={{
            opacity: s5System,
            padding: "16px 28px",
            border: `2px solid ${COLORS.secondaryCurve}`,
            borderRadius: 12,
            backgroundColor: "rgba(255,121,198,0.08)",
          }}>
            <MathFormula
              latex="\begin{cases} f_x = \lambda g_x \\ f_y = \lambda g_y \\ g(x,y) = 0 \end{cases}"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s5Note, color: COLORS.annotation, fontSize: 22 }}>
            解方程组得驻点 (x, y) 和参数 λ（<span style={{ color: COLORS.highlight }}>拉格朗日乘数</span>）
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
          <TheoremBox title="梯度公式总结" opacity={s6Opacity} width={960}>
            <div style={{ fontSize: 24, lineHeight: 2.4, color: COLORS.formula }}>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>方向导数</span>：
                ∂f/∂l = fₓcos α + fᵧcos β（+ f_z cos γ）
              </div>
              <div>
                • <span style={{ color: COLORS.vector }}>梯度定义</span>：
                grad f = ∇f = (fₓ, fᵧ)，指向函数增长最快方向
              </div>
              <div>
                • <span style={{ color: COLORS.highlight }}>方向导数与梯度关系</span>：
                ∂f/∂l = ∇f · l⃗° = |∇f|cos θ
              </div>
              <div>
                • <span style={{ color: COLORS.secondaryCurve }}>梯度方向</span>：
                = 函数值增长最快方向；梯度⊥等值线
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec07Gradient;
