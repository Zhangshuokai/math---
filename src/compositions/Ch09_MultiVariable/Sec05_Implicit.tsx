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

const Sec05Implicit: React.FC = () => {
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
          sectionNum="9.5"
          sectionTitle="隐函数的求导公式"
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
              情形一：F(x,y) = 0 确定 y = y(x)
            </div>
            <MathFormula
              latex="\frac{dy}{dx} = -\frac{F_x}{F_y} \quad (F_y \neq 0)"
              fontSize={50}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.highlight, fontSize: 24, marginBottom: 10 }}>
              情形二：F(x,y,z) = 0 确定 z = z(x,y)
            </div>
            <MathFormula
              latex="\frac{\partial z}{\partial x} = -\frac{F_x}{F_z}, \quad \frac{\partial z}{\partial y} = -\frac{F_y}{F_z} \quad (F_z \neq 0)"
              fontSize={42}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 22, marginBottom: 8 }}>
              推导思路：对方程 F(x,y) = 0 两边对 x 求导
            </div>
            <MathFormula
              latex="F_x + F_y \frac{dy}{dx} = 0 \;\Rightarrow\; \frac{dy}{dx} = -\frac{F_x}{F_y}"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4 }}>
            <div style={{ color: COLORS.annotation, fontSize: 21, marginBottom: 6 }}>
              例：x² + y² = 1，求 dy/dx
            </div>
            <MathFormula
              latex="F = x^2+y^2-1,\; F_x=2x,\; F_y=2y \;\Rightarrow\; \frac{dy}{dx} = -\frac{x}{y}"
              fontSize={36}
              color={COLORS.highlight}
            />
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
          <TheoremBox title="隐函数存在定理" opacity={thm1} width={960}>
            <div style={{ fontSize: 22, lineHeight: 2.1, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                若 F(x₀,y₀) = 0，且 F 在邻域内有连续偏导数，F_y(x₀,y₀) ≠ 0，
              </div>
              <div style={{ opacity: thm2 }}>
                则在 x₀ 附近唯一确定 <span style={{ color: COLORS.primaryCurve }}>y = f(x)</span> 使 F(x,f(x)) ≡ 0
              </div>
              <div style={{ opacity: thm3 }}>
                且 dy/dx = <span style={{ color: COLORS.highlight }}>−F_x/F_y</span>（隐函数导数公式）
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 21, marginBottom: 8 }}>
              三元情形：F(x,y,z)=0，两个偏导：
            </div>
            <MathFormula
              latex="\frac{\partial z}{\partial x} = -\frac{F_x}{F_z}, \quad \frac{\partial z}{\partial y} = -\frac{F_y}{F_z}"
              fontSize={48}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec05Implicit;
