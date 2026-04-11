import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Sec06Line: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-180 对称式方程
  const s2Title = fade(frame, 60, 20);
  const s2Concept = fade(frame, 80, 20);
  const s2Formula = fade(frame, 110, 20);
  const s2Explain = fade(frame, 145, 20);
  const s2Example = fade(frame, 162, 18);

  // Scene 3: 180-300 参数方程与对称式的关系
  const s3Title = fade(frame, 180, 20);
  const s3Param = fade(frame, 200, 20);
  const s3Relation = fade(frame, 235, 20);
  const s3TwoPlane = fade(frame, 265, 20);
  const s3TwoPlaneEq = fade(frame, 278, 18);

  // Scene 4: 300-390 直线与平面夹角
  const s4Title = fade(frame, 300, 20);
  const s4Diagram = fade(frame, 320, 20);
  const s4Formula = fade(frame, 345, 20);
  const s4Perp = fade(frame, 368, 18);
  const s4Para = fade(frame, 378, 18);

  // Scene 5: 390-480 总结
  const s5Opacity = fade(frame, 390, 30);

  const scene = frame < 60 ? 1
    : frame < 180 ? 2
    : frame < 300 ? 3
    : frame < 390 ? 4
    : 5;

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* Scene 1: 标题 */}
      {scene === 1 && (
        <TitleCard
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.6"
          sectionTitle="空间直线及其方程"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 对称式方程 */}
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
            直线的对称式（点向式）方程
          </div>

          <div style={{ opacity: s2Concept, display: "flex", gap: 36, alignItems: "center" }}>
            <div style={{
              padding: "12px 20px",
              border: `2px solid ${COLORS.vector}`,
              borderRadius: 8,
              backgroundColor: "rgba(255,215,0,0.1)",
            }}>
              <div style={{ color: COLORS.vector, fontSize: 20 }}>已知条件</div>
              <div style={{ color: COLORS.formula, fontSize: 18, marginTop: 6 }}>
                过点 M₀(x₀, y₀, z₀)<br />
                方向向量 v⃗ = (l, m, n)
              </div>
            </div>
          </div>

          <div style={{
            opacity: s2Formula,
            padding: "16px 32px",
            border: `2px solid ${COLORS.primaryCurve}`,
            borderRadius: 12,
            backgroundColor: "rgba(97,218,251,0.08)",
          }}>
            <MathFormula
              latex="\frac{x - x_0}{l} = \frac{y - y_0}{m} = \frac{z - z_0}{n}"
              fontSize={50}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s2Explain, color: COLORS.annotation, fontSize: 22, textAlign: "center" }}>
            其中 v⃗ = (l, m, n) 为直线的<span style={{ color: COLORS.vector }}> 方向向量</span>，
            l, m, n 称为<span style={{ color: COLORS.vector }}> 方向数</span>
          </div>

          <div style={{ opacity: s2Example }}>
            <MathFormula
              latex="\text{例：过 }(1,2,3)\text{ 方向 }(2,-1,4)\text{：}\;\frac{x-1}{2}=\frac{y-2}{-1}=\frac{z-3}{4}"
              fontSize={28}
              color={COLORS.annotation}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 参数方程与对称式 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.secondaryCurve, fontSize: 30, opacity: s3Title }}>
            参数方程与对称式
          </div>

          <div style={{ opacity: s3Param }}>
            <MathFormula
              latex={"\begin{cases} x = x_0 + lt \\ y = y_0 + mt \\ z = z_0 + nt \end{cases} \quad (t \in \mathbb{R})"}
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s3Relation, display: "flex", gap: 16, alignItems: "center", fontSize: 24 }}>
            <div style={{ color: COLORS.annotation }}>令各式 =</div>
            <div style={{ color: COLORS.secondaryCurve, fontWeight: "bold" }}>t</div>
            <div style={{ color: COLORS.annotation }}>即得对称式（反之亦然）</div>
          </div>

          <div style={{ opacity: s3TwoPlane, marginTop: 8, color: COLORS.primaryCurve, fontSize: 26 }}>
            直线也可表示为两平面的交线：
          </div>

          <div style={{ opacity: s3TwoPlaneEq }}>
            <MathFormula
              latex={"L: \begin{cases} A_1x+B_1y+C_1z+D_1=0 \\ A_2x+B_2y+C_2z+D_2=0 \end{cases}"}
              fontSize={36}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 直线与平面夹角 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 24,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.highlight, fontSize: 30, opacity: s4Title }}>
            直线与平面的夹角
          </div>

          <div style={{ opacity: s4Diagram, display: "flex", gap: 48 }}>
            <div style={{
              padding: "16px 20px",
              border: `2px solid ${COLORS.annotation}`,
              borderRadius: 8,
              fontSize: 20,
              color: COLORS.annotation,
              lineHeight: 1.8,
            }}>
              直线方向向量：v⃗ = (l, m, n)<br />
              平面法向量：n⃗ = (A, B, C)<br />
              夹角 φ：直线与平面所成角<br />
              <span style={{ color: COLORS.highlight }}>（0 ≤ φ ≤ π/2）</span>
            </div>
          </div>

          <div style={{
            opacity: s4Formula,
            padding: "16px 32px",
            border: `2px solid ${COLORS.highlight}`,
            borderRadius: 12,
            backgroundColor: "rgba(255,107,107,0.08)",
          }}>
            <MathFormula
              latex="\sin\varphi = \frac{|\vec{n}\cdot\vec{v}|}{|\vec{n}||\vec{v}|} = \frac{|Al+Bm+Cn|}{\sqrt{A^2+B^2+C^2}\,\sqrt{l^2+m^2+n^2}}"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <div style={{ display: "flex", gap: 40, fontSize: 22 }}>
            <div style={{
              opacity: s4Perp,
              padding: "10px 20px",
              border: `1px solid ${COLORS.primaryCurve}`,
              borderRadius: 8,
              color: COLORS.primaryCurve,
            }}>
              直线⊥平面：Al + Bm + Cn = 0 不对，<br />
              应为：Al + Bm + Cn ≠ 0<br />
              <span style={{ color: COLORS.highlight }}>⊥条件：(l,m,n) ∥ (A,B,C)</span>
            </div>
            <div style={{
              opacity: s4Para,
              padding: "10px 20px",
              border: `1px solid ${COLORS.secondaryCurve}`,
              borderRadius: 8,
              color: COLORS.secondaryCurve,
            }}>
              直线∥平面：<br />
              <span style={{ color: COLORS.highlight }}>∥条件：Al + Bm + Cn = 0</span>
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 总结 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 80px",
          }}
        >
          <TheoremBox title="空间直线方程总结" opacity={s5Opacity} width={1000}>
            <div style={{ fontSize: 24, lineHeight: 2.4, color: COLORS.formula }}>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>对称式</span>：
                (x−x₀)/l = (y−y₀)/m = (z−z₀)/n，方向向量 v⃗=(l,m,n)
              </div>
              <div>
                • <span style={{ color: COLORS.secondaryCurve }}>参数式</span>：
                x=x₀+lt，y=y₀+mt，z=z₀+nt，参数 t∈ℝ
              </div>
              <div>
                • <span style={{ color: COLORS.tertiaryCurve }}>两平面交线式</span>：
                联立两平面方程，方向向量 = n⃗₁ × n⃗₂
              </div>
              <div>
                • <span style={{ color: COLORS.highlight }}>线面夹角</span>：
                sin φ = |n⃗·v⃗| / (|n⃗||v⃗|)，φ ∈ [0, π/2]
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec06Line;
