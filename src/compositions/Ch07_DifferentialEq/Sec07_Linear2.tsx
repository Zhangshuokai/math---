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

const Sec07Linear2: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 125, 25);
  const t4 = fade(frame, 155, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 215, 25);
  const thm3 = fade(frame, 245, 25);
  const thm4 = fade(frame, 270, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="七"
          chapterTitle="微分方程"
          sectionNum="7.7"
          sectionTitle="高阶线性微分方程"
          opacity={titleOpacity}
        />
      </Sequence>

      {/* 场景2：核心概念 60-180 */}
      <Sequence from={60} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "flex-start",
            flexDirection: "column",
            gap: 24,
            padding: "40px 120px",
          }}
        >
          <div style={{ opacity: t1 }}>
            <div style={{ color: COLORS.primaryCurve, fontSize: 26, marginBottom: 10 }}>
              n 阶线性方程的一般形式
            </div>
            <MathFormula
              latex="y^{(n)} + p_1(x)y^{(n-1)} + \cdots + p_n(x)y = f(x)"
              fontSize={38}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, width: "100%", borderTop: `1px solid ${COLORS.grid}`, paddingTop: 18 }}>
            <div style={{ color: COLORS.highlight, fontSize: 24, marginBottom: 10 }}>
              线性相关性与朗斯基（Wronskian）行列式
            </div>
            <MathFormula
              latex="W(y_1,y_2)(x) = \begin{vmatrix} y_1 & y_2 \\ y_1' & y_2' \end{vmatrix} = y_1 y_2' - y_2 y_1'"
              fontSize={40}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t3, color: COLORS.annotation, fontSize: 22, marginTop: 4 }}>
            若 W(x) ≢ 0，则 y₁, y₂ 线性无关（构成基本解组）
          </div>

          <div style={{ opacity: t4, width: "100%", borderTop: `1px solid ${COLORS.grid}`, paddingTop: 18 }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 24, marginBottom: 10 }}>
              对应齐次方程的通解（n=2）
            </div>
            <MathFormula
              latex="Y = C_1 y_1(x) + C_2 y_2(x)"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>
        </AbsoluteFill>
      </Sequence>

      {/* 场景3：解的结构定理 180-300 */}
      <Sequence from={180} durationInFrames={120}>
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: 28,
            padding: "0 100px",
          }}
        >
          <TheoremBox title="解的结构定理" opacity={thm1} width={960}>
            <div style={{ fontSize: 23, lineHeight: 2.0, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                <span style={{ color: COLORS.primaryCurve }}>齐次方程通解</span>：y₁, y₂ 是基本解组，
                通解为 Y = C₁y₁ + C₂y₂
              </div>
              <div style={{ opacity: thm2 }}>
                <span style={{ color: COLORS.highlight }}>非齐次方程通解</span>：y = Y（齐次通解）+ y*（特解）
              </div>
              <div style={{ opacity: thm3 }}>
                <span style={{ color: COLORS.secondaryCurve }}>叠加原理</span>：若 y₁* 是右端 f₁ 的特解，
                y₂* 是 f₂ 的特解，则 y₁* + y₂* 是 f₁+f₂ 的特解
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm4, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              非齐次方程通解结构：
            </div>
            <MathFormula
              latex="y = C_1 y_1(x) + C_2 y_2(x) + y^*(x)"
              fontSize={48}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec07Linear2;
