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

const Sec05Apps: React.FC = () => {
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
          chapterNum="十二"
          chapterTitle="无穷级数"
          sectionNum="12.5"
          sectionTitle="幂级数展开的应用"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：核心应用 60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 26,
            padding: "30px 120px",
          }}
        >
          <div style={{ opacity: t1 }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 24, marginBottom: 10 }}>
              应用一：近似计算积分（利用 e^x 的展开）
            </div>
            <MathFormula
              latex="e^{-x^2} = 1 - x^2 + \frac{x^4}{2!} - \frac{x^6}{3!} + \cdots"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2 }}>
            <MathFormula
              latex="\int_0^1 e^{-x^2}\,dx \approx 1 - \frac{1}{3} + \frac{1}{10} - \frac{1}{42} \approx 0.7475"
              fontSize={40}
              color={COLORS.highlight}
            />
            <div style={{ color: COLORS.annotation, fontSize: 18, marginTop: 6 }}>
              （精确值 ≈ 0.7468，取前4项误差小于 0.001）
            </div>
          </div>

          <div style={{ opacity: t3, borderTop: `1px solid ${COLORS.grid}`, paddingTop: 14, width: "100%" }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 24, marginBottom: 8 }}>
              应用二：求极限（展开后约分）
            </div>
            <MathFormula
              latex="\sin x = x - \frac{x^3}{6} + \frac{x^5}{120} - \cdots"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4 }}>
            <MathFormula
              latex="\lim_{x\to 0}\frac{\sin x - x}{x^3} = \lim_{x\to 0}\frac{-x^3/6 + O(x^5)}{x^3} = -\frac{1}{6}"
              fontSize={38}
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
            gap: 30,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="幂级数展开的主要应用" opacity={thm1} width={960}>
            <div style={{ fontSize: 22, lineHeight: 2.1, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                1. <span style={{ color: COLORS.primaryCurve }}>近似计算</span>：
                将被积函数展开，逐项积分，按精度要求截断
              </div>
              <div style={{ opacity: thm2 }}>
                2. <span style={{ color: COLORS.highlight }}>求极限</span>：
                展开后同阶项相消，化简 0/0 型极限
              </div>
              <div style={{ opacity: thm3 }}>
                3. <span style={{ color: COLORS.secondaryCurve }}>求级数的和</span>：
                逆用展开式，识别已知函数的展开
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm2, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 21, marginBottom: 8 }}>
              常用展开（需熟记）：
            </div>
            <MathFormula
              latex="\ln(1+x) = x - \frac{x^2}{2} + \frac{x^3}{3} - \cdots, \quad |x|\leq 1\,(x\neq -1)"
              fontSize={36}
              color={COLORS.tertiaryCurve}
            />
          </div>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <MathFormula
              latex="\arctan x = x - \frac{x^3}{3} + \frac{x^5}{5} - \cdots \;\Rightarrow\; \frac{\pi}{4} = 1 - \frac{1}{3} + \frac{1}{5} - \cdots"
              fontSize={34}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec05Apps;
