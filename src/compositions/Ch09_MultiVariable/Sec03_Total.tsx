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

const Sec03Total: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 125, 25);
  const t4 = fade(frame, 155, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 252, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="九"
          chapterTitle="多元函数微分法及其应用"
          sectionNum="9.3"
          sectionTitle="全微分"
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
              全微分的定义
            </div>
            <MathFormula
              latex="dz = \frac{\partial z}{\partial x}dx + \frac{\partial z}{\partial y}dy"
              fontSize={52}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.highlight, fontSize: 24, marginBottom: 10 }}>
              全微分近似公式：Δz ≈ dz
            </div>
            <MathFormula
              latex="\Delta z \approx f_x(x_0,y_0)\Delta x + f_y(x_0,y_0)\Delta y"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 24, marginBottom: 8 }}>
              近似计算例题：估算 √(1.02² + 1.97²)
            </div>
            <div style={{ color: COLORS.annotation, fontSize: 20, marginBottom: 6 }}>
              令 f(x,y) = √(x²+y²)，在 (1,2) 处展开，Δx = 0.02, Δy = −0.03
            </div>
            <MathFormula
              latex="f_x = \frac{x}{\sqrt{x^2+y^2}},\quad f_y = \frac{y}{\sqrt{x^2+y^2}}"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4 }}>
            <MathFormula
              latex="\sqrt{1.02^2+1.97^2} \approx \sqrt{5} + \frac{1}{\sqrt{5}}(0.02) + \frac{2}{\sqrt{5}}(-0.03) \approx 2.2360"
              fontSize={34}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：定理总结 180-300 */}
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
          <TheoremBox title="可微的充分条件" opacity={thm1} width={960}>
            <div style={{ fontSize: 23, lineHeight: 2.1, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                若偏导数 <span style={{ color: COLORS.primaryCurve }}>f_x, f_y</span> 在点 (x₀,y₀) 连续，
                则 f 在该点可微
              </div>
              <div style={{ opacity: thm2 }}>
                可微 ⇒ 偏导数存在，反之不成立
              </div>
              <div style={{ opacity: thm3 }}>
                可微 ⇒ <span style={{ color: COLORS.highlight }}>连续</span>，反之不成立
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              全微分形式不变性：z = f(u,v)，u,v 为 x,y 的函数
            </div>
            <MathFormula
              latex="dz = \frac{\partial z}{\partial u}du + \frac{\partial z}{\partial v}dv"
              fontSize={48}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec03Total;
