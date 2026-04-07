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

const Sec01Concept: React.FC = () => {
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
          sectionNum="9.1"
          sectionTitle="多元函数基本概念"
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
            gap: 26,
            padding: "40px 120px",
          }}
        >
          <div style={{ opacity: t1 }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 26, marginBottom: 10 }}>
              二元函数的定义
            </div>
            <MathFormula
              latex="z = f(x, y), \quad (x,y) \in D \subset \mathbb{R}^2"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.highlight, fontSize: 24, marginBottom: 10 }}>
              定义域示例：不等式组确定平面区域
            </div>
            <MathFormula
              latex="D: \; x^2 + y^2 \leq 1 \;\text{ 且 }\; y \geq 0"
              fontSize={42}
              color={COLORS.formula}
            />
            <div style={{ color: COLORS.annotation, fontSize: 20, marginTop: 8 }}>
              上半单位圆盘（闭区域）
            </div>
          </div>

          <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 16, width: "100%" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 24, marginBottom: 10 }}>
              二元函数的极限（路径无关性）
            </div>
            <MathFormula
              latex="\lim_{(x,y)\to(x_0,y_0)} f(x,y) = A"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4, color: COLORS.annotation, fontSize: 20 }}>
            注：二元极限要求沿任意路径趋近极限值相同，否则极限不存在
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
          <TheoremBox title="连续性与偏导数的关系" opacity={thm1} width={960}>
            <div style={{ fontSize: 23, lineHeight: 2.0, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                <span style={{ color: COLORS.primaryCurve }}>连续</span> ⇒ 极限存在且等于函数值
              </div>
              <div style={{ opacity: thm2 }}>
                偏导数存在 <span style={{ color: COLORS.highlight }}>不</span> 一定连续（与一元函数不同！）
              </div>
              <div style={{ opacity: thm3 }}>
                连续也 <span style={{ color: COLORS.highlight }}>不</span> 一定偏导存在
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm2, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              路径相关性反例：沿 y = kx 趋向原点
            </div>
            <MathFormula
              latex="\lim_{\substack{x\to 0\\y=kx}} \frac{xy}{x^2+y^2} = \frac{k}{1+k^2} \neq \text{常数}"
              fontSize={40}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec01Concept;
