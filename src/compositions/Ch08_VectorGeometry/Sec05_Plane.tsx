import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";
import { COLORS } from "../../constants/colorTheme";
import { TitleCard } from "../../components/ui/TitleCard";
import { MathFormula } from "../../components/math/MathFormula";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { StepByStep } from "../../components/ui/StepByStep";

const fade = (frame: number, start: number, duration = 30) =>
  interpolate(frame, [start, start + duration], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Sec05Plane: React.FC = () => {
  const frame = useCurrentFrame();

  // Scene 1: 0-60 标题
  const titleOpacity = fade(frame, 0, 30);

  // Scene 2: 60-180 点法式方程推导
  const s2Title = fade(frame, 60, 20);
  const s2Step1 = fade(frame, 80, 20);
  const s2Step2 = fade(frame, 110, 20);
  const s2Step3 = fade(frame, 140, 20);
  const s2Eq = fade(frame, 160, 20);

  // Scene 3: 180-300 一般式展开
  const s3Title = fade(frame, 180, 20);
  const s3Expand = fade(frame, 200, 20);
  const s3General = fade(frame, 240, 20);
  const s3HighA = fade(frame, 260, 15);
  const s3HighB = fade(frame, 268, 15);
  const s3HighC = fade(frame, 276, 15);
  const s3HighD = fade(frame, 284, 15);

  // Scene 4: 300-390 点到平面距离
  const s4Title = fade(frame, 300, 20);
  const s4Formula = fade(frame, 320, 20);
  const s4Example = fade(frame, 350, 20);
  const s4Result = fade(frame, 375, 20);

  // Scene 5: 390-480 特殊平面
  const s5Opacity = fade(frame, 390, 30);

  // 当前步骤（Scene 2）
  const derivStep = frame < 80 ? -1
    : frame < 110 ? 0
    : frame < 140 ? 1
    : 2;

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
          sectionNum="8.5"
          sectionTitle="平面及其方程"
          opacity={titleOpacity}
        />
      )}

      {/* Scene 2: 点法式方程推导 */}
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
          <div style={{ color: COLORS.primaryCurve, fontSize: 30, opacity: s2Title, marginBottom: 8 }}>
            平面的点法式方程推导
          </div>

          <div style={{ opacity: s2Step1, display: "flex", gap: 40, alignItems: "center" }}>
            <div style={{
              padding: "12px 20px",
              border: `2px solid ${COLORS.vector}`,
              borderRadius: 8,
              backgroundColor: "rgba(255,215,0,0.1)",
            }}>
              <div style={{ color: COLORS.vector, fontSize: 22 }}>已知条件</div>
              <div style={{ color: COLORS.formula, fontSize: 20, marginTop: 6 }}>
                法向量 n⃗ = (A, B, C)<br />
                过点 M₀(x₀, y₀, z₀)
              </div>
            </div>
          </div>

          <div style={{ opacity: s2Step2 }}>
            <MathFormula
              latex="\overrightarrow{M_0M} = (x - x_0,\; y - y_0,\; z - z_0)"
              fontSize={36}
              color={COLORS.annotation}
            />
          </div>

          <div style={{ opacity: s2Step3, display: "flex", flexDirection: "column", gap: 8, alignItems: "center" }}>
            <div style={{ color: COLORS.highlight, fontSize: 24 }}>
              因为 n⃗ ⊥ M₀M⃗，所以 n⃗ · M₀M⃗ = 0：
            </div>
          </div>

          <div style={{
            opacity: s2Eq,
            padding: "16px 32px",
            border: `2px solid ${COLORS.primaryCurve}`,
            borderRadius: 12,
            backgroundColor: "rgba(97,218,251,0.08)",
          }}>
            <MathFormula
              latex="A(x-x_0) + B(y-y_0) + C(z-z_0) = 0"
              fontSize={46}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 3: 一般式展开 */}
      {scene === 3 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.primaryCurve, fontSize: 28, opacity: s3Title }}>
            展开得平面一般方程
          </div>

          <div style={{ opacity: s3Expand }}>
            <MathFormula
              latex="Ax - Ax_0 + By - By_0 + Cz - Cz_0 = 0"
              fontSize={38}
              color={COLORS.annotation}
            />
          </div>

          <div style={{
            opacity: s3General,
            padding: "16px 32px",
            border: `2px solid ${COLORS.secondaryCurve}`,
            borderRadius: 12,
            backgroundColor: "rgba(255,121,198,0.08)",
          }}>
            <MathFormula
              latex="Ax + By + Cz + D = 0"
              fontSize={56}
              color={COLORS.formula}
            />
          </div>

          <div style={{ display: "flex", gap: 32, fontSize: 22 }}>
            <div style={{ color: COLORS.primaryCurve, opacity: s3HighA }}>
              A → n⃗ 的 x 分量
            </div>
            <div style={{ color: COLORS.secondaryCurve, opacity: s3HighB }}>
              B → n⃗ 的 y 分量
            </div>
            <div style={{ color: COLORS.tertiaryCurve, opacity: s3HighC }}>
              C → n⃗ 的 z 分量
            </div>
            <div style={{ color: COLORS.highlight, opacity: s3HighD }}>
              D = −(Ax₀+By₀+Cz₀)
            </div>
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 4: 点到平面距离 */}
      {scene === 4 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 120px",
          }}
        >
          <div style={{ color: COLORS.vector, fontSize: 30, opacity: s4Title }}>
            点到平面的距离公式
          </div>

          <div style={{
            opacity: s4Formula,
            padding: "16px 32px",
            border: `2px solid ${COLORS.vector}`,
            borderRadius: 12,
            backgroundColor: "rgba(255,215,0,0.08)",
          }}>
            <MathFormula
              latex="d = \frac{|Ax_0 + By_0 + Cz_0 + D|}{\sqrt{A^2+B^2+C^2}}"
              fontSize={48}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: s4Example, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 24 }}>
              例：点 P(1, 2, 3) 到平面 x + 2y − 2z + 1 = 0 的距离
            </div>
            <MathFormula
              latex="d = \frac{|1 + 2\times2 + (-2)\times3 + 1|}{\sqrt{1^2+2^2+(-2)^2}} = \frac{|1+4-6+1|}{\sqrt{9}}"
              fontSize={34}
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
              latex="d = \frac{0}{3} = 0 \implies \text{点在平面上}"
              fontSize={36}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      )}

      {/* Scene 5: 特殊平面定理框 */}
      {scene === 5 && (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            padding: "0 80px",
          }}
        >
          <TheoremBox title="三种特殊平面" opacity={s5Opacity} width={1000}>
            <div style={{ fontSize: 24, lineHeight: 2.5, color: COLORS.formula }}>
              <div>
                • <span style={{ color: COLORS.primaryCurve }}>过原点</span>（D = 0）：
                <span style={{ marginLeft: 8 }}>Ax + By + Cz = 0</span>
              </div>
              <div>
                • <span style={{ color: COLORS.secondaryCurve }}>平行于 z 轴</span>（C = 0）：
                <span style={{ marginLeft: 8 }}>Ax + By + D = 0</span>
              </div>
              <div>
                • <span style={{ color: COLORS.tertiaryCurve }}>xOy 坐标平面</span>（A=B=0）：
                <span style={{ marginLeft: 8 }}>z = 0（即 Cz = 0）</span>
              </div>
              <div>
                • <span style={{ color: COLORS.vector }}>法向量</span>：
                <span style={{ marginLeft: 8 }}>n⃗ = (A, B, C) 垂直于平面</span>
              </div>
            </div>
          </TheoremBox>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default Sec05Plane;
