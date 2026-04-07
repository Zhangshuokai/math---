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

const Sec06HighOrder: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 90, 25);
  const t3 = fade(frame, 115, 25);
  const t4 = fade(frame, 140, 25);
  const t5 = fade(frame, 165, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 220, 25);
  const thm3 = fade(frame, 255, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.6"
          sectionTitle="可降阶高阶微分方程"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：三种类型 60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 28,
            padding: "60px 120px",
          }}
        >
          <div style={{ opacity: t1, color: COLORS.primaryCurve, fontSize: 28, fontWeight: "bold" }}>
            三种可降阶类型
          </div>

          {/* 类型一 */}
          <div style={{ opacity: t2, width: "100%" }}>
            <div style={{ color: COLORS.highlight, fontSize: 22, marginBottom: 6 }}>
              类型一：y⁽ⁿ⁾ = f(x)
            </div>
            <MathFormula
              latex="y^{(n)} = f(x) \;\xrightarrow{\text{积分 }n\text{ 次}}\; y = \text{含 }n\text{ 个任意常数的通解}"
              fontSize={34}
              color={COLORS.formula}
            />
          </div>

          {/* 类型二 */}
          <div style={{ opacity: t3, width: "100%", borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16 }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 22, marginBottom: 6 }}>
              类型二：y'' = f(x, y')，不含 y
            </div>
            <MathFormula
              latex="\text{令 } p = y',\; y'' = p' \;\Rightarrow\; p' = f(x,p)"
              fontSize={36}
              color={COLORS.formula}
            />
          </div>

          {/* 类型三 */}
          <div style={{ opacity: t4, width: "100%", borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16 }}>
            <div style={{ color: COLORS.tertiaryCurve, fontSize: 22, marginBottom: 6 }}>
              类型三：y'' = f(y, y')，不含 x
            </div>
            <MathFormula
              latex="\text{令 } p = y',\; y'' = p\frac{dp}{dy} \;\Rightarrow\; p\frac{dp}{dy} = f(y,p)"
              fontSize={36}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t5, color: COLORS.annotation, fontSize: 20 }}>
            类型三中利用链式法则：y'' = dp/dx = (dp/dy)·(dy/dx) = p·dp/dy
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
            gap: 30,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="降阶法核心思路" opacity={thm1} width={960}>
            <div style={{ fontSize: 23, lineHeight: 2.0, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                • 类型一：<span style={{ color: COLORS.highlight }}>直接积分</span> n 次即可
              </div>
              <div style={{ opacity: thm2 }}>
                • 类型二：令 p = y'，变为一阶方程 p' = f(x,p)，解出 p 再积分
              </div>
              <div style={{ opacity: thm3 }}>
                • 类型三：令 p = y'，利用 y'' = p dp/dy，变为以 y 为自变量的方程
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm2, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              例（类型二）：y'' + y' = x，令 p = y'：
            </div>
            <MathFormula
              latex="p' + p = x \;\Rightarrow\; p = x - 1 + Ce^{-x}"
              fontSize={44}
              color={COLORS.secondaryCurve}
            />
          </div>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <MathFormula
              latex="y = \frac{x^2}{2} - x - Ce^{-x} + D"
              fontSize={44}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec06HighOrder;
