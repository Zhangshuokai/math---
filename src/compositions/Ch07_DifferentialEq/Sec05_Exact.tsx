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

const Sec05Exact: React.FC = () => {
  const frame = useCurrentFrame();

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
          sectionNum="7.5"
          sectionTitle="全微分方程"
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
            gap: 36,
            padding: "0 120px",
          }}
        >
          <div style={{ opacity: eq1Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 26, marginBottom: 12 }}>
              全微分方程的标准形式
            </div>
            <MathFormula
              latex="P(x,y)\,dx + Q(x,y)\,dy = 0"
              fontSize={52}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: eq2Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 24, marginBottom: 10 }}>
              恰当条件（可积条件）：
            </div>
            <MathFormula
              latex="\frac{\partial P}{\partial y} = \frac{\partial Q}{\partial x}"
              fontSize={52}
              color={COLORS.highlight}
            />
          </div>

          <div style={{ opacity: eq3Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 24, marginBottom: 10 }}>
              此时存在势函数 u(x,y) 使得 du = P dx + Q dy，求解方法：
            </div>
            <MathFormula
              latex="u = \int P\,dx + \varphi(y)"
              fontSize={46}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{ opacity: eq4Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              由 ∂u/∂y = Q 确定 φ(y)，通解为：
            </div>
            <MathFormula
              latex="u(x,y) = C"
              fontSize={52}
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
          <TheoremBox title="全微分方程判定与求解" opacity={thm1Opacity} width={960}>
            <div style={{ fontSize: 24, lineHeight: 2.0, color: COLORS.formula }}>
              <div style={{ opacity: thm1Opacity }}>
                若 <span style={{ color: COLORS.highlight }}>∂P/∂y = ∂Q/∂x</span>，则方程为全微分方程
              </div>
              <div style={{ opacity: thm2Opacity }}>
                求势函数：先对 x 积分 u = ∫P dx + φ(y)
              </div>
              <div style={{ opacity: thm2Opacity }}>
                再由 <span style={{ color: COLORS.secondaryCurve }}>∂u/∂y = Q</span> 确定 φ(y)
              </div>
              <div style={{ opacity: thm3Opacity }}>
                通解为 <span style={{ color: COLORS.primaryCurve }}>u(x,y) = C</span>（隐函数形式）
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3Opacity, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              例：(2xy + 1)dx + (x² + 2y)dy = 0，∂P/∂y = 2x = ∂Q/∂x
            </div>
            <MathFormula
              latex="u = x^2 y + x + y^2 = C"
              fontSize={48}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec05Exact;
