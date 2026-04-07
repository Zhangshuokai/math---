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

const Sec03Surfaces: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = fade(frame, 0, 30);
  const t1 = fade(frame, 65, 25);
  const t2 = fade(frame, 95, 25);
  const t3 = fade(frame, 125, 25);
  const t4 = fade(frame, 155, 25);
  const thm1 = fade(frame, 185, 25);
  const thm2 = fade(frame, 218, 25);
  const thm3 = fade(frame, 255, 25);

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.background }}>
      {/* 场景1：标题卡 0-60 */}
      <Sequence from={0} durationInFrames={60}>
        <TitleCard
          chapterNum="八"
          chapterTitle="空间解析几何与向量代数"
          sectionNum="8.3"
          sectionTitle="曲面及其方程"
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
              球面方程（圆心 (a,b,c)，半径 R）
            </div>
            <MathFormula
              latex="(x-a)^2 + (y-b)^2 + (z-c)^2 = R^2"
              fontSize={46}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t2, width: "100%", borderTop: `1px solid ${COLORS.grid}`, paddingTop: 18 }}>
            <div style={{ color: COLORS.highlight, fontSize: 24, marginBottom: 10 }}>
              旋转曲面：曲线 z = f(y) 绕 z 轴旋转
            </div>
            <MathFormula
              latex="z = f\!\left(\sqrt{x^2+y^2}\right)"
              fontSize={46}
              color={COLORS.formula}
            />
            <div style={{ color: COLORS.annotation, fontSize: 20, marginTop: 8 }}>
              规律：绕哪个轴旋转，该轴变量不变，另两个变量替换为 √(u²+v²)
            </div>
          </div>

          <div style={{ opacity: t3, width: "100%", borderTop: `1px solid ${COLORS.grid}`, paddingTop: 18 }}>
            <div style={{ color: COLORS.secondaryCurve, fontSize: 24, marginBottom: 10 }}>
              柱面：准线在 xOy 面上，母线平行 z 轴
            </div>
            <MathFormula
              latex="F(x, y) = 0 \quad (\text{不含 } z)"
              fontSize={44}
              color={COLORS.formula}
            />
          </div>

          <div style={{ opacity: t4, color: COLORS.annotation, fontSize: 22 }}>
            例：x² + y² = R²（圆柱面），x²/a² + y²/b² = 1（椭圆柱面）
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
          <TheoremBox title="常见二次曲面" opacity={thm1} width={960}>
            <div style={{ fontSize: 22, lineHeight: 2.1, color: COLORS.formula }}>
              <div style={{ opacity: thm1 }}>
                • <span style={{ color: COLORS.primaryCurve }}>椭球面</span>：x²/a² + y²/b² + z²/c² = 1
              </div>
              <div style={{ opacity: thm2 }}>
                • <span style={{ color: COLORS.highlight }}>单叶双曲面</span>：x²/a² + y²/b² − z²/c² = 1
              </div>
              <div style={{ opacity: thm2 }}>
                • <span style={{ color: COLORS.secondaryCurve }}>双叶双曲面</span>：x²/a² − y²/b² − z²/c² = 1
              </div>
              <div style={{ opacity: thm3 }}>
                • <span style={{ color: COLORS.tertiaryCurve }}>椭圆抛物面</span>：z = x²/a² + y²/b²
              </div>
            </div>
          </TheoremBox>

          <div style={{ opacity: thm3, textAlign: "center" }}>
            <div style={{ color: COLORS.annotation, fontSize: 22, marginBottom: 8 }}>
              旋转抛物面（绕 z 轴）：
            </div>
            <MathFormula
              latex="z = x^2 + y^2"
              fontSize={52}
              color={COLORS.highlight}
            />
          </div>
        </AbsoluteFill>
      </Sequence>
    </AbsoluteFill>
  );
};

export default Sec03Surfaces;
