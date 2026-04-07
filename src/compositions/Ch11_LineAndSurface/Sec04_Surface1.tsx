import React from "react";
import { AbsoluteFill, useCurrentFrame, interpolate, Sequence } from "remotion";
import { MathFormula } from "../../components/math/MathFormula";
import { TitleCard } from "../../components/ui/TitleCard";
import { TheoremBox } from "../../components/ui/TheoremBox";
import { COLORS } from "../../constants/colorTheme";

const fade = (frame: number, start: number, dur = 30) =>
  interpolate(frame, [start, start + dur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

const Sec04Surface1: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 130, 25);
  const t4 = fade(frame, 160, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="十一"
          chapterTitle="曲线积分与曲面积分"
          sectionNum="11.4"
          sectionTitle="对面积的曲面积分（第一类）"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：核心公式 60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 28,
            padding: "40px 120px",
          }}
        >
          <div style={{ opacity: t1 }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 26, marginBottom: 10 }}>
              第一类曲面积分的定义（对面积微元）
            </div>
            <MathFormula
              latex="\iint_\Sigma f(x,y,z)\,dS"
              fontSize={52}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.highlight, fontSize: 24, marginBottom: 10 }}>
              化为二重积分的计算公式（曲面 z = z(x,y)）
            </div>
            <MathFormula
              latex="\iint_\Sigma f\,dS = \iint_D f(x,y,z(x,y))\sqrt{1+z_x^2+z_y^2}\,dA"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 22, marginBottom: 8 }}>
              面积微元 dS 与投影面积 dA 的关系：
            </div>
            <MathFormula
              latex="dS = \sqrt{1 + \left(\frac{\partial z}{\partial x}\right)^2 + \left(\frac{\partial z}{\partial y}\right)^2}\,dA"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4, color: COLORS.annotation, fontSize: 20 }}>
            物理意义：曲面上密度 f(x,y,z) 的总质量；f ≡ 1 时积分为曲面面积
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：总结 180-300 */}
      <Sequence from={180} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 32,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="第一类曲面积分性质" opacity={thm1} width={960}>
            <div style={{ fontSize: 22, lineHeight: 2.1, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                与曲面方向无关（只与曲面形状有关），dS &gt; 0 恒成立
              </div>
              <div style={{ opacity: thm2 }}>
                线性性：∬(af + bg)dS = a∬f dS + b∬g dS
              </div>
              <div style={{ opacity: thm3 }}>
                可加性：Σ = Σ₁ ∪ Σ₂ ⇒ ∬_Σ = ∬_Σ₁ + ∬_Σ₂
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm2, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 21, marginBottom: 8 }}>
              例：求球面 x²+y²+z²=a² 的面积（令 f=1）
            </div>
            <MathFormula
              latex="\iint_{x^2+y^2+z^2=a^2} dS = 4\pi a^2"
              fontSize={48}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec04Surface1;
