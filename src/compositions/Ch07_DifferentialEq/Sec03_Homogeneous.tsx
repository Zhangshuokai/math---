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

const Sec03Homogeneous: React.FC = () => {
  const frame = useCurrentFrame();

  // 场景1: 0-60 标题卡
  // 场景2: 60-180 核心公式
  // 场景3: 180-300 定理框总结

  const titleOpacity = fade(frame, 0, 30);

  const eq1Opacity = fade(frame, 65, 25);
  const eq2Opacity = fade(frame, 95, 25);
  const eq3Opacity = fade(frame, 125, 25);
  const eq4Opacity = fade(frame, 155, 25);

  const thm1Opacity = fade(frame, 185, 25);
  const thm2Opacity = fade(frame, 220, 25);
  const thm3Opacity = fade(frame, 255, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.3"
          sectionTitle="齐次方程"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：核心公式 60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 32,
            padding: "0 120px",
          }}
        >
          <div style={{ opacity: eq1Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 26, marginBottom: 12 }}>
              齐次方程的标准形式
            </div>
            <MathFormula
              latex="\frac{dy}{dx} = \varphi\!\left(\frac{y}{x}\right)"
              fontSize={56}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: eq2Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 24, marginBottom: 10 }}>
              令 <span style={{ color: COLORS.highlight }}>u = y/x</span>，则 y = ux，对 x 求导：
            </div>
            <MathFormula
              latex="\frac{dy}{dx} = u + x\frac{du}{dx}"
              fontSize={48}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: eq3Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 24, marginBottom: 10 }}>
              代入原方程，化为可分离变量方程：
            </div>
            <MathFormula
              latex="x\frac{du}{dx} = \varphi(u) - u"
              fontSize={48}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{ opacity: eq4Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              例：dy/dx = (y/x) + tan(y/x)，令 u = y/x：
            </div>
            <MathFormula
              latex="x\frac{du}{dx} = \tan u \;\Rightarrow\; \frac{du}{\tan u} = \frac{dx}{x}"
              fontSize={40}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：定理框总结 180-300 */}
      <Sequence from={180} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 36,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="齐次方程求解步骤" opacity={thm1Opacity} width={960}>
            <div style={{ fontSize: 24, lineHeight: 2.0, color: COLORS.formula }}>
              <div style={{ opacity: thm1Opacity }}>
                1. 验证方程可写为 <span style={{ color: COLORS.primaryCurve }}>dy/dx = φ(y/x)</span> 的形式
              </div>
              <div style={{ opacity: thm2Opacity }}>
                2. 令 <span style={{ color: COLORS.highlight }}>u = y/x</span>，则 dy/dx = u + x(du/dx)
              </div>
              <div style={{ opacity: thm2Opacity }}>
                3. 代入后得可分离变量方程：<span style={{ color: COLORS.secondaryCurve }}>x du/dx = φ(u) − u</span>
              </div>
              <div style={{ opacity: thm3Opacity }}>
                4. 分离变量积分，最后将 u 换回 y/x 得通解
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 10 }}>
              例题通解（dy/dx = y/x + tan(y/x)）：
            </div>
            <MathFormula
              latex="\sin\!\left(\frac{y}{x}\right) = Cx"
              fontSize={52}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec03Homogeneous;
